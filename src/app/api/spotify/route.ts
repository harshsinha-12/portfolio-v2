import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export const runtime = "nodejs";

const CACHE_KEY = "portfolio:spotify:last-track";
const REFRESH_LOCK_KEY = "portfolio:spotify:refresh-lock";
const FRESH_FOR_MS = 10 * 60 * 1000;
const STALE_FOR_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_LOCK_SECONDS = 20;
const DEFAULT_BACKOFF_SECONDS = 5 * 60;

type SpotifyArtist = { name?: string };

type SpotifyTrack = {
  type?: string;
  name?: string;
  artists?: SpotifyArtist[];
  external_urls?: { spotify?: string };
};

type PublicTrack = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
};

type SpotifyCache = {
  track: PublicTrack | null;
  freshUntil: number;
  blockedUntil: number;
};

type CurrentlyPlayingResponse = {
  is_playing?: boolean;
  item?: SpotifyTrack | null;
};

type RecentlyPlayedResponse = {
  items?: Array<{ track?: SpotifyTrack }>;
};

type RefreshResult =
  | { kind: "success"; track: PublicTrack | null }
  | { kind: "rate-limited"; retryAfterSeconds: number }
  | { kind: "failed" };

let memoryCache: SpotifyCache | null = null;
let localRefreshInFlight = false;

function publicTrack(
  track: SpotifyTrack | null | undefined,
  isPlaying: boolean,
): PublicTrack | null {
  const title = track?.name?.trim();
  const url = track?.external_urls?.spotify;
  const artists = track?.artists
    ?.map((artist) => artist.name?.trim())
    .filter((artist): artist is string => Boolean(artist));

  if (!title || !url || !artists?.length) return null;

  return { title, artist: artists.join(", "), url, isPlaying };
}

function parseCache(value: string | null): SpotifyCache | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<SpotifyCache>;
    if (
      typeof parsed.freshUntil !== "number" ||
      typeof parsed.blockedUntil !== "number" ||
      !(parsed.track === null || typeof parsed.track === "object")
    ) {
      return null;
    }
    return parsed as SpotifyCache;
  } catch {
    return null;
  }
}

async function readCache() {
  try {
    const redis = await getRedisClient();
    const cached = parseCache(await redis.get(CACHE_KEY));
    if (cached) memoryCache = cached;
  } catch {
    // The in-process cache still prevents a request storm if Redis is unavailable.
  }
  return memoryCache;
}

async function writeCache(cache: SpotifyCache) {
  memoryCache = cache;
  try {
    const redis = await getRedisClient();
    await redis.set(CACHE_KEY, JSON.stringify(cache), {
      EX: STALE_FOR_SECONDS,
    });
  } catch {
    // Serving from memory is preferable to failing the portfolio route.
  }
}

async function acquireRefreshLock() {
  if (localRefreshInFlight) return false;
  localRefreshInFlight = true;

  try {
    const redis = await getRedisClient();
    const lock = await redis.set(REFRESH_LOCK_KEY, randomUUID(), {
      NX: true,
      EX: REFRESH_LOCK_SECONDS,
    });

    if (lock !== "OK") {
      localRefreshInFlight = false;
      return false;
    }
  } catch {
    // The local lock is enough for a single server process when Redis is down.
  }
  return true;
}

function retryAfterSeconds(response: Response) {
  const retryAfter = Number(response.headers.get("retry-after"));
  return Number.isFinite(retryAfter) && retryAfter > 0
    ? Math.ceil(retryAfter)
    : DEFAULT_BACKOFF_SECONDS;
}

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const body = (await response.json()) as { access_token?: string };
  return body.access_token ?? null;
}

async function spotifyGet(accessToken: string, endpoint: string) {
  return fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
}

async function refreshTrack(): Promise<RefreshResult> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return { kind: "failed" };

    const currentResponse = await spotifyGet(
      accessToken,
      "/me/player/currently-playing",
    );

    if (currentResponse.status === 429) {
      return {
        kind: "rate-limited",
        retryAfterSeconds: retryAfterSeconds(currentResponse),
      };
    }
    if (!currentResponse.ok && currentResponse.status !== 204) {
      return { kind: "failed" };
    }

    if (currentResponse.status !== 204) {
      const current = (await currentResponse.json()) as CurrentlyPlayingResponse;
      const track = publicTrack(current.item, Boolean(current.is_playing));
      if (track?.isPlaying) return { kind: "success", track };
    }

    const recentResponse = await spotifyGet(
      accessToken,
      "/me/player/recently-played?limit=1",
    );

    if (recentResponse.status === 429) {
      return {
        kind: "rate-limited",
        retryAfterSeconds: retryAfterSeconds(recentResponse),
      };
    }
    if (!recentResponse.ok) return { kind: "failed" };

    const recent = (await recentResponse.json()) as RecentlyPlayedResponse;
    return {
      kind: "success",
      track: publicTrack(recent.items?.[0]?.track, false),
    };
  } catch {
    return { kind: "failed" };
  }
}

function spotifyResponse(
  track: PublicTrack | null,
  cacheStatus: "hit" | "refreshed" | "stale" | "cooldown",
  blockedUntil = 0,
) {
  return NextResponse.json(
    {
      track,
      configured: true,
      cacheStatus,
      retryAt:
        cacheStatus === "cooldown" && blockedUntil > Date.now()
          ? new Date(blockedUntil).toISOString()
          : null,
    },
    {
      headers: {
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        "X-Spotify-Cache": cacheStatus,
      },
    },
  );
}

export async function GET() {
  const configured = Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN,
  );

  if (!configured) {
    return NextResponse.json(
      { track: null, configured: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const now = Date.now();
  const cached = await readCache();

  if (cached && cached.freshUntil > now) {
    return spotifyResponse(cached.track, "hit");
  }
  if (cached && cached.blockedUntil > now) {
    return spotifyResponse(cached.track, "cooldown", cached.blockedUntil);
  }

  const hasRefreshLock = await acquireRefreshLock();
  if (!hasRefreshLock) {
    return spotifyResponse(cached?.track ?? null, "stale");
  }

  try {
    const result = await refreshTrack();

    if (result.kind === "success") {
      const nextCache: SpotifyCache = {
        track: result.track,
        freshUntil: now + FRESH_FOR_MS,
        blockedUntil: 0,
      };
      await writeCache(nextCache);
      return spotifyResponse(nextCache.track, "refreshed");
    }

    if (result.kind === "rate-limited") {
      const nextCache: SpotifyCache = {
        track: cached?.track ?? null,
        freshUntil: cached?.freshUntil ?? 0,
        blockedUntil: now + result.retryAfterSeconds * 1000,
      };
      await writeCache(nextCache);
      return spotifyResponse(
        nextCache.track,
        "cooldown",
        nextCache.blockedUntil,
      );
    }

    return spotifyResponse(cached?.track ?? null, "stale");
  } finally {
    localRefreshInFlight = false;
  }
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";

type SpotifyArtist = {
  name?: string;
};

type SpotifyTrack = {
  type?: string;
  name?: string;
  artists?: SpotifyArtist[];
  external_urls?: {
    spotify?: string;
  };
};

type CurrentlyPlayingResponse = {
  is_playing?: boolean;
  item?: SpotifyTrack | null;
};

type RecentlyPlayedResponse = {
  items?: Array<{
    track?: SpotifyTrack;
  }>;
};

function publicTrack(track: SpotifyTrack | null | undefined, isPlaying: boolean) {
  const title = track?.name?.trim();
  const url = track?.external_urls?.spotify;
  const artists = track?.artists
    ?.map((artist) => artist.name?.trim())
    .filter((artist): artist is string => Boolean(artist));

  if (!title || !url || !artists?.length) {
    return null;
  }

  return {
    title,
    artist: artists.join(", "),
    url,
    isPlaying,
  };
}

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

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

  if (!response.ok) {
    throw new Error(`Spotify token refresh failed with ${response.status}`);
  }

  const body = (await response.json()) as { access_token?: string };

  if (!body.access_token) {
    throw new Error("Spotify token response did not include an access token");
  }

  return body.access_token;
}

async function spotifyGet(accessToken: string, endpoint: string) {
  return fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { track: null, configured: false },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const currentResponse = await spotifyGet(
      accessToken,
      "/me/player/currently-playing",
    );

    if (currentResponse.ok && currentResponse.status !== 204) {
      const current = (await currentResponse.json()) as CurrentlyPlayingResponse;
      const track = publicTrack(current.item, Boolean(current.is_playing));

      if (track?.isPlaying) {
        return NextResponse.json(
          { track, configured: true },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=30, stale-while-revalidate=60",
            },
          },
        );
      }
    }

    const recentResponse = await spotifyGet(
      accessToken,
      "/me/player/recently-played?limit=1",
    );

    if (!recentResponse.ok) {
      throw new Error(`Spotify recently played failed with ${recentResponse.status}`);
    }

    const recent = (await recentResponse.json()) as RecentlyPlayedResponse;
    const track = publicTrack(recent.items?.[0]?.track, false);

    return NextResponse.json(
      { track, configured: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { track: null, configured: true },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

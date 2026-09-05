import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { renderSpotifyOg } from "@/lib/og-spotify.mjs";
import { getSpotifyResponse, type PublicTrack } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = {
    "Cache-Control": "no-store",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
  };
  try {
    const response = await getSpotifyResponse();
    const { track } = await response.json() as { track: PublicTrack | null };
    if (track?.albumArt) {
      try {
        const art = await fetch(track.albumArt, {
          signal: AbortSignal.timeout(3000),
          cache: "force-cache",
          next: { revalidate: 86400 },
        });
        track.albumArt = art.ok ? `data:image/jpeg;base64,${Buffer.from(await art.arrayBuffer()).toString("base64")}` : undefined;
      } catch {
        track.albumArt = undefined;
      }
    }
    const image = await renderSpotifyOg(track);
    return new Response(await image.arrayBuffer(), { headers: { ...headers, "Content-Type": "image/png" } });
  } catch {
    const fallback = await readFile(join(process.cwd(), "public/og.jpg"));
    return new Response(fallback, { headers: { ...headers, "Content-Type": "image/jpeg" } });
  }
}

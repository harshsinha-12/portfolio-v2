import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { PublicTrack } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "no-store",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

export async function GET(request: Request) {
  try {
    // Keep module initialization inside the fallback boundary as well as rendering.
    const [{ ImageResponse }, { buildSpotifyOg }, { getSpotifyResponse }] = await Promise.all([
      import("next/og"),
      import("@/lib/og-spotify.mjs"),
      import("@/lib/spotify"),
    ]);
    const response = await getSpotifyResponse();
    const { track } = await response.json() as { track: PublicTrack | null };
    if (track?.albumArt) {
      try {
        const art = await fetch(track.albumArt, {
          signal: AbortSignal.timeout(3000),
          cache: "force-cache",
          next: { revalidate: 86400 },
        });
        track.albumArt = art.ok
          ? `data:image/jpeg;base64,${Buffer.from(await art.arrayBuffer()).toString("base64")}`
          : undefined;
      } catch {
        track.albumArt = undefined;
      }
    }
    const { element, options } = await buildSpotifyOg(track);
    const image = new ImageResponse(element, {
      ...options,
      fonts: options.fonts.map((font) => ({
        ...font,
        weight: font.weight as 400 | 600,
        style: "normal" as const,
      })),
    });
    return new Response(await image.arrayBuffer(), {
      headers: { ...headers, "Content-Type": "image/png" },
    });
  } catch (error) {
    // Log only the error class/code, never provider responses or credentials.
    console.error("Spotify OG generation failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      code: error && typeof error === "object" && "code" in error ? error.code : undefined,
    });
    try {
      const fallback = await readFile(join(process.cwd(), "public/og.jpg"));
      return new Response(fallback, {
        headers: { ...headers, "Content-Type": "image/jpeg", "X-OG-Fallback": "static" },
      });
    } catch {
      // Vercel serves public assets separately even if tracing omits the local copy.
      return new Response(null, {
        status: 307,
        headers: { ...headers, Location: new URL("/og.jpg", request.url).href },
      });
    }
  }
}

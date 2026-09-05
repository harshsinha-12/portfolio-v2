/** Render the same image used by /api/og/spotify, with a clearly labeled sample track.
 * Run: pnpm generate-og-spotify-poc
 * Optional: SPOTIFY_PREVIEW_JSON=/path/to/track.json (PublicTrack shape).
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { renderSpotifyOg } from "../src/lib/og-spotify.mjs";
const SAMPLE_TRACK_URL = "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC";

async function fetchSampleTrack() {
  const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(SAMPLE_TRACK_URL)}`;
  const response = await fetch(oembedUrl);
  if (!response.ok) {
    throw new Error(`Spotify oEmbed failed: ${response.status}`);
  }
  const data = await response.json();
  const thumbResponse = await fetch(data.thumbnail_url);
  if (!thumbResponse.ok) {
    throw new Error(`Album art fetch failed: ${thumbResponse.status}`);
  }
  const thumbBuf = Buffer.from(await thumbResponse.arrayBuffer());
  const albumArt = `data:image/jpeg;base64,${(
    await sharp(thumbBuf).resize(256, 256).jpeg({ quality: 85 }).toBuffer()
  ).toString("base64")}`;

  return {
    title: data.title,
    artist: "Rick Astley",
    isPlaying: true,
    albumArt,
    url: SAMPLE_TRACK_URL,
    durationMs: 213000,
  };
}


const track = process.env.SPOTIFY_PREVIEW_JSON
  ? JSON.parse(await readFile(process.env.SPOTIFY_PREVIEW_JSON, "utf8"))
  : await fetchSampleTrack();
const outDir = join(process.cwd(), "tmp/og-spotify-poc");
await mkdir(outDir, { recursive: true });
const image = await renderSpotifyOg(track);
const output = join(outDir, "og-with-spotify.png");
await writeFile(output, Buffer.from(await image.arrayBuffer()));
console.log(`Preview fixture (not live listening): ${track?.title ?? "unavailable"}`);
console.log(`Wrote ${output}`);

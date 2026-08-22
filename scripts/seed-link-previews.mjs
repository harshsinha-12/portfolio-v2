import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCES_PATH = path.join(ROOT, "src/data/link-preview-sources.json");
const OUTPUT_DIR = path.join(ROOT, "public/assets/link-previews");
const META_LIMIT = 500_000;
const FETCH_TIMEOUT_MS = 15_000;
const PREVIEW_WIDTH = 480;
const PREVIEW_HEIGHT = 360;
const WEBP_QUALITY = 82;
const MIN_OUTPUT_BYTES = 2 * 1024;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function extractMeta(html, property) {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]);
  }

  return null;
}

function resolveImageUrl(pageUrl, imageUrl) {
  try {
    return new URL(imageUrl, pageUrl).href;
  } catch {
    return null;
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.text()).slice(0, META_LIMIT);
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function youtubeVideoId(href) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return url.pathname.replace(/^\//, "").split("/")[0] || null;
    }
    if (host === "youtube.com") {
      const watchId = url.searchParams.get("v");
      if (watchId) return watchId;
      const live = url.pathname.match(/^\/live\/([^/]+)/);
      if (live?.[1]) return live[1];
    }
  } catch {
    return null;
  }
  return null;
}

function extractOgImage(html) {
  return (
    extractMeta(html, "og:image") ??
    extractMeta(html, "twitter:image") ??
    extractMeta(html, "twitter:image:src")
  );
}

async function writePreview(buffer, outputPath, { minBytes } = {}) {
  await sharp(buffer)
    .rotate()
    .resize({
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
      fit: "cover",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const after = fs.statSync(outputPath).size;
  if (minBytes && after < minBytes) {
    fs.unlinkSync(outputPath);
    throw new Error(`output too small (${formatKb(after)})`);
  }

  return after;
}

async function seedFromFallback(fallback, outputPath, relativePath) {
  const fallbackPath = path.join(ROOT, "public", fallback.replace(/^\//, ""));
  if (!fs.existsSync(fallbackPath)) {
    throw new Error(`fallback missing: ${fallback}`);
  }

  const after = await writePreview(fs.readFileSync(fallbackPath), outputPath);
  console.log(`seeded: ${relativePath} from local ${fallback} (${formatKb(after)})`);
  return { status: "seeded" };
}

async function seedImage(image, hrefs, fallback) {
  const outputPath = path.join(OUTPUT_DIR, image);
  const relativePath = path.relative(path.join(ROOT, "public"), outputPath);

  if (fs.existsSync(outputPath)) {
    console.log(`skipped (exists): ${relativePath}`);
    return { status: "skipped" };
  }

  const errors = [];

  for (const href of hrefs) {
    try {
      const html = await fetchText(href);
      const ogImage = extractOgImage(html);
      if (!ogImage) {
        errors.push(`${href}: no og:image / twitter:image`);
        continue;
      }

      const imageUrl = resolveImageUrl(href, ogImage);
      if (!imageUrl) {
        errors.push(`${href}: invalid og:image URL (${ogImage})`);
        continue;
      }

      const after = await writePreview(await fetchBuffer(imageUrl), outputPath, {
        minBytes: MIN_OUTPUT_BYTES,
      });
      console.log(`seeded: ${relativePath} from ${href} (${formatKb(after)})`);
      return { status: "seeded" };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${href}: ${message}`);
    }
  }

  if (fallback) {
    try {
      return await seedFromFallback(fallback, outputPath, relativePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`fallback ${fallback}: ${message}`);
    }
  }

  for (const href of hrefs) {
    const videoId = youtubeVideoId(href);
    if (!videoId) continue;
    try {
      const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const after = await writePreview(await fetchBuffer(thumbUrl), outputPath, {
        minBytes: MIN_OUTPUT_BYTES,
      });
      console.log(`seeded: ${relativePath} from YouTube thumb ${videoId} (${formatKb(after)})`);
      return { status: "seeded" };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`youtube thumb ${videoId}: ${message}`);
    }
  }

  console.log(`no OG found — supply manually: ${image}`);
  for (const error of errors) {
    console.log(`  - ${error}`);
  }
  return { status: "missing" };
}

function groupByImage(sources) {
  const grouped = new Map();

  for (const source of sources) {
    const entry = grouped.get(source.image) ?? { hrefs: [], fallback: undefined };
    entry.hrefs.push(source.href);
    if (!entry.fallback && source.fallback) entry.fallback = source.fallback;
    grouped.set(source.image, entry);
  }

  return grouped;
}

async function main() {
  const sources = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8"));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const grouped = groupByImage(sources);
  const counts = { seeded: 0, skipped: 0, missing: 0 };

  for (const [image, { hrefs, fallback }] of grouped) {
    const result = await seedImage(image, hrefs, fallback);
    counts[result.status] += 1;
  }

  console.log(
    `\nDone. seeded: ${counts.seeded}, skipped (exists): ${counts.skipped}, no OG found: ${counts.missing}`,
  );

  if (counts.missing > 0) {
    console.log(
      "Drop a replacement into public/assets/link-previews/<filename> — re-runs never overwrite existing files.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const PUBLIC_DIR = "public";
const SOURCE_DIR = "media-src/videos";
const OUTPUT_DIR = path.join(PUBLIC_DIR, "assets/videos");
const MAX_WIDTH = 960;
const OUTPUT_EXT = "webm";

const INPUT_PATTERN = /\.mp4$/i;

/** Source .mp4 in media-src/videos/ → VP9 WebM in public/assets/videos/. No MP4 outputs. */

/** Basename (without extension) -> output slug */
const SLUG_OVERRIDES = new Map([
  ["Claude City Short", "claude-city"],
  ["Claude City for Portfolio", "claude-city"],
  ["Sadak Short", "sadak"],
  ["Sadak for portfolio", "sadak"],
  ["Kahani for portfolio", "kahani"],
  ["Khoj Short", "khoj"],
  ["Khoj Landing", "khoj"],
  ["Hackathon Curation Agent Demo Short", "hackathon-curation-agent"],
  ["Hackathon Curation Agent Short", "hackathon-curation-agent"],
  ["Echo Short", "echo"],
]);

function formatMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveSlug(basename) {
  return SLUG_OVERRIDES.get(basename) ?? slugify(basename);
}

function ensureFfmpeg() {
  const result = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error("ffmpeg is required but was not found on PATH.");
  }
}

function scaleFilter(maxWidth) {
  return `scale='min(${maxWidth},iw)':-2:flags=lanczos`;
}

function runFfmpeg(args) {
  const result = spawnSync("ffmpeg", args, { encoding: "utf8", stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed: ${args.join(" ")}`);
  }
}

function convertWebm(inputPath, outputPath) {
  runFfmpeg([
    "-y",
    "-i",
    inputPath,
    "-an",
    "-c:v",
    "libvpx-vp9",
    "-crf",
    "32",
    "-b:v",
    "0",
    "-row-mt",
    "1",
    "-vf",
    scaleFilter(MAX_WIDTH),
    "-pix_fmt",
    "yuv420p",
    outputPath,
  ]);
}

function listSourceFiles() {
  if (!fs.existsSync(SOURCE_DIR)) {
    return [];
  }

  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => INPUT_PATTERN.test(name))
    .map((name) => path.join(SOURCE_DIR, name));
}

async function main() {
  ensureFfmpeg();

  if (!fs.existsSync(SOURCE_DIR)) {
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
    console.log(`Created ${SOURCE_DIR}/ — drop source .mp4 files here, then re-run.`);
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const sourceFiles = listSourceFiles();
  if (sourceFiles.length === 0) {
    console.log(`No .mp4 files found in ${SOURCE_DIR}/`);
    return;
  }

  const converted = [];
  const claimedSlugs = new Set();

  for (const inputPath of sourceFiles) {
    const basename = path.basename(inputPath, path.extname(inputPath));
    const slug = resolveSlug(basename);

    if (claimedSlugs.has(slug)) {
      console.log(`skip (slug already processed): ${basename} -> ${slug}`);
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${slug}.${OUTPUT_EXT}`);
    const outputRelative = path.relative(PUBLIC_DIR, outputPath);
    const before = fs.statSync(inputPath).size;

    if (fs.existsSync(outputPath)) {
      console.log(`skip (webm exists): ${outputRelative}`);
      claimedSlugs.add(slug);
      continue;
    }

    console.log(`\nConverting: ${path.relative(".", inputPath)} -> ${slug}.${OUTPUT_EXT}`);
    convertWebm(inputPath, outputPath);

    const after = fs.statSync(outputPath).size;
    console.log(`done: ${slug} (${formatMb(before)} source -> ${formatMb(after)} ${OUTPUT_EXT})`);

    converted.push({
      slug,
      path: `/${outputRelative.replaceAll("\\", "/")}`,
    });
    claimedSlugs.add(slug);
  }

  if (converted.length === 0) {
    console.log("\nNo new videos to optimize.");
    return;
  }

  console.log("\nAdd to src/data/portfolio.ts (video field on matching projects):");
  for (const { slug, path: videoPath } of converted) {
    console.log(`  ${slug}: "${videoPath}"`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

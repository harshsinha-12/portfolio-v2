import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = "public";
const ASSETS_DIR = path.join(PUBLIC_DIR, "assets");
const RASTER_PATTERN = /\.(png|jpe?g)$/i;
const SKIP_IF_SMALLER_THAN_BYTES = 20 * 1024;
const HACKATHON_ICON_MIN_BYTES = 50 * 1024;

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function toWebpPath(filePath) {
  return filePath.replace(/\.(png|jpe?g)$/i, ".webp");
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function getOptimizationPlan(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");

  if (normalized === "assets/profile-pic.jpg") {
    return { kind: "jpeg-in-place", maxWidth: 560, quality: 85 };
  }

  if (normalized.includes("hackathon-icons/")) {
    return { kind: "webp", maxWidth: 128, quality: 85, minSourceBytes: HACKATHON_ICON_MIN_BYTES };
  }

  if (normalized.includes("notes/")) {
    return { kind: "webp", maxWidth: 96, quality: 80, trim: true };
  }

  if (/assets\/(sadak|kahani|khoj|echo-1|hackclub|claude-city)\./i.test(normalized)) {
    return { kind: "webp", maxWidth: 960, quality: 82 };
  }

  if (normalized.includes("link-previews/")) {
    return { kind: "webp", maxWidth: 480, quality: 82 };
  }

  return { kind: "webp", maxWidth: 500, quality: 82 };
}

async function optimizeRaster(filePath, plan) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const before = fs.statSync(filePath).size;

  if (plan.minSourceBytes && before < plan.minSourceBytes) {
    console.log(`skip (icon below ${plan.minSourceBytes / 1024}KB): ${relativePath} (${formatKb(before)})`);
    return null;
  }

  if (before < SKIP_IF_SMALLER_THAN_BYTES) {
    console.log(`skip (already small): ${relativePath} (${formatKb(before)})`);
    return null;
  }

  if (plan.kind === "jpeg-in-place") {
    const tempPath = `${filePath}.tmp.jpg`;
    await sharp(filePath)
      .rotate()
      .resize({ width: plan.maxWidth, withoutEnlargement: true })
      .jpeg({ quality: plan.quality, mozjpeg: true })
      .toFile(tempPath);

    const after = fs.statSync(tempPath).size;
    if (after >= before - 1024) {
      fs.unlinkSync(tempPath);
      console.log(`skip (already optimized): ${relativePath} (${formatKb(before)})`);
      return null;
    }

    fs.renameSync(tempPath, filePath);
    console.log(`optimized: ${relativePath} ${formatKb(before)} -> ${formatKb(after)}`);
    return { from: relativePath, to: relativePath };
  }

  const outputPath = toWebpPath(filePath);
  if (fs.existsSync(outputPath)) {
    console.log(`skip (webp exists): ${path.relative(PUBLIC_DIR, outputPath)}`);
    return null;
  }

  let pipeline = sharp(filePath).rotate();
  if (plan.trim) pipeline = pipeline.trim();
  await pipeline
    .resize({ width: plan.maxWidth, withoutEnlargement: true })
    .webp({ quality: plan.quality })
    .toFile(outputPath);

  const after = fs.statSync(outputPath).size;
  if (after >= before) {
    fs.unlinkSync(outputPath);
    console.log(`skip (webp not smaller): ${relativePath} (${formatKb(before)})`);
    return null;
  }

  fs.unlinkSync(filePath);

  const outputRelative = path.relative(PUBLIC_DIR, outputPath);
  console.log(`converted: ${relativePath} -> ${outputRelative} (${formatKb(before)} -> ${formatKb(after)})`);

  return { from: relativePath, to: outputRelative };
}

async function optimizeClipSvg() {
  const svgPath = path.join(PUBLIC_DIR, "clip.svg");
  const webpPath = path.join(PUBLIC_DIR, "clip.webp");

  if (!fs.existsSync(svgPath)) return null;
  if (fs.existsSync(webpPath) && fs.statSync(webpPath).mtimeMs >= fs.statSync(svgPath).mtimeMs) {
    console.log("skip (clip.webp up to date)");
    return null;
  }

  const before = fs.statSync(svgPath).size;
  // clip.svg is a 480×480 frame around a much smaller pin. Clothesline.tsx
  // object-cover crops that square into --clip-height (6rem), so the raster
  // must stay square or the pin shrinks. 960px (2× native, density 144) gives
  // 3× displays enough pixels after that crop without bringing back the 476KB SVG.
  const CLIP_RASTER_PX = 960;
  await sharp(svgPath, { density: 144 })
    .resize({
      width: CLIP_RASTER_PX,
      height: CLIP_RASTER_PX,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 90, alphaQuality: 90 })
    .toFile(webpPath);

  const after = fs.statSync(webpPath).size;
  console.log(`converted: clip.svg -> clip.webp (${formatKb(before)} -> ${formatKb(after)})`);
  return { from: "clip.svg", to: "clip.webp" };
}

async function main() {
  const rasterFiles = walkFiles(ASSETS_DIR).filter((file) => RASTER_PATTERN.test(file));
  const converted = [];

  for (const filePath of rasterFiles) {
    const relativePath = path.relative(PUBLIC_DIR, filePath);
    const plan = getOptimizationPlan(relativePath);
    const result = await optimizeRaster(filePath, plan);
    if (result) converted.push(result);
  }

  const clipResult = await optimizeClipSvg();
  if (clipResult) converted.push(clipResult);

  if (converted.length === 0) {
    console.log("\nNo new assets to optimize.");
    return;
  }

  console.log("\nUpdate references in src/data/portfolio.ts if extensions changed:");
  for (const { from, to } of converted) {
    if (from !== to) {
      console.log(`  /${from} -> /${to}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Local image assets

When adding or replacing a raster image (`.png`, `.jpg`, `.jpeg`) under `public/assets/`:

1. Place the file in `public/assets/` or `public/assets/hackathon-icons/`.
2. Run `pnpm optimize-images`.
3. Update paths in `src/data/portfolio.ts` (`icon`, `photo`, `image`, `companyIcon`) to the `.webp` path printed by the script.
4. Commit the optimized `.webp` file(s) and `portfolio.ts` together.

Hover-preview stamps live in `public/assets/link-previews/`. Run `pnpm seed-link-previews` to fill missing files from each URL's Open Graph image. Existing files are never overwritten — drop a replacement at the same path to swap an OG default. Mapping: `src/data/link-preview-sources.json`.

`pnpm optimize-images` scans `public/assets/` and converts files that are not already optimized. It:

- Creates a `.webp` sibling and removes the original when smaller (e.g. `my-photo.jpg` → `my-photo.webp`)
- Skips files that already have a `.webp` version
- Skips files under 20 KB, hackathon icons under 50 KB, and conversions where WebP would not shrink the file
- Re-compresses `profile-pic.jpg` in place when worthwhile

Display rules:

- Use `next/image` with an explicit `sizes` prop for local images shown in components.
- SVG logos (e.g. `sarvam-logo.svg`) can stay as-is.
- Remote images (OG previews, external favicons) are not handled by the script; keep those as plain `<img>` when the host is arbitrary.

Do not commit large unoptimized raster files when a `.webp` version should exist instead.

## Project demo videos

When adding a hover/tap demo video for a project card:

1. Drop the source `.mp4` in `media-src/videos/` (this folder is gitignored).
2. Run `pnpm optimize-videos`.
3. Add the printed `video` field to the matching project in `src/data/portfolio.ts` (`.webm` path under `/assets/videos/`).
4. Commit the optimized `public/assets/videos/*.webm` files and `portfolio.ts` together. Deployed assets are WebM only — never commit `.mp4` under `public/assets/videos/`.

`pnpm optimize-videos` converts each source `.mp4` into VP9 WebM:

- `public/assets/videos/<slug>.webm` — VP9, max width 960, no audio

Existing outputs are never overwritten — delete a file to re-encode. The project card reuses its static `image` as the video poster and no-JS fallback. Videos prefetch when their card scrolls near the viewport; playback is hover on desktop and tap on mobile.


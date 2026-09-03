# Upcoming Tasks

Prefer **`plan.md`** for current status. This file is an older copy of the same roadmap.

Track work for **Harsh's portfolio** fork. Upstream repo: [mittal-parth/portfolio-v2](https://github.com/mittal-parth/portfolio-v2).

**Your fork:** [harshsinha-12/portfolio-v2](https://github.com/harshsinha-12/portfolio-v2)  
**Current sync:** up to date with upstream `main` at PR #50 (YouTube music on headphones sticker).

Use the status checkboxes as you go: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skipped/won't do

---

## How to use this file

1. **Phase 0** — personalize content first (`Harsh.md` → `portfolio.ts`).
2. **From upstream** — pick open PRs/issues or unmerged fixes below.
3. **Your ideas** — add features only you want in the last section.
4. When integrating upstream work, see **Upstream branches** below — most features have a dedicated branch you can preview or merge.
5. Mark items done here and note the PR/commit you used.

---

## Upstream branches

After `git fetch upstream`, every remote branch is available as `upstream/<branch-name>`.

### Try a branch locally (preview without merging)

```bash
git fetch upstream
git checkout -b preview/timeline-stamps upstream/cursor/timeline-stamp-images-aeeb
pnpm install && pnpm dev
# when done previewing, return to your work:
git checkout main
git branch -D preview/timeline-stamps
```

### Merge a branch into your fork

```bash
git fetch upstream
git checkout main
git merge upstream/cursor/timeline-stamp-images-aeeb   # or cherry-pick specific commits
# resolve conflicts — keep YOUR portfolio.ts content from Harsh.md
pnpm build
```

### Branch map — actionable (not in `main` yet)

| Branch | PR / Issue | Status | What it does | Integrate? |
|--------|------------|--------|--------------|------------|
| `cursor/timeline-stamp-images-aeeb` | [PR #14](https://github.com/mittal-parth/portfolio-v2/pull/14) · [#9](https://github.com/mittal-parth/portfolio-v2/issues/9) | **Open** | Draggable postcard stamps on experience/education timeline (desktop only, perforated edges) | [ ] |
| `cursor/timeline-stamp-zigzag-57f6` | same as above | **Open** | Same feature as `timeline-stamp-images-aeeb` (duplicate branch — use either one) | [-] |
| `cursor/clothesline-wind-sway-a7b5` | [PR #35](https://github.com/mittal-parth/portfolio-v2/pull/35) (closed) | Superseded | Heavier continuous “wind gust” sway on hackathon polaroids | [-] skip — [#36](https://github.com/mittal-parth/portfolio-v2/pull/36) merged a lighter version |
| `cursor/fix-hackathon-carousel-jitter-15fa` | [PR #22](https://github.com/mittal-parth/portfolio-v2/pull/22) · [#21](https://github.com/mittal-parth/portfolio-v2/issues/21) | **Closed, branch deleted** | Fixes mobile left-swipe jitter on hackathon carousel | [ ] use `gh pr diff 22` if bug still exists |

**No branch yet** (issues only — you'd build yourself or wait):

| Issue | Feature |
|-------|---------|
| [#8](https://github.com/mittal-parth/portfolio-v2/issues/8) | Inline links with previews in experience bullets |
| [#2](https://github.com/mittal-parth/portfolio-v2/issues/2) | Realistic sticky note + corner peel hover |

### Branch map — merged into `main` (already in your clone)

These branches still exist on the remote for reference; you already have their code at `upstream/main`.

| Branch | PR | Feature |
|--------|-----|---------|
| `feat/music-yt-embed` | [#50](https://github.com/mittal-parth/portfolio-v2/pull/50) | YouTube music on headphones sticker |
| `feat/headphone-note-hover` | [#48](https://github.com/mittal-parth/portfolio-v2/pull/48) | Music-note hover animation on headphones |
| `fix/sticker-drag-cursor-and-sound` | [#47](https://github.com/mittal-parth/portfolio-v2/pull/47) | Sticker drag cursor + sound latency |
| `posthog-analytics` | [#46](https://github.com/mittal-parth/portfolio-v2/pull/46) | PostHog analytics |
| `cursor/sound-effects-f508` | [#43](https://github.com/mittal-parth/portfolio-v2/pull/43) | Soundcn interaction sounds |
| `feat/link-previews-and-sticker-polish` | [#42](https://github.com/mittal-parth/portfolio-v2/pull/42) | Link preview refresh + sticker pile polish |
| `feat/project-hover-videos` | [#40](https://github.com/mittal-parth/portfolio-v2/pull/40) | Hover/tap demo videos on project cards |
| `feat/polaroid-wind-sway` | [#36](https://github.com/mittal-parth/portfolio-v2/pull/36) | Wind-sway on hackathon polaroids |
| `cursor/profile-sticker-pile-771d` | [#39](https://github.com/mittal-parth/portfolio-v2/pull/39) | Draggable die-cut stickers |
| `cursor/image-link-previews-3283` | [#37](https://github.com/mittal-parth/portfolio-v2/pull/37) | Stamp-sized link preview images |
| `feat/xacto-knife-easter-egg` | [#33](https://github.com/mittal-parth/portfolio-v2/pull/33) | Draggable X-acto knife |
| `cursor/open-graph-preview-00be` | [#32](https://github.com/mittal-parth/portfolio-v2/pull/32) | OG social share image |
| `cursor/cutting-mat-details-6d26` | [#31](https://github.com/mittal-parth/portfolio-v2/pull/31) | Cutting-mat ticks, radius, angle guides |
| `cursor/fix-blurry-clothesline-clips-6324` | [#30](https://github.com/mittal-parth/portfolio-v2/pull/30) | Sharper clothesline clips |
| `cursor/fix-clothesline-clip-size-7455` | [#28](https://github.com/mittal-parth/portfolio-v2/pull/28) | Clothesline clip size after WebP |
| `feat/claude-city-hackathon` | [#26](https://github.com/mittal-parth/portfolio-v2/pull/26) | Claude City project entry |
| `cursor/reduce-load-time-preload-assets-19ba` | [#24](https://github.com/mittal-parth/portfolio-v2/pull/24) | Preload + faster load |
| `cursor/hackathon-company-icons-7124` | [#23](https://github.com/mittal-parth/portfolio-v2/pull/23) | Hackathon sponsor icons |
| `feat/mobile-hackathon-arc-slider` | [#20](https://github.com/mittal-parth/portfolio-v2/pull/20) | Mobile hackathon swipe carousel |
| `cursor/swiggly-link-underlines-2434` | [#19](https://github.com/mittal-parth/portfolio-v2/pull/19) | Squiggly link underlines |
| `cursor/increase-project-link-size-bca0` | [#13](https://github.com/mittal-parth/portfolio-v2/pull/13) | Larger project link touch targets |
| `cursor/fix-ethindia-22-image-bfa2` | [#3](https://github.com/mittal-parth/portfolio-v2/pull/3) | ETHIndia'22 photo fix |

### Your fork branches

| Branch | Status | Notes |
|--------|--------|-------|
| `main` | Active | Synced with upstream at PR #50 |
| _(create as needed)_ | — | e.g. `feat/harsh-content`, `feat/timeline-stamps`, `feat/sticky-note` |

**Suggested workflow for your own features:**

```bash
git checkout -b feat/my-feature-name
# ... work ...
git push -u origin feat/my-feature-name
# open PR on harshsinha-12/portfolio-v2 when ready
```

---

## Phase 0 — Personalization (do first)

Content lives in `Harsh.md`. Integration checklist:

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Fill in `Harsh.md` with your bio, links, experience, education, hackathons, projects | [ ] | |
| 0.2 | Update `src/data/portfolio.ts` from `Harsh.md` | [ ] | Main content file |
| 0.3 | Replace `public/assets/profile-pic.jpg` + run `pnpm optimize-images` | [ ] | |
| 0.4 | Replace `src/app/favicon.ico` and `src/app/apple-icon.jpg` | [ ] | |
| 0.5 | Update `src/app/layout.tsx` (keywords, Twitter handle, JSON-LD) | [ ] | |
| 0.6 | Update `src/components/sections/Profile.tsx` (alt text, tagline break) | [ ] | |
| 0.7 | Update `src/components/layout/Footer.tsx` (copyright name) | [ ] | |
| 0.8 | Update `scripts/generate-og.mjs` + run `pnpm generate-og` | [ ] | |
| 0.9 | Add your company/school/hackathon/project images | [ ] | See `Harsh.md` §15 |
| 0.10 | Set the canonical domain in `siteConfig.url` | [x] | `https://www.harshsinha.dev` |
| 0.11 | Run `pnpm seed-link-previews` for your URLs | [ ] | |
| 0.12 | `pnpm build` + manual QA on mobile and desktop | [ ] | |

---

## From upstream — Open (ready to integrate)

These are **not yet merged** into upstream `main`. See **Upstream branches → actionable** for branch names and checkout commands.

### High interest

| # | Source | Title | Status | Priority | Notes |
|---|--------|-------|--------|----------|-------|
| U.1 | [PR #14](https://github.com/mittal-parth/portfolio-v2/pull/14) · closes [#9](https://github.com/mittal-parth/portfolio-v2/issues/9) | Draggable postcard stamps on experience/education timeline | [ ] | High | Desktop-only decorative stamps with perforated edges; uses hackathon photos. Branch: `cursor/timeline-stamp-images-aeeb` |
| U.2 | [#8](https://github.com/mittal-parth/portfolio-v2/issues/8) | Add more links in the experience section | [ ] | Medium | Experience bullets are text-only today; add `LinkPreview` links like the About section. No PR yet — build or wait. |
| U.3 | [#2](https://github.com/mittal-parth/portfolio-v2/issues/2) | Realistic sticky note + corner peel on hover | [ ] | Medium | About-section yellow note looks flat; issue has design refs. No PR yet. |
| U.4 | [#44](https://github.com/mittal-parth/portfolio-v2/issues/44) | Agents-only endpoint / machine-readable bio | [x] | Low–Med | `/llms.txt`, `/llms-full.txt`, `/api/about` generated from `portfolio.ts`. |

### PR #14 — files to expect

If you cherry-pick or merge this PR, expect new/edited files:

- `src/components/decor/PostcardStamp.tsx`
- `src/lib/timelineStamps.ts`
- `src/components/sections/Timeline.tsx`
- `src/app/globals.css` (`.stamp-perforated` utility)

---

## From upstream — Closed but not merged (worth revisiting)

These were **closed without landing** in `main`. The bug/idea may still apply to your fork.

| # | Source | Title | Status | Priority | Notes |
|---|--------|-------|--------|----------|-------|
| U.5 | [PR #22](https://github.com/mittal-parth/portfolio-v2/pull/22) · [#21](https://github.com/mittal-parth/portfolio-v2/issues/21) | Fix hackathon carousel jitter when swiping left (mobile) | [ ] | Medium | **Test on your phone first** — swipe left through hackathon pages with different caption heights. If jitter exists, port this fix into `Achievements.tsx`. |
| U.6 | [PR #35](https://github.com/mittal-parth/portfolio-v2/pull/35) | Wind gust on clothesline (superseded) | [-] | — | **Skip** — [#36](https://github.com/mittal-parth/portfolio-v2/pull/36) merged a lighter “wind sway” version; you already have it. |

---

## From upstream — Already in your clone ✓

No action needed unless you want to customize further.

<details>
<summary>Merged features & fixes (click to expand)</summary>

| PR | What it added |
|----|----------------|
| #50 | YouTube music embed on headphones sticker |
| #48 | Music-note hover animation on headphones |
| #47 | Sticker drag cursor + pick sound latency polish |
| #46 | PostHog analytics |
| #43 | Soundcn interaction sounds |
| #42 | Link preview refresh, sticker pile, profile polish |
| #40 | Hover/tap demo videos on project cards |
| #39 | Draggable die-cut stickers |
| #37 | Stamp-sized image link previews |
| #36 | Wind-sway micro-animation on hackathon polaroids |
| #33 | Draggable X-acto knife easter egg |
| #32 | Open Graph image for link previews |
| #31 | Richer cutting-mat ticks, radius, angle guides |
| #30, #28 | Clothesline clip sharpness/size fixes |
| #24 | Loading time + asset preload |
| #23 | Hackathon company icons |
| #20 | Mobile hackathon swipe carousel |
| #19 | Squiggly underlines on links |
| #13 | Larger project link touch targets |
| #3 | ETHIndia'22 photo asset fix |

</details>

---

## My own ideas (add yours here)

Features you want that may **not** exist upstream. Edit freely.

| # | Idea | Status | Priority | Notes |
|---|------|--------|----------|-------|
| M.1 | | [ ] | | |
| M.2 | | [ ] | | |
| M.3 | | [ ] | | |

### Idea prompts (delete if unused)

- **Resume button** — wire `resumeLink` from `portfolio.ts` into nav or About section
- **Blog / writing section** — new nav item + MDX or external links
- **Dark mode** — mat palette variant (non-trivial; touches `globals.css`)
- **Custom domain + deploy** — configured as `https://www.harshsinha.dev`
- **Remove/replace PostHog** — drop analytics or use your own project token
- **Different sticker set** — swap `experienceStickers` / `projectStickers` images and tooltips
- **Skills / tech stack section** — not in upstream; new section component
- **Testimonials / recommendations** — LinkedIn quotes as sticky notes
- **Contact form** — Formspree, Resend, etc.
- **i18n** — unlikely needed for a personal portfolio

---

## Bugs & polish (discovered locally)

Track issues you find while customizing.

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| B.1 | | [ ] | |
| B.2 | | [ ] | |

---

## Suggested roadmap

### Sprint 1 — Make it yours
- [ ] Phase 0 (all personalization tasks)
- [ ] Deploy to your domain
- [ ] Replace README live URL and screenshot

### Sprint 2 — Polish from upstream
- [ ] Preview `upstream/cursor/timeline-stamp-images-aeeb` locally before merging
- [ ] Test mobile hackathon swipe → port [PR #22](https://github.com/mittal-parth/portfolio-v2/pull/22) if jitter exists (branch deleted; use `gh pr diff 22`)
- [ ] Integrate [PR #14](https://github.com/mittal-parth/portfolio-v2/pull/14) timeline stamps (if you like the look)
- [ ] [#8](https://github.com/mittal-parth/portfolio-v2/issues/8) inline links in experience bullets

### Sprint 3 — Differentiation
- [ ] [#2](https://github.com/mittal-parth/portfolio-v2/issues/2) sticky note redesign
- [ ] Your own ideas from **M.*** section
- [ ] [#44](https://github.com/mittal-parth/portfolio-v2/issues/44) agent-readable endpoint (useful if you want LLM-friendly portfolio)

---

## Syncing with upstream later

When Parth ships new features you want:

```bash
git fetch upstream
git log HEAD..upstream/main --oneline    # see what's new
git merge upstream/main                  # or cherry-pick specific commits
```

After merging upstream changes, re-apply your personal data if `portfolio.ts` conflicts (keep your `Harsh.md` as source of truth).

---

## References

| Doc | Purpose |
|-----|---------|
| `Harsh.md` | Your content — bio, projects, links, assets |
| `Upcoming tasks.md` | This file — features, fixes, roadmap |
| `README.md` | Dev setup, scripts, env vars |
| `AGENTS.md` | Image/video optimization rules for agents |

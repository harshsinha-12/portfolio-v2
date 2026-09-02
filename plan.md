# Portfolio plan — Harsh Sinha

Master roadmap for turning the upstream fork into **your** portfolio.

| | |
|---|---|
| **Upstream** | [mittal-parth/portfolio-v2](https://github.com/mittal-parth/portfolio-v2) |
| **Your fork** | [harshsinha-12/portfolio-v2](https://github.com/harshsinha-12/portfolio-v2) |
| **Sync point** | Upstream `main` at PR #50 (YouTube music on headphones sticker) |
| **Content source of truth** | `Harsh.md` → `src/data/portfolio.ts` |
| **Status legend** | `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skip |

---

## How to use this file

1. **Phase 0 first** — fill `Harsh.md`, then apply name/content changes across the repo.
2. **Deploy** — get a working “Harsh version” live before layering features.
3. **Upstream** — cherry-pick or merge open PRs/branches you want.
4. **Your ideas** — features only you want (Phase 2 + feature specs below).
5. **Add more below** — drop new items in Phase 4 as you think of them in chat.

Related docs: `Harsh.md` (content), `Upcoming tasks.md` (older copy of some of this — prefer `plan.md` going forward), `README.md` (dev setup), `AGENTS.md` (asset rules).

---

## Phase 0 — Personalization (do first)

### 0A. Fill your content (`Harsh.md`)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0A.1 | Site identity (name, title, description, URL, GitHub username, role, tagline) | [x] | Live in `src/data/portfolio.ts` |
| 0A.2 | Resume link | [x] | Wired in About + contact section |
| 0A.3 | Social links (X, LinkedIn, GitHub, email) | [x] | §3 |
| 0A.4 | About intro bullets | [x] | §4 |
| 0A.5 | Work experience | [x] | Multibagg AI in timeline |
| 0A.6 | Education | [x] | IIT Patna |
| 0A.7 | Hackathons & achievements | [x] | Clothesline: olympiad + certs |
| 0A.8 | Projects | [x] | Six GitHub projects |
| 0A.9 | Sticker tooltips / music video ID (optional) | [x] | Headphones + personality stickers |
| 0A.10 | Freeform notes (skills, speaking, prefs) | [x] | Folded into intro / experience |

---

### 0B. Name & identity changes (Parth → Harsh)

Identity, data, and docs now live under Harsh. Remaining polish is custom domain + JSON-LD employment wording.

#### Data & config

| File | What to change | Status |
|------|----------------|--------|
| `src/data/portfolio.ts` | `siteConfig` (name, title, description, url, githubUsername, role, tagline), `socialMedia`, `introBullets`, experience, education, hackathons, projects, sticker tooltips | [x] |
| `src/data/link-preview-sources.json` | Pruned to current URLs; re-seed with `pnpm seed-link-previews` after adding new links | [x] |

#### SEO & metadata

| File | What to change | Status |
|------|----------------|--------|
| `src/app/layout.tsx` | `keywords`, `twitter.creator`, JSON-LD `personJsonLd` (name, jobTitle, alumniOf, sameAs) | [x] |
| `src/app/layout.tsx` | JSON-LD `worksFor` still implies current Multibagg employment — drop or mark as former | [ ] |
| `scripts/generate-og.mjs` | `NAME`, `TAGLINE`, `socials` handles → then `pnpm generate-og` | [x] |

#### UI strings

| File | What to change | Status |
|------|----------------|--------|
| `src/components/sections/Profile.tsx` | Name alt text; `MobileTagline` splits on the last ` · ` in `siteConfig.tagline` | [x] |
| `src/components/layout/Footer.tsx` | Copyright uses `siteConfig.name` | [x] |

#### Assets & branding

| Asset | Action | Status |
|-------|--------|--------|
| `public/assets/profile-pic.jpg` | Replace with your photo → `pnpm optimize-images` → hard refresh (clear `.next/dev/cache/images` if stale) | [x] |
| `src/app/favicon.ico` | Replace | [x] |
| `src/app/apple-icon.jpg` | Replace | [x] |
| `public/og.jpg` | Regenerated via `pnpm generate-og` | [x] |
| Company / school / hackathon / project images | Add to `public/assets/` per `Harsh.md` §15 | [x] |
| `public/assets/portfolio-screenshot.webp` | README screenshot | [x] |

#### Env & docs

| File | What to change | Status |
|------|----------------|--------|
| `.env.local` | `NEXT_PUBLIC_SITE_URL` for a custom domain when you have one | [ ] |
| `README.md` | Live URL, screenshot, example env URL | [x] |
| PostHog (optional) | Keep upstream token or swap/remove in `.env.local` | [ ] |

---

### 0C. Integration checklist (after content is written)

Run in roughly this order:

| # | Task | Status | Command / notes |
|---|------|--------|-----------------|
| 0C.1 | Map `Harsh.md` → `portfolio.ts` | [x] | Canonical source is `portfolio.ts` |
| 0C.2 | Update hardcoded strings (Profile, Footer, layout, generate-og) | [x] | See 0B |
| 0C.3 | Replace images | [x] | `pnpm optimize-images` |
| 0C.4 | Project demo videos (if any) | [ ] | Optional — drop `.mp4` in `media-src/videos/` → `pnpm optimize-videos` |
| 0C.5 | Link preview stamps | [x] | `pnpm seed-link-previews` — sources pruned to current URLs |
| 0C.6 | Social share image | [x] | `pnpm generate-og` |
| 0C.7 | Local QA | [ ] | `pnpm dev` — desktop + mobile, all sections & links |
| 0C.8 | Production build | [ ] | `pnpm build` |
| 0C.9 | Deploy | [x] | Live on Vercel; custom domain still open (M.7) |

---

## Phase 1 — Upstream branches & PRs

After `git fetch upstream`, branches are available as `upstream/<branch-name>`.

### Preview a branch locally

```bash
git fetch upstream
git checkout -b preview/<name> upstream/<branch-name>
pnpm install && pnpm dev
# when done:
git checkout main
git branch -D preview/<name>
```

### Merge into your fork

```bash
git fetch upstream
git checkout main
git merge upstream/<branch-name>
# resolve conflicts — keep YOUR portfolio.ts from Harsh.md
pnpm build
```

---

### 1A. Open / actionable (not in upstream `main` yet)

| ID | Branch | PR / Issue | Status | Priority | What it does | Integrate? |
|----|--------|------------|--------|----------|--------------|------------|
| U.1 | `cursor/timeline-stamp-images-aeeb` | [PR #14](https://github.com/mittal-parth/portfolio-v2/pull/14) · [#9](https://github.com/mittal-parth/portfolio-v2/issues/9) | Open | **High** | Draggable postcard stamps on experience/education timeline (desktop, perforated edges) | [ ] |
| U.2 | `cursor/timeline-stamp-zigzag-57f6` | same as U.1 | Open | — | Duplicate of U.1 — pick one | [-] |
| U.3 | — | [#8](https://github.com/mittal-parth/portfolio-v2/issues/8) | Done here | Medium | Inline `LinkPreview` links in experience bullets | [x] |
| U.4 | — | [#2](https://github.com/mittal-parth/portfolio-v2/issues/2) | No PR | Medium | Realistic sticky note + corner peel on hover | [ ] |
| U.5 | — | [#44](https://github.com/mittal-parth/portfolio-v2/issues/44) | Done here | Low–Med | Agent-readable endpoint (`/llms.txt`, `/llms-full.txt`, `/api/about`) | [x] |

**PR #14 files to expect:** `PostcardStamp.tsx`, `timelineStamps.ts`, `Timeline.tsx`, `globals.css` (`.stamp-perforated`).

---

### 1B. Closed but worth revisiting

| ID | Source | Status | Priority | Notes | Integrate? |
|----|--------|--------|----------|-------|------------|
| U.6 | [PR #22](https://github.com/mittal-parth/portfolio-v2/pull/22) · [#21](https://github.com/mittal-parth/portfolio-v2/issues/21) | Closed, branch deleted | Medium | Mobile hackathon carousel left-swipe jitter — **test on your phone first**; port via `gh pr diff 22` if still broken | [ ] |
| U.7 | [PR #35](https://github.com/mittal-parth/portfolio-v2/pull/35) | Superseded | — | Skip — [#36](https://github.com/mittal-parth/portfolio-v2/pull/36) merged lighter wind sway | [-] |

---

### 1C. Already in your clone ✓

Merged into upstream `main` at your sync point. No action unless customizing.

<details>
<summary>Merged features (click to expand)</summary>

| PR | Feature |
|----|---------|
| #50 | YouTube music on headphones sticker |
| #48 | Music-note hover on headphones |
| #47 | Sticker drag cursor + sound latency |
| #46 | PostHog analytics |
| #43 | Soundcn interaction sounds |
| #42 | Link preview refresh + sticker polish |
| #40 | Project hover/tap demo videos |
| #39 | Draggable die-cut stickers |
| #37 | Stamp-sized link preview images |
| #36 | Wind-sway on hackathon polaroids |
| #33 | X-acto knife easter egg |
| #32 | Open Graph share image |
| #31 | Cutting-mat ticks, radius, angle guides |
| #30, #28 | Clothesline clip fixes |
| #24 | Preload + faster load |
| #23 | Hackathon sponsor icons |
| #20 | Mobile hackathon swipe carousel |
| #19 | Squiggly link underlines |
| #13 | Larger project link touch targets |
| #3 | ETHIndia'22 photo fix |

</details>

---

### 1D. Your fork branches

| Branch | Status | Notes |
|--------|--------|-------|
| `main` | Active | Synced with upstream at PR #50 |
| _(create as needed)_ | — | e.g. `feat/harsh-content`, `feat/spotify-last-played`, `feat/timeline-stamps` |

```bash
git checkout -b feat/my-feature
# ... work ...
git push -u origin feat/my-feature
# open PR on harshsinha-12/portfolio-v2 when ready
```

---

## Phase 2 — Your own ideas

Features that may **not** exist upstream. Reference screenshots saved in chat (Spotify row, tech stack grid, contact footer).

| ID | Idea | Status | Priority | Notes |
|----|------|--------|----------|-------|
| M.1 | **Spotify “Last played”** | [x] | High | Profile header row + `/api/spotify` |
| M.2 | **Tech stack row below GitHub graph** | [x] | High | `TechStack.tsx` + `techStack` in `portfolio.ts` |
| M.3 | **Footer / contact section** | [x] | High | `ContactSection.tsx` — form, availability, résumé, socials |
| M.4 | **Tech stack icons on project cards** | [x] | Med | `project.stack` + `stackIconMap` |
| M.5 | **Tech stack icons on experience entries** | [x] | Med | `experiences[].positions[].stack` in Timeline |
| M.6 | Resume button in nav / About | [x] | Med | About header + contact row |
| M.7 | Custom domain + deploy polish | [ ] | High | Site is on Vercel; custom domain still open |
| M.8 | **Certifications & courses section** | [x] | Low–Med | Combined clothesline with hackathons |
| M.9 | **Articles & write-ups** | [ ] | Med | Inline links today; dedicated section still optional |

### Idea backlog (unscheduled)

- Spotify **play button** — in-app playback via Spotify Web Playback SDK (needs Premium + OAuth); fallback: link opens track in Spotify
- ~~Blog / writing section~~ → see **M.9** (inline links today; optional dedicated section later)
- Dark mode / alternate mat palette (`globals.css`)
- Replace or remove PostHog analytics
- Custom sticker set (`experienceStickers` / `projectStickers`)
- Testimonials as sticky notes

**Education note:** About intro keeps education to one line (IIT Patna, final year). Certs live on the Hackathons & certifications clothesline (M.8).

---

## Feature specs (from chat)

### Feature spec: Spotify “Last played”

**Reference:** `Last played — Want To Love - Just Raw · Aloboi` row with green Spotify icon.

**Placement options (pick one during build):**
- Below profile header / near social stamps
- Below GitHub contribution graph (alongside or above tech stack row)
- Thin bar above footer

**UI:**
```
[Spotify icon] Last played — {track name} · {artist}
```
- Track name + artist link to Spotify track URL
- Optional: small play button (▶) if Web Playback SDK is feasible
- Loading / error: show `—` or hide row gracefully

**Data & API (investigate during build):**

| Approach | Pros | Cons |
|----------|------|------|
| **Spotify Web API** — `GET /v1/me/player/recently-played` | Real last-played track | Requires Spotify Developer app, OAuth refresh token, server route to hide secrets |
| **Now Playing API** (community wrappers) | Simpler if you use an existing service | Third-party dependency |
| **Static fallback** | No API | Not live — only for dev |

**Suggested implementation:**
1. `src/app/api/spotify/last-played/route.ts` — server-side fetch with cached response (~30–60s)
2. `src/components/sections/SpotifyLastPlayed.tsx` — client component, polls or SWR
3. Env: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
4. Optional play: Spotify Web Playback SDK + user must have Spotify open / Premium

**Content in `Harsh.md`:** add § for Spotify profile URL (for “open in Spotify” fallback).

**Branch:** `feat/spotify-last-played`

---

### Feature spec: Tech stack

**Reference:** Two-row grid of technology logos (TypeScript, React, Next.js, Python, etc.).

**Two placements:**

#### A. Site-wide row below GitHub graph (M.2)
- Lives in `Profile.tsx` under the `TapedCard` wrapping `GitHubGraph`
- Section label optional: `TECH STACK` or unlabeled icon strip
- Data: new `techStack: { name: string; icon?: string }[]` in `portfolio.ts` (or reuse/aggregate from project stacks)
- Reuse `getStackIcon` / `stackIconMap` in `src/lib/icons.tsx` — extend map for any missing icons (MongoDB, MySQL, Figma, Bun, Prisma, etc.)

#### B. Per-project icons (M.4)
- **Already partially built:** `Projects.tsx` renders `project.stack` as small icons next to the title
- Your ask: make them more visible — e.g. move to the same row as GitHub / YouTube / external link buttons, or slightly larger icons with tooltips
- Fill in `stack` arrays in `portfolio.ts` for every project

#### C. Per-experience icons (M.5)
- Add optional `stack` to each experience position (or per organisation) in `portfolio.ts`
- Render in `Timeline.tsx` under role title or bullet list — same `StackIcon` component, extracted to shared `TechStackIcons.tsx`

**Assets:** react-icons (`si`) covers most logos; custom SVGs in `public/assets/` for anything missing.

**Content in `Harsh.md`:** add §19 — master tech stack list + per-experience / per-project overrides.

---

### Feature spec: Contact footer

**Reference:** “Let’s work together” section — get in touch cards, send-a-message form, quote bar, visitor counter.

**Replace / extend** `src/components/layout/Footer.tsx` (or add `ContactSection.tsx` above footer).

**Blocks to include:**

| Block | Content | Implementation notes |
|-------|---------|---------------------|
| **Get in touch** | Email, X, calendar link (optional), “Replies within 24h” | Reuse `socialMedia` + `LinkPreview`; optional Cal.com / Calendly URL in `portfolio.ts` |
| **Send a message** | Name, email, message form | Formspree, Resend, Web3Forms, or Vercel serverless + email API |
| **Availability tagline** | e.g. “Open to any remote AI opportunities” | Static string in `portfolio.ts` → `siteConfig.openTo` or `footerConfig` |
| **Personal quote** | e.g. “The secret of getting ahead is getting started.” — Mark Twain | `footerConfig.quote` in `portfolio.ts` |
| **Visitor counter** | “You are the **29,793**rd visitor” | Options below |

**Visitor counter options:**

| Approach | Notes |
|----------|-------|
| **PostHog** (already in repo) | Query total pageviews or custom event — needs API route |
| **Vercel KV / Upstash Redis** | `INCR` on each visit — simple, accurate |
| **Third-party** | e.g. CountAPI, GoatCounter |
| **Plausible / Umami** | If you switch analytics |

**Styling:** Adapt reference layout to portfolio aesthetic (mat background, `TapedCard` / `StickyNote` instead of plain white cards) so it doesn’t feel pasted from another site.

**Content in `Harsh.md`:** add §20 — quote, availability line, contact form recipient, calendar link.

**Branch:** `feat/contact-footer`

---

### Feature spec: Certifications & courses

**Decision (Sep 2026):** Keep the About sticky note minimal — one education line only (final year @ IIT Patna). Do **not** list clubs, societies, or individual courses in intro bullets.

**Later section (M.8):** Optional nav item or subsection under Experience — e.g. `Certifications` / `Learning`.

| Item type | Example | Data shape |
|-----------|---------|------------|
| Certification | AWS ML Specialty, Coursera DL | `title`, `issuer`, `date`, `link`, optional `icon` |
| Course | Stanford CS229 (audit) | same as above |
| Program | Short bootcamp / fellowship | same |

**Implementation sketch:**
- `certifications: Certification[]` in `portfolio.ts` (or extend `educationList` with `kind: "degree" | "cert"`)
- New `Certifications.tsx` or extra rows in `Timeline.tsx` with a different card style (stamps vs degrees)
- Content draft in `Harsh.md` §7b (added below)

**When to build:** After Phase 0 content is live; low priority unless you have 3+ notable certs to show.

---

### Feature spec: Articles & write-ups

**Two layers** (use both over time):

#### A. Inline links (done today ✓)
Squiggly `marker-link` + hover preview inside About intro and experience bullets — same `IntroSegment` / `link` type as Ask Iris, Shark Tank, SEBI, etc.

**Already linked (keep list updated in `Harsh.md` §21):**

| Anchor text | URL | Where |
|-------------|-----|--------|
| Ask Iris | multibagg.ai/ask-iris | intro-3, experience |
| Multibagg AI | multibagg.ai | intro-3 |
| Shark Tank India Season 5 | [LinkedIn — ST India × Multibagg](https://www.linkedin.com/posts/shark-tank-india_namitathapar-sharktankindia-sharktankindiaseason5-ugcPost-7418286077645312000-fXBB) | intro-3 |
| Iris launch | [LinkedIn — Iris launch](https://www.linkedin.com/posts/biased-human_today-we-are-launching-the-most-powerful-ugcPost-7398653952919101440-vvJ_) | experience |
| automated X posts | [X — Twitter automation architecture](https://x.com/sinhaharsh12/status/1975865353705320477) | experience |
| Nine out of ten people lose in F&O | [SEBI F&O P&L study](https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-of-individual-traders-dealing-in-equity-fando-segment_67525.html) | intro-5 |
| Pinecone / Qdrant | product sites | experience |

Run `pnpm seed-link-previews` after adding new URLs to `link-preview-sources.json`.

#### B. Dedicated section (M.9 — build later)
Optional nav item: **Writing** / **Articles** — cards or stamp row for longer-form or standout posts you want discoverable without reading every bullet.

| Field | Example |
|-------|---------|
| `title` | Twitter market-news automation — architecture |
| `url` | X / LinkedIn / SEBI / personal blog |
| `date` | Oct 2025 |
| `tag` | `thread` · `launch` · `research` · `architecture` |
| `blurb` | One-line why it matters |

**Placement options:** below Projects, above Footer, or a subsection in About.

**Implementation sketch:**
- `articles: Article[]` in `portfolio.ts`
- `ArticlesSection.tsx` — `TapedCard` + polaroid/stamp cards, reuse `LinkPreview`
- Content draft in `Harsh.md` §21

**When to build:** When you have 4+ links worth surfacing together; until then inline links are enough.

**Branch:** `feat/articles-section`

---

### Suggested build order (Phase 2)

1. **M.4 + M.5** — tech stack data + UI (no external APIs; extends existing patterns)
2. **M.2** — site-wide tech stack below GitHub graph
3. **M.1** — Spotify last played (needs Spotify Developer setup)
4. **M.3** — contact footer + visitor counter (needs form backend + counter store)
5. **M.8** — certifications & courses (when you have 3+ to show)
6. **M.9** — articles & write-ups section (when you have 4+ posts to curate; inline links already done)

---

## Phase 3 — Bugs & polish (discovered locally)

| ID | Issue | Status | Notes |
|----|-------|--------|-------|
| B.1 | | [ ] | |
| B.2 | | [ ] | |

---

## Phase 4 — More from chat

| ID | Item | Status | Notes |
|----|------|--------|-------|
| C.1 | Spotify play button in-page | [ ] | Explore Web Playback SDK; may only work for Premium users — link-out fallback is fine |
| C.2 | Text tag below GitHub graph | [ ] | Covered by M.2 — could be tech stack strip or a short handwritten tagline |
| C.3 | Timeline steam train at top of experience rail | [x] | First entry — train on dual dashed “elevated tracks” |
| C.4 | Inline article/write-up links in intro + experience | [x] | Ask Iris, Shark Tank, SEBI F&O study, X automation thread, etc. — full list in M.9 |
| C.5 | Dedicated articles / write-ups section | [ ] | M.9 — optional nav section when you have 4+ posts |

---

## Suggested roadmap

### Sprint 1 — Make it yours
- [x] Phase 0A — content in `portfolio.ts`
- [x] Phase 0B — name/identity sweep (Parth → Harsh)
- [x] Phase 0C — integrate, optimize assets, deploy (QA/build still listed in 0C)
- [x] Update README live URL + screenshot

### Sprint 2 — Polish from upstream
- [ ] Preview `upstream/cursor/timeline-stamp-images-aeeb` (U.1)
- [ ] Test mobile hackathon swipe → port PR #22 fix if needed (U.6)
- [x] Experience inline links (U.3)

### Sprint 3 — Differentiation (your features)
- [x] Tech stack on projects + experience (M.4, M.5)
- [x] Tech stack row below GitHub graph (M.2)
- [x] Spotify last played (M.1)
- [x] Contact footer: get in touch, form, quote, visitor counter (M.3)
- [ ] Optional: Spotify in-page play (C.1)

### Sprint 4 — Upstream polish + writing
- [ ] [#2](https://github.com/mittal-parth/portfolio-v2/issues/2) sticky note redesign (U.4)
- [x] Resume button (M.6)
- [ ] Articles & write-ups section (M.9) — when you have enough posts to curate

---

## Syncing with upstream later

```bash
git fetch upstream
git log HEAD..upstream/main --oneline   # what's new
git merge upstream/main                 # or cherry-pick
```

After merge: if `portfolio.ts` conflicts, keep **your** content from `Harsh.md`.

---

## Quick reference — where things live

| What | Location |
|------|----------|
| All main text & links | `src/data/portfolio.ts` |
| Content draft | `Harsh.md` |
| SEO, OG, JSON-LD | `src/app/layout.tsx` |
| Profile photo & alt | `src/components/sections/Profile.tsx` |
| Footer / contact | `src/components/layout/Footer.tsx` (→ expand or add `ContactSection.tsx`) |
| Project stack icons | `src/components/sections/Projects.tsx` + `project.stack` in `portfolio.ts` |
| Experience stack (new) | `src/components/sections/Timeline.tsx` + `experiences[].stack` in `portfolio.ts` |
| Stack icon map | `src/lib/icons.tsx` → `stackIconMap` |
| Spotify last played (new) | `src/app/api/spotify/last-played/route.ts`, `SpotifyLastPlayed.tsx` |
| OG image generator | `scripts/generate-og.mjs` → `public/og.jpg` |
| Images | `public/assets/` |
| Demo videos | `media-src/videos/` → `pnpm optimize-videos` |
| Link previews | `pnpm seed-link-previews` |
| Site URL | `.env.local` → `NEXT_PUBLIC_SITE_URL` |

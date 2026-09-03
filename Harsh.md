# Harsh Sinha — Portfolio Content

Canonical content lives in `src/data/portfolio.ts`. This file is a readable snapshot of that data — not a fill-in draft.

**Status:** Synced with the live site (Vercel). Add new copy in `portfolio.ts` first, then refresh this file if you want a markdown backup.

---

## Quick reference — where things live in the repo

| What | File / folder |
|------|----------------|
| All main text & links | `src/data/portfolio.ts` |
| SEO, Open Graph, JSON-LD | `src/app/layout.tsx` |
| Agent-readable profile | `/llms.txt`, `/llms-full.txt`, `/api/about` — generated from `portfolio.ts` via `src/lib/agentProfile.ts` |
| Profile photo path & alt text | `src/components/sections/Profile.tsx` |
| Footer copyright name | `src/components/layout/Footer.tsx` |
| Social share image generator | `scripts/generate-og.mjs` → outputs `public/og.jpg` |
| Profile photo | `public/assets/profile-pic.jpg` |
| App icons | `src/app/favicon.ico`, `src/app/apple-icon.jpg` |
| Company / school logos | `public/assets/` |
| Hackathon polaroid photos | `public/assets/` |
| Hackathon sponsor icons | `public/assets/hackathon-icons/` |
| Project cover images | `public/assets/` |
| Project demo videos (source) | `media-src/videos/*.mp4` → run `pnpm optimize-videos` |
| Project demo videos (deployed) | `public/assets/videos/*.webm` |
| Decorative stickers | `public/assets/sticker-*.webp` |
| Link hover previews | `public/assets/link-previews/` — run `pnpm seed-link-previews` after adding URLs |
| Site URL (production) | `siteConfig.url` in `src/data/portfolio.ts` |

---

## 1. Site identity

```yaml
name: "Harsh Sinha"
title: "Harsh Sinha | AI Engineer"
description: "AI Engineer · Prev Founder's Office @ Multibagg AI · National Finalist IFF-FinTech Olympiad '24 · IIT Patna '27."
url: "https://www.harshsinha.dev"
githubUsername: "harshsinha-12"
role: "Prev Founder's Office and AI Engineer"
tagline: "Prev @ Multibagg AI · National Finalist IFF-FinTech Olympiad’24 · IIT Patna'27 · Working on AI Agents, Quant and Backend"
```

**Notes:**
- `tagline` appears under your name on desktop. On mobile, `MobileTagline` inserts a line break before the last ` · ` segment.
- `description` is used for Google/social previews.

---

## 2. Resume

```yaml
resumeLink: "https://drive.google.com/file/d/1vkxyMDB5_KpMwt4QXFgT2aqdRizr8Czh/view?usp=sharing"
```

Shown as a Résumé chip in About and as a row in the contact section.

---

## 3. Social links

Add or remove entries as needed. Supported platforms: `linkedin`, `github`, `mail`, `twitter`.

```yaml
socialMedia:
  - platform: twitter
    link: "https://x.com/sinhaharsh12"
    label: "Twitter"

  - platform: linkedin
    link: "https://www.linkedin.com/in/harshsinha12/"
    label: "LinkedIn"

  - platform: github
    link: "https://www.github.com/harshsinha-12"
    label: "GitHub"

  - platform: mail
    link: "mailto:sinha.harshsep@gmail.com"
    label: "Email"
```

**Connect button:** The nav “Connect” button and footer link use your Twitter/X URL by default (`connectLink`).

---

## 4. About — intro bullets

Live in `introBullets` in `portfolio.ts`:

1. Looking for AI Engineering roles; previously Founder's Office & AI Engineer at Multibagg AI.
2. Builds AI agents for finance, payments, data pipelines, news, Instagram analysis.
3. Ask Iris + Multibagg AI — 500K+ queries; Shark Tank India S5.
4. Final year at IIT Patna; national finalist IFF–FinTech Olympiad '24 (top 30 of >1 lakh).
5. Fun fact: investing since 2019; F&O warning with SEBI study link.

---

## 5. GitHub contribution graph

```yaml
githubGraphConfig:
  months: 12
  cellSize: 11
  cellGap: 3
  showLegend: true
  showWeekdayLabels: true
  showMonthLabels: true
```

---

## 6. Work experience

One role in `experiences`: **Founder's Office & AI Engineer** at Multibagg AI (Jan 2025 – Jun 2026). Logo `/assets/multibagg-ai.webp`. Full bullets (Ask Iris, evals, retrieval, Pinecone/Qdrant, X automation, Redis) live in `portfolio.ts`.

---

## 7. Education

```yaml
educationList:
  - id: "education-1"
    icon: "/assets/iitp-logo.webp"
    title: "Indian Institute of Technology, Patna"
    degree: "Bachelor of Technology"
    duration: "Aug 2023 - May 2027"
    content:
      - "Major: Computer Science and Engineering"
      - "Minor: Data Science and Artificial Intelligence"
    link: "https://www.iitp.ac.in/"
```

---

## 8. Hackathons & certifications

Clothesline in `achievements` (most impressive first): IFF–FinTech Olympiad '24 (National Finalist), Mine The Model (2nd), Summer of Quant, then course certificates (100xdevs, Udemy, Coursera, Forage). Photos live under `public/assets/`.

---

## 9. Projects

| # | Title | Live | GitHub |
|---|-------|------|--------|
| 1 | RecoveryOS | rzpy-agent-web.vercel.app | harshsinha-12/rzpy-agent |
| 2 | LLM Trading Arena | the-llm-trading-arena-frontend.vercel.app | -the-llm-trading-arena-frontend |
| 3 | Vritta AI | vritta-one.vercel.app | Vritta |
| 4 | Instagram Creative Intelligence | instagram-analysis-red.vercel.app | instagram-analysis |
| 5 | LLM Trading Arena Engine | — | the-llm-trading-arena-backend |
| 6 | Go Rabbit | go-rabbit-sable.vercel.app | go-rabbit |

Cover images under `public/assets/`. Optional demo videos: `media-src/videos/` → `pnpm optimize-videos`.

---

## 10. Decorative stickers

| Section | Stickers |
|---------|----------|
| About (`profileStickers`) | Marvel, MacBook |
| Experience (`experienceStickers`) | Headphones (YouTube on hover) |
| Projects (`projectStickers`) | Coffee, RCB, Kohli, gym, food placeholder |

Drop replacements as `public/assets/sticker-*.webp` and point `src` in `portfolio.ts`.

---

## 11. Navigation sections

```yaml
navSections:
  - id: profile
    label: "About"
  - id: experience
    label: "Experience"
  - id: projects
    label: "Projects"
  - id: hackathons
    label: "Hackathons & Certs"
  - id: contact
    label: "Connect"
```

---

## 12. SEO & metadata (`src/app/layout.tsx`)

```yaml
keywords:
  - "Harsh Sinha"
  - "AI Engineer"
  - "Multibagg AI"
  - "IFF-FinTech Olympiad’24"
  - "IIT Patna'27"
  - "Quant"
  - "Backend"
  - "AI Agents"
  - "Portfolio"

twitter:
  creator: "@sinhaharsh12"

personJsonLd:
  name: "Harsh Sinha"
  jobTitle: "Looking for AI Engineering roles"
  worksFor:
    name: "Multibagg AI"          # still listed as current in JSON-LD — should become former
    url: "https://www.multibagg.ai"
  alumniOf:
    - name: "Indian Institute of Technology Patna"
      url: "https://www.iitp.ac.in/"
  sameAs:
    - "https://www.linkedin.com/in/harshsinha12"
    - "https://github.com/harshsinha-12"
    - "https://x.com/sinhaharsh12"
```

---

## 13. Open Graph social image (`scripts/generate-og.mjs`)

```yaml
NAME: "Harsh Sinha"
TAGLINE: "Prev @ Multibagg AI · National Finalist IFF-FinTech Olympiad’24 · IIT Patna'27 · Working on AI Agents, Quant and Backend"
socials:
  - handle: "harshsinha12"
  - handle: "harshsinha-12"
  - handle: "@sinhaharsh12"
```

Regenerate with `pnpm generate-og` after changing name/tagline.

---

## 14. Hardcoded strings outside `portfolio.ts`

| Location | Status |
|----------|--------|
| `Profile.tsx` alt text | Harsh Sinha |
| `Footer.tsx` copyright | Harsh Sinha |
| `MobileTagline` | Splits on the last ` · ` in `siteConfig.tagline` (no NITK token) |

---

## 15. Images & assets checklist

- [x] `public/assets/profile-pic.jpg`
- [x] `src/app/favicon.ico` / `apple-icon.jpg`
- [x] `public/og.jpg`
- [x] Multibagg + IIT Patna logos
- [x] Cert / olympiad polaroids
- [x] Project cover images
- [ ] Project demo videos (optional)
- [x] `public/assets/portfolio-screenshot.webp` for README
- [x] Link preview stamps — `pnpm seed-link-previews` (sources pruned to current URLs)

---

## 16. Environment variables

```bash
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
REDIS_USERNAME=default
REDIS_PASSWORD=...
REDIS_HOST=...
REDIS_PORT=...
REDIS_TLS=false
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=...
CONTACT_FROM_EMAIL=...
```

Canonical domain: `https://www.harshsinha.dev` (configured in `siteConfig.url`).

---

## 17. Optional / nice-to-have

- [x] **README.md** — live URL and screenshot
- [x] **src/data/link-preview-sources.json** — current URLs only
- [ ] **Colors / theme** — only if you want a different mat palette
- [ ] **Custom domain**

---

## 18. After content changes

1. Edit `src/data/portfolio.ts`.
2. `pnpm seed-link-previews` for new HTTP links.
3. `pnpm optimize-images` / `pnpm optimize-videos` for new assets.
4. `pnpm generate-og` if name or tagline changed.
5. `pnpm dev` then `pnpm build`.

---

## 19. Tech stack

Site-wide strip: `techStack` in `portfolio.ts` → `TechStack.tsx` under the GitHub graph.

Per-role and per-project `stack` arrays already render on Timeline and project cards. Names must match `stackIconMap` in `src/lib/icons.tsx` (or pass a custom `icon` path).

---

## 20. Footer / contact

`ContactSection.tsx` is live: email, LinkedIn, X, résumé, 24–48h reply note, open-to-remote line, and a message form (`/api/contact`). Visitor quote card stays below. Spotify last-played is in the About header (credentials in `.env.local`).

---

## 21. Articles & write-ups

**Today:** link out from intro/experience bullets (`link` segments) — see `plan.md` → M.9.

**Later:** optional **Writing** section when you have 4+ standout posts.

### Link inventory (update as you add inline links)

| Title / anchor | URL | Section | Type |
|----------------|-----|---------|------|
| Ask Iris | https://www.multibagg.ai/ask-iris | intro-3, experience | product |
| Multibagg AI | https://www.multibagg.ai | intro-3 | product |
| Shark Tank India Season 5 | https://www.linkedin.com/posts/shark-tank-india_namitathapar-sharktankindia-sharktankindiaseason5-ugcPost-7418286077645312000-fXBB | intro-3 | press |
| Iris launch | https://www.linkedin.com/posts/biased-human_today-we-are-launching-the-most-powerful-ugcPost-7398653952919101440-vvJ_ | experience | launch |
| automated X posts | https://x.com/sinhaharsh12/status/1975865353705320477 | experience | architecture thread |
| Nine out of ten people lose in F&O | https://www.sebi.gov.in/reports-and-statistics/research/jan-2023/study-analysis-of-profit-and-loss-of-individual-traders-dealing-in-equity-fando-segment_67525.html | intro-5 | research |
| _(add more)_ | | | |

### Future dedicated section (when building M.9)

```yaml
# articles:
#   - id: "article-1"
#     title: "Twitter market-news automation — architecture"
#     url: "https://x.com/sinhaharsh12/status/1975865353705320477"
#     date: "Oct 2025"
#     tag: "thread"          # thread | launch | research | architecture
#     blurb: "How we built AI-native high-frequency market updates on X."
```

After adding URLs: `pnpm seed-link-previews`

---

## Notes & ideas (freeform)

Stickers still to swap: food (chicken leg) when you have a cutout. JSON-LD `worksFor` should be marked former. Custom domain when ready.

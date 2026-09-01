# Harsh Sinha — Portfolio Content

Fill in every section below. Another agent can map this file directly to `src/data/portfolio.ts` and related assets.

**Status:** Draft — replace all `TODO` placeholders with your real information.

---

## Quick reference — where things live in the repo

| What | File / folder |
|------|----------------|
| All main text & links | `src/data/portfolio.ts` |
| SEO, Open Graph, JSON-LD | `src/app/layout.tsx` |
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
| Site URL (production) | `.env.local` → `NEXT_PUBLIC_SITE_URL` |

---

## 1. Site identity

```yaml
name: "Harsh Sinha"                    # Display name in header
title: "Harsh Sinha | Software Developer" # Browser tab & SEO title
description: "TODO — 1–2 sentence bio for Google/social previews"
url: "https://TODO-your-domain.com"    # Production site URL
githubUsername: "TODO-github-username" # Used for live contribution graph
role: "TODO — e.g. Software Engineer"
tagline: "TODO — e.g. SWE @ Company · Hackathon winner · College'25"
```

**Notes:**
- `tagline` appears under your name on desktop and on mobile (with a line break before the last segment if it contains ` · `).
- `description` should mention your role, standout projects, and 1–2 keywords.

---

## 2. Resume

```yaml
resumeLink: "TODO — Google Drive / personal site PDF link"
```

Currently exported in `portfolio.ts` but not wired to the UI. Keep it here if you add a resume button later.

---

## 3. Social links

Add or remove entries as needed. Supported platforms: `linkedin`, `github`, `mail`, `twitter`.

```yaml
socialMedia:
  - platform: twitter
    link: "https://x.com/TODO"
    label: "Twitter"

  - platform: linkedin
    link: "https://www.linkedin.com/in/TODO"
    label: "LinkedIn"

  - platform: github
    link: "https://github.com/TODO"
    label: "GitHub"

  - platform: mail
    link: "mailto:TODO@email.com"
    label: "Email"
```

**Connect button:** The nav “Connect” button and footer link use your Twitter/X URL by default (`connectLink`).

---

## 4. About — intro bullets

Each bullet is a list of segments. Use these segment types:

| Type | Purpose | Example |
|------|---------|---------|
| `text` | Plain sentence fragment | `"I am currently a "` |
| `hand` | Handwritten-style emphasis | `"Software Engineer"` |
| `link` | Clickable link with hover preview | label, href, optional previewTitle & previewDescription |

### Bullet 1 — Current role
```yaml
segments:
  - type: text
    value: "I am currently a "
  - type: hand
    value: "TODO job title"
  - type: text
    value: " at "
  - type: link
    label: "TODO Company"
    href: "https://TODO"
    previewTitle: "TODO Company"
    previewDescription: "TODO one-line description"
  - type: text
    value: "TODO — what you work on."
```

### Bullet 2 — Hackathons / competitions (optional)
```yaml
segments:
  - type: text
    value: "I like doing "
  - type: hand
    value: "hackathons"
  - type: text
    value: ". TODO — your hackathon stats and a recent win."
  # Add a link segment if you want to link a specific win announcement
```

### Bullet 3 — Leadership / notable work (optional)
```yaml
segments:
  - type: text
    value: "TODO — e.g. led a team, built a product, open source, etc."
```

### Bullet 4 — Education (optional)
```yaml
segments:
  - type: text
    value: "Graduated from "
  - type: link
    label: "TODO University"
    href: "https://TODO"
    previewTitle: "TODO University"
    previewDescription: "TODO"
  - type: text
    value: " in TODO year."
```

### Bullet 5 — Fun fact (optional)
```yaml
segments:
  - type: text
    value: "Fun fact: TODO"
```

_Add or remove bullets. Each needs a unique `id` like `intro-1`, `intro-2`, …_

---

## 5. GitHub contribution graph (optional tweaks)

Defaults are usually fine.

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

Repeat this block for each company / organization.

### Experience 1
```yaml
id: "exp-TODO-slug"
organisation: "TODO Company Name"
logo: "/assets/TODO-logo.jpg"          # Add image to public/assets/, run pnpm optimize-images
link: "https://TODO-company-url"
positions:
  - title: "TODO Role"
    duration: "MMM YYYY - Present"     # or "MMM YYYY - MMM YYYY"
    content:
      - text: "TODO accomplishment or responsibility."
      - text: "TODO — metrics help (e.g. reduced latency by 40%)."
      # Optional: link a word in a bullet
      # - text: "Built "
      #   link: "https://project-url"   # Not in current schema — use plain text + link in intro instead
```

### Experience 2
```yaml
id: "exp-TODO-slug-2"
organisation: "TODO"
logo: "/assets/TODO-logo.jpg"
link: "https://TODO"
positions:
  - title: "TODO"
    duration: "TODO"
    content:
      - text: "TODO"
```

_Add more experiences as needed. Most recent first._

---

## 7. Education

**About intro (sticky note):** One line only — e.g. final year undergrad @ IIT Patna. No clubs or course lists here.

**Experience timeline (`educationList`):** Degree entry for IIT Patna when you fill §6 experience section.

```yaml
educationList:
  - id: "education-1"
    icon: "/assets/TODO-iitp-logo.png"
    title: "Indian Institute of Technology Patna"
    degree: "B.Tech — TODO branch"          # e.g. Computer Science and Engineering
    duration: "TODO start - Present"        # e.g. 2023 - Present (final year)
    content:
      - "Final year undergraduate"
    link: "https://www.iitp.ac.in/"

  # Certifications / courses → use §7b when you add section M.8 in plan.md
```

---

## 7b. Certifications & courses (optional — add section later)

_Not in the About intro bullets. Planned as portfolio section **M.8** in `plan.md`._

```yaml
# certifications:   # wire up when you build the UI section
#   - id: "cert-1"
#     title: "TODO — e.g. AWS Certified Machine Learning"
#     issuer: "Amazon Web Services"
#     date: "MMM YYYY"
#     link: "https://TODO"
#     icon: "/assets/TODO.png"   # optional
```

---

## 8. Hackathons & achievements

Polaroid cards on the clothesline. Each entry needs a photo (`icon` / `photo`) and optionally a small sponsor logo (`companyIcon`).

```yaml
achievements:
  - id: "a-TODO-slug"
    icon: "/assets/TODO-hackathon.webp"       # Polaroid image
    companyIcon: "/assets/hackathon-icons/TODO.png"  # Small logo overlay (optional)
    photo: "/assets/TODO-hackathon.webp"      # Usually same as icon
    event: "TODO Hackathon Name"
    position: "TODO — Winner / Runner Up / Top 10"
    highlight: "TODO — one compelling line with numbers if possible"
    article: "https://TODO"                   # X / LinkedIn / news post (optional)
    project: "https://TODO"                   # Devfolio / live demo (optional)
    youtube: "https://youtu.be/TODO"          # optional
    github: "https://github.com/TODO/repo"    # optional
    rotation: -2.0                            # Slight tilt on clothesline; -3 to 3 is fine
```

### My hackathons (fill in)

| # | Event | Position | Highlight | Links |
|---|-------|----------|-----------|-------|
| 1 | TODO | TODO | TODO | article: TODO, project: TODO, youtube: TODO, github: TODO |
| 2 | TODO | TODO | TODO | |
| 3 | TODO | TODO | TODO | |

_Remove rows you don't need. Order = display order (most impressive first recommended)._

---

## 9. Projects

```yaml
projects:
  - id: "project-1"
    title: "TODO Project Name"
    github: "https://github.com/TODO/repo"    # optional
    link: "https://TODO-live-demo.com"        # optional
    youtube: "https://youtu.be/TODO"          # optional
    image: "/assets/TODO-project.webp"        # Cover / poster image
    video: "/assets/videos/TODO-project.webm" # optional — after running optimize-videos
    content: "TODO — 1–2 sentence description of what it does."
    highlight: "TODO — e.g. Winner - Some Hackathon"  # optional badge text
    stack:
      - name: "TypeScript"
      - name: "Next.js"
      - name: "TODO"
      # Custom icon for a stack item:
      # - name: "Sarvam"
      #   icon: "/assets/sarvam-logo.svg"
```

### My projects (fill in)

| # | Title | Description | Live | GitHub | Video | Highlight |
|---|-------|-------------|------|--------|-------|-----------|
| 1 | TODO | TODO | TODO | TODO | yes/no | TODO |
| 2 | TODO | TODO | TODO | TODO | yes/no | TODO |
| 3 | TODO | TODO | TODO | TODO | yes/no | TODO |

**Video workflow:** Drop `media-src/videos/<slug>.mp4` → `pnpm optimize-videos` → use printed `.webm` path in `video` field.

---

## 10. Decorative stickers (personality / easter eggs)

Optional fun cutouts around the page. You can reuse existing sticker images or add your own to `public/assets/`.

### Experience section stickers (`experienceStickers`)
```yaml
- id: "sticker-headphones"
  src: "/assets/sticker-headphones.webp"
  tooltip: "TODO — e.g. I run on music"
  musicVideoId: "TODO-youtube-video-id"   # optional — plays on hover
  # Position/rotation usually fine as-is; customize tooltips only

- id: "sticker-macbook"
  src: "/assets/sticker-macbook.webp"
  tooltip: "TODO — e.g. this is where the work happens"
```

### Projects section stickers (`projectStickers`)
```yaml
# Update tooltips to match your personality, or swap images:
- tooltip: "TODO"
- tooltip: "TODO"
- tooltip: "TODO"
- tooltip: "TODO"
```

---

## 11. Navigation sections (optional)

Default labels — change only if you rename sections.

```yaml
navSections:
  - id: profile
    label: "About"
  - id: hackathons
    label: "Hackathons"
  - id: experience
    label: "Experience"
  - id: projects
    label: "Projects"
```

---

## 12. SEO & metadata (`src/app/layout.tsx`)

Update these after filling `portfolio.ts`:

```yaml
keywords:
  - "Harsh Sinha"
  - "Software Developer"
  - "TODO company or school"
  - "TODO specialty"
  - "Portfolio"

twitter:
  creator: "@TODO-your-x-handle"

personJsonLd:
  name: "Harsh Sinha"
  jobTitle: "TODO current role"
  worksFor:
    name: "TODO Company"
    url: "https://TODO"
  alumniOf:
    - name: "TODO University"
      url: "https://TODO"
  sameAs:
    - "https://www.linkedin.com/in/TODO"
    - "https://github.com/TODO"
    - "https://x.com/TODO"
  image: "{siteUrl}/assets/profile-pic.jpg"
```

---

## 13. Open Graph social image (`scripts/generate-og.mjs`)

```yaml
NAME: "Harsh Sinha"
TAGLINE: "TODO — same as siteConfig.tagline"
socials:
  - handle: "TODO-linkedin-slug"
  - handle: "TODO-github-username"
  - handle: "@TODO-x-handle"
```

After updating, run:
```bash
pnpm generate-og
```
This writes `public/og.jpg` used when your site is shared on Twitter/LinkedIn/iMessage.

---

## 14. Hardcoded strings outside `portfolio.ts`

| Location | What to change |
|----------|----------------|
| `src/components/sections/Profile.tsx` | `alt="Parth Mittal"` → your name; `src="/assets/profile-pic.jpg"` if you use a different filename |
| `src/components/layout/Footer.tsx` | `© {year} Parth Mittal` → your name |
| `src/components/sections/Profile.tsx` → `MobileTagline` | Break token ` · NITK'24` is hardcoded for line wrapping — adjust to a natural break in *your* tagline |

---

## 15. Images & assets checklist

### Must replace
- [ ] `public/assets/profile-pic.jpg` — your headshot
- [ ] `src/app/favicon.ico`
- [ ] `src/app/apple-icon.jpg`
- [ ] `public/og.jpg` — regenerate with `pnpm generate-og`

### Per experience entry
- [ ] Company logo → `public/assets/<company>.jpg` (or `.png`)

### Per education entry
- [ ] School / program logo

### Per hackathon entry
- [ ] Polaroid photo (`icon` / `photo`)
- [ ] Sponsor icon in `public/assets/hackathon-icons/` (optional)

### Per project entry
- [ ] Cover image (`image`)
- [ ] Demo video (optional): source in `media-src/videos/`, output in `public/assets/videos/`

### Optional personality
- [ ] Decorative stickers (`sticker-*.webp`) — keep or replace
- [ ] `public/assets/portfolio-screenshot.png` — for README only

### After adding images
```bash
pnpm optimize-images      # Converts large JPG/PNG → WebP where beneficial
pnpm seed-link-previews   # Fetches OG images for URLs in your content
pnpm generate-og          # Regenerates social share card
```

---

## 16. Environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SITE_URL=https://TODO-your-domain.com

# Optional analytics (PostHog)
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_TODO
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

---

## 17. Optional / nice-to-have

- [ ] **README.md** — update live URL and screenshot
- [ ] **package.json** — `"name"` can stay `portfolio-v2` or become your project name
- [ ] **src/lib/linkIcons.ts** — add favicon overrides for domains you link often
- [ ] **src/data/link-preview-sources.json** — usually auto-managed by `pnpm seed-link-previews`
- [ ] **Colors / theme** — `src/app/globals.css` if you want a different mat color palette

---

## 18. Integration order (for the next agent)

1. Fill this file completely.
2. Update `src/data/portfolio.ts` from sections 1–11.
3. Replace images per section 15.
4. Update `layout.tsx`, `Profile.tsx`, `Footer.tsx`, `generate-og.mjs`.
5. Run `pnpm optimize-images`, `pnpm optimize-videos` (if any), `pnpm seed-link-previews`, `pnpm generate-og`.
6. Set `.env.local` with your domain.
7. `pnpm dev` → verify all sections, links, and images.
8. `pnpm build` → fix any broken image paths or TypeScript errors.

---

## 19. Tech stack (for icons below GitHub graph + experience/project cards)

### Site-wide stack (icon strip below contribution graph)
```yaml
techStack:
  - name: "TypeScript"
  - name: "Next.js"
  - name: "React"
  - name: "Python"
  # Add all technologies you want shown — must match keys in src/lib/icons.tsx stackIconMap
  # or provide custom icon: "/assets/icons/figma.svg"
```

### Per-experience stack (optional — add to each role in §6)
```yaml
# Under each position in experiences:
stack:
  - name: "TypeScript"
  - name: "Node.js"
```

### Per-project stack
Already in §9 (`projects[].stack`). Fill every project; icons show on project cards.

---

## 20. Footer / contact section

```yaml
footerConfig:
  openTo: "Open to any remote AI opportunities"   # availability line
  replyTime: "Replies within 24 hours"            # optional
  quote:
    text: "TODO — your favorite quote"
    author: "TODO — attribution"
  calendarLink: "TODO — Cal.com or Calendly URL (optional)"
  contactForm:
    enabled: true
    # Backend TBD: Formspree ID, Resend, etc.
```

**Spotify (for last-played row):**
```yaml
spotifyProfileUrl: "https://open.spotify.com/user/TODO"
# API credentials go in .env.local — not in this file
```

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

_Use this space for anything that doesn't fit above: speaking engagements, publications, skills you want highlighted, design preferences, etc._

```
TODO
```

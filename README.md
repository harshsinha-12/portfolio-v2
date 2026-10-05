# Developer Portfolio

A fun yet functional portfolio that captures important aspects of my life in a not so boring way :)

![Portfolio screenshot](public/assets/portfolio-screenshot.webp)

**Live:** [www.harshsinha.dev](https://www.harshsinha.dev/)

## Features

- Cutting mat canvas with self-healing scratch marks when you drag the X-Acto knife
- Draggable stickers and cutout decor scattered across the page
- Polaroid-style hackathon cards hanging from a clothesline
- Hover-previews on links — pulls Open Graph images and favicons automatically
- Project cards with hover-to-play demo videos (tap on mobile)
- Live GitHub contribution graph rendered as a heatmap
- Floating nav with smooth scroll between sections
- Sound effects for UI interactions (toggleable, off by default on mobile)
- SEO-ready — Open Graph image, sitemap, robots, and JSON-LD person schema
- Agent-readable profile — `/llms.txt` index, `/llms-full.txt` markdown CV, `/api/about` JSON
- Voice concierge — OpenAI Realtime mic plus typed Q&A that can scroll the page, focus projects, and answer from the CV
- Fully responsive and accessible

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) for hover cards
- [PostHog](https://posthog.com/) for analytics
- [pnpm](https://pnpm.io/) (required)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

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
OPENAI_API_KEY=sk-...
```

The canonical production URL is defined once in `src/data/portfolio.ts`. Metadata,
structured data, sitemaps, robots, feeds, and share links all derive from it.

PostHog is initialized from `instrumentation-client.ts` when
`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is set. `NEXT_PUBLIC_POSTHOG_HOST` defaults
to `https://us.i.posthog.com`. The client enables autocapture (clicks),
pageviews/pageleaves, exception capture, web vitals, and session recordings.
In your PostHog project, turn on **Record user sessions** (and optionally
console logs) under Project settings → Session replay. The SDK stays inert
until the token is present, so you can ship the code first and add keys later.

The Spotify variables are server-only and power the live last-played line in
the profile header. Authorize the app once with the
`user-read-currently-playing user-read-recently-played` scopes, then store the
returned refresh token with the Client ID and Client Secret in your local and
deployment environment settings. Never prefix these variables with
`NEXT_PUBLIC_`.

The Redis variables power the footer visitor counter. Set `REDIS_TLS=true`
when the Redis Cloud database requires TLS. A one-year, HTTP-only cookie keeps
ordinary page refreshes from incrementing the counter repeatedly in the same
browser.

`OPENAI_API_KEY` powers the desk intercom (bottom-right). It stays server-only:
the browser receives a short-lived Realtime client secret, never the key.
Without it the control still renders but Talk/Send stay disabled.

## Voice concierge

The live mic is an OpenAI Realtime session over WebRTC. Speech uses the peer connection's media tracks. Transcripts, tool calls, and page context use a data channel named `oai-events`. The browser exchanges SDP with `https://api.openai.com/v1/realtime/calls` using the client secret from `POST /api/voice/session`.

Typed questions while the mic is off skip Realtime. They go through `POST /api/voice/turn` (Chat Completions) and can be read aloud with `POST /api/voice/speak`. Both paths share the same tools in `src/voice/tools/`.

```mermaid
sequenceDiagram
  actor Visitor
  participant Browser
  participant API as Next.js API
  participant OpenAI as OpenAI Realtime

  Visitor->>Browser: Tap Talk
  Browser->>API: POST /api/voice/session
  API->>OpenAI: POST /realtime/client_secrets
  OpenAI-->>API: Client secret and tool list
  API-->>Browser: clientSecret
  Browser->>OpenAI: WebRTC SDP offer
  OpenAI-->>Browser: SDP answer
  Note over Browser,OpenAI: Audio on media tracks. Events on data channel oai-events.

  OpenAI-->>Browser: response.done with function calls
  Browser->>Browser: parseSiteAction
  Browser->>Browser: executeSiteAction
  Browser->>OpenAI: function_call_output
  Browser->>OpenAI: Silent page context
  Browser->>OpenAI: response.create
  OpenAI-->>Visitor: Spoken confirmation
```

The model chooses the tool (`tool_choice: auto`). `parseSiteAction` checks the name and arguments. `executeSiteAction` does the work in the page, then the result goes back on the data channel so the model can confirm it. The text path runs that same parse-and-execute step in a loop of up to four rounds.

Scrolling is two of those tools. `scroll_to_section` jumps to a homepage hash. `scroll_page` moves about one viewport (`page`, 0.9× height) or a shorter step (`section`, 0.72×). `scrollToId` reads `scroll-padding` on `<html>` — the open transcript sheet sets the bottom padding to the dock height — and centers the target in the space above the dock. A `voice-target-flash` class marks it for 2.4s. Focus, demo, and achievement tools scroll the same way, then fire a window event so the card can expand or play.

```mermaid
flowchart TD
  call[executeSiteAction] --> kind{Action}

  kind -->|scroll_to_section| home[Navigate home if needed]
  home --> wait[Wait for the section element]
  wait --> toId[scrollToId]

  kind -->|scroll_page| by["window.scrollBy up or down"]

  kind -->|focus, demo, or achievement| card[scrollToId on that card]
  card --> event["portfolio:voice-* event for expand, play, or show"]

  toId --> padding["Offset by scroll-padding-top and scroll-padding-bottom"]
  padding --> flash[Add voice-target-flash]
  card --> flash
```

## Content

- Live data: `src/data/portfolio.ts`
- Agent-readable copies: `/llms.txt`, `/llms-full.txt`, `/api/about` (generated from `portfolio.ts`)
- Images: `public/assets/`
- Videos: `media-src/videos/` (source) → `public/assets/videos/` (optimized WebM)

## Scripts

- `pnpm dev` — development server
- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm lint` — ESLint
- `pnpm optimize-images` — compress and convert local images to WebP
- `pnpm optimize-videos` — convert source MP4s to VP9 WebM for project cards
- `pnpm seed-link-previews` — fetch Open Graph images for link hover previews
- `pnpm generate-og` — generate the Open Graph social share image

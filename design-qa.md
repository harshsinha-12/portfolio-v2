**Source visual truth**

- Selected Field Notes mockup: `/Users/harshsinha/.codex/generated_images/01a06729-64ee-7c11-a163-63e4865dec06/exec-f2c6465b-f734-4ca7-9d4c-43359c772857.png`
- Source dimensions: 864 × 1821 px.
- Target state: desktop long-form article at `/articles/building-ai-agents-that-know-when-to-stop` with the local draft visible.

**Implementation evidence**

- Local implementation: `http://localhost:3000/articles/building-ai-agents-that-know-when-to-stop`
- Browser-rendered implementation screenshot: unavailable.
- Intended comparison viewport: 864 × 1821 CSS px at device scale factor 1.
- Implementation pixel dimensions: unavailable because no browser instance could be connected.
- Density normalization: pending; the source can be compared 1:1 at the intended viewport after capture.
- HTTP smoke checks: homepage, article index, draft article, `/articles.json`, `/rss.xml`, and `/sitemap.xml` returned 200 in development.
- Production checks: homepage and article index returned 200; the draft article returned 404; public JSON, RSS, and sitemap excluded the draft.
- Primary interactions requiring browser testing: table-of-contents anchors, X/LinkedIn share links, copy-link feedback, native mobile sharing, external social-post links, Mermaid rendering, navigation, focus states, and responsive layout.
- Console errors: unavailable without a connected browser.

**Full-view comparison evidence**

Blocked. The source mockup was opened at original resolution, but the configured browser runtime returned no available browser instance. No implementation screenshot could be captured or combined with the source for a valid comparison.

**Focused region comparison evidence**

Blocked for the same reason. The article header, sticky contents/share rail, Mermaid diagrams, JSON table, margin notes, responsive mobile share row, and author footer require browser-rendered captures before their detailed fidelity can be judged.

**Required fidelity surfaces**

- Fonts and typography: implementation uses the existing Inter and Indie Flower font tokens with a narrow editorial reading column; visual comparison is blocked.
- Spacing and layout rhythm: code implements the asymmetric paper sheet, sticky left rail, 680 px reading column, right-margin notes, and responsive single-column layout; visual comparison is blocked.
- Colors and visual tokens: implementation reuses the portfolio forest mat, cream paper, charcoal ink, coral accent, and existing grid canvas; visual comparison and contrast inspection are blocked.
- Image quality and asset fidelity: the supplied profile portrait is rendered through `next/image`. The draft intentionally avoids permanent article artwork until the real article is supplied. Mermaid provides the requested editable technical diagrams; browser rendering is unverified.
- Copy and content: the local-only sample follows the selected mockup topic and is clearly marked as a draft. Production excludes it from listings and public feeds.

**Findings**

- [P1] Browser-rendered evidence is unavailable.
  Location: article index, homepage Writing section, and the selected draft article route.
  Evidence: the source image is available, the routes and production build pass, but browser discovery returned `No browser is available` and no screenshot or console inspection could be produced.
  Impact: visual fidelity, Mermaid output, responsive behavior, keyboard focus, share interactions, and browser console health cannot be signed off.
  Fix: connect the in-app browser, capture the article at 864 × 1821 and mobile width, combine each implementation capture with the source, test the primary interactions, and repeat this QA pass.

**Open Questions**

- Final chart imagery, cover art, video, citations, and social launch URLs depend on the real article the user will provide later.

**Implementation Checklist**

- Capture and compare the desktop article against the selected mockup.
- Capture the homepage Writing section, article index, and mobile article state.
- Test contents links, social sharing, copy feedback, Mermaid rendering, media components, and keyboard focus.
- Check the browser console and resolve any runtime or accessibility issues.
- Replace the sample draft with the real article and generate its final charts and images.

**Comparison History**

- Pass 1: blocked before visual comparison because no browser instance was available. No visual fixes were made from unverifiable evidence.

**Follow-up Polish**

- Tune handwritten margin-note placement after real article length and media density are known.

final result: blocked

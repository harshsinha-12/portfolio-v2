# Article authoring guide

Each article is a self-contained publishing bundle. Copy `_template/` into a new kebab-case folder and keep the website article, structured data, and social launch copy together.

```text
content/articles/<slug>/
├── article.mdx
├── data.json
├── twitter.md
└── linkedin.md
```

## What belongs in each file

- `article.mdx` — frontmatter and the canonical long-form article. It can contain prose, images, captions, code, callouts, tables, video embeds, and Mermaid diagrams.
- `data.json` — optional structured inputs for charts, comparisons, timelines, interactive examples, citations, or other data-backed blocks.
- `twitter.md` — the X/Twitter launch post or thread that sends readers to the canonical article URL.
- `linkedin.md` — the LinkedIn launch post that sends readers to the canonical article URL.

Markdown/MDX is the source of truth for article metadata. Do not maintain the same title, description, date, tags, or canonical URL separately in `data.json`. The application should derive its article index, RSS feed, sitemap records, page metadata, Open Graph data, and `Article` JSON-LD from MDX frontmatter.

## Frontmatter

Use this shape at the top of `article.mdx`:

```yaml
---
title: "Article title"
description: "A concise summary for search and social previews."
date: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
tags:
  - AI Agents
cover: "/assets/articles/<slug>/cover.webp"
draft: true
canonical: "/articles/<slug>"
social:
  twitter: ""
  linkedin: ""
---
```

The `social` URLs stay empty until the posts are published. They can then link the article back to the original X/Twitter and LinkedIn discussions.

## Rich MDX blocks

The article renderer provides these components without imports:

```mdx
<Callout title="Key idea">
  A short, useful takeaway.
</Callout>

<MarginNote>
  A restrained handwritten note for the right margin.
</MarginNote>

<Mermaid
  caption="How the request moves through the system."
  chart="flowchart LR; A[Request] --> B[Agent]; B --> C[Answer]"
/>

<DataTable
  dataset="results"
  caption="Rows are loaded from the results array in data.json."
/>

<References
  dataset="citations"
  title="Sources and further reading"
/>

<ArticleImage
  src="/assets/articles/<slug>/diagram.webp"
  alt="Describe the information shown in the image."
  caption="Optional visible caption."
  width={1200}
  height={675}
/>

<Video
  src="/assets/videos/demo.webm"
  title="Accessible video title"
  caption="Optional video caption."
  poster="/assets/articles/<slug>/video-poster.webp"
/>
```

Standard Markdown, GitHub-flavoured tables, fenced code blocks, and Markdown images also work. Prefer the explicit `ArticleImage` component when dimensions or a caption matter.

`References` renders an expandable source list from `data.json`. Each entry can include `title`, `publisher`, `url`, and `note`. Keep factual citations linked inline where the claim appears; use the references block as a scannable bibliography rather than a replacement for claim-level sourcing.

Keep Mermaid `chart` values as quoted, one-line strings separated with semicolons. This keeps the value serializable across the React Server Component boundary.

## Charts

Use `<Chart />` in MDX without imports. Charts use [Recharts](https://recharts.github.io/), load their renderer on the client, and include a server-rendered expandable data table that works without JavaScript.

Add a named array to the article's `data.json` (these values are illustrative):

```json
{
  "resultSeries": [
    { "key": "baseline", "label": "Baseline" },
    { "key": "improved", "label": "With memory", "color": "#b65332" }
  ],
  "results": [
    { "run": "Run 1", "baseline": 42, "improved": 55 },
    { "run": "Run 2", "baseline": 48, "improved": 67 },
    { "run": "Run 3", "baseline": 51, "improved": 74 }
  ]
}
```

Then insert this in `article.mdx`:

```mdx
<Chart
  dataset="results"
  type="line"
  title="Completion rate by run"
  xKey="run"
  series="resultSeries"
  yUnit="%"
  caption="Illustrative data only. Replace with sourced measurements."
/>
```

- `dataset`: a top-level array in the companion `data.json`, like `DataTable`.
- `type`: `line` (default), `bar`, or `area`.
- `title`: required visible title and accessible chart label.
- `xKey`: the string or numeric category column; categories follow row order and are spaced equally. This is not a continuous numeric or time axis.
- `series`: the name of a top-level series array in `data.json`. Each entry has a unique numeric column `key`, optional `label`, and optional CSS `color`. Use JSON numbers, not formatted strings. Use `null` for missing observations; line and area charts leave gaps. Each series must have at least one numeric observation.
- `height`: optional height in pixels, from 200 to 800; use `height="400"`. Defaults to 320. Width follows the article container.
- `stacked`: add the bare `stacked` attribute for stacked bars or areas; use only when the series are additive and share units.
- `yUnit`: optional shared suffix, such as `%` or `ms`, for axis ticks and tooltips.
- `caption`: optional context, takeaway, or source attribution.

The MDX renderer strips JavaScript expressions, including JSX attributes in braces. Use quoted strings and bare boolean attributes in MDX; put series arrays in `data.json`. Invalid or empty datasets display a diagnostic message. Charts include a legend, tooltips, and Recharts keyboard navigation; readers can also expand **View chart data**. Keep factual claims sourced in the surrounding article. Use `Mermaid` for flow diagrams.

## Markdown for AI agents

Every published article automatically has an AI-readable endpoint at `/articles/<slug>/article.md`. The HTML article advertises it as a `text/markdown` alternate, the article tools include a **View Markdown** action, and `/llms.txt` lists all published Markdown articles.

The Markdown response includes frontmatter, canonical and Markdown URLs, direct links to every article section, author profile URLs, the MDX source, and the companion `data.json` content. Draft endpoints return 404 in production.

The root `/sitemap.xml` contains portfolio/profile resources, the main `/articles` listing, and an explicit `/articles/sitemap.xml` URL. The article sitemap contains published HTML articles, their Markdown resources, `/articles.json`, and `/rss.xml`. `robots.txt` also advertises both sitemap files.

## Media

- Put article images under `public/assets/articles/<slug>/`.
- Run `pnpm optimize-images` after adding raster images and use the resulting `.webp` paths.
- Use `next/image` with an explicit `sizes` prop when local images are rendered by a component.
- Put source `.mp4` files in `media-src/videos/`, run `pnpm optimize-videos`, and publish only the generated WebM asset.
- Use Mermaid for diagrams that should remain editable and accessible; use an image only when the diagram is intentionally illustrative.

## Publishing checklist

1. Copy `_template/` to a new slug folder.
2. Write `article.mdx`; keep `draft: true` while working.
3. Add optional structured inputs to `data.json`.
4. Prepare the short launch copy in `twitter.md` and `linkedin.md`.
5. Add and optimize local media.
6. Preview the article on desktop and mobile, including diagrams and embeds.
7. Set `draft: false`, publish, and verify its canonical metadata, Open Graph preview, sitemap entry, RSS item, and share buttons.
8. Publish the social drafts, then add their final URLs to the `social` frontmatter fields.

Drafts appear in local development with a visible label. Production article listings, individual routes, RSS, sitemap records, and `/articles.json` exclude every article whose frontmatter still has `draft: true`.

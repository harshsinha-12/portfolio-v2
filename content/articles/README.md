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
  chart={`flowchart LR
    A[Request] --> B[Agent]
    B --> C[Answer]`}
/>

<DataTable
  dataset="results"
  caption="Rows are loaded from the results array in data.json."
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

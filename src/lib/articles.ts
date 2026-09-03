import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { siteConfig, socialMedia } from "@/data/portfolio";
import type {
  Article,
  ArticleFrontmatter,
  ArticleHeading,
  ArticleSocialLinks,
  ArticleSummary,
} from "@/types/articles";

const ARTICLES_DIRECTORY = path.join(process.cwd(), "content", "articles");
const ARTICLE_FILE = "article.mdx";
const DATA_FILE = "data.json";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function optionalString(value: unknown) {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function parseSocialLinks(value: unknown): ArticleSocialLinks {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const social = value as Record<string, unknown>;
  return {
    twitter: optionalString(social.twitter),
    linkedin: optionalString(social.linkedin),
  };
}

function parseFrontmatter(slug: string, value: Record<string, unknown>): ArticleFrontmatter {
  if (!isNonEmptyString(value.title) || !isNonEmptyString(value.description)) {
    throw new Error(`Article "${slug}" must define a title and description.`);
  }

  if (!isNonEmptyString(value.date) || Number.isNaN(Date.parse(value.date))) {
    throw new Error(`Article "${slug}" must define a valid date.`);
  }

  const tags = Array.isArray(value.tags)
    ? value.tags.filter(isNonEmptyString).map((tag) => tag.trim())
    : [];

  return {
    title: value.title.trim(),
    description: value.description.trim(),
    date: value.date,
    updatedAt: optionalString(value.updatedAt),
    tags,
    cover: optionalString(value.cover),
    draft: value.draft !== false,
    featured: value.featured === true,
    canonical: optionalString(value.canonical),
    social: parseSocialLinks(value.social),
  };
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractHeadings(body: string): ArticleHeading[] {
  const seen = new Map<string, number>();
  const headings: ArticleHeading[] = [];

  for (const line of body.split("\n")) {
    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/\s+#+$/, "").trim();
    const baseId = slugifyHeading(text);
    if (!baseId) continue;

    const count = seen.get(baseId) ?? 0;
    seen.set(baseId, count + 1);
    headings.push({
      depth: match[1].length as 2 | 3,
      text: text.replace(/[`*_~]/g, ""),
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
    });
  }

  return headings;
}

function readArticleData(directory: string): Record<string, unknown> {
  const filePath = path.join(directory, DATA_FILE);
  if (!fs.existsSync(filePath)) return {};

  const parsed: unknown = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${filePath} must contain a JSON object.`);
  }

  return parsed as Record<string, unknown>;
}

function getArticleSlugs() {
  if (!fs.existsSync(ARTICLES_DIRECTORY)) return [];

  return fs
    .readdirSync(ARTICLES_DIRECTORY, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith("_") &&
        fs.existsSync(path.join(ARTICLES_DIRECTORY, entry.name, ARTICLE_FILE)),
    )
    .map((entry) => entry.name);
}

export function getArticle(slug: string): Article | null {
  if (!getArticleSlugs().includes(slug)) return null;

  const directory = path.join(ARTICLES_DIRECTORY, slug);
  const raw = fs.readFileSync(path.join(directory, ARTICLE_FILE), "utf8");
  const parsed = matter(raw);
  const frontmatter = parseFrontmatter(slug, parsed.data);

  return {
    ...frontmatter,
    slug,
    body: parsed.content,
    readingTime: readingTime(parsed.content).text,
    headings: extractHeadings(parsed.content),
    data: readArticleData(directory),
  };
}

export function getAllArticles(options?: { includeDrafts?: boolean }): ArticleSummary[] {
  const includeDrafts = options?.includeDrafts ?? process.env.NODE_ENV !== "production";

  return getArticleSlugs()
    .map(getArticle)
    .filter((article): article is Article => Boolean(article))
    .filter((article) => includeDrafts || !article.draft)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      date: article.date,
      updatedAt: article.updatedAt,
      tags: article.tags,
      cover: article.cover,
      draft: article.draft,
      featured: article.featured,
      canonical: article.canonical,
      social: article.social,
      readingTime: article.readingTime,
    }))
    .sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
}

export function getPublishedArticles() {
  return getAllArticles({ includeDrafts: false });
}

export function buildArticleMarkdown(article: Article, siteUrl: string) {
  const articleUrl = new URL(
    article.canonical ?? `/articles/${article.slug}`,
    siteUrl,
  ).toString();
  const markdownUrl = new URL(
    `/articles/${article.slug}/article.md`,
    siteUrl,
  ).toString();
  const sectionLinks = article.headings
    .map((heading) => `- [${heading.text}](${articleUrl}#${heading.id})`)
    .join("\n");
  const profileLinks = [
    { label: "Website", url: siteUrl },
    ...socialMedia
      .filter((profile) => profile.platform !== "mail")
      .map((profile) => ({ label: profile.label, url: profile.link })),
  ];
  const profileMarkdown = profileLinks
    .map((profile) => `- [${profile.label}](${profile.url})`)
    .join("\n");
  const sameAs = profileLinks.slice(1).map((profile) => profile.url);
  const structuredData =
    Object.keys(article.data).length > 0
      ? `\n\n## Companion structured data\n\n\`\`\`json\n${JSON.stringify(article.data, null, 2)}\n\`\`\``
      : "";

  return `---
title: ${JSON.stringify(article.title)}
description: ${JSON.stringify(article.description)}
date: ${JSON.stringify(article.date)}
updatedAt: ${JSON.stringify(article.updatedAt ?? article.date)}
author:
  name: ${JSON.stringify(siteConfig.name)}
  url: ${JSON.stringify(siteUrl)}
  sameAs: ${JSON.stringify(sameAs)}
canonical: ${JSON.stringify(articleUrl)}
markdown: ${JSON.stringify(markdownUrl)}
tags: ${JSON.stringify(article.tags)}
---

> AI-readable source for [the published article](${articleUrl}). Interactive components are preserved as MDX, and their structured datasets are included at the end.

## Section links

${sectionLinks}

## Author profiles

${profileMarkdown}

${article.body.trim()}${structuredData}
`;
}

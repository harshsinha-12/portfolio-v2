import { notFound } from "next/navigation";
import { siteConfig } from "@/data/portfolio";
import { getAllArticles, getArticle } from "@/lib/articles";
import {
  articleOgContentType,
  articleOgSize,
  renderArticleOgImage,
} from "@/lib/articleOgImage";

export const runtime = "nodejs";
export const alt = `Field note by ${siteConfig.name}`;
export const size = articleOgSize;
export const contentType = articleOgContentType;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles({ includeDrafts: true }).map(({ slug }) => ({ slug }));
}

function formatOgDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article || (article.draft && process.env.NODE_ENV === "production")) {
    notFound();
  }

  return renderArticleOgImage({
    eyebrow: "Field Notes",
    title: article.title,
    description: article.description,
    meta: `${formatOgDate(article.date)} · ${article.readingTime}`,
    tags: article.tags,
  });
}

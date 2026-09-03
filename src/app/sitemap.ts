import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles().map((article) => ({
    url: new URL(article.canonical ?? `/articles/${article.slug}`, siteUrl).toString(),
    lastModified: new Date(article.updatedAt ?? article.date),
    changeFrequency: "monthly" as const,
    priority: article.featured ? 0.8 : 0.7,
    images: article.cover
      ? [new URL(article.cover, siteUrl).toString()]
      : undefined,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/api/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...articles,
  ];
}

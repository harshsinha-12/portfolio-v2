import type { MetadataRoute } from "next";
import { articleOgPath } from "@/lib/articleOgImage";
import { getPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export default function articlesSitemap(): MetadataRoute.Sitemap {
  const articleResources = getPublishedArticles().flatMap((article) => {
    const lastModified = new Date(article.updatedAt ?? article.date);
    const images = [new URL(articleOgPath(article.slug), siteUrl).toString()];

    if (article.cover) {
      images.push(new URL(article.cover, siteUrl).toString());
    }

    return [
      {
        url: new URL(
          article.canonical ?? `/articles/${article.slug}`,
          siteUrl,
        ).toString(),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: article.featured ? 0.8 : 0.7,
        images,
      },
      {
        url: `${siteUrl}/articles/${article.slug}/article.md`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      },
    ];
  });

  return [
    {
      url: `${siteUrl}/articles.json`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/rss.xml`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
    ...articleResources,
  ];
}

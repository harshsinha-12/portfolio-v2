import { getPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const siteUrl = getSiteUrl();
  const articles = getPublishedArticles();
  const items = articles
    .map((article) => {
      const url = new URL(article.canonical ?? `/articles/${article.slug}`, siteUrl).toString();
      return `<item>
  <title>${escapeXml(article.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid isPermaLink="true">${escapeXml(url)}</guid>
  <description>${escapeXml(article.description)}</description>
  <pubDate>${new Date(article.date).toUTCString()}</pubDate>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Harsh Sinha — Field Notes</title>
  <link>${escapeXml(new URL("/articles", siteUrl).toString())}</link>
  <description>Articles on AI agents, backend systems, quant, and building products.</description>
  <language>en</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

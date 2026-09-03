import { getPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export function GET() {
  const articles = getPublishedArticles().map((article) => ({
    ...article,
    url: new URL(article.canonical ?? `/articles/${article.slug}`, getSiteUrl()).toString(),
  }));

  return Response.json(
    { articles },
    {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}

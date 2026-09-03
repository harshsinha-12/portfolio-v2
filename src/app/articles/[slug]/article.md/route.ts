import { buildArticleMarkdown, getArticle, getPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublishedArticles().map(({ slug }) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article || (article.draft && process.env.NODE_ENV === "production")) {
    return new Response("Article not found.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = new URL(
    article.canonical ?? `/articles/${article.slug}`,
    siteUrl,
  ).toString();

  return new Response(buildArticleMarkdown(article, siteUrl), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      Link: `<${canonicalUrl}>; rel="canonical"`,
      "X-Robots-Tag": "noindex, follow",
    },
  });
}

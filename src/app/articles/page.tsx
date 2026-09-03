import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { ArticleIndexChrome } from "@/components/articles/ArticleChrome";
import { ArticlePreview } from "@/components/articles/ArticlePreview";
import { SiteVisitorTracker } from "@/components/analytics/SiteVisitorTracker";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Field notes from Harsh Sinha on AI agents, backend systems, quant, and building products.",
  alternates: { canonical: "/articles" },
  openGraph: {
    type: "website",
    title: "Articles | Harsh Sinha",
    description:
      "Field notes on AI agents, backend systems, quant, and building products.",
    url: "/articles",
    images: [
      {
        url: "/articles/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Articles and write-ups by Harsh Sinha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | Harsh Sinha",
    description:
      "Field notes on AI agents, backend systems, quant, and building products.",
    creator: "@sinhaharsh12",
    images: ["/articles/opengraph-image"],
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <ArticleIndexChrome>
      <SiteVisitorTracker />
      <Link className="article-index-back" href="/">
        <FiArrowLeft aria-hidden="true" /> Back to portfolio
      </Link>
      <header className="article-index-header">
        <p>Field Notes</p>
        <h1>Articles &amp; write-ups</h1>
        <div>
          Longer notes on the systems I build, the problems behind them, and the
          lessons that survive beyond a launch post.
        </div>
      </header>
      {articles.length > 0 ? (
        <div className="article-index-list">
          {articles.map((article) => (
            <ArticlePreview key={article.slug} article={article} variant="index" />
          ))}
        </div>
      ) : (
        <div className="article-index-empty">
          <p>First field note is being written.</p>
          <span>Threads, launch notes, and longer write-ups will land here.</span>
        </div>
      )}
    </ArticleIndexChrome>
  );
}

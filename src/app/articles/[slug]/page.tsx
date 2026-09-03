import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  ArticleAuthorFooter,
  ArticlePageChrome,
} from "@/components/articles/ArticleChrome";
import { createArticleComponents } from "@/components/articles/ArticleContent";
import { ShareButtons } from "@/components/articles/ShareButtons";
import { siteConfig } from "@/data/portfolio";
import { articleOgPath } from "@/lib/articleOgImage";
import { getAllArticles, getArticle } from "@/lib/articles";
import { getSiteUrl } from "@/lib/siteUrl";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function generateStaticParams() {
  return getAllArticles({ includeDrafts: true }).map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const canonical = article.canonical ?? `/articles/${article.slug}`;
  const markdown = `/articles/${article.slug}/article.md`;

  return {
    title: article.title,
    description: article.description,
    authors: [{ name: siteConfig.name, url: getSiteUrl() }],
    keywords: article.tags,
    alternates: {
      canonical,
      types: {
        "text/markdown": [{ url: markdown, title: `${article.title} — Markdown` }],
      },
    },
    robots: article.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: canonical,
      publishedTime: article.date,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      creator: "@sinhaharsh12",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article || (article.draft && process.env.NODE_ENV === "production")) {
    notFound();
  }

  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex((item) => item.slug === article.slug);
  const nextArticle =
    currentIndex >= 0 && allArticles.length > 1
      ? allArticles[(currentIndex + 1) % allArticles.length]
      : undefined;
  const articlePath = article.canonical ?? `/articles/${article.slug}`;
  const articleUrl = new URL(articlePath, getSiteUrl()).toString();
  const markdownUrl = new URL(
    `/articles/${article.slug}/article.md`,
    getSiteUrl(),
  ).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    mainEntityOfPage: articleUrl,
    image: new URL(articleOgPath(article.slug), getSiteUrl()).toString(),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
  };

  return (
    <ArticlePageChrome
      headings={article.headings}
      title={article.title}
      url={articleUrl}
      markdownUrl={markdownUrl}
      social={article.social}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="article-header">
        {article.draft ? <div className="article-draft-banner">Local draft preview</div> : null}
        <div className="article-header__meta">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime}</span>
        </div>
        <h1>{article.title}</h1>
        <div className="article-title-rule" aria-hidden="true" />
        <p className="article-header__description">{article.description}</p>
        <div className="article-byline">
          <Image
            src="/assets/profile-pic.jpg"
            alt="Harsh Sinha"
            width={44}
            height={44}
            sizes="44px"
          />
          <strong>{siteConfig.name}</strong>
          <div className="article-tags" aria-label="Article topics">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="article-mobile-share">
          <ShareButtons
            title={article.title}
            url={articleUrl}
            markdownUrl={markdownUrl}
            social={article.social}
            compact
          />
        </div>
      </header>
      <div className="article-prose">
        <MDXRemote
          source={article.body}
          components={createArticleComponents(article.data)}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                rehypeHighlight,
              ],
            },
          }}
        />
      </div>
      <ArticleAuthorFooter nextArticle={nextArticle} />
    </ArticlePageChrome>
  );
}

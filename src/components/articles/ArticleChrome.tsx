import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { ArticleSocialIcons } from "@/components/articles/ArticleSocialIcons";
import { ShareButtons } from "@/components/articles/ShareButtons";
import { ArticleTableOfContents } from "@/components/articles/ArticleTableOfContents";
import { siteConfig } from "@/data/portfolio";
import { getSiteUrl } from "@/lib/siteUrl";
import type { ArticleHeading, ArticleSocialLinks, ArticleSummary } from "@/types/articles";

type ArticleBreadcrumbItem = {
  label: string;
  href: string;
};

export function ArticleBreadcrumbs({ items }: { items: ArticleBreadcrumbItem[] }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, getSiteUrl()).toString(),
    })),
  };

  return (
    <>
      <nav className="article-breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;

            return (
              <li key={item.href}>
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {isCurrent ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <TrackedLink
                    href={item.href}
                    event="article_nav_clicked"
                    eventProperties={{
                      destination: item.href,
                      label: item.label,
                      placement: "breadcrumb",
                    }}
                  >
                    {item.label}
                  </TrackedLink>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replaceAll("<", "\\u003c"),
        }}
      />
    </>
  );
}

export function ArticleTopNav() {
  return (
    <header className="article-topbar">
      <TrackedLink
        href="/"
        className="article-brand"
        event="article_nav_clicked"
        eventProperties={{ destination: "home", placement: "article_topbar" }}
      >
        <span aria-hidden="true" />
        {siteConfig.name}
      </TrackedLink>
      <nav aria-label="Article navigation">
        <TrackedLink
          className="is-active"
          href="/articles"
          event="articles_index_opened"
          eventProperties={{ placement: "article_topbar" }}
        >
          Articles
        </TrackedLink>
        <TrackedLink
          href="/"
          event="article_nav_clicked"
          eventProperties={{ destination: "portfolio", placement: "article_topbar" }}
        >
          Portfolio
        </TrackedLink>
        <ArticleSocialIcons variant="topbar" />
      </nav>
    </header>
  );
}

type ArticlePageChromeProps = {
  children: React.ReactNode;
  headings: ArticleHeading[];
  title: string;
  slug: string;
  url: string;
  markdownUrl: string;
  social: ArticleSocialLinks;
};

export function ArticlePageChrome({
  children,
  headings,
  title,
  slug,
  url,
  markdownUrl,
  social,
}: ArticlePageChromeProps) {
  return (
    <div className="article-page">
      <CanvasBackground />
      <ArticleTopNav />
      <main className="article-paper">
        <aside className="article-rail" aria-label="Article tools">
          <p className="article-rail__eyebrow">Field Notes</p>
          {headings.length > 0 ? (
            <ArticleTableOfContents headings={headings} />
          ) : null}
          <div className="article-rail__share-label">Share this article</div>
          <ShareButtons
            title={title}
            slug={slug}
            url={url}
            markdownUrl={markdownUrl}
            social={social}
          />
        </aside>
        <div className="article-column">{children}</div>
      </main>
    </div>
  );
}

export function ArticleIndexChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="article-page article-index-page">
      <CanvasBackground />
      <ArticleTopNav />
      <main className="article-index-paper">{children}</main>
    </div>
  );
}

type ArticleAuthorFooterProps = {
  nextArticle?: ArticleSummary;
};

export function ArticleAuthorFooter({ nextArticle }: ArticleAuthorFooterProps) {
  return (
    <footer className="article-author-footer">
      <div className="article-author-footer__bio">
        <div className="article-author-footer__portrait">
          <span aria-hidden="true" />
          <Image
            src="/assets/profile-pic.jpg"
            alt="Harsh Sinha"
            width={240}
            height={300}
            sizes="(max-width: 640px) 112px, 140px"
          />
        </div>
        <div>
          <p className="article-hand-label">Written by</p>
          <h2>{siteConfig.name}</h2>
          <p>{siteConfig.tagline}</p>
          <div className="article-author-footer__socials">
            <ArticleSocialIcons variant="footer" />
          </div>
        </div>
      </div>
      {nextArticle ? (
        <TrackedLink
          className="article-next"
          href={`/articles/${nextArticle.slug}`}
          event="article_opened"
          eventProperties={{
            slug: nextArticle.slug,
            article_title: nextArticle.title,
            placement: "article_next",
          }}
        >
          <span>Next up</span>
          <strong>{nextArticle.title}</strong>
          <p>{nextArticle.description}</p>
          <FiArrowRight aria-hidden="true" />
        </TrackedLink>
      ) : (
        <TrackedLink
          className="article-next article-next--index"
          href="/articles"
          event="articles_index_opened"
          eventProperties={{ placement: "article_footer" }}
        >
          <FiArrowLeft aria-hidden="true" />
          <span>Back to all writing</span>
        </TrackedLink>
      )}
    </footer>
  );
}

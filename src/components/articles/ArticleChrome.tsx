import Link from "next/link";
import Image from "next/image";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { ShareButtons } from "@/components/articles/ShareButtons";
import { ArticleTableOfContents } from "@/components/articles/ArticleTableOfContents";
import { siteConfig, socialMedia } from "@/data/portfolio";
import type { ArticleHeading, ArticleSocialLinks, ArticleSummary } from "@/types/articles";

function socialUrl(platform: "twitter" | "linkedin" | "github") {
  return socialMedia.find((item) => item.platform === platform)?.link ?? "#";
}

export function ArticleTopNav() {
  return (
    <header className="article-topbar">
      <Link href="/" className="article-brand">
        <span aria-hidden="true" />
        {siteConfig.name}
      </Link>
      <nav aria-label="Article navigation">
        <Link className="is-active" href="/articles">
          Articles
        </Link>
        <Link href="/">Portfolio</Link>
        <a href={socialUrl("linkedin")} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <AiFillLinkedin aria-hidden="true" />
        </a>
        <a href={socialUrl("github")} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <AiFillGithub aria-hidden="true" />
        </a>
        <a href={socialUrl("twitter")} target="_blank" rel="noopener noreferrer" aria-label="X">
          <FaXTwitter aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}

type ArticlePageChromeProps = {
  children: React.ReactNode;
  headings: ArticleHeading[];
  title: string;
  url: string;
  markdownUrl: string;
  social: ArticleSocialLinks;
};

export function ArticlePageChrome({
  children,
  headings,
  title,
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
            <a
              href={socialUrl("linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <AiFillLinkedin aria-hidden="true" />
            </a>
            <a
              href={socialUrl("github")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <AiFillGithub aria-hidden="true" />
            </a>
            <a
              href={socialUrl("twitter")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <FaXTwitter aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      {nextArticle ? (
        <Link className="article-next" href={`/articles/${nextArticle.slug}`}>
          <span>Next up</span>
          <strong>{nextArticle.title}</strong>
          <p>{nextArticle.description}</p>
          <FiArrowRight aria-hidden="true" />
        </Link>
      ) : (
        <Link className="article-next article-next--index" href="/articles">
          <FiArrowLeft aria-hidden="true" />
          <span>Back to all writing</span>
        </Link>
      )}
    </footer>
  );
}

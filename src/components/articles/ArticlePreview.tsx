"use client";

import Image from "next/image";
import Link from "next/link";
import { AiFillLinkedin } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { siteConfig } from "@/data/portfolio";
import { track, trackOutboundClick } from "@/lib/analytics";
import type { ArticleSummary } from "@/types/articles";

type ArticlePreviewProps = {
  article: ArticleSummary;
  variant?: "home" | "index";
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function ArticlePreview({ article, variant = "home" }: ArticlePreviewProps) {
  const articleUrl = `/articles/${article.slug}`;
  const canonicalUrl = new URL(article.canonical ?? articleUrl, siteConfig.url).toString();
  const xUrl =
    article.social.twitter ??
    `https://x.com/intent/post?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(canonicalUrl)}`;
  const linkedInUrl =
    article.social.linkedin ??
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;

  return (
    <article className={`article-preview article-preview--${variant}`}>
      <Link
        className="article-preview__media"
        href={articleUrl}
        aria-label={`Read ${article.title}`}
        onClick={() => track("article_opened", { slug: article.slug, placement: variant })}
      >
        <Image
          src={`/articles/${article.slug}/opengraph-image`}
          alt=""
          width={1200}
          height={630}
          sizes={
            variant === "home"
              ? "(max-width: 700px) 100vw, 360px"
              : "(max-width: 700px) 100vw, 380px"
          }
        />
      </Link>
      <div className="article-preview__body">
        <div className="article-preview__meta">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime}</span>
          {article.draft ? <span className="article-preview__draft">Local draft</span> : null}
        </div>
        <h3>
          <Link
            href={articleUrl}
            onClick={() => track("article_opened", { slug: article.slug, placement: variant })}
          >
            {article.title}
          </Link>
        </h3>
        <p>{article.description}</p>
        <div className="article-preview__footer">
          <Link className="article-preview__read" href={articleUrl}>
            Read article <FiArrowUpRight aria-hidden="true" />
          </Link>
          <div className="article-preview__socials" aria-label="Article social links">
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                article.social.twitter
                  ? `Open the original ${article.title} post on X`
                  : `Share ${article.title} on X`
              }
              title={article.social.twitter ? "Original X post" : "Share on X"}
              onClick={() =>
                trackOutboundClick(xUrl, {
                  platform: "twitter",
                  slug: article.slug,
                  placement: `${variant}_article_preview`,
                })
              }
            >
              <FaXTwitter aria-hidden="true" />
              <span>{article.social.twitter ? "X post" : "Share"}</span>
            </a>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                article.social.linkedin
                  ? `Open the original ${article.title} post on LinkedIn`
                  : `Share ${article.title} on LinkedIn`
              }
              title={article.social.linkedin ? "Original LinkedIn post" : "Share on LinkedIn"}
              onClick={() =>
                trackOutboundClick(linkedInUrl, {
                  platform: "linkedin",
                  slug: article.slug,
                  placement: `${variant}_article_preview`,
                })
              }
            >
              <AiFillLinkedin aria-hidden="true" />
              <span>{article.social.linkedin ? "LinkedIn" : "Share"}</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

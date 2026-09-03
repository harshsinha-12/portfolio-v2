"use client";

import Link from "next/link";
import { AiFillLinkedin } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
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
  return (
    <article className={`article-preview article-preview--${variant}`}>
      <div className="article-preview__meta">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{article.readingTime}</span>
        {article.draft ? <span className="article-preview__draft">Local draft</span> : null}
      </div>
      <h3>
        <Link
          href={`/articles/${article.slug}`}
          onClick={() => track("article_opened", { slug: article.slug, placement: variant })}
        >
          {article.title}
        </Link>
      </h3>
      <p>{article.description}</p>
      <div className="article-preview__footer">
        <Link className="article-preview__read" href={`/articles/${article.slug}`}>
          Read article <FiArrowUpRight aria-hidden="true" />
        </Link>
        <div className="article-preview__socials" aria-label="Original social posts">
          {article.social.twitter ? (
            <a
              href={article.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${article.title} on X`}
              onClick={() =>
                trackOutboundClick(article.social.twitter!, {
                  platform: "twitter",
                  slug: article.slug,
                  placement: `${variant}_article_preview`,
                })
              }
            >
              <FaXTwitter aria-hidden="true" />
              <span>X post</span>
            </a>
          ) : null}
          {article.social.linkedin ? (
            <a
              href={article.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${article.title} on LinkedIn`}
              onClick={() =>
                trackOutboundClick(article.social.linkedin!, {
                  platform: "linkedin",
                  slug: article.slug,
                  placement: `${variant}_article_preview`,
                })
              }
            >
              <AiFillLinkedin aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

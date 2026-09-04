"use client";

import { useState } from "react";
import { AiFillLinkedin } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FiCheck, FiCopy, FiFileText, FiShare2 } from "react-icons/fi";
import { track, trackOutboundClick } from "@/lib/analytics";
import type { ArticleSocialLinks } from "@/types/articles";

type ShareButtonsProps = {
  title: string;
  slug?: string;
  url: string;
  social?: ArticleSocialLinks;
  markdownUrl?: string;
  compact?: boolean;
};

export function ShareButtons({
  title,
  slug,
  url,
  social,
  markdownUrl,
  compact = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Share on X",
      href: `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`,
      Icon: FaXTwitter,
      platform: "twitter",
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: AiFillLinkedin,
      platform: "linkedin",
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    track("article_link_copied", { title, slug: slug ?? null, url });
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function nativeShare() {
    if (!navigator.share) return copyLink();

    try {
      await navigator.share({ title, url });
      track("article_shared", { title, slug: slug ?? null, platform: "native" });
    } catch {
      // Closing the native share sheet is not an error state for the reader.
    }
  }

  return (
    <div className={compact ? "article-share article-share--compact" : "article-share"}>
      {shareLinks.map(({ label, href, Icon, platform }) => (
        <a
          key={platform}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="article-share__action"
          onClick={() => {
            trackOutboundClick(href, {
              kind: "article_share",
              label,
              platform,
              placement: "article_share",
              slug: slug ?? null,
              title,
            });
            track("article_shared", { title, slug: slug ?? null, platform });
          }}
        >
          <Icon aria-hidden="true" />
          <span>{compact ? platform === "twitter" ? "X" : "LinkedIn" : label}</span>
        </a>
      ))}
      {markdownUrl ? (
        <a
          href={markdownUrl}
          target="_blank"
          rel="alternate"
          type="text/markdown"
          className="article-share__action"
          title="View AI-readable Markdown"
          onClick={() =>
            track("article_markdown_opened", {
              title,
              slug: slug ?? null,
              url: markdownUrl,
            })
          }
        >
          <FiFileText aria-hidden="true" />
          <span>{compact ? "Markdown" : "View Markdown"}</span>
        </a>
      ) : null}
      <button type="button" className="article-share__action" onClick={copyLink}>
        {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
        <span>{copied ? "Copied" : compact ? "Copy" : "Copy link"}</span>
      </button>
      <button
        type="button"
        className="article-share__action article-share__native"
        onClick={nativeShare}
      >
        <FiShare2 aria-hidden="true" />
        <span>Share</span>
      </button>
      {social?.twitter || social?.linkedin ? (
        <div className="article-discussion-links">
          <span>Original posts</span>
          {social.twitter ? (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackOutboundClick(social.twitter!, {
                  kind: "article_original_post",
                  platform: "twitter",
                  slug: slug ?? null,
                  title,
                })
              }
            >
              X
            </a>
          ) : null}
          {social.linkedin ? (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackOutboundClick(social.linkedin!, {
                  kind: "article_original_post",
                  platform: "linkedin",
                  slug: slug ?? null,
                  title,
                })
              }
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

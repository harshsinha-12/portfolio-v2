"use client";

import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";

type ArticleViewResponse = {
  count: number | null;
};

type ArticleViewTrackerProps = {
  articleSlug: string;
  className?: string;
};

let viewRequests = new Map<string, Promise<number | null>>();

function requestArticleView(articleSlug: string) {
  if (!viewRequests.has(articleSlug)) {
    const request = fetch("/api/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "article", articleSlug }),
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }
        const body = (await response.json()) as ArticleViewResponse;
        return body.count;
      })
      .catch(() => null);

    viewRequests.set(articleSlug, request);
  }

  return viewRequests.get(articleSlug)!;
}

export function ArticleViewTracker({ 
  articleSlug, 
  className = "" 
}: ArticleViewTrackerProps) {
  const [viewCount, setViewCount] = useState<number | null>();

  useEffect(() => {
    let mounted = true;

    void requestArticleView(articleSlug).then((count) => {
      if (mounted) {
        setViewCount(count);
      }
    });

    return () => {
      mounted = false;
    };
  }, [articleSlug]);

  return (
    <div className={`inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-subtle)] ${className}`}>
      <FiEye size={14} aria-hidden="true" />
      <span>
        {viewCount === undefined 
          ? "—" 
          : viewCount === null 
            ? "Error" 
            : new Intl.NumberFormat("en-US").format(viewCount)
        }
        {viewCount === 1 ? " view" : " views"}
      </span>
    </div>
  );
}
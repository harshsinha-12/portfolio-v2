"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleIndexChrome } from "@/components/articles/ArticleChrome";

export default function ArticleError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ArticleIndexChrome>
      <div className="article-error">
        <p className="article-hand-label">Something broke</p>
        <h1>This page could not load</h1>
        <p>
          A part of this page failed to render. The rest of the site still
          works. Try again, or head back to all writing.
        </p>
        <div className="article-error__actions">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="ghost">
            <Link href="/articles">Back to all writing</Link>
          </Button>
        </div>
      </div>
    </ArticleIndexChrome>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/types/articles";
import { track } from "@/lib/analytics";

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[];
};

export function ArticleTableOfContents({ headings }: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const sections = headings
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    let animationFrame = 0;

    function updateActiveSection() {
      const readingLine = Math.min(180, window.innerHeight * 0.28);
      const atPageEnd =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      let currentId = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) {
          currentId = section.id;
        } else {
          break;
        }
      }

      if (atPageEnd) currentId = sections.at(-1)?.id ?? currentId;
      setActiveId((previousId) => (previousId === currentId ? previousId : currentId));
    }

    function scheduleUpdate() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [headings]);

  return (
    <nav className="article-toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <li key={heading.id} data-depth={heading.depth}>
              <a
                href={`#${heading.id}`}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "location" : undefined}
                onClick={() =>
                  track("article_toc_clicked", {
                    heading_id: heading.id,
                    heading_text: heading.text,
                  })
                }
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

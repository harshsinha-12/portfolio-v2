import { StickyNote, TapedCard } from "@/components/decor/Decor";
import { ArticlePreview } from "@/components/articles/ArticlePreview";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FiArrowRight } from "react-icons/fi";
import type { ArticleSummary } from "@/types/articles";

type ArticlesSectionProps = {
  articles?: ArticleSummary[];
  hasMoreArticles?: boolean;
};

export function ArticlesSection({
  articles = [],
  hasMoreArticles = false,
}: ArticlesSectionProps) {
  return (
    <section
      id="articles"
      aria-labelledby="articles-heading"
      className="animate-fade-up"
    >
      <TapedCard rotation={0.4}>
        <SectionHeading
          id="articles-heading"
          title="Articles"
          accent="& write-ups"
        />
        {articles.length > 0 ? (
          <div className="home-articles">
            <div className="home-articles__list">
              {articles.map((article) => (
                <ArticlePreview key={article.slug} article={article} />
              ))}
            </div>
            {hasMoreArticles ? (
              <TrackedLink
                className="home-articles__all marker-link"
                href="/articles"
                event="articles_index_opened"
                eventProperties={{ placement: "home_articles" }}
              >
                View all field notes <FiArrowRight aria-hidden="true" />
              </TrackedLink>
            ) : null}
          </div>
        ) : (
          <div className="flex justify-center overflow-visible py-2 sm:py-4">
            <StickyNote
              rotation={-2.5}
              color="pink"
              className="relative z-10 w-full max-w-sm text-center sm:max-w-md"
            >
              <p className="font-hand text-2xl text-[var(--color-ink)] sm:text-3xl">
                Coming soon
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                Threads, launch notes, and longer write-ups will land here.
              </p>
            </StickyNote>
          </div>
        )}
      </TapedCard>
    </section>
  );
}

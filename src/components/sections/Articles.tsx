import { StickyNote, TapedCard } from "@/components/decor/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ArticlesSection() {
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
        <div className="flex justify-center py-2 sm:py-4">
          <StickyNote
            rotation={-2.5}
            color="pink"
            className="w-full max-w-sm text-center sm:max-w-md"
          >
            <p
              className="font-hand text-2xl text-[var(--color-ink)] sm:text-3xl"
            >
              Coming soon
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Threads, launch notes, and longer write-ups will land here.
            </p>
          </StickyNote>
        </div>
      </TapedCard>
    </section>
  );
}

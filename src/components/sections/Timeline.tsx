"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  educationList,
  experienceStickers,
  experiences,
  type Experience,
} from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { TapedCard } from "@/components/decor/Decor";
import { CutoutStickers } from "@/components/decor/CutoutStickers";
import {
  formatDurationWithTenure,
  totalTenureFromDurations,
} from "@/lib/tenure";
import { cn } from "@/lib/utils";

const timelineArticleClass =
  "relative flex gap-3 [--logo-w:2.25rem] [--logo-gap:0.5rem] [--row-gap:0.75rem] sm:gap-3.5 sm:[--logo-w:2.5rem] sm:[--logo-gap:0.625rem] sm:[--row-gap:0.875rem]";

function TimelineDot() {
  return (
    <div
      className="absolute top-1.5 h-2 w-2 -translate-x-1/2 rounded-full border border-[var(--color-sticker-outline)] bg-[var(--color-accent)] shadow-[1px_1px_0_var(--color-shadow)]"
      style={{ left: "calc((var(--logo-w) / 2 + var(--row-gap)) * -1)" }}
      aria-hidden="true"
    />
  );
}

function TimelineLine() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 w-px -translate-x-1/2 border-l border-dashed border-[var(--color-ink-subtle)]/50"
      style={{ left: "calc(var(--logo-w) / 2)", top: "calc(var(--logo-w) + var(--logo-gap))" }}
      aria-hidden="true"
    />
  );
}

function OrgLogo({ icon }: { icon: string }) {
  return (
    <div
      className="relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-sticker-outline)] bg-[var(--color-paper)] shadow-[2px_3px_0_var(--color-shadow)]"
      style={{ width: "var(--logo-w)", height: "var(--logo-w)" }}
    >
      <Image
        src={icon}
        alt=""
        width={32}
        height={32}
        sizes="40px"
        className="h-[calc(var(--logo-w)-0.5rem)] w-[calc(var(--logo-w)-0.5rem)] rounded-full object-cover"
      />
    </div>
  );
}

function OrgHeader({
  title,
  link,
  tenure,
}: {
  title: string;
  link?: string;
  tenure?: string | null;
}) {
  const name = link ? (
    <LinkPreview href={link} title={title}>
      <span className="text-sm font-semibold text-[var(--color-ink)]">
        {title}
      </span>
    </LinkPreview>
  ) : (
    <span className="text-sm font-semibold text-[var(--color-ink)]">
      {title}
    </span>
  );

  return (
    <div className="min-w-0 pt-0.5">
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        {name}
        {tenure && (
          <>
            <span className="text-[var(--color-ink-subtle)]" aria-hidden="true">
              ·
            </span>
            <span className="text-[11px] text-[var(--color-ink-subtle)]">
              {tenure}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function TimelineEntry({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <TimelineDot />
      {children}
    </div>
  );
}

function ExperienceCompany({ exp }: { exp: Experience }) {
  const [expanded, setExpanded] = useState(false);
  const latest = exp.positions[0];
  const summary = latest?.content[0]?.text ?? "";
  const hasMore =
    exp.positions.length > 1 || (latest?.content.length ?? 0) > 1;
  const visiblePositions = expanded
    ? exp.positions
    : latest
      ? [latest]
      : [];
  const tenure = totalTenureFromDurations(
    exp.positions.map((position) => position.duration),
  );

  return (
    <article className={timelineArticleClass}>
      <TimelineLine />
      <OrgLogo icon={exp.logo} />

      <div className="min-w-0 flex-1">
        <OrgHeader
          title={exp.organisation}
          link={exp.link}
          tenure={tenure}
        />

        <div className="mt-3.5 space-y-3.5">
          {visiblePositions.map((position) => (
            <TimelineEntry key={`${exp.id}-${position.title}`}>
              <p className="text-xs font-semibold text-[var(--color-ink)]">
                {position.title}
              </p>
              <p className="text-[11px] text-[var(--color-ink-subtle)]">
                {formatDurationWithTenure(position.duration)}
              </p>
              {expanded ? (
                <ul className="mt-1 space-y-1">
                  {position.content.map((block, bi) => (
                    <li
                      key={`${position.title}-${bi}`}
                      className="text-xs leading-relaxed text-[var(--color-ink-muted)]"
                    >
                      {block.link ? (
                        <LinkPreview href={block.link} title={block.text}>
                          {block.text}
                        </LinkPreview>
                      ) : (
                        block.text
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  {summary}
                </p>
              )}
            </TimelineEntry>
          ))}
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown
              size={14}
              className={cn("transition-transform", expanded && "rotate-180")}
            />
          </button>
        )}
      </div>
    </article>
  );
}

function EducationItem({ edu }: { edu: (typeof educationList)[number] }) {
  const tenure = totalTenureFromDurations([edu.duration]);

  return (
    <article className={timelineArticleClass}>
      <TimelineLine />
      <OrgLogo icon={edu.icon} />

      <div className="min-w-0 flex-1">
        <OrgHeader title={edu.title} link={edu.link} tenure={tenure} />

        <div className="mt-3.5">
          <TimelineEntry>
            <p className="text-xs font-semibold text-[var(--color-ink)]">
              {edu.degree}
            </p>
            <p className="text-[11px] text-[var(--color-ink-subtle)]">
              {formatDurationWithTenure(edu.duration)}
            </p>
            {edu.content.map((line) => (
              <p
                key={line}
                className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]"
              >
                {line}
              </p>
            ))}
          </TimelineEntry>
        </div>
      </div>
    </article>
  );
}

export function TimelineSection() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative animate-fade-up">
      <CutoutStickers stickers={experienceStickers} />
      <TapedCard rotation={0} className="relative z-10">
        <SectionHeading id="experience-heading" title="Experience" accent="& education" />
        <div className="space-y-4">
          {experiences.map((exp) => (
            <ExperienceCompany key={exp.id} exp={exp} />
          ))}
        </div>
        <div className="my-5 h-px bg-[var(--color-ink-subtle)]/15" />
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-ink)]">Education</h3>
        <div className="space-y-4">
          {educationList.map((edu) => (
            <EducationItem key={edu.id} edu={edu} />
          ))}
        </div>
      </TapedCard>
    </section>
  );
}

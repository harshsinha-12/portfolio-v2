"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { stackIconMap } from "@/lib/icons";

export type OSSContribution = {
  repository: string;
  href: string;
  count: number;
  kind: "PR" | "issue";
  technologies: readonly string[];
};

type OSSContributionsProps = {
  contributions: readonly OSSContribution[];
};

function ownerAvatar(repository: string) {
  return `https://github.com/${repository.split("/")[0]}.png?size=80`;
}

export function OSSContributions({ contributions }: OSSContributionsProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  if (contributions.length === 0) return null;

  return (
    <div className="mt-4 text-[var(--color-ink-muted)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium sm:text-base">OSS contributions:</p>
        <div className="flex items-center gap-3">
          {!expanded && (
            <div className="flex items-center -space-x-2" aria-hidden="true">
              {contributions.map(({ repository }) => (
                <Image
                  key={repository}
                  src={ownerAvatar(repository)}
                  alt=""
                  width={28}
                  height={28}
                  sizes="28px"
                  unoptimized
                  className="h-7 w-7 rounded-full border-2 border-[var(--color-paper)] bg-[var(--color-paper)] object-cover"
                />
              ))}
            </div>
          )}
          <button
            type="button"
            aria-label={expanded ? "Hide OSS contributions" : "Show OSS contributions"}
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-accent)] text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-paper-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id={panelId} hidden={!expanded} className="mt-2 space-y-1">
        {contributions.map(({ repository, href, count, kind, technologies }) => (
          <a
            key={repository}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-9 items-center gap-2 rounded-md px-1.5 py-1 text-xs transition-colors hover:bg-[var(--color-paper-muted)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:text-sm"
          >
            <Image
              src={ownerAvatar(repository)}
              alt=""
              width={28}
              height={28}
              sizes="28px"
              unoptimized
              className="h-7 w-7 shrink-0 rounded-full border border-[var(--color-paper)] bg-[var(--color-paper)] object-cover"
            />
            <span className="min-w-0 flex-1 truncate">{repository}</span>
            <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
              {technologies.map((technology) => {
                const Icon = stackIconMap[technology];
                return Icon ? <Icon key={technology} className="h-4 w-4" /> : null;
              })}
            </span>
            <span className="min-w-12 shrink-0 text-right tabular-nums">
              {count} {kind}{count === 1 ? "" : "s"}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

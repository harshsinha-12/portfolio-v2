"use client";

import { AiFillGithub } from "@/lib/icons";
import { FaXTwitter } from "react-icons/fa6";
import { LinkPreview } from "@/components/ui/LinkPreview";
import type { PersonCredit } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type CreditKind = "github" | "twitter";

const compactLinkClassName =
  "flex h-5 w-5 items-center justify-center rounded border border-[var(--color-ink-subtle)]/25 text-[var(--color-ink-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-focus)] sm:h-6 sm:w-6";

const labeledLinkClassName =
  "inline-flex min-h-7 shrink-0 items-center gap-1 rounded px-1 py-1 text-[10px] font-semibold whitespace-nowrap text-[var(--color-ink)]/80 transition-[color,background-color,transform] hover:-translate-y-0.5 hover:bg-[var(--color-paper-muted)] hover:text-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]";

export function PersonCredits({
  people,
  compact = false,
  className,
  onOpen,
}: {
  people: PersonCredit[];
  compact?: boolean;
  className?: string;
  onOpen?: (person: PersonCredit, kind: CreditKind) => void;
}) {
  if (people.length === 0) return null;

  return (
    <ul
      aria-label="Built with"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1",
        compact ? "gap-x-1.5" : "justify-center",
        className,
      )}
    >
      {people.map((person) => (
        <li key={person.name} className="flex items-center gap-0.5">
          <span
            className={cn(
              "font-semibold text-[var(--color-ink)]",
              compact ? "pr-0.5 text-[10px] leading-none" : "px-1 text-[10px]",
            )}
          >
            {person.name}
          </span>
          {person.github && (
            <CreditLink
              href={person.github}
              person={person}
              kind="github"
              compact={compact}
              onOpen={onOpen}
            />
          )}
          {person.twitter && (
            <CreditLink
              href={person.twitter}
              person={person}
              kind="twitter"
              compact={compact}
              onOpen={onOpen}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function CreditLink({
  href,
  person,
  kind,
  compact,
  onOpen,
}: {
  href: string;
  person: PersonCredit;
  kind: CreditKind;
  compact: boolean;
  onOpen?: (person: PersonCredit, kind: CreditKind) => void;
}) {
  const label = kind === "github" ? "GitHub" : "Twitter";
  const Icon = kind === "github" ? AiFillGithub : FaXTwitter;

  return (
    <LinkPreview
      href={href}
      ariaLabel={`${person.name} on ${label}`}
      title={`${person.name} on ${label}`}
      description={
        kind === "github"
          ? `${person.name}'s GitHub profile.`
          : `${person.name}'s Twitter profile.`
      }
      onClick={() => onOpen?.(person, kind)}
      className={compact ? compactLinkClassName : labeledLinkClassName}
    >
      <Icon size={compact ? 10 : 13} aria-hidden="true" />
      {compact ? null : <span>{label}</span>}
    </LinkPreview>
  );
}

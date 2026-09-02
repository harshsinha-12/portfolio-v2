"use client";

import { useEffect, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { TapedCard } from "@/components/decor/Decor";

type VisitorResponse = {
  count: number | null;
};

let visitorCountRequest: Promise<number | null> | undefined;

function requestVisitorCount() {
  visitorCountRequest ??= fetch("/api/visitor", {
    method: "POST",
    cache: "no-store",
  })
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }

      const body = (await response.json()) as VisitorResponse;
      return body.count;
    })
    .catch(() => null);

  return visitorCountRequest;
}

function ordinalParts(value: number) {
  const lastTwo = value % 100;
  const last = value % 10;
  const suffix =
    lastTwo >= 11 && lastTwo <= 13
      ? "th"
      : last === 1
        ? "st"
        : last === 2
          ? "nd"
          : last === 3
            ? "rd"
            : "th";

  return {
    number: new Intl.NumberFormat("en-US").format(value),
    suffix,
  };
}

export function VisitorQuoteCard() {
  const [visitorCount, setVisitorCount] = useState<number | null>();

  useEffect(() => {
    let mounted = true;

    void requestVisitorCount().then((count) => {
      if (mounted) {
        setVisitorCount(count);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const ordinal =
    typeof visitorCount === "number" ? ordinalParts(visitorCount) : null;

  return (
    <TapedCard
      rotation={0.25}
      className="mx-auto mb-[var(--space-xl)] max-w-4xl text-left text-shadow-none max-sm:!rotate-0"
    >
      <div className="grid items-stretch gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-0">
        <blockquote className="flex min-w-0 gap-3 sm:pr-6">
          <FaQuoteLeft
            className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
              The secret of getting ahead is getting started.
            </p>
            <cite className="mt-2 block text-right text-xs not-italic text-[var(--color-ink-subtle)]">
              — Mark Twain
            </cite>
          </div>
        </blockquote>

        <div className="flex min-w-[14rem] items-center justify-center border-t border-[var(--color-ink-subtle)]/20 pt-4 text-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          {visitorCount === undefined ? (
            <span className="text-sm text-[var(--color-ink-subtle)]">
              Counting footsteps…
            </span>
          ) : ordinal ? (
            <p className="text-sm text-[var(--color-ink-muted)]">
              You are the{" "}
              <strong className="text-base font-semibold text-[var(--color-ink)]">
                {ordinal.number}
                <sup className="ml-0.5 text-[9px]">{ordinal.suffix}</sup>
              </strong>{" "}
              visitor
            </p>
          ) : (
            <span className="text-sm text-[var(--color-ink-subtle)]">
              Thanks for stopping by
            </span>
          )}
        </div>
      </div>
    </TapedCard>
  );
}

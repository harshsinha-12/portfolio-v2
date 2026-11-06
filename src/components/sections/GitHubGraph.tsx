"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FocusEvent, type MouseEvent } from "react";
import {
  loadGitHubContributions,
  multibaggContributionTotal,
  type ContributionDay,
} from "@/lib/githubContributions";
import { cn } from "@/lib/utils";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { track } from "@/lib/analytics";
import type { ScalioPRStats } from "@/lib/scalioPullRequests";
import { OSSContributions, type OSSContribution } from "@/components/sections/OSSContributions";

type TooltipState = {
  text: string;
  x: number;
  y: number;
};

export type GitHubGraphProps = {
  username: string;
  initialDays?: ContributionDay[];
  months?: number;
  cellSize?: number;
  cellGap?: number;
  showLegend?: boolean;
  showWeekdayLabels?: boolean;
  showMonthLabels?: boolean;
  colors?: string[];
  ossContributions?: readonly OSSContribution[];
  scalioPRStats?: ScalioPRStats | null;
  className?: string;
};

const DEFAULT_COLORS = [
  "var(--color-gh-0)",
  "var(--color-gh-1)",
  "var(--color-gh-2)",
  "var(--color-gh-3)",
  "var(--color-gh-4)",
];

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const ESTIMATED_WEEKS = 53;
const MOBILE_BREAKPOINT = "(max-width: 1023px)";
const MOBILE_GRAPH = {
  cellSize: 8,
  cellGap: 2,
  showWeekdayLabels: false,
} as const;

function useMobileGraphLayout() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(MOBILE_BREAKPOINT);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(MOBILE_BREAKPOINT).matches,
    () => false,
  );
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function ordinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function formatContributionDate(dateStr: string): string {
  const date = parseDate(dateStr);
  const month = date.toLocaleString("en", { month: "short" });
  return `${ordinal(date.getDate())} ${month} ${date.getFullYear()}`;
}

function formatTooltip(dateStr: string, count: number): string {
  const noun = count === 1 ? "contribution" : "contributions";
  return `${count} ${noun} on ${formatContributionDate(dateStr)}`;
}

function buildWeeks(days: ContributionDay[]) {
  if (days.length === 0) return [] as (ContributionDay | null)[][];
  const weeksCount = Math.ceil(days.length / 7);
  const weeks: (ContributionDay | null)[][] = Array.from({ length: weeksCount }, () =>
    Array.from({ length: 7 }, () => null),
  );
  days.forEach((day, index) => {
    const week = Math.floor(index / 7);
    const weekday = index % 7;
    if (week < weeksCount) weeks[week][weekday] = day;
  });
  return weeks;
}

function getMonthLabels(weeks: (ContributionDay | null)[][]) {
  const labels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) return;
    const month = parseDate(firstDay.date).getMonth();
    if (month !== lastMonth) {
      const parsed = parseDate(firstDay.date);
      const name = parsed.toLocaleString("en", { month: "short" });
      const showYear = labels.length === 0 || month === 0;
      labels.push({
        weekIndex: wi,
        label: showYear ? `${name} ’${String(parsed.getFullYear()).slice(2)}` : name,
      });
      lastMonth = month;
    }
  });

  // A leading December can sit one column before January. Drop any label
  // that doesn't have room before the next one.
  return labels.filter((label, index) => {
    const next = labels[index + 1];
    if (!next) return true;
    const minWeeks = label.label.includes("’") ? 3 : 2;
    return next.weekIndex - label.weekIndex >= minWeeks;
  });
}

export function GitHubGraph({
  username,
  initialDays,
  months = 12,
  cellSize = 11,
  cellGap = 3,
  showLegend = true,
  showWeekdayLabels = true,
  showMonthLabels = true,
  colors = DEFAULT_COLORS,
  ossContributions = [],
  scalioPRStats,
  className,
}: GitHubGraphProps) {
  const isMobileLayout = useMobileGraphLayout();
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<ContributionDay[]>(initialDays ?? []);
  const [loading, setLoading] = useState(!initialDays?.length);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const resolvedCellSize = isMobileLayout ? MOBILE_GRAPH.cellSize : cellSize;
  const resolvedCellGap = isMobileLayout ? MOBILE_GRAPH.cellGap : cellGap;
  const resolvedShowWeekdayLabels = isMobileLayout
    ? MOBILE_GRAPH.showWeekdayLabels
    : showWeekdayLabels;

  useEffect(() => {
    if (initialDays?.length) return;

    const controller = new AbortController();
    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);
        setDays(await loadGitHubContributions(username, { signal: controller.signal }));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Could not load GitHub activity.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchContributions();
    return () => controller.abort();
  }, [initialDays, username]);

  const availableYears = useMemo(() => {
    const years = new Set<number>([currentYear]);
    const monthsByYear = new Map<number, Set<number>>();
    for (const day of days) {
      const year = Number(day.date.slice(0, 4));
      const month = Number(day.date.slice(5, 7));
      const months = monthsByYear.get(year) ?? new Set<number>();
      months.add(month);
      monthsByYear.set(year, months);
    }
    for (const [year, months] of monthsByYear) {
      const onlyLeadingDecember = months.size === 1 && months.has(12);
      if (!onlyLeadingDecember && year <= currentYear) years.add(year);
    }
    return [...years].sort((a, b) => b - a);
  }, [currentYear, days]);

  const visibleDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const showingCurrentYear = selectedYear === currentYear;
    const rangeStart = showingCurrentYear ? new Date(today) : new Date(selectedYear, 0, 1);
    if (showingCurrentYear) rangeStart.setMonth(rangeStart.getMonth() - months);
    let rangeEnd = showingCurrentYear ? new Date(today) : new Date(selectedYear, 11, 31);
    if (rangeEnd > today && !showingCurrentYear) rangeEnd = new Date(today);
    rangeStart.setHours(0, 0, 0, 0);
    rangeStart.setDate(rangeStart.getDate() - rangeStart.getDay());
    rangeEnd.setHours(0, 0, 0, 0);
    rangeEnd.setDate(rangeEnd.getDate() + (6 - rangeEnd.getDay()));

    const byDate = new Map(days.map((day) => [day.date, day]));
    const aligned: ContributionDay[] = [];
    for (let cursor = new Date(rangeStart); cursor <= rangeEnd; cursor.setDate(cursor.getDate() + 1)) {
      const date = toIsoDate(cursor);
      aligned.push(byDate.get(date) ?? { date, count: 0, level: 0 });
    }
    return aligned;
  }, [currentYear, days, months, selectedYear]);

  const contributionTotal = useMemo(() => {
    return visibleDays.reduce((sum, day) => {
      if (selectedYear !== currentYear && parseDate(day.date).getFullYear() !== selectedYear) return sum;
      return sum + day.count;
    }, 0);
  }, [currentYear, selectedYear, visibleDays]);

  const weeks = useMemo(() => buildWeeks(visibleDays), [visibleDays]);
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const weekCount = weeks.length || (isMobileLayout ? 31 : ESTIMATED_WEEKS);
  const labelWidth = resolvedShowWeekdayLabels ? 28 : 0;
  const gridWidth = weekCount * (resolvedCellSize + resolvedCellGap) - resolvedCellGap;
  const gridHeight = 7 * resolvedCellSize + 6 * resolvedCellGap;
  const cellStyle = { width: resolvedCellSize, height: resolvedCellSize };

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const pin = () => {
      scroller.scrollLeft = selectedYear === currentYear ? scroller.scrollWidth : 0;
    };
    pin();
    const frame = requestAnimationFrame(pin);
    return () => cancelAnimationFrame(frame);
  }, [currentYear, selectedYear, weeks.length, resolvedCellSize, resolvedCellGap, showMonthLabels]);

  function showTooltip(
    target: HTMLElement,
    text: string,
  ) {
    const grid = gridRef.current;
    if (!grid) return;
    const gridRect = grid.getBoundingClientRect();
    const cellRect = target.getBoundingClientRect();
    setTooltip({
      text,
      x: cellRect.left - gridRect.left + cellRect.width / 2,
      y: cellRect.top - gridRect.top - 4,
    });
  }

  function handleCellMouseEnter(
    event: MouseEvent<HTMLElement>,
    dateStr: string,
    count: number,
  ) {
    showTooltip(event.currentTarget, formatTooltip(dateStr, count));
  }

  function handleCellFocus(event: FocusEvent<HTMLElement>, dateStr: string, count: number) {
    showTooltip(event.currentTarget, formatTooltip(dateStr, count));
  }

  return (
    <div className={cn("w-full min-w-0 max-w-full", className)} aria-label={`GitHub contributions for ${username}`}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[var(--color-ink-muted)]">GitHub activity</p>
          {!loading && !error && (
            <p className="mt-0.5 text-[11px] text-[var(--color-ink-subtle)]">
              {contributionTotal.toLocaleString("en-US")}{" "}
              {contributionTotal === 1 ? "contribution" : "contributions"}{" "}
              {selectedYear === currentYear ? "in the last year" : `in ${selectedYear}`}
            </p>
          )}
        </div>
        <LinkPreview
          href={`https://github.com/${username}`}
          analytics={{ kind: "github", placement: "github_map", username }}
          onClick={() =>
            track("github_profile_clicked", {
              username,
              placement: "github_map",
            })
          }
          className="text-xs text-[var(--color-ink-subtle)] hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          @{username}
        </LinkPreview>
      </div>

      {loading && (
        <div
          className="w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--color-paper-muted)]"
          style={{ height: gridHeight + (showLegend ? 24 : 0) }}
        />
      )}
      {error && !loading && (
        <p className="text-xs text-[var(--color-ink-muted)]">{error}</p>
      )}

      {!loading && !error && weeks.length > 0 && (
        <>
          <div className="flex min-w-0 items-start gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-1">
            {resolvedShowWeekdayLabels && (
              <div className="shrink-0" style={{ width: labelWidth }}>
                {showMonthLabels && <div className="mb-1.5 h-3.5" />}
                <div
                  className="flex flex-col text-[9px] leading-none text-[var(--color-ink-subtle)]"
                  style={{ gap: resolvedCellGap }}
                >
                  {WEEKDAY_LABELS.map((lbl, i) => (
                    <span key={i} style={{ height: resolvedCellSize }}>
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div
              ref={scrollRef}
              className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain"
              onMouseLeave={() => setTooltip(null)}
            >
              <div className="inline-flex w-max items-start">
                <div className="pb-4">
                  {showMonthLabels && (
                    <div
                      className="relative mb-1.5 h-3.5 text-[10px] leading-none text-[var(--color-ink-subtle)]"
                      style={{ width: gridWidth }}
                    >
                      {monthLabels.map(({ weekIndex, label }) => (
                        <span
                          key={`${label}-${weekIndex}`}
                          className="absolute top-0 whitespace-nowrap"
                          style={{ left: weekIndex * (resolvedCellSize + resolvedCellGap) }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                  <div ref={gridRef} className="relative">
                    <div className="inline-flex" style={{ gap: resolvedCellGap }}>
                      {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col" style={{ gap: resolvedCellGap }}>
                          {week.map((day, di) =>
                            day ? (
                              <div
                                key={day.date}
                                className="rounded-[2px] hover:ring-1 hover:ring-[var(--color-ink)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                                style={{
                                  ...cellStyle,
                                  backgroundColor: colors[Math.min(day.level, 4)],
                                }}
                                role="img"
                                aria-label={formatTooltip(day.date, day.count)}
                                onMouseEnter={(event) => handleCellMouseEnter(event, day.date, day.count)}
                                onFocus={(event) => handleCellFocus(event, day.date, day.count)}
                                onBlur={() => setTooltip(null)}
                                tabIndex={0}
                              />
                            ) : (
                              <div key={`e-${wi}-${di}`} style={cellStyle} aria-hidden="true" />
                            ),
                          )}
                        </div>
                      ))}
                    </div>
                    {tooltip && (
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[4px] bg-[var(--color-ink)] px-2 py-1.5 text-[10px] leading-none text-[var(--color-paper)] shadow-[0_4px_12px_var(--color-shadow)]"
                        style={{ left: tooltip.x, top: tooltip.y }}
                      >
                        {tooltip.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="flex shrink-0 flex-col gap-1" role="group" aria-label="Contribution year">
              {showMonthLabels && <div className="mb-1.5 h-3.5" aria-hidden="true" />}
              {availableYears.map((year) => {
                const selected = year === selectedYear;
                return (
                  <button
                    key={year}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setTooltip(null);
                      setSelectedYear(year);
                    }}
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-center text-[11px] font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                      selected
                        ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "text-[var(--color-ink-subtle)] hover:bg-[var(--color-paper-muted)] hover:text-[var(--color-ink)]",
                    )}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          {showLegend && (
            <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[10px] text-[var(--color-ink-subtle)]">
              <span>Less</span>
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="rounded-[2px]"
                  style={{ ...cellStyle, backgroundColor: c }}
                  aria-hidden="true"
                />
              ))}
              <span>More</span>
            </div>
          )}
          {scalioPRStats && (
            <OSSContributions
              heading="Scalio contributions"
              initiallyExpanded
              contributions={scalioPRStats.repositories.map(({ repository, count }) => ({
                repository,
                count,
                kind: "PR" as const,
                logo: "/assets/scalio.webp",
              }))}
              summary={`${scalioPRStats.total} PRs authored · ${scalioPRStats.merged} merged · ${scalioPRStats.open} open`}
            />
          )}
          <OSSContributions
            heading="Multibagg contributions"
            initiallyExpanded
            contributions={[
              {
                repository: "Multibagg AI",
                count: multibaggContributionTotal,
                kind: "contribution",
                logo: "/assets/multibagg-ai.webp",
              },
            ]}
            summary="Jan 2025 – Jun 2026"
          />
          <OSSContributions contributions={ossContributions} />
        </>
      )}
    </div>
  );
}

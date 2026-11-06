import multibaggContributions from "@/data/multibagg-contributions.json";

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionResponse = {
  contributions?: Array<{ date: string; count: number; level?: number }>;
};

type ContributionFetchInit = RequestInit & { next?: { revalidate?: number } };

/** Calendar contributions from the Multibagg account. The total does not change. */
export const multibaggContributionTotal = multibaggContributions.total;

export function levelFromCount(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function contributionsFromResponse(data: ContributionResponse): ContributionDay[] {
  return (data.contributions ?? []).map((item) => ({
    date: item.date,
    count: item.count,
    level: item.level ?? levelFromCount(item.count),
  }));
}

/**
 * Add the frozen Multibagg calendar onto another account's days.
 * The result is a Sunday-aligned run of days so the contribution grid stays lined up.
 */
export function withMultibaggContributions(
  days: readonly ContributionDay[],
  now = new Date(),
): ContributionDay[] {
  const byDate = new Map<string, ContributionDay>();
  for (const day of days) byDate.set(day.date, { ...day });

  for (const extra of multibaggContributions.days) {
    const existing = byDate.get(extra.date);
    const count = (existing?.count ?? 0) + extra.count;
    byDate.set(extra.date, {
      date: extra.date,
      count,
      level: levelFromCount(count),
    });
  }

  const today = formatIsoDate(now);
  for (const date of [...byDate.keys()]) {
    if (date > today) byDate.delete(date);
  }
  if (byDate.size === 0) return [];

  const start = parseIsoDate([...byDate.keys()].sort()[0]);
  start.setDate(start.getDate() - start.getDay());
  const end = parseIsoDate(today);
  const filled: ContributionDay[] = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const date = formatIsoDate(cursor);
    filled.push(byDate.get(date) ?? { date, count: 0, level: 0 });
  }
  return filled;
}

export async function loadGitHubContributions(
  username: string,
  init?: ContributionFetchInit,
): Promise<ContributionDay[]> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=all`,
    init,
  );
  if (!response.ok) throw new Error("Failed to fetch GitHub contributions");
  const personal = contributionsFromResponse((await response.json()) as ContributionResponse);
  if (personal.length === 0) throw new Error("Failed to fetch GitHub contributions");
  return withMultibaggContributions(personal);
}

export async function fetchGitHubContributions(username: string): Promise<ContributionDay[]> {
  return loadGitHubContributions(username, { next: { revalidate: 3600 } });
}

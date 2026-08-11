export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export function levelFromCount(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export async function fetchGitHubContributions(
  username: string,
): Promise<ContributionDay[]> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub contributions");
  }

  const data = (await res.json()) as {
    contributions?: Array<{ date: string; count: number; level?: number }>;
  };

  return (data.contributions ?? []).map((item) => ({
    date: item.date,
    count: item.count,
    level: item.level ?? levelFromCount(item.count),
  }));
}

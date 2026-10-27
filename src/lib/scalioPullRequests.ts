/** Private repositories explicitly approved for display on the public portfolio. */
const SCALIO_REPOSITORIES = ["scalio-app/scalio", "scalio-app/mobile"] as const;

export type ScalioPRStats = {
  total: number;
  merged: number;
  open: number;
  repositories: { repository: string; count: number }[];
};

export async function fetchScalioPRStats(username: string): Promise<ScalioPRStats | null> {
  const token = process.env.SCALIO_GITHUB_TOKEN;
  if (!token) return null;

  async function count(repository: string, filter: string): Promise<number> {
    const q = ["is:pr", `author:${username}`, `repo:${repository}`, filter]
      .filter(Boolean)
      .join(" ");
    const url = "https://api.github.com/search/issues?" +
      new URLSearchParams({ q, per_page: "1" }).toString();
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("GitHub PR search failed");
    const data = await response.json() as {
      total_count?: number;
      incomplete_results?: boolean;
    };
    if (data.incomplete_results || !Number.isSafeInteger(data.total_count)) {
      throw new Error("GitHub returned incomplete PR counts");
    }
    return data.total_count as number;
  }

  try {
    const all = await Promise.all(SCALIO_REPOSITORIES.map(async (repository) => {
      const [total, merged, open] = await Promise.all([
        count(repository, ""),
        count(repository, "is:merged"),
        count(repository, "is:open"),
      ]);
      if (merged + open > total) throw new Error("Inconsistent PR counts");
      return { repository, total, merged, open };
    }));

    const total = all.reduce((sum, item) => sum + item.total, 0);
    if (total === 0) return null;

    return {
      total,
      merged: all.reduce((sum, item) => sum + item.merged, 0),
      open: all.reduce((sum, item) => sum + item.open, 0),
      repositories: all
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total)
        .map(({ repository, total: count }) => ({ repository, count })),
    };
  } catch {
    // Do not publish partial or potentially inaccurate private-repo counts.
    return null;
  }
}

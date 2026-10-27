export type ScalioPRStats = { total: number; merged: number; open: number };
const ORG = "scalio-app";
export async function fetchScalioPRStats(username: string): Promise<ScalioPRStats | null> {
  const token = process.env.SCALIO_GITHUB_TOKEN;
  if (!token) return null;
  async function count(filter: string) {
    const q = ["is:pr", "author:" + username, "org:" + ORG, filter].filter(Boolean).join(" ");
    const url = "https://api.github.com/search/issues?" + new URLSearchParams({ q, per_page: "1" });
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("GitHub search failed");
    const data = await res.json() as {total_count?: number; incomplete_results?: boolean};
    if (data.incomplete_results || !Number.isSafeInteger(data.total_count) || data.total_count === undefined) throw new Error("Incomplete GitHub results");
    return data.total_count;
  }
  try {
    const [total, merged, open] = await Promise.all([count(""), count("is:merged"), count("is:open")]);
    if (total === 0 || merged + open > total) return null;
    return { total, merged, open };
  } catch { return null; }
}

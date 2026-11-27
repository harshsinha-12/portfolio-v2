import type { OSSContribution } from "@/components/sections/OSSContributions";

/** How long a successful GitHub search is reused. A new pull request shows up on the next refresh after this. */
const REVALIDATE_SECONDS = 600;
const PAGE_SIZE = 100;
const MAX_PAGES = 5;

/**
 * Icons for repositories already on the site. A repository that is not listed
 * uses the language GitHub reports for it.
 */
const KNOWN_TECHNOLOGIES: Record<string, readonly string[]> = {
  "OrchestratorInc/agent-orchestrator": ["TypeScript"],
  "pingdotgg/t3code": ["TypeScript"],
  "superplanehq/superplane": ["Go"],
  "itsmosin/ismegroutbhardenge": ["HTML"],
  "OpenBB-finance/OpenBB": ["Python"],
  "openbq-org/OpenBB": ["Python"],
  "codebasics/langchain": ["Python"],
};

type SearchItem = {
  updated_at?: string;
  repository_url?: string;
};

type SearchResponse = {
  total_count?: number;
  incomplete_results?: boolean;
  items?: SearchItem[];
};

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "harshsinha-portfolio",
  "X-GitHub-Api-Version": "2022-11-28",
};

function repositoryName(item: SearchItem): string | null {
  const prefix = "https://api.github.com/repos/";
  const url = item.repository_url;
  if (!url?.startsWith(prefix)) return null;
  const name = url.slice(prefix.length);
  return name.includes("/") ? name : null;
}

/**
 * Every matching public pull request or issue.
 * Returns null unless GitHub returns a complete result, so the page can keep
 * the last list written into the portfolio data.
 */
async function searchAll(query: string): Promise<SearchItem[] | null> {
  const items: SearchItem[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url =
      "https://api.github.com/search/issues?" +
      new URLSearchParams({
        q: query,
        per_page: String(PAGE_SIZE),
        page: String(page),
        sort: "updated",
        order: "desc",
      }).toString();

    const response = await fetch(url, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as SearchResponse;
    const total = data.total_count;
    if (
      data.incomplete_results ||
      typeof total !== "number" ||
      !Number.isSafeInteger(total) ||
      !Array.isArray(data.items)
    ) {
      return null;
    }

    items.push(...data.items);
    if (items.length >= total || data.items.length < PAGE_SIZE) return items;
  }

  return null;
}

async function technologiesFor(repository: string): Promise<readonly string[] | undefined> {
  const known = KNOWN_TECHNOLOGIES[repository];
  if (known) return known;

  try {
    const response = await fetch(`https://api.github.com/repos/${repository}`, {
      headers,
      next: { revalidate: 86_400 },
    });
    if (!response.ok) return undefined;
    const data = (await response.json()) as { language?: string | null };
    return data.language ? [data.language] : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Public pull requests and issues authored outside this GitHub account.
 * One row per repository. Pull requests take the row when the repository has both.
 * There is no link. Other organizations cannot notify this site, so this asks
 * GitHub directly and the result is cached for ten minutes.
 */
export async function fetchExternalOSSContributions(
  username: string,
): Promise<OSSContribution[] | null> {
  try {
    const outsideAccount = `-user:${username}`;
    const [pullRequests, issues] = await Promise.all([
      searchAll(`is:pr author:${username} ${outsideAccount}`),
      searchAll(`is:issue author:${username} ${outsideAccount}`),
    ]);
    if (!pullRequests || !issues) return null;

    const byRepository = new Map<string, { prs: number; issues: number; updatedAt: string }>();

    function add(items: SearchItem[], field: "prs" | "issues") {
      for (const item of items) {
        const repository = repositoryName(item);
        if (!repository || repository.startsWith(`${username}/`)) continue;
        const current = byRepository.get(repository) ?? { prs: 0, issues: 0, updatedAt: "" };
        current[field] += 1;
        if ((item.updated_at ?? "") > current.updatedAt) current.updatedAt = item.updated_at ?? "";
        byRepository.set(repository, current);
      }
    }

    add(pullRequests, "prs");
    add(issues, "issues");

    const rows = [...byRepository.entries()]
      .flatMap(([repository, bucket]) => {
        const count = bucket.prs > 0 ? bucket.prs : bucket.issues;
        if (count === 0) return [];
        return [
          {
            repository,
            count,
            kind: bucket.prs > 0 ? ("PR" as const) : ("issue" as const),
            updatedAt: bucket.updatedAt,
          },
        ];
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.count - a.count);

    const technologies = await Promise.all(rows.map((row) => technologiesFor(row.repository)));

    return rows.map((row, index) => ({
      repository: row.repository,
      count: row.count,
      kind: row.kind,
      technologies: technologies[index],
    }));
  } catch {
    return null;
  }
}

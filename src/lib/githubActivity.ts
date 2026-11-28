export type GitHubActivity = {
  commits: number;
  codeReview: number;
  pullRequests: number;
  issues: number;
  from: string;
  to: string;
};

/**
 * Public contributionsCollection for harshsinha-12, fetched 2026-11-28.
 * This is the same split the GitHub profile activity chart shows.
 * Private contributions are not included.
 */
export const githubActivitySnapshot: GitHubActivity = {
  commits: 943,
  codeReview: 9,
  pullRequests: 118,
  issues: 2,
  from: "2025-11-23",
  to: "2026-11-28",
};

export function activityPercents(activity: GitHubActivity) {
  const total = activity.commits + activity.codeReview + activity.pullRequests + activity.issues;
  const round = (count: number) => (total === 0 ? 0 : Math.round((count / total) * 100));
  return {
    total,
    commits: round(activity.commits),
    codeReview: round(activity.codeReview),
    pullRequests: round(activity.pullRequests),
    issues: round(activity.issues),
  };
}

const ACTIVITY_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        startedAt
        endedAt
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
      }
    }
  }
`;

function day(iso: string): string {
  return iso.slice(0, 10);
}

export async function fetchGitHubActivity(username: string): Promise<GitHubActivity | null> {
  const token = process.env.GITHUB_TOKEN ?? process.env.SCALIO_GITHUB_TOKEN;
  const fallback = username === "harshsinha-12" ? githubActivitySnapshot : null;
  if (!token) return fallback;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ query: ACTIVITY_QUERY, variables: { login: username } }),
      next: { revalidate: 3600 },
    });
    if (!response.ok) return fallback;
    const body = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            startedAt?: string;
            endedAt?: string;
            totalCommitContributions?: number;
            totalIssueContributions?: number;
            totalPullRequestContributions?: number;
            totalPullRequestReviewContributions?: number;
          };
        };
      };
    };
    const collection = body.data?.user?.contributionsCollection;
    if (!collection?.startedAt || !collection.endedAt) return fallback;
    const counts = [
      collection.totalCommitContributions,
      collection.totalPullRequestReviewContributions,
      collection.totalPullRequestContributions,
      collection.totalIssueContributions,
    ];
    if (counts.some((count) => !Number.isSafeInteger(count))) return fallback;
    return {
      commits: collection.totalCommitContributions as number,
      codeReview: collection.totalPullRequestReviewContributions as number,
      pullRequests: collection.totalPullRequestContributions as number,
      issues: collection.totalIssueContributions as number,
      from: day(collection.startedAt),
      to: day(collection.endedAt),
    };
  } catch {
    return fallback;
  }
}

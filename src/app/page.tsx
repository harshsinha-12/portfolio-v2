import { SiteShell } from "@/components/layout/SiteShell";
import { getAllArticles } from "@/lib/articles";
import { fetchGitHubContributions } from "@/lib/githubContributions";
import { fetchGitHubActivity } from "@/lib/githubActivity";
import { fetchExternalOSSContributions } from "@/lib/externalContributions";
import { fetchScalioPRStats } from "@/lib/scalioPullRequests";
import { ossContributions, siteConfig } from "@/data/portfolio";

export default async function Home() {
  let initialContributions;

  try {
    initialContributions = await fetchGitHubContributions(siteConfig.githubUsername);
  } catch {
    initialContributions = undefined;
  }

  const [scalioPRStats, externalContributions, githubActivity] = await Promise.all([
    fetchScalioPRStats(siteConfig.githubUsername),
    fetchExternalOSSContributions(siteConfig.githubUsername),
    fetchGitHubActivity(siteConfig.githubUsername),
  ]);
  const contributions = externalContributions ?? [...ossContributions];

  const allArticles = getAllArticles();
  const articles = allArticles.slice(0, 3);

  return (
    <SiteShell
      initialContributions={initialContributions}
      ossContributions={contributions}
      scalioPRStats={scalioPRStats}
      githubActivity={githubActivity}
      articles={articles}
      hasMoreArticles={allArticles.length > articles.length}
    />
  );
}

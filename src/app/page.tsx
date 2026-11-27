import { SiteShell } from "@/components/layout/SiteShell";
import { getAllArticles } from "@/lib/articles";
import { fetchGitHubContributions } from "@/lib/githubContributions";
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

  const [scalioPRStats, externalContributions] = await Promise.all([
    fetchScalioPRStats(siteConfig.githubUsername),
    fetchExternalOSSContributions(siteConfig.githubUsername),
  ]);
  const contributions = externalContributions ?? [...ossContributions];

  const allArticles = getAllArticles();
  const articles = allArticles.slice(0, 3);

  return (
    <SiteShell
      initialContributions={initialContributions}
      ossContributions={contributions}
      scalioPRStats={scalioPRStats}
      articles={articles}
      hasMoreArticles={allArticles.length > articles.length}
    />
  );
}

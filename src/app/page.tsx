import { SiteShell } from "@/components/layout/SiteShell";
import { getAllArticles } from "@/lib/articles";
import { fetchGitHubContributions } from "@/lib/githubContributions";
import { siteConfig } from "@/data/portfolio";

export default async function Home() {
  let initialContributions;

  try {
    initialContributions = await fetchGitHubContributions(siteConfig.githubUsername);
  } catch {
    initialContributions = undefined;
  }

  const allArticles = getAllArticles();
  const articles = allArticles.slice(0, 3);

  return (
    <SiteShell
      initialContributions={initialContributions}
      articles={articles}
      hasMoreArticles={allArticles.length > articles.length}
    />
  );
}

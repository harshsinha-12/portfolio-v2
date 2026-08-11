import { SiteShell } from "@/components/layout/SiteShell";
import { fetchGitHubContributions } from "@/lib/githubContributions";
import { siteConfig } from "@/data/portfolio";

export default async function Home() {
  let initialContributions;

  try {
    initialContributions = await fetchGitHubContributions(siteConfig.githubUsername);
  } catch {
    initialContributions = undefined;
  }

  return <SiteShell initialContributions={initialContributions} />;
}

"use client";

import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { ScatterDecor } from "@/components/decor/ScatterDecor";
import { XactoProvider, XactoScratchLayer } from "@/components/decor/XactoProvider";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { ProfileSection } from "@/components/sections/Profile";
import { TimelineSection } from "@/components/sections/Timeline";
import { AchievementsSection } from "@/components/sections/Achievements";
import { ProjectsSection } from "@/components/sections/Projects";
import { TechStackSection } from "@/components/sections/TechStack";
import { ArticlesSection } from "@/components/sections/Articles";
import type { ContributionDay } from "@/lib/githubContributions";
import type { ScalioPRStats } from "@/lib/scalioPullRequests";
import type { ArticleSummary } from "@/types/articles";

type SiteShellProps = {
  initialContributions?: ContributionDay[];
  scalioPRStats?: ScalioPRStats | null;
  articles?: ArticleSummary[];
  hasMoreArticles?: boolean;
};

export function SiteShell({
  initialContributions,
  scalioPRStats,
  articles = [],
  hasMoreArticles = false,
}: SiteShellProps) {
  return (
    <SoundProvider>
      <XactoProvider>
        <CanvasBackground />
        <div className="relative overflow-x-clip">
          <XactoScratchLayer />
          <div className="relative z-10 mx-auto min-h-screen w-full max-w-[var(--content-max-canvas)] px-4 py-6 sm:px-6">
            <ScatterDecor />
            <FloatingNav />
            <main className="flex flex-col gap-[var(--space-2xl)] lg:gap-[var(--space-3xl)] [&>#hackathons]:-mt-2 lg:[&>#hackathons]:-mt-6">
              <ProfileSection initialContributions={initialContributions} scalioPRStats={scalioPRStats} />
              <TimelineSection />
              <ProjectsSection />
              <TechStackSection />
              <AchievementsSection />
              <ArticlesSection
                articles={articles}
                hasMoreArticles={hasMoreArticles}
              />
            </main>
            <Footer />
          </div>
        </div>
      </XactoProvider>
    </SoundProvider>
  );
}

"use client";

import Image from "next/image";
import { BookOpenText, ExternalLink } from "lucide-react";
import {
  PiArrowBendDownRightThin,
  PiArrowBendUpLeftThin,
  PiArrowBendUpRightThin,
} from "react-icons/pi";
import type { IconType } from "react-icons";
import { AiFillGithub, AiFillYoutube } from "@/lib/icons";
import { projects, projectStickers, type Project } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StackIconRow } from "@/components/ui/StackIcons";
import { Button } from "@/components/ui/button";
import { PushPin, WashiTape } from "@/components/decor/PushPin";
import { CutoutStickers } from "@/components/decor/CutoutStickers";
import { resetAllStickerPositions } from "@/components/decor/useDraggable";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { ProjectPreviewVideo } from "@/components/ui/ProjectPreviewVideo";
import { useOpenGraphPreview } from "@/lib/useOpenGraphPreview";
import { cn, placeholderGradient } from "@/lib/utils";
import { track } from "@/lib/analytics";

function isLocalAsset(src: string) {
  return src.startsWith("/");
}

const projectCoverSizes =
  "(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 92vw";

type PreviewShape = "standard" | "wide";

function ProjectPreview({
  project,
  shape = "standard",
}: {
  project: Project;
  shape?: PreviewShape;
}) {
  const ogPreview = useOpenGraphPreview(project.link, !project.image);
  const previewImage = project.image ?? ogPreview?.image ?? null;
  const frameClassName = cn(
    "project-storyboard-preview relative w-full overflow-hidden border border-[var(--color-ink)]/15 bg-[var(--color-paper-muted)] shadow-[2px_3px_0_var(--color-shadow)]",
    shape === "wide" ? "aspect-[16/8]" : "aspect-[16/10]",
  );

  if (previewImage && project.video && isLocalAsset(previewImage)) {
    return (
      <div className={frameClassName}>
        <ProjectPreviewVideo
          video={project.video}
          poster={previewImage}
          title={project.title}
          projectId={project.id}
          sizes={projectCoverSizes}
        />
      </div>
    );
  }

  if (previewImage) {
    return (
      <div className={frameClassName}>
        {isLocalAsset(previewImage) ? (
          <Image
            src={previewImage}
            alt=""
            fill
            sizes={projectCoverSizes}
            className="object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewImage} alt="" className="h-full w-full object-cover" />
        )}
      </div>
    );
  }

  return (
    <div
      className={frameClassName}
      style={{ background: placeholderGradient(project.title) }}
    >
      <div className="flex h-full items-center justify-center">
        <span className="font-hand text-lg text-white/90">{project.title}</span>
      </div>
    </div>
  );
}

const projectLinkClassName =
  "inline-flex min-h-7 shrink-0 items-center gap-1 rounded px-1 py-1 text-[10px] font-semibold whitespace-nowrap text-[var(--color-ink)]/80 transition-[color,background-color,transform] hover:-translate-y-0.5 hover:bg-[var(--color-paper-muted)] hover:text-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]";

const projectLinkIconSize = 13;

function ProjectLinks({
  project,
  liveLinkTitle,
  liveLinkDescription,
}: {
  project: Project;
  liveLinkTitle: string;
  liveLinkDescription: string;
}) {
  const hasLinks = project.github || project.readme || project.youtube || project.link;
  if (!hasLinks) return null;

  return (
    <div className="mt-2 flex flex-nowrap items-center justify-center gap-x-0.5">
      {project.github && (
        <LinkPreview
          href={project.github}
          ariaLabel={`GitHub for ${project.title}`}
          analytics={{ kind: "github", project_id: project.id, project_name: project.title }}
          onClick={() =>
            track("project_link_clicked", {
              project_id: project.id,
              project_name: project.title,
              link_type: "github",
            })
          }
          className={projectLinkClassName}
        >
          <AiFillGithub size={projectLinkIconSize} aria-hidden="true" />
          <span>GitHub</span>
        </LinkPreview>
      )}
      {project.readme && (
        <LinkPreview
          href={project.readme}
          ariaLabel={`README for ${project.title}`}
          analytics={{ kind: "readme", project_id: project.id, project_name: project.title }}
          onClick={() =>
            track("project_link_clicked", {
              project_id: project.id,
              project_name: project.title,
              link_type: "readme",
            })
          }
          title={`${project.title} README`}
          description="Architecture, setup, implementation details, and current limitations."
          className={projectLinkClassName}
        >
          <BookOpenText size={projectLinkIconSize} strokeWidth={2.1} aria-hidden="true" />
          <span>README</span>
        </LinkPreview>
      )}
      {project.youtube && (
        <LinkPreview
          href={project.youtube}
          ariaLabel={`Video for ${project.title}`}
          analytics={{ kind: "youtube", project_id: project.id, project_name: project.title }}
          onClick={() =>
            track("project_link_clicked", {
              project_id: project.id,
              project_name: project.title,
              link_type: "youtube",
            })
          }
          className={projectLinkClassName}
        >
          <AiFillYoutube size={projectLinkIconSize} aria-hidden="true" />
          <span>Video</span>
        </LinkPreview>
      )}
      {project.link && (
        <LinkPreview
          href={project.link}
          analytics={{ kind: "live_site", project_id: project.id, project_name: project.title }}
          onClick={() =>
            track("project_link_clicked", {
              project_id: project.id,
              project_name: project.title,
              link_type: "live_site",
            })
          }
          title={liveLinkTitle}
          description={liveLinkDescription}
          className={projectLinkClassName}
        >
          <ExternalLink size={projectLinkIconSize} strokeWidth={2.25} aria-hidden="true" />
          <span>Live</span>
        </LinkPreview>
      )}
    </div>
  );
}

function ProjectStory({
  project,
  shape = "standard",
  className,
}: {
  project: Project;
  shape?: PreviewShape;
  className?: string;
}) {
  const ogPreview = useOpenGraphPreview(project.link, !project.image);
  const liveLinkTitle = ogPreview?.title ?? project.title;
  const liveLinkDescription = ogPreview?.description ?? project.content;

  return (
    <article className={cn("min-w-0", className)}>
      <div className="relative px-1 pt-2">
        <PushPin className="top-0 left-[58%]" />
        <ProjectPreview project={project} shape={shape} />
      </div>
      <div className="mt-3 min-w-0 px-1">
        <div className="min-w-0 text-center">
          <h4
            className="whitespace-nowrap text-[clamp(0.72rem,1.12vw,0.95rem)] font-semibold leading-snug text-[var(--color-ink)]"
            style={{ overflowWrap: "anywhere" }}
          >
            {project.title}
          </h4>
          <StackIconRow stack={project.stack} className="mt-1 justify-center gap-1" />
        </div>
        {project.highlight && (
          <p className="mt-1 text-[10px] font-medium leading-snug text-[var(--color-accent-hover)]">
            {project.highlight}
          </p>
        )}
        <p className="mt-2 text-[11px] leading-[1.55] text-[var(--color-ink-muted)]">
          {project.content}
        </p>
        <ProjectLinks
          project={project}
          liveLinkTitle={liveLinkTitle}
          liveLinkDescription={liveLinkDescription}
        />
      </div>
    </article>
  );
}

function PencilNote({
  children,
  icon: Icon,
  className,
}: {
  children: React.ReactNode;
  icon: IconType;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-[var(--color-mat)]/80", className)}>
      <p className="font-hand text-base leading-tight">{children}</p>
      <Icon className="h-12 w-12 shrink-0" aria-hidden="true" />
    </div>
  );
}

function ChapterHeading({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <header className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)]/80 font-hand text-2xl leading-none text-[var(--color-ink)]">
        {number}
      </span>
      <h3 className="font-hand text-xl font-semibold uppercase tracking-wide text-[var(--color-ink)] underline decoration-[var(--color-ink)]/75 decoration-2 underline-offset-8 sm:text-2xl">
        {children}
      </h3>
    </header>
  );
}

function getProject(id: string) {
  const project = projects.find((entry) => entry.id === id);
  if (!project) throw new Error(`Missing project: ${id}`);
  return project;
}

export function ProjectsSection() {
  const recoveryOs = getProject("recovery-os");
  const tradingArena = getProject("llm-trading-arena-frontend");
  const vritta = getProject("vritta-ai");
  const creativeIntelligence = getProject("instagram-creative-intelligence");
  const tradingEngine = getProject("llm-trading-arena-engine");
  const goRabbit = getProject("go-rabbit");

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative animate-fade-up scroll-mt-24">
      <CutoutStickers stickers={projectStickers} />
      <SectionHeading id="projects-heading" title="Projects" accent="pinned up" onMat />

      <div className="project-storyboard relative z-10">
        <PushPin className="top-2 left-4 sm:left-7" />
        <PushPin className="top-2 left-auto right-4 translate-x-0 sm:right-7" />
        <WashiTape className="-top-2 left-16 hidden sm:block" rotation={-5} />
        <WashiTape className="-top-1 right-14 hidden sm:block" rotation={7} />

        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.55fr_1.1fr] xl:gap-0">
          <section className="project-storyboard-chapter project-storyboard-chapter--first xl:pr-6">
            <ChapterHeading number="1">Ship &amp; recover</ChapterHeading>
            <ProjectStory project={recoveryOs} />
            <PencilNote
              icon={PiArrowBendUpRightThin}
              className="mt-8 max-w-[17rem] -rotate-2"
            >
              Make recovery predictable, explainable, and trustworthy.
            </PencilNote>
          </section>

          <section className="project-storyboard-chapter xl:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <ChapterHeading number="2">Research &amp; markets</ChapterHeading>
              <PencilNote
                icon={PiArrowBendDownRightThin}
                className="hidden max-w-[14rem] -rotate-2 2xl:flex"
              >
                Markets need better models and context.
              </PencilNote>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <ProjectStory project={tradingArena} />
              <ProjectStory project={vritta} />
            </div>
            <ProjectStory
              project={tradingEngine}
              shape="wide"
              className="mt-8 border-t border-[var(--color-ink)]/15 pt-5 sm:mx-8"
            />
            <PencilNote
              icon={PiArrowBendUpRightThin}
              className="mt-5 max-w-[17rem] rotate-[-3deg]"
            >
              From research to rigorous, reproducible execution.
            </PencilNote>
          </section>

          <section className="project-storyboard-chapter project-storyboard-chapter--last xl:pl-6">
            <ChapterHeading number="3">Agents &amp; automation</ChapterHeading>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1">
              <ProjectStory project={creativeIntelligence} shape="wide" />
              <ProjectStory project={goRabbit} shape="wide" />
            </div>
            <PencilNote
              icon={PiArrowBendUpLeftThin}
              className="ml-auto mt-6 max-w-[17rem] rotate-2 flex-row-reverse text-right"
            >
              Automate the boring, ship more confidently.
            </PencilNote>
          </section>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          track("stickers_reset");
          resetAllStickerPositions();
        }}
        className="relative z-30 mt-4 hidden font-hand xl:inline-flex"
      >
        Reset stickers
      </Button>
    </section>
  );
}

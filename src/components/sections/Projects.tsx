"use client";

import { createElement } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { AiFillGithub, AiFillYoutube } from "@/lib/icons";
import { projects, projectStickers, type Project, type ProjectStackItem } from "@/data/portfolio";
import { getStackIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { PinnedCard } from "@/components/decor/Decor";
import { CutoutStickers } from "@/components/decor/CutoutStickers";
import { resetAllStickerPositions } from "@/components/decor/useDraggable";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { ProjectPreviewVideo } from "@/components/ui/ProjectPreviewVideo";
import { useOpenGraphPreview } from "@/lib/useOpenGraphPreview";
import { placeholderGradient } from "@/lib/utils";
import { track } from "@/lib/analytics";

function isLocalAsset(src: string) {
  return src.startsWith("/");
}

const projectCoverSizes = "(min-width: 1280px) 30vw, (min-width: 520px) 45vw, 90vw";

function ProjectPreview({ project }: { project: Project }) {
  const ogPreview = useOpenGraphPreview(project.link, !project.image);
  const previewImage = project.image ?? ogPreview?.image ?? null;

  if (previewImage && project.video && isLocalAsset(previewImage)) {
    return (
      <ProjectPreviewVideo
        video={project.video}
        poster={previewImage}
        title={project.title}
        projectId={project.id}
        sizes={projectCoverSizes}
      />
    );
  }

  if (previewImage) {
    return (
      <div className="relative mb-1.5 aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-md)] border-2 border-[var(--color-sticker-outline)] bg-[var(--color-paper-muted)]">
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
          <img
            src={previewImage}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="relative mb-1.5 aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-md)] border-2 border-[var(--color-sticker-outline)]"
      style={{ background: placeholderGradient(project.title) }}
    >
      <div className="flex h-full items-center justify-center">
        <span className="font-hand text-lg text-white/90">{project.title}</span>
      </div>
    </div>
  );
}

const stackIconColorClass = "text-[var(--color-ink)]/60";

function StackIcon({ tech }: { tech: ProjectStackItem }) {
  const Icon = getStackIcon(tech.name);

  if (tech.icon) {
    return (
      <span
        title={tech.name}
        className="inline-flex shrink-0 items-center justify-center"
      >
        <Image
          src={tech.icon}
          alt=""
          width={14}
          height={14}
          sizes="14px"
          className="h-3.5 w-3.5 object-contain opacity-90"
        />
        <span className="sr-only">{tech.name}</span>
      </span>
    );
  }

  if (!Icon) {
    return (
      <span
        title={tech.name}
        className={`inline-flex shrink-0 items-center justify-center text-[9px] font-semibold ${stackIconColorClass}`}
      >
        {tech.name.slice(0, 1)}
        <span className="sr-only">{tech.name}</span>
      </span>
    );
  }

  return (
    <span
      title={tech.name}
      className={`inline-flex shrink-0 items-center justify-center ${stackIconColorClass}`}
    >
      {createElement(Icon, { size: 11, "aria-hidden": true })}
      <span className="sr-only">{tech.name}</span>
    </span>
  );
}

const projectLinkClassName =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--color-paper-muted)] text-[var(--color-ink)]/80 transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]";

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
  const hasLinks = project.github || project.youtube || project.link;
  if (!hasLinks) return null;

  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {project.github && (
        <LinkPreview
          href={project.github}
          ariaLabel={`GitHub for ${project.title}`}
          onClick={() => track("project_link_clicked", { project_id: project.id, link_type: "github" })}
          className={projectLinkClassName}
        >
          <AiFillGithub size={projectLinkIconSize} aria-hidden="true" />
        </LinkPreview>
      )}
      {project.youtube && (
        <LinkPreview
          href={project.youtube}
          ariaLabel={`Video for ${project.title}`}
          onClick={() => track("project_link_clicked", { project_id: project.id, link_type: "youtube" })}
          className={projectLinkClassName}
        >
          <AiFillYoutube size={projectLinkIconSize} aria-hidden="true" />
        </LinkPreview>
      )}
      {project.link && (
        <LinkPreview
          href={project.link}
          onClick={() => track("project_link_clicked", { project_id: project.id, link_type: "live_site" })}
          title={liveLinkTitle}
          description={liveLinkDescription}
          className={projectLinkClassName}
        >
          <ExternalLink size={projectLinkIconSize} strokeWidth={2.25} aria-hidden="true" />
          <span className="sr-only">Live link for {project.title}</span>
        </LinkPreview>
      )}
    </div>
  );
}

function ProjectCardContent({ project }: { project: Project }) {
  const ogPreview = useOpenGraphPreview(project.link, !project.image);
  const liveLinkTitle = ogPreview?.title ?? project.title;
  const liveLinkDescription = ogPreview?.description ?? project.content;

  return (
    <>
      <ProjectPreview project={project} />
      <div className="min-w-0">
        <div className="flex min-w-0 items-start gap-2">
          <h3
            className="min-w-0 flex-1 text-base font-semibold leading-snug text-[var(--color-ink)]"
            style={{ overflowWrap: "anywhere" }}
          >
            {project.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            {project.stack.map((tech) => (
              <StackIcon key={tech.name} tech={tech} />
            ))}
          </div>
        </div>
        {project.highlight && (
          <p className="mt-0.5 text-[11px] font-medium text-[var(--color-accent)]">
            {project.highlight}
          </p>
        )}
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
          {project.content}
        </p>
        <ProjectLinks
          project={project}
          liveLinkTitle={liveLinkTitle}
          liveLinkDescription={liveLinkDescription}
        />
      </div>
    </>
  );
}

export function ProjectsSection() {
  const rotations = [-1.5, 1.2, -0.8, 1.6, -1.1, 0.9];

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative animate-fade-up">
      <CutoutStickers stickers={projectStickers} />
      <SectionHeading id="projects-heading" title="Projects" accent="pinned up" onMat />
      <div className="relative z-10 grid grid-cols-1 gap-8 min-[520px]:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, i) => (
          <PinnedCard key={project.id} rotation={rotations[i] ?? 0}>
            <ProjectCardContent project={project} />
          </PinnedCard>
        ))}
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

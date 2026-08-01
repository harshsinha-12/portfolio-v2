"use client";

import { createElement, useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { AiFillGithub, AiFillYoutube } from "@/lib/icons";
import { projects, type Project, type ProjectStackItem } from "@/data/portfolio";
import { getStackIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PinnedCard } from "@/components/decor/Decor";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { placeholderGradient } from "@/lib/utils";

type OgPreview = {
  image: string | null;
  title: string | null;
  description: string | null;
};

function useOpenGraphPreview(link?: string, enabled = true) {
  const [preview, setPreview] = useState<OgPreview | null>(null);

  useEffect(() => {
    if (!enabled || !link) return;

    let cancelled = false;

    fetch(`/api/og?url=${encodeURIComponent(link)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: OgPreview | null) => {
        if (!cancelled && data) setPreview(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [enabled, link]);

  return preview;
}

function ProjectPreview({ project }: { project: Project }) {
  const ogPreview = useOpenGraphPreview(project.link, !project.image);
  const previewImage = project.image ?? ogPreview?.image ?? null;

  if (previewImage) {
    return (
      <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-md)] border-2 border-[var(--color-sticker-outline)] bg-[var(--color-paper-muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewImage}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-md)] border-2 border-[var(--color-sticker-outline)]"
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
    <div className="mt-2 flex flex-wrap gap-1.5">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub for ${project.title}`}
          className={projectLinkClassName}
        >
          <AiFillGithub size={projectLinkIconSize} aria-hidden="true" />
        </a>
      )}
      {project.youtube && (
        <a
          href={project.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Video for ${project.title}`}
          className={projectLinkClassName}
        >
          <AiFillYoutube size={projectLinkIconSize} aria-hidden="true" />
        </a>
      )}
      {project.link && (
        <LinkPreview
          href={project.link}
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
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)]">
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
    <section id="projects" aria-labelledby="projects-heading" className="animate-fade-up">
      <SectionHeading id="projects-heading" title="Projects" accent="pinned up" onMat />
      <div className="grid grid-cols-1 gap-8 min-[520px]:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, i) => (
          <PinnedCard key={project.id} rotation={rotations[i] ?? 0}>
            <ProjectCardContent project={project} />
          </PinnedCard>
        ))}
      </div>
    </section>
  );
}

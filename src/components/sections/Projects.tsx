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

function StackBadge({ tech }: { tech: ProjectStackItem }) {
  const Icon = getStackIcon(tech.name);

  if (tech.icon) {
    return (
      <span
        title={tech.name}
        className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-[var(--color-paper-muted)]"
      >
        <Image
          src={tech.icon}
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 object-contain"
        />
        <span className="sr-only">{tech.name}</span>
      </span>
    );
  }

  if (!Icon) {
    return (
      <span
        title={tech.name}
        className="inline-flex h-6 w-6 items-center justify-center rounded bg-[var(--color-paper-muted)] text-[10px] font-semibold text-[var(--color-ink-muted)]"
      >
        {tech.name.slice(0, 1)}
        <span className="sr-only">{tech.name}</span>
      </span>
    );
  }

  return (
    <span
      title={tech.name}
      className="inline-flex h-6 w-6 items-center justify-center rounded bg-[var(--color-paper-muted)] text-[var(--color-ink-muted)]"
    >
      {createElement(Icon, { size: 12, "aria-hidden": true })}
      <span className="sr-only">{tech.name}</span>
    </span>
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
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-semibold text-[var(--color-ink)]"
            style={{ overflowWrap: "anywhere", minWidth: 0 }}
          >
            {project.title}
          </h3>
          <div className="flex shrink-0 gap-1">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub for ${project.title}`}
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
              >
                <AiFillGithub size={14} />
              </a>
            )}
            {project.youtube && (
              <a
                href={project.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Video for ${project.title}`}
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
              >
                <AiFillYoutube size={14} />
              </a>
            )}
            {project.link && (
              <LinkPreview
                href={project.link}
                title={liveLinkTitle}
                description={liveLinkDescription}
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
              >
                <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">Live link for {project.title}</span>
              </LinkPreview>
            )}
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
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <StackBadge key={tech.name} tech={tech} />
          ))}
        </div>
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

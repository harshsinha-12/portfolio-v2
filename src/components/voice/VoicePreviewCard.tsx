"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { ArticlePreview } from "@/components/articles/ArticlePreview";
import {
  achievements,
  educationList,
  experiences,
  projects,
  siteConfig,
} from "@/data/portfolio";
import { getContactUrl } from "@/voice/functions/site-catalog";
import {
  sectionBlurbs,
  sectionLabel,
} from "@/voice/functions/preview-from-action";
import {
  achievementDomId,
  educationDomId,
  experienceDomId,
  projectDomId,
} from "@/voice/ids";
import type { ArticleSummary } from "@/types/articles";
import type { ContactKind, NavSectionId, VoicePreview } from "@/voice/types";

const SECTION_MEDIA: Partial<
  Record<NavSectionId, { image: string; imageFit?: "cover" | "contain" }>
> = {
  profile: { image: "/assets/profile-pic.jpg" },
  experience: experiences[0]
    ? { image: experiences[0].logo, imageFit: "contain" }
    : undefined,
  projects: projects[0]?.image ? { image: projects[0].image } : undefined,
  hackathons: achievements[0]
    ? { image: achievements[0].photo ?? achievements[0].icon }
    : undefined,
};

const CONTACT_COPY: Record<ContactKind, { title: string; summary: string }> = {
  resume: { title: "Résumé", summary: "PDF résumé — experience, projects, and education." },
  linkedin: { title: "LinkedIn", summary: "Connect with Harsh on LinkedIn." },
  github: { title: "GitHub", summary: `@${siteConfig.githubUsername} — source for the work on this site.` },
  twitter: { title: "X / Twitter", summary: "Notes and launch posts." },
  email: { title: "Email", summary: "Write to Harsh directly." },
};

function Card({
  eyebrow,
  title,
  summary,
  href,
  image,
  imageAlt = "",
  imageFit = "cover",
}: {
  eyebrow: string;
  title: string;
  summary: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
}) {
  const media = image ? (
    <div className={cn("voice-preview__media", imageFit === "contain" && "voice-preview__media--contain")}>
      <Image src={image} alt={imageAlt} width={640} height={360} sizes="280px" />
    </div>
  ) : null;

  const body = (
    <>
      {media}
      <div className="voice-preview__body">
        <p className="voice-preview__eyebrow">{eyebrow}</p>
        <p className="voice-preview__title">{title}</p>
        <p className="voice-preview__summary">{summary}</p>
        {href ? (
          <span className="voice-preview__go">
            Open <FiArrowUpRight aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          className="voice-preview"
        >
          {body}
        </a>
      );
    }
    return (
      <Link href={href} className="voice-preview">
        {body}
      </Link>
    );
  }

  return <div className="voice-preview">{body}</div>;
}

function ArticleVoiceCard({ slug }: { slug: string }) {
  const [article, setArticle] = useState<ArticleSummary | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void fetch("/articles.json")
      .then((response) => response.json())
      .then((body: { articles?: ArticleSummary[] }) => {
        if (cancelled) return;
        setArticle(body.articles?.find((entry) => entry.slug === slug) ?? null);
      })
      .catch(() => {
        if (!cancelled) setArticle(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (article === undefined) {
    return <p className="text-[12px] text-[var(--color-ink-muted)]">Loading article…</p>;
  }
  if (!article) {
    return (
      <Card
        eyebrow="Writing"
        title={slug}
        summary="Opened this field note."
        href={`/articles/${slug}`}
      />
    );
  }
  return <ArticlePreview article={article} variant="voice" />;
}

export function VoicePreviewCard({ preview }: { preview: VoicePreview }) {
  switch (preview.type) {
    case "article":
      return <ArticleVoiceCard slug={preview.slug} />;
    case "project": {
      const project = projects.find((entry) => entry.id === preview.id);
      if (!project) {
        return (
          <Card
            eyebrow="Project"
            title={preview.id}
            summary="Opened this project."
            href={`/#${projectDomId(preview.id)}`}
          />
        );
      }
      return (
        <Card
          eyebrow="Project"
          title={project.title}
          summary={project.highlight ?? project.content}
          href={preview.href ?? project.link ?? project.github ?? `/#${projectDomId(project.id)}`}
          image={project.image}
        />
      );
    }
    case "experience": {
      const experience = experiences.find((entry) => entry.id === preview.id);
      if (!experience) {
        return (
          <Card
            eyebrow="Experience"
            title={preview.id}
            summary="Opened this role."
            href="/#experience"
          />
        );
      }
      const role = experience.positions[0];
      return (
        <Card
          eyebrow="Experience"
          title={experience.organisation}
          summary={role ? `${role.title} · ${role.duration}` : experience.organisation}
          href={`/#${experienceDomId(experience.id)}`}
          image={experience.logo}
          imageFit="contain"
        />
      );
    }
    case "education": {
      const education = educationList.find((entry) => entry.id === preview.id);
      if (!education) {
        return (
          <Card
            eyebrow="Education"
            title={preview.id}
            summary="Opened education."
            href="/#experience"
          />
        );
      }
      return (
        <Card
          eyebrow="Education"
          title={education.title}
          summary={`${education.degree} · ${education.duration}`}
          href={`/#${educationDomId(education.id)}`}
          image={education.icon}
          imageFit="contain"
        />
      );
    }
    case "achievement": {
      const item = achievements.find((entry) => entry.id === preview.id);
      if (!item) {
        return (
          <Card
            eyebrow="Hackathons & certs"
            title={preview.id}
            summary="Opened this pin."
            href="/#hackathons"
          />
        );
      }
      return (
        <Card
          eyebrow="Hackathons & certs"
          title={item.event}
          summary={`${item.position}. ${item.highlight}`}
          href={`/#${achievementDomId(item.id)}`}
          image={item.photo ?? item.icon}
        />
      );
    }
    case "section": {
      const media = SECTION_MEDIA[preview.id];
      return (
        <Card
          eyebrow="On this page"
          title={sectionLabel(preview.id)}
          summary={sectionBlurbs[preview.id] ?? "Jumped to this section."}
          href={preview.href ?? `/#${preview.id}`}
          image={media?.image}
          imageFit={media?.imageFit}
        />
      );
    }
    case "contact": {
      const copy = CONTACT_COPY[preview.kind];
      const href = getContactUrl(preview.kind) ?? undefined;
      return (
        <Card
          eyebrow="Connect"
          title={copy.title}
          summary={copy.summary}
          href={href}
        />
      );
    }
  }
}

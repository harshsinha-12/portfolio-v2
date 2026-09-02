"use client";

import { createElement } from "react";
import Image from "next/image";
import { getStackIcon, getStackImageIcon } from "@/lib/icons";
import type { ProjectStackItem } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const stackIconColorClass = "text-[var(--color-ink)]/60";

export function StackIcon({
  tech,
  size = 11,
}: {
  tech: ProjectStackItem;
  size?: number;
}) {
  const Icon = getStackIcon(tech.name);
  const imageIcon = tech.icon ?? getStackImageIcon(tech.name);
  const px = Math.round(size * 1.27);

  if (imageIcon) {
    return (
      <span
        title={tech.name}
        className="inline-flex shrink-0 items-center justify-center"
      >
        <Image
          src={imageIcon}
          alt=""
          width={px}
          height={px}
          sizes={`${px}px`}
          className="object-contain opacity-90"
          style={{ width: px, height: px }}
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
      {createElement(Icon, { size, "aria-hidden": true })}
      <span className="sr-only">{tech.name}</span>
    </span>
  );
}

export function StackIconRow({
  stack,
  className,
  size = 11,
}: {
  stack: ProjectStackItem[];
  className?: string;
  size?: number;
}) {
  if (stack.length === 0) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      aria-label={`Tech stack: ${stack.map((t) => t.name).join(", ")}`}
    >
      {stack.map((tech) => (
        <StackIcon key={tech.name} tech={tech} size={size} />
      ))}
    </div>
  );
}

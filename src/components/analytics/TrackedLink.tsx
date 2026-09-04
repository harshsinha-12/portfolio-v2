"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import {
  track,
  trackOutboundClick,
  type AnalyticsProperties,
} from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: string;
  eventProperties?: AnalyticsProperties;
};

export function TrackedLink({
  event,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        track(event, eventProperties);
        onClick?.(clickEvent);
      }}
    />
  );
}

type TrackedExternalLinkProps = ComponentProps<"a"> & {
  kind: string;
  label?: string;
};

export function TrackedExternalLink({
  href,
  kind,
  label,
  onClick,
  children,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(clickEvent) => {
        if (href) {
          trackOutboundClick(href, {
            kind,
            label: label ?? null,
          });
        }
        onClick?.(clickEvent);
      }}
    >
      {children}
    </a>
  );
}

export function TrackedMarkdownLink({
  href,
  children,
  onClick,
  ...props
}: ComponentProps<"a">) {
  function handleClick(clickEvent: MouseEvent<HTMLAnchorElement>) {
    if (href && /^https?:\/\//.test(href)) {
      trackOutboundClick(href, { kind: "article_body_link" });
    }
    onClick?.(clickEvent);
  }

  const isExternal = Boolean(href && /^https?:\/\//.test(href));

  return (
    <a
      {...props}
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

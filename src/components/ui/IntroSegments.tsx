"use client";

import Image from "next/image";
import { LinkPreview } from "@/components/ui/LinkPreview";
import type { IntroSegment } from "@/data/portfolio";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type IntroSegmentsProps = {
  segments: IntroSegment[];
  handClassName?: string;
  linkClassName?: string;
};

export function segmentsToPlainText(segments: IntroSegment[]): string {
  return segments
    .map((segment) => {
      switch (segment.type) {
        case "text":
        case "hand":
          return segment.value;
        case "link":
          return segment.label;
        default: {
          const _exhaustive: never = segment;
          return _exhaustive;
        }
      }
    })
    .join("");
}

export function IntroSegments({
  segments,
  handClassName = "font-hand text-sm text-[var(--color-accent)] sm:text-base",
  linkClassName,
}: IntroSegmentsProps) {
  return (
    <>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case "text":
            return <span key={index}>{segment.value}</span>;
          case "hand":
            return (
              <span key={index} className={cn(handClassName)}>
                {segment.value}
              </span>
            );
          case "link":
            return (
              <LinkPreview
                key={index}
                href={segment.href}
                title={segment.previewTitle ?? segment.label}
                description={segment.previewDescription}
                className={
                  segment.image ? "inline-block align-middle" : linkClassName
                }
                analytics={{ kind: "intro_link", label: segment.label }}
                onClick={() =>
                  track("intro_link_clicked", { label: segment.label })
                }
              >
                {segment.image ? (
                  <Image
                    src={segment.image}
                    alt={segment.label}
                    width={32}
                    height={32}
                    sizes="32px"
                    className="inline-block h-[1.65em] w-[1.65em] rounded-sm object-contain"
                  />
                ) : (
                  segment.label
                )}
              </LinkPreview>
            );
          default: {
            const _exhaustive: never = segment;
            return _exhaustive;
          }
        }
      })}
    </>
  );
}

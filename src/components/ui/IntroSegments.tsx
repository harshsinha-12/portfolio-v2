import { LinkPreview } from "@/components/ui/LinkPreview";
import type { IntroSegment } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type IntroSegmentsProps = {
  segments: IntroSegment[];
  handClassName?: string;
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
              >
                {segment.label}
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

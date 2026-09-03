import { cn } from "@/lib/utils";
import { PushPin } from "@/components/decor/PushPin";
import { WashiTape } from "@/components/decor/PushPin";

type PolaroidProps = {
  children?: React.ReactNode;
  image?: React.ReactNode;
  caption?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  captionClassName?: string;
  rotation?: number;
  pinned?: boolean;
};

export function Polaroid({
  children,
  image,
  caption,
  footer,
  className,
  imageClassName,
  captionClassName,
  rotation = -2,
  pinned = false,
}: PolaroidProps) {
  return (
    <div
      className={cn(
        "relative w-full bg-[var(--color-paper)] p-1.5 pb-5 shadow-[4px_6px_0_var(--color-shadow)] sm:p-2 sm:pb-6",
        className,
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {pinned && <PushPin />}
      <div
        className={cn(
          "overflow-hidden border border-[var(--color-paper-muted)] bg-[var(--color-polaroid-placeholder)]",
          imageClassName ?? "aspect-square",
        )}
      >
        {image ?? children}
      </div>
      {(caption || footer) && (
        <div className={cn("mt-1.5 min-w-0 px-0.5 sm:mt-2", captionClassName)}>
          {caption}
          {footer}
        </div>
      )}
    </div>
  );
}

type StickyNoteProps = {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  color?: "yellow" | "pink" | "blue";
};

const noteColors = {
  yellow: {
    bg: "oklch(94% 0.08 95)",
    fold: "oklch(78% 0.08 85)",
    crease: "oklch(98% 0.02 95)",
  },
  pink: {
    bg: "oklch(92% 0.06 15)",
    fold: "oklch(76% 0.07 20)",
    crease: "oklch(98% 0.02 15)",
  },
  blue: {
    bg: "oklch(93% 0.04 240)",
    fold: "oklch(76% 0.05 240)",
    crease: "oklch(98% 0.015 240)",
  },
};

export function StickyNote({ children, className, rotation = 1.5, color = "yellow" }: StickyNoteProps) {
  const palette = noteColors[color];

  return (
    <div
      className={cn("sticky-note p-3 sm:p-4", className)}
      style={
        {
          "--note-rotation": `${rotation}deg`,
          "--note-bg": palette.bg,
          "--note-fold": palette.fold,
          "--note-crease": palette.crease,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

type TapedCardProps = {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
};

export function TapedCard({ children, className, rotation = -0.5 }: TapedCardProps) {
  return (
    <div className={cn("relative", className)} style={{ transform: `rotate(${rotation}deg)` }}>
      <WashiTape className="-top-2 left-4" rotation={-6} />
      <WashiTape className="-top-2 right-4" rotation={8} />
      <div className="rounded-[var(--radius-lg)] border-4 border-[var(--color-sticker-outline)] bg-[var(--color-paper)] p-[var(--space-lg)] shadow-[4px_6px_0_var(--color-shadow)]">
        {children}
      </div>
    </div>
  );
}

type PinnedCardProps = {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
};

export function PinnedCard({ children, className, rotation = 1 }: PinnedCardProps) {
  return (
    <div className={cn("relative", className)} style={{ transform: `rotate(${rotation}deg)` }}>
      <PushPin />
      <div className="rounded-[var(--radius-lg)] border-2 border-[var(--color-sticker-outline)] bg-[var(--color-paper)] p-[var(--space-sm)] shadow-[4px_6px_0_var(--color-shadow)]">
        {children}
      </div>
    </div>
  );
}

type StampProps = {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
};

export function Stamp({ children, className, rotation = -6 }: StampProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-paper)] px-2 py-1 text-[var(--color-accent)] shadow-[1px_2px_0_var(--color-shadow)]",
        className,
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </div>
  );
}

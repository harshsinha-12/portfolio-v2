"use client";

import type { LucideIcon } from "lucide-react";
import { useDraggable } from "@/components/decor/useDraggable";
import { useStickerSounds } from "@/components/decor/useStickerSounds";
import { cn } from "@/lib/utils";

type BaseProps = {
  id: string;
  Icon: LucideIcon;
  rotate?: number;
  draggable: boolean;
  className?: string;
  iconSize?: number;
};

type AbsoluteDraggableStickerProps = BaseProps & {
  layout?: "absolute";
  top: string;
  left?: string;
  right?: string;
};

type InlineDraggableStickerProps = BaseProps & {
  layout: "inline";
};

export type DraggableStickerProps = AbsoluteDraggableStickerProps | InlineDraggableStickerProps;

export function DraggableSticker(props: DraggableStickerProps) {
  const { id, Icon, rotate = 0, draggable, className, iconSize = 20 } = props;
  const stickerSounds = useStickerSounds();
  const { ref, style, dragHandlers } = useDraggable({
    id,
    disabled: !draggable,
    rotate,
    ...stickerSounds,
  });
  const isAbsolute = props.layout !== "inline";

  return (
    <div
      ref={ref}
      {...(draggable ? dragHandlers : {})}
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-xl border-4 border-[var(--color-sticker-outline)] bg-[var(--color-paper)] text-[var(--color-accent)] shadow-[3px_4px_0_var(--color-shadow)]",
        isAbsolute ? "absolute h-12 w-12" : "relative h-10 w-10 sm:h-11 sm:w-11",
        draggable && "pointer-events-auto z-[35]",
        className,
      )}
      style={{
        ...(isAbsolute && {
          top: props.top,
          left: props.left,
          right: props.right,
        }),
        transform: style.transform,
        touchAction: style.touchAction,
        cursor: draggable ? style.cursor : undefined,
      }}
      aria-hidden="true"
    >
      <Icon size={iconSize} strokeWidth={2.2} />
    </div>
  );
}

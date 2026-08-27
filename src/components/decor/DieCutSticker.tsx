"use client";

import type { PointerEvent } from "react";
import Image from "next/image";
import { NoteBurst } from "@/components/decor/NoteBurst";
import { useDraggable } from "@/components/decor/useDraggable";
import { useStickerSounds } from "@/components/decor/useStickerSounds";
import { cn } from "@/lib/utils";

let frontLayer = 40;

function nextFrontLayer(): number {
  frontLayer += 1;
  return frontLayer;
}

export type DieCutStickerProps = {
  id: string;
  src: string;
  width: number;
  height: number;
  tooltip: string;
  rotate?: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  displayWidth: string;
  zIndex: number;
  draggable: boolean;
  outline?: "default" | "thin" | "plain";
  emit?: "notes";
};

const stickerOutlineClass = {
  default: "cutout-sticker",
  thin: "cutout-sticker-thin",
  plain: "cutout-sticker-plain",
} as const;

export function DieCutSticker({
  id,
  src,
  width,
  height,
  tooltip,
  rotate = 0,
  top,
  bottom,
  left,
  right,
  displayWidth,
  zIndex,
  draggable,
  outline = "default",
  emit,
}: DieCutStickerProps) {
  const stickerSounds = useStickerSounds();
  const { ref, style, dragHandlers } = useDraggable({
    id,
    disabled: !draggable,
    rotate,
    ...stickerSounds,
  });

  return (
    <div
      ref={ref}
      {...(draggable
        ? {
            ...dragHandlers,
            onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
              event.currentTarget.style.zIndex = String(nextFrontLayer());
              dragHandlers.onPointerDown(event);
            },
          }
        : {})}
      className={cn("group/cutout absolute select-none", draggable && "pointer-events-auto")}
      style={{
        top,
        bottom,
        left,
        right,
        width: displayWidth,
        zIndex,
        transform: style.transform,
        touchAction: style.touchAction,
        cursor: draggable ? style.cursor : undefined,
      }}
      role="img"
      aria-label={tooltip}
    >
      {emit === "notes" && <NoteBurst />}
      <div className="cutout-pop">
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          sizes="128px"
          unoptimized
          draggable={false}
          className={cn(stickerOutlineClass[outline], "h-auto w-full bg-transparent")}
        />
      </div>
      <span className="cutout-tooltip">{tooltip}</span>
    </div>
  );
}

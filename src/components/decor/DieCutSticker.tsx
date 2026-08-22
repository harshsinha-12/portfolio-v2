"use client";

import type { PointerEvent } from "react";
import Image from "next/image";
import { useDraggable } from "@/components/decor/useDraggable";
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
};

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
}: DieCutStickerProps) {
  const { ref, style, dragHandlers } = useDraggable({
    id,
    disabled: !draggable,
    rotate,
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
      className={cn("group/cutout absolute select-none", draggable && "pointer-events-auto active:cursor-grabbing")}
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
      <div className="cutout-pop">
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          sizes="128px"
          unoptimized
          draggable={false}
          className="cutout-sticker h-auto w-full bg-transparent"
        />
      </div>
      <span className="cutout-tooltip">{tooltip}</span>
    </div>
  );
}

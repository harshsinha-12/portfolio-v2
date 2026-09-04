"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import Image from "next/image";
import { NoteBurst } from "@/components/decor/NoteBurst";
import { useDraggable } from "@/components/decor/useDraggable";
import { useMusicPlayer } from "@/components/decor/useMusicPlayer";
import {
  resolveStickerPlacement,
  useCanHover,
  useIsMobileStickerLayout,
} from "@/components/decor/useStickerLayout";
import { useStickerSounds } from "@/components/decor/useStickerSounds";
import type { CutoutSticker } from "@/data/portfolio";
import { cn } from "@/lib/utils";

let frontLayer = 40;

function nextFrontLayer(): number {
  frontLayer += 1;
  return frontLayer;
}

const stickerOutlineClass = {
  default: "cutout-sticker",
  thin: "cutout-sticker-thin",
  plain: "cutout-sticker-plain",
} as const;

export type DieCutStickerProps = CutoutSticker & {
  draggable: boolean;
};

export function DieCutSticker(sticker: DieCutStickerProps) {
  const {
    id,
    src,
    width,
    height,
    tooltip,
    draggable,
    outline = "default",
    emit,
    musicVideoId,
    zIndex,
  } = sticker;

  const isMobile = useIsMobileStickerLayout();
  const canHover = useCanHover();
  const layout = resolveStickerPlacement(sticker, isMobile);
  const dragId = isMobile ? `${id}-mobile` : id;
  const tapHandlerRef = useRef<(() => void) | undefined>(undefined);

  const stickerSounds = useStickerSounds();
  const { ref, style, dragHandlers } = useDraggable({
    id: dragId,
    disabled: !draggable,
    bounds: isMobile ? "viewport" : "none",
    rotate: layout.rotate,
    onTap: () => tapHandlerRef.current?.(),
    label: tooltip,
    ...stickerSounds,
  });

  const { playerTargetRef, handlers: musicHandlers } = useMusicPlayer(musicVideoId, ref, {
    sticker_id: id,
    sticker_name: tooltip,
  });

  useEffect(() => {
    tapHandlerRef.current =
      musicVideoId && !canHover ? musicHandlers.onTap : undefined;
  }, [canHover, musicHandlers.onTap, musicVideoId]);

  const { onPointerDown: onDragPointerDown, onPointerEnter } = dragHandlers;
  const isMusicTapTarget = Boolean(musicVideoId && !canHover);

  return (
    <div
      ref={ref}
      {...(draggable
        ? {
            onPointerEnter,
            onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
              event.currentTarget.style.zIndex = String(nextFrontLayer());
              onDragPointerDown(event);
            },
          }
        : {})}
      className={cn(
        "group/cutout absolute touch-manipulation select-none",
        draggable && "pointer-events-auto",
        isMusicTapTarget && "cursor-pointer",
      )}
      style={{
        top: layout.top,
        bottom: layout.bottom,
        left: layout.left,
        right: layout.right,
        width: layout.displayWidth,
        zIndex,
        transform: style.transform,
        touchAction: style.touchAction,
        cursor: draggable ? style.cursor : undefined,
      }}
      role={isMusicTapTarget ? "button" : "img"}
      aria-label={tooltip}
      onMouseEnter={musicHandlers.onMouseEnter}
      onMouseLeave={musicHandlers.onMouseLeave}
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
      {musicVideoId && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div ref={playerTargetRef} />
        </div>
      )}
    </div>
  );
}

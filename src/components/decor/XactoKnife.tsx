"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { useDraggable } from "@/components/decor/useDraggable";
import { useXacto, type Point } from "@/components/decor/XactoProvider";
import { cn } from "@/lib/utils";

const KNIFE_SRC = "/assets/x-acto-knife.webp";
const KNIFE_NATURAL_W = 480;
const KNIFE_NATURAL_H = 318;
const KNIFE_DISPLAY_W = "4.75rem";
const KNIFE_SIZES = "76px";

// Cropped sprite: blade sits at the bottom-left corner of the alpha.
const TIP_X = 0.03;
const TIP_Y = 0.96;

type XactoKnifeProps = {
  id: string;
  top: string;
  left?: string;
  right?: string;
  rotate?: number;
  draggable: boolean;
};

function rotateAround(point: Point, center: Point, deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: center.y + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

function bladeTip(el: HTMLDivElement, offset: Point, rotateDeg: number): Point {
  const parent = el.offsetParent;
  const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const originX = parentRect.left + el.offsetLeft + offset.x;
  const originY = parentRect.top + el.offsetTop + offset.y;
  const center = { x: originX + width / 2, y: originY + height / 2 };
  const local = { x: originX + width * TIP_X, y: originY + height * TIP_Y };
  return rotateAround(local, center, rotateDeg);
}

export function XactoKnife({
  id,
  top,
  left,
  right,
  rotate = 0,
  draggable,
}: XactoKnifeProps) {
  const { addScratchPoint, endStroke, testCut } = useXacto();
  const knifeRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<{ point: Point; time: number } | null>(null);

  const handleDrag = useCallback(
    (offset: Point) => {
      const el = knifeRef.current;
      if (!el) return;
      const tip = bladeTip(el, offset, rotate);
      addScratchPoint(tip);

      const now = performance.now();
      const last = lastRef.current;
      if (last) {
        const dt = now - last.time;
        if (dt > 0) {
          const speed = Math.hypot(tip.x - last.point.x, tip.y - last.point.y) / dt;
          testCut(last.point, tip, speed);
        }
      }
      lastRef.current = { point: tip, time: now };
    },
    [addScratchPoint, rotate, testCut],
  );

  const handleDragEnd = useCallback(() => {
    lastRef.current = null;
    endStroke();
  }, [endStroke]);

  const { ref, style, dragHandlers } = useDraggable({
    id,
    disabled: !draggable,
    persist: false,
    bounds: "viewport",
    onDrag: handleDrag,
    onDragEnd: handleDragEnd,
  });

  return (
    <div
      ref={(node) => {
        knifeRef.current = node;
        ref.current = node;
      }}
      {...(draggable ? dragHandlers : {})}
      className={cn("absolute select-none", draggable && "pointer-events-auto z-[35] active:cursor-grabbing")}
      style={{
        top,
        left,
        right,
        width: KNIFE_DISPLAY_W,
        transform: draggable ? `${style.transform} rotate(${rotate}deg)` : `rotate(${rotate}deg)`,
        touchAction: style.touchAction,
        cursor: draggable ? style.cursor : undefined,
      }}
      aria-hidden="true"
    >
      <Image
        src={KNIFE_SRC}
        alt=""
        width={KNIFE_NATURAL_W}
        height={KNIFE_NATURAL_H}
        sizes={KNIFE_SIZES}
        draggable={false}
        className="h-auto w-full"
      />
    </div>
  );
}

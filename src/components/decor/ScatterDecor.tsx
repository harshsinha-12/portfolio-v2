"use client";

import { Coffee, Ruler, Scissors, Star } from "lucide-react";
import { DraggableSticker } from "@/components/decor/DraggableSticker";
import { useDraggableEnabled } from "@/components/decor/useDraggable";

const items = [
  { id: "scissors", Icon: Scissors, top: "12%", left: "3%", rotate: -12 },
  { id: "ruler", Icon: Ruler, top: "38%", left: "1%", rotate: 8 },
  { id: "coffee", Icon: Coffee, top: "22%", right: "3%", rotate: 10 },
  { id: "star", Icon: Star, top: "52%", right: "2%", rotate: -14 },
];

export function ScatterDecor() {
  const draggable = useDraggableEnabled();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 hidden xl:block"
      aria-hidden="true"
    >
      {items.map(({ id, Icon, top, left, right, rotate }) => (
        <DraggableSticker
          key={id}
          id={id}
          Icon={Icon}
          top={top}
          left={left}
          right={right}
          rotate={rotate}
          draggable={draggable}
        />
      ))}
    </div>
  );
}

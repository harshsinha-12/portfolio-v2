"use client";

import { Star } from "lucide-react";
import { DraggableSticker } from "@/components/decor/DraggableSticker";
import { useDraggableEnabled } from "@/components/decor/useDraggable";

const items = [
  { id: "star", Icon: Star, top: "52%", right: "2%", rotate: -14 },
];

export function ScatterDecor() {
  const draggable = useDraggableEnabled();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 hidden xl:block"
      aria-hidden="true"
    >
      {items.map(({ id, Icon, ...position }) => (
        <DraggableSticker
          key={id}
          id={id}
          Icon={Icon}
          {...position}
          draggable={draggable}
        />
      ))}
    </div>
  );
}

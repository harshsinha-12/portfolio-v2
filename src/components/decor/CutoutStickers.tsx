"use client";

import { DieCutSticker } from "@/components/decor/DieCutSticker";
import { useDraggableEnabled } from "@/components/decor/useDraggable";
import type { CutoutSticker } from "@/data/portfolio";

type CutoutStickersProps = {
  stickers: CutoutSticker[];
};

export function CutoutStickers({ stickers }: CutoutStickersProps) {
  const draggable = useDraggableEnabled();

  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden xl:block">
      {stickers.map((sticker) => (
        <DieCutSticker key={sticker.id} {...sticker} draggable={draggable} />
      ))}
    </div>
  );
}

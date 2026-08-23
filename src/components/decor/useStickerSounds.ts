"use client";

import { playPortfolioSound } from "@/lib/portfolio-sounds";

export function useStickerSounds() {
  return {
    onDragStart: () => playPortfolioSound("stickerPick"),
    onDragEnd: () => playPortfolioSound("stickerDrop"),
  };
}

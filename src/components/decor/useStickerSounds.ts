"use client";

import { useEffect } from "react";
import { playPortfolioSound, preloadStickerSounds } from "@/lib/portfolio-sounds";

export function useStickerSounds() {
  useEffect(() => {
    preloadStickerSounds();
  }, []);

  return {
    onDragStart: () => playPortfolioSound("stickerPick"),
    onDragEnd: () => playPortfolioSound("stickerDrop"),
  };
}

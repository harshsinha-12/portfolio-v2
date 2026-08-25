"use client";

import { useEffect, type ReactNode } from "react";
import {
  bindUiInteractionSounds,
  initSoundMuteFromStorage,
  isSoundMuted,
  preloadPortfolioSounds,
  preloadStickerSounds,
} from "@/lib/portfolio-sounds";

export function SoundProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initSoundMuteFromStorage();
    preloadStickerSounds();
    if (!isSoundMuted()) {
      preloadPortfolioSounds();
    }
    return bindUiInteractionSounds();
  }, []);

  return children;
}

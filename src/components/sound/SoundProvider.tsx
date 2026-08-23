"use client";

import { useEffect, type ReactNode } from "react";
import {
  bindUiInteractionSounds,
  initSoundMuteFromStorage,
  isSoundMuted,
  preloadPortfolioSounds,
} from "@/lib/portfolio-sounds";

export function SoundProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initSoundMuteFromStorage();
    if (!isSoundMuted()) {
      preloadPortfolioSounds();
    }
    return bindUiInteractionSounds();
  }, []);

  return children;
}

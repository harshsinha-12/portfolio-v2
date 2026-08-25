"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  SOUND_MUTE_EVENT,
  isSoundMuted,
  playPortfolioSound,
  preloadPortfolioSounds,
  setSoundMuted,
  unlockPortfolioSounds,
} from "@/lib/portfolio-sounds";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

function subscribeMute(onStoreChange: () => void) {
  window.addEventListener(SOUND_MUTE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(SOUND_MUTE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getMuteSnapshot() {
  return isSoundMuted();
}

function getServerMuteSnapshot() {
  return true;
}

export function SoundToggle({ className }: { className?: string }) {
  const muted = useSyncExternalStore(subscribeMute, getMuteSnapshot, getServerMuteSnapshot);

  const toggle = useCallback(() => {
    const nextMuted = !muted;
    track("sound_preference_changed", { sound_enabled: !nextMuted });
    unlockPortfolioSounds();
    if (muted) {
      setSoundMuted(false);
      preloadPortfolioSounds();
      playPortfolioSound("click");
      return;
    }
    playPortfolioSound("click");
    setSoundMuted(true);
  }, [muted]);

  return (
    <button
      type="button"
      data-sound="off"
      aria-pressed={!muted}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      title={muted ? "Unmute" : "Mute"}
      onClick={toggle}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--color-on-mat)]/40",
        "hover:bg-[var(--color-mat-deep)]/50 hover:text-[var(--color-on-mat)]/65",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
        "sm:h-8 sm:w-8",
        className,
      )}
    >
      {muted ? (
        <VolumeX size={15} strokeWidth={2.3} aria-hidden="true" />
      ) : (
        <Volume2 size={15} strokeWidth={2.3} aria-hidden="true" />
      )}
    </button>
  );
}

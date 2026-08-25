import { playSound, playSoundNow, decodeAudioData, getAudioContext } from "@/lib/sound-engine";
import type { SoundAsset } from "@/lib/sound-types";
import { clickSoftSound } from "@/sounds/click-soft/click-soft";
import { knifeSliceSound } from "@/sounds/knife-slice/knife-slice";
import { maximize004Sound } from "@/sounds/maximize-004/maximize-004";
import { scratch001Sound } from "@/sounds/scratch-001/scratch-001";
import { scratch002Sound } from "@/sounds/scratch-002/scratch-002";
import { scratch003Sound } from "@/sounds/scratch-003/scratch-003";

export type PortfolioSoundId =
  | "click"
  | "stickerPick"
  | "stickerDrop"
  | "scratch"
  | "cut"
  | "fall"
  | "swoosh";

export const SOUND_MUTE_STORAGE_KEY = "portfolio:sounds-muted";
export const SOUND_MUTE_EVENT = "portfolio:sounds-muted-change";

const MUTE_ATTR = "data-sound";

const VOLUMES: Record<PortfolioSoundId, number> = {
  click: 0.42,
  stickerPick: 0.42,
  stickerDrop: 0.42,
  scratch: 0.3,
  cut: 0.5,
  fall: 0.4,
  swoosh: 0.4,
};

const THROTTLE_MS: Partial<Record<PortfolioSoundId, number>> = {
  click: 50,
  scratch: 100,
};

const SCRATCHES = [scratch001Sound, scratch002Sound, scratch003Sound] as const;

const lastPlayedAt: Partial<Record<PortfolioSoundId, number>> = {};
let scratchIndex = 0;
let lastDragEndedAt = 0;
let muted = true;

export function isSoundMuted(): boolean {
  return muted;
}

export function readStoredSoundMute(): boolean {
  try {
    const stored = localStorage.getItem(SOUND_MUTE_STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* private mode */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setSoundMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem(SOUND_MUTE_STORAGE_KEY, next ? "1" : "0");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(SOUND_MUTE_EVENT));
}

export function initSoundMuteFromStorage(): boolean {
  muted = readStoredSoundMute();
  window.dispatchEvent(new Event(SOUND_MUTE_EVENT));
  return muted;
}

export function markPointerDragEnd(): void {
  lastDragEndedAt = performance.now();
}

export function unlockPortfolioSounds(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
  } catch {
    /* Web Audio unavailable */
  }
}

export function preloadPortfolioSounds(): void {
  for (const asset of collectAssets()) {
    void decodeAudioData(asset.dataUri).catch(() => {
      /* ignore decode failures */
    });
  }
}

const STICKER_SOUND_IDS: PortfolioSoundId[] = ["stickerPick", "stickerDrop"];

export function preloadStickerSounds(): void {
  for (const id of STICKER_SOUND_IDS) {
    void decodeAudioData(assetFor(id).dataUri).catch(() => {
      /* ignore decode failures */
    });
  }
}

function collectAssets(): SoundAsset[] {
  return [clickSoftSound, ...SCRATCHES, knifeSliceSound, maximize004Sound];
}

function assetFor(id: PortfolioSoundId): SoundAsset {
  switch (id) {
    case "click":
      return clickSoftSound;
    case "stickerPick":
    case "stickerDrop":
      return clickSoftSound;
    case "scratch": {
      const asset = SCRATCHES[scratchIndex % SCRATCHES.length];
      scratchIndex += 1;
      return asset ?? scratch001Sound;
    }
    case "cut":
      return knifeSliceSound;
    case "fall":
    case "swoosh":
      return maximize004Sound;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function playbackRateFor(id: PortfolioSoundId): number {
  switch (id) {
    case "scratch":
      return 0.92 + (scratchIndex % 5) * 0.04;
    case "fall":
      return 0.86;
    case "swoosh":
      return 1.06;
    case "click":
    case "stickerPick":
    case "stickerDrop":
    case "cut":
      return 1;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function playPortfolioSound(id: PortfolioSoundId): void {
  if (muted) return;
  unlockPortfolioSounds();
  const now = performance.now();
  const throttle = THROTTLE_MS[id];
  const last = lastPlayedAt[id];
  if (throttle !== undefined && last !== undefined && now - last < throttle) {
    return;
  }
  lastPlayedAt[id] = now;

  const asset = assetFor(id);
  const options = {
    volume: VOLUMES[id],
    playbackRate: playbackRateFor(id),
  };
  if (playSoundNow(asset.dataUri, options)) return;
  void playSound(asset.dataUri, options).catch(() => {
    /* autoplay or decode failure */
  });
}

function isSilentTarget(el: Element): boolean {
  return el.closest(`[${MUTE_ATTR}="off"]`) !== null;
}

function interactiveFromEvent(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null;
  return target.closest("a[href], button, [role='button'], [role='tab']");
}

export function bindUiInteractionSounds(): () => void {
  unlockPortfolioSounds();
  preloadPortfolioSounds();
  preloadStickerSounds();

  const onPointerDown = () => {
    unlockPortfolioSounds();
    preloadStickerSounds();
    if (!muted) preloadPortfolioSounds();
  };

  const onClick = (event: MouseEvent) => {
    const el = interactiveFromEvent(event.target);
    if (!el || isSilentTarget(el)) return;
    if (performance.now() - lastDragEndedAt < 280) return;
    playPortfolioSound("click");
  };

  document.addEventListener("pointerdown", onPointerDown, { capture: true });
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("pointerdown", onPointerDown, { capture: true });
    document.removeEventListener("click", onClick);
  };
}

if (typeof window !== "undefined") {
  queueMicrotask(() => {
    unlockPortfolioSounds();
    preloadStickerSounds();
  });
}

"use client";

import { useSyncExternalStore } from "react";
import type { CutoutSticker, StickerPlacement } from "@/data/portfolio";

const MOBILE_STICKER_QUERY = "(max-width: 1023px)";

function subscribeMediaQuery(query: string, cb: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useCanHover() {
  return useSyncExternalStore(
    (cb) => subscribeMediaQuery("(hover: hover)", cb),
    () => window.matchMedia("(hover: hover)").matches,
    () => true,
  );
}

export function useIsMobileStickerLayout() {
  return useSyncExternalStore(
    (cb) => subscribeMediaQuery(MOBILE_STICKER_QUERY, cb),
    () => window.matchMedia(MOBILE_STICKER_QUERY).matches,
    () => false,
  );
}

export function resolveStickerPlacement(
  sticker: CutoutSticker,
  isMobile: boolean,
): StickerPlacement & { rotate: number } {
  const mobile = isMobile ? sticker.mobile : undefined;
  return {
    top: mobile?.top ?? sticker.top,
    bottom: mobile?.bottom ?? sticker.bottom,
    left: mobile?.left ?? sticker.left,
    right: mobile?.right ?? sticker.right,
    displayWidth: mobile?.displayWidth ?? sticker.displayWidth,
    rotate: mobile?.rotate ?? sticker.rotate,
  };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isSoundMuted, SOUND_MUTE_EVENT, unlockPortfolioSounds } from "@/lib/portfolio-sounds";

const TRAIN_VOLUME = 0.38;

type HoverLoopSoundHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

type HoverLoopSoundResult = {
  handlers: HoverLoopSoundHandlers;
};

/**
 * Loops a short ambient clip on hover — same mute gate and hover-only rules as
 * useMusicPlayer (headphones sticker).
 */
export function useHoverLoopSound(
  src: string | undefined,
  targetRef: React.RefObject<HTMLElement | null>,
): HoverLoopSoundResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcRef = useRef(src);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    srcRef.current = src;
  }, [src]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!src) return;

    const target = targetRef.current;
    if (!target) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const loadAudio = () => {
      if (cancelled || audioRef.current) return;
      const audio = new Audio(srcRef.current);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = TRAIN_VOLUME;
      audioRef.current = audio;
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadAudio();
          observer?.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => {
      cancelled = true;
      observer?.disconnect();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      }
    };
  }, [src, targetRef]);

  useEffect(() => {
    if (!src) return;

    const pauseIfMuted = () => {
      if (isSoundMuted() && audioRef.current) {
        audioRef.current.pause();
      }
    };

    window.addEventListener(SOUND_MUTE_EVENT, pauseIfMuted);
    window.addEventListener("storage", pauseIfMuted);

    return () => {
      window.removeEventListener(SOUND_MUTE_EVENT, pauseIfMuted);
      window.removeEventListener("storage", pauseIfMuted);
    };
  }, [src]);

  const onMouseEnter = useCallback(() => {
    if (!canHover || !srcRef.current) return;
    if (isSoundMuted()) return;

    unlockPortfolioSounds();
    const audio = audioRef.current;
    if (!audio) return;

    void audio.play().catch(() => {
      /* autoplay blocked */
    });
  }, [canHover]);

  const onMouseLeave = useCallback(() => {
    if (!canHover || !srcRef.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, [canHover]);

  return { handlers: { onMouseEnter, onMouseLeave } };
}

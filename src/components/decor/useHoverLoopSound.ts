"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isSoundMuted, SOUND_MUTE_EVENT, unlockPortfolioSounds } from "@/lib/portfolio-sounds";

const TRAIN_VOLUME = 0.38;

type LoopSoundHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onTap: () => void;
};

type LoopSoundResult = {
  handlers: LoopSoundHandlers;
};

/**
 * Loops a short clip on hover (desktop) or tap-to-toggle (touch).
 * Same mute gate as useMusicPlayer.
 */
export function useHoverLoopSound(
  src: string | undefined,
  targetRef: React.RefObject<HTMLElement | null>,
): LoopSoundResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
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
        playingRef.current = false;
      }
    };
  }, [src, targetRef]);

  useEffect(() => {
    if (!src) return;

    const pauseIfMuted = () => {
      if (isSoundMuted() && audioRef.current) {
        audioRef.current.pause();
        playingRef.current = false;
      }
    };

    window.addEventListener(SOUND_MUTE_EVENT, pauseIfMuted);
    window.addEventListener("storage", pauseIfMuted);

    return () => {
      window.removeEventListener(SOUND_MUTE_EVENT, pauseIfMuted);
      window.removeEventListener("storage", pauseIfMuted);
    };
  }, [src]);

  const start = useCallback(() => {
    if (!srcRef.current || isSoundMuted()) return;

    unlockPortfolioSounds();
    const audio = audioRef.current;
    if (!audio) return;

    void audio.play().catch(() => {
      /* autoplay blocked */
    });
    playingRef.current = true;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    playingRef.current = false;
  }, []);

  const onMouseEnter = useCallback(() => {
    if (!canHover) return;
    start();
  }, [canHover, start]);

  const onMouseLeave = useCallback(() => {
    if (!canHover) return;
    stop();
  }, [canHover, stop]);

  const onTap = useCallback(() => {
    if (canHover) return;
    if (playingRef.current) {
      stop();
      return;
    }
    start();
  }, [canHover, start, stop]);

  return { handlers: { onMouseEnter, onMouseLeave, onTap } };
}

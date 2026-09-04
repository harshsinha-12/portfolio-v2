"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { isSoundMuted, SOUND_MUTE_EVENT } from "@/lib/portfolio-sounds";
import {
  loadYouTubeIframeAPI,
  YTPlayer,
  YTPlayerState,
} from "@/lib/youtube-player";

const MUSIC_VOLUME = 55;

type MusicPlayerHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onTap: () => void;
};

type MusicPlayerResult = {
  playerTargetRef: React.RefObject<HTMLDivElement | null>;
  handlers: MusicPlayerHandlers;
};

type MusicStickerAnalytics = {
  sticker_id: string;
  sticker_name: string;
};

/**
 * Manages a hidden YouTube IFrame player for a sticker.
 *
 * The player is created lazily when the sticker scrolls near the viewport
 * (IntersectionObserver, 200px rootMargin — mirroring ProjectPreviewVideo) so
 * the first hover is instant. Playback is gated behind the site SFX mute
 * toggle: muted SFX means no music. If the user mutes while music is playing,
 * playback pauses immediately.
 *
 * `stickerRef` is the visible sticker element — used as the IntersectionObserver
 * target (the player target div is offscreen at -9999px and would never
 * intersect) and for the drag gate (`data-dragging` lives on the sticker, and
 * `playerTargetRef` goes stale once YT.Player replaces the div with an iframe).
 *
 * When `videoId` is undefined the hook is a no-op — it returns handlers that
 * do nothing and never creates a player. This lets DieCutSticker call it
 * unconditionally.
 */
export function useMusicPlayer(
  videoId: string | undefined,
  stickerRef: React.RefObject<HTMLDivElement | null>,
  stickerAnalytics?: MusicStickerAnalytics,
): MusicPlayerResult {
  const playerTargetRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const videoIdRef = useRef(videoId);
  const stickerAnalyticsRef = useRef(stickerAnalytics);
  const [canHover, setCanHover] = useState(true);

  stickerAnalyticsRef.current = stickerAnalytics;

  // Keep videoIdRef current for use in callbacks without re-creating the player.
  useEffect(() => {
    videoIdRef.current = videoId;
  }, [videoId]);

  // --- Hover capability (mirrors ProjectPreviewVideo's canHover) ------------
  useEffect(() => {
    const media = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // --- Create the player when the sticker scrolls near the viewport ---------
  useEffect(() => {
    if (!videoId) return;

    const sticker = stickerRef.current;
    if (!sticker) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const createPlayer = async () => {
      try {
        await loadYouTubeIframeAPI();
      } catch {
        // API failed to load — music feature degrades to no-op.
        return;
      }
      if (cancelled || !window.YT?.Player || !playerTargetRef.current) return;

      playerRef.current = new window.YT.Player(playerTargetRef.current, {
        videoId: videoIdRef.current,
        playerVars: {
          loop: 1,
          playlist: videoIdRef.current,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          autoplay: 0,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(MUSIC_VOLUME);
          },
          onStateChange: (event) => {
            // Loop param occasionally fails; restart manually on ENDED.
            if (event.data === YTPlayerState.ENDED) {
              event.target.seekTo(0, true);
              event.target.playVideo();
            }
          },
        },
      });
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void createPlayer();
          observer?.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    // Observe the visible sticker, NOT the hidden player target (which sits
    // offscreen at -9999px and would never intersect the viewport).
    observer.observe(sticker);

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          /* player already destroyed */
        }
        playerRef.current = null;
      }
    };
  }, [videoId, stickerRef]);

  // --- Mute coupling: pause immediately if muted while playing -------------
  useEffect(() => {
    if (!videoId) return;

    const onMuteChange = () => {
      if (isSoundMuted() && playerRef.current) {
        playerRef.current.pauseVideo();
      }
    };

    window.addEventListener(SOUND_MUTE_EVENT, onMuteChange);
    window.addEventListener("storage", onMuteChange);

    return () => {
      window.removeEventListener(SOUND_MUTE_EVENT, onMuteChange);
      window.removeEventListener("storage", onMuteChange);
    };
  }, [videoId]);

  // --- Hover handlers -------------------------------------------------------

  const onMouseEnter = useCallback(() => {
    if (!canHover) return;
    if (!videoIdRef.current) return;
    // Mute gate: no music when SFX are muted.
    if (isSoundMuted()) return;
    // Drag gate: don't start music mid-drag.
    // Use stickerRef (the visible sticker) — playerTargetRef goes stale once
    // YT.Player replaces the target div with an iframe.
    if (stickerRef.current?.dataset.dragging === "true") return;

    const player = playerRef.current;
    if (!player) return;

    player.playVideo();
    track("music_play", {
      video_id: videoIdRef.current,
      trigger: "hover",
      ...stickerAnalyticsRef.current,
    });
  }, [canHover, stickerRef]);

  const onMouseLeave = useCallback(() => {
    if (!canHover) return;
    if (!videoIdRef.current) return;

    const player = playerRef.current;
    if (!player) return;

    player.pauseVideo();
    track("music_pause", {
      video_id: videoIdRef.current,
      trigger: "leave",
      ...stickerAnalyticsRef.current,
    });
  }, [canHover]);

  const onTap = useCallback(() => {
    if (!videoIdRef.current || isSoundMuted()) return;

    const player = playerRef.current;
    if (!player) return;

    const state = player.getPlayerState();
    if (state === YTPlayerState.PLAYING) {
      player.pauseVideo();
      track("music_pause", {
        video_id: videoIdRef.current,
        trigger: "tap",
        ...stickerAnalyticsRef.current,
      });
      return;
    }

    player.playVideo();
    track("music_play", {
      video_id: videoIdRef.current,
      trigger: "tap",
      ...stickerAnalyticsRef.current,
    });
  }, []);

  return {
    playerTargetRef,
    handlers: { onMouseEnter, onMouseLeave, onTap },
  };
}

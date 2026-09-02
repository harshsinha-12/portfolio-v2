"use client";

import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { cn } from "@/lib/utils";

type LastPlayedTrack = {
  title: string;
  artist: string;
  url: string;
  isPlaying: boolean;
};

type SpotifyResponse = {
  track: LastPlayedTrack | null;
};

export function SpotifyLastPlayed({ className }: { className?: string }) {
  const [track, setTrack] = useState<LastPlayedTrack | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTrack() {
      try {
        const response = await fetch("/api/spotify", {
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const body = (await response.json()) as SpotifyResponse;
        setTrack(body.track);
      } catch {
        // Keep the hero uncluttered when Spotify is unavailable.
      }
    }

    void loadTrack();
    const refreshTimer = window.setInterval(loadTrack, 60_000);

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, []);

  if (!track) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1.5 text-[11px] leading-snug text-[var(--color-on-mat)]/80 sm:text-xs",
        className,
      )}
      aria-live="polite"
    >
      <FaSpotify
        className={cn(
          "h-3 w-3 shrink-0 text-[#1ed760] sm:h-3.5 sm:w-3.5",
          track.isPlaying && "animate-pulse",
        )}
        aria-hidden="true"
      />
      <span className="shrink-0">
        {track.isPlaying ? "Now playing" : "Last played"}
      </span>
      <span aria-hidden="true">—</span>
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${track.title} — ${track.artist}`}
        className="min-w-0 truncate font-medium text-[var(--color-heading-on-mat)] underline decoration-[var(--color-link-squiggle-on-mat)] underline-offset-[0.2em] transition-colors hover:text-[#1ed760] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
      >
        {track.title} · {track.artist}
      </a>
    </div>
  );
}

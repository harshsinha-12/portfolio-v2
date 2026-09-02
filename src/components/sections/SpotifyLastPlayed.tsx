"use client";

import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { PiWaveformBold } from "react-icons/pi";
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

function getSpotifyEmbedUrl(trackUrl: string) {
  try {
    const url = new URL(trackUrl);
    const [, type, id] = url.pathname.split("/");

    if (url.hostname !== "open.spotify.com" || type !== "track" || !id) {
      return null;
    }

    return `https://open.spotify.com/embed/track/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}

export function SpotifyLastPlayed({ className }: { className?: string }) {
  const [track, setTrack] = useState<LastPlayedTrack | null>(null);
  const [playerOpen, setPlayerOpen] = useState(true);

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

  const embedUrl = getSpotifyEmbedUrl(track.url);

  return (
    <div className={cn("min-w-0", className)}>
      <div
        className="flex min-w-0 items-center gap-1.5 text-[11px] leading-snug text-[var(--color-on-mat)]/80 sm:text-xs"
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
        {embedUrl && (
          <button
            type="button"
            onClick={() => setPlayerOpen((open) => !open)}
            aria-expanded={playerOpen}
            aria-controls="spotify-last-played-player"
            aria-label={
              playerOpen
                ? "Hide Spotify player"
                : `Play this song: ${track.title} by ${track.artist}`
            }
            title={playerOpen ? "Close song player" : "Play this song"}
            className={cn(
              "ml-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#1ed760]/55 bg-[var(--color-mat-deep)]/55 text-[#1ed760] shadow-[1px_1px_0_var(--color-shadow)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-mat-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
              playerOpen && "bg-[#1ed760]/15",
            )}
          >
            <PiWaveformBold
              className="spotify-waveform-beat h-3.5 w-3.5"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {playerOpen && embedUrl && (
        <div
          id="spotify-last-played-player"
          className="mt-2 w-full max-w-[28rem] overflow-hidden rounded-xl shadow-[2px_3px_0_var(--color-shadow)]"
        >
          <iframe
            src={embedUrl}
            title={`Spotify player: ${track.title} by ${track.artist}`}
            width="100%"
            height="80"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="block border-0"
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { StickyNote } from "@/components/decor/Decor";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "portfolio.voiceHint.v1";

function ScribbleArrow() {
  return (
    <svg
      className="voice-hint__arrow"
      viewBox="0 0 72 36"
      width="72"
      height="36"
      aria-hidden="true"
    >
      <path
        d="M36 2c-8 6-14 12-18 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="3 5"
      />
      <path
        d="M12 18c2 6 4 10 6 14l-10-3 8 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VoiceHint({
  visible,
  onDismiss,
  onTryTalk,
}: {
  visible: boolean;
  onDismiss: () => void;
  onTryTalk: () => void;
}) {
  if (!visible) return null;

  return (
    <aside
      className="voice-hint pointer-events-auto mb-1 w-[min(16.5rem,calc(100vw-2rem))]"
      aria-label="Voice agent intro"
    >
      <StickyNote rotation={-2.8} color="yellow" className="voice-hint__note px-3.5 py-3 sm:px-4">
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss voice hint"
          className="absolute top-1.5 right-2 font-hand text-lg leading-none text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          ×
        </button>
        <p className="font-hand text-[1.35rem] leading-none text-[var(--color-ink)]">
          psst — talk to the site
        </p>
        <p className="mt-2 text-[12px] leading-snug text-[var(--color-ink-muted)]">
          There’s a voice agent in the pill. Ask it to scroll, open a project, or
          tell you what Harsh does.
        </p>
        <button
          type="button"
          onClick={onTryTalk}
          className="mt-2.5 font-hand text-[15px] text-[var(--color-accent-hover)] underline decoration-wavy decoration-[var(--color-link-squiggle)] underline-offset-4 hover:decoration-[var(--color-accent)]"
        >
          okay, listen →
        </button>
      </StickyNote>
      <div className="flex justify-center text-[var(--color-on-mat)]">
        <ScribbleArrow />
      </div>
    </aside>
  );
}

export function useVoiceHint(suppressed: boolean) {
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) === "1";
    const timer = window.setTimeout(() => {
      setReady(true);
      setDismissed(stored);
      if (!stored) {
        track("voice_hint_shown");
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setDismissed(true);
    window.localStorage.setItem(STORAGE_KEY, "1");
    track("voice_hint_dismissed");
  }

  return {
    visible: ready && !dismissed && !suppressed,
    dismiss,
  };
}

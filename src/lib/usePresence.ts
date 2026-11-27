"use client";

import { useEffect, useState } from "react";

/** Keep a closing element mounted until --dur-state finishes, so the exit can reverse. */
const STATE_MS = 400;

export function usePresence(open: boolean, duration = STATE_MS) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = reduce ? 0 : duration;
    let second = 0;
    let timeout = 0;

    const first = requestAnimationFrame(() => {
      if (open) {
        setMounted(true);
        if (reduce) {
          setVisible(true);
          return;
        }
        second = requestAnimationFrame(() => setVisible(true));
        return;
      }

      setVisible(false);
      timeout = window.setTimeout(() => setMounted(false), wait);
    });

    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [open, duration]);

  return { mounted, visible };
}

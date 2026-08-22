"use client";

import { useEffect, useState } from "react";
import type { OpenGraphData } from "@/lib/og";

export function useOpenGraphPreview(
  link?: string,
  enabled = true,
): OpenGraphData | null {
  const [preview, setPreview] = useState<OpenGraphData | null>(null);

  useEffect(() => {
    if (!enabled || !link) return;

    let cancelled = false;

    fetch(`/api/og?url=${encodeURIComponent(link)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: OpenGraphData | null) => {
        if (!cancelled && data) setPreview(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [enabled, link]);

  return preview;
}

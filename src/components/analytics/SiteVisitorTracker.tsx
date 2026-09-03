"use client";

import { useEffect } from "react";

type SiteVisitorResponse = {
  count: number | null;
};

let siteVisitorRequest: Promise<number | null> | undefined;

function requestSiteVisitorCount() {
  siteVisitorRequest ??= fetch("/api/visitor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "site" }),
    cache: "no-store",
  })
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }
      const body = (await response.json()) as SiteVisitorResponse;
      return body.count;
    })
    .catch(() => null);

  return siteVisitorRequest;
}

/**
 * Invisible component that tracks site-wide visitor count.
 * Use this on pages that don't have the VisitorQuoteCard component.
 */
export function SiteVisitorTracker() {
  useEffect(() => {
    // Track the visit when component mounts
    void requestSiteVisitorCount();
  }, []);

  // This component renders nothing
  return null;
}
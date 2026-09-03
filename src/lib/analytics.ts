import posthog from "posthog-js";

export const ANALYTICS_APP = "portfolio-v2";

type AnalyticsProperty = string | number | boolean | null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function canCapture(): boolean {
  return (
    isBrowser() && Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)
  );
}

/** Fire a custom PostHog event. No-ops when the SDK token is unset. */
export function track(
  event: string,
  properties?: Record<string, AnalyticsProperty>,
): void {
  if (!canCapture()) return;
  posthog.capture(event, { app: ANALYTICS_APP, ...properties });
}

/** Track outbound / external link clicks with a consistent event name. */
export function trackOutboundClick(
  href: string,
  properties?: Record<string, AnalyticsProperty>,
): void {
  track("outbound_link_clicked", {
    href,
    destination: href,
    ...properties,
  });
}

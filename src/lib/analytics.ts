import posthog from "posthog-js";

export const ANALYTICS_APP = "portfolio-v2";

type AnalyticsProperty = string | number | boolean | null;

export function track(event: string, properties?: Record<string, AnalyticsProperty>): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, { app: ANALYTICS_APP, ...properties });
}

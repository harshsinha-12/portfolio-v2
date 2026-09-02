import posthog from "posthog-js";
import { ANALYTICS_APP } from "@/lib/analytics";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

// Session recordings require cookies / local storage, so cookieless mode is off.
// Enable "Record user sessions" in the PostHog project settings after adding the token.
if (projectToken) {
  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-01-30",
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    capture_exceptions: true,
    capture_performance: true,
    disable_session_recording: false,
    enable_recording_console_log: true,
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
      recordCrossOriginIframes: false,
    },
    debug: process.env.NODE_ENV === "development",
    loaded: (client) => {
      client.register({ app: ANALYTICS_APP });
    },
  });
}

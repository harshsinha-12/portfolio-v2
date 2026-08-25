import posthog from "posthog-js";
import { ANALYTICS_APP } from "@/lib/analytics";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (projectToken && host) {
  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-01-30",
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    capture_exceptions: true,
    person_profiles: "never",
    cookieless_mode: "always",
    debug: process.env.NODE_ENV === "development",
    loaded: (client) => {
      client.register({ app: ANALYTICS_APP });
    },
  });
}

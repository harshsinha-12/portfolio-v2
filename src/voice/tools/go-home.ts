import type { SiteToolDefinition } from "@/voice/types";

export const goHomeTool: SiteToolDefinition = {
  name: "go_home",
  description:
    "Return to the homepage. Use when the visitor is on an article and wants the main portfolio.",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
};

export function parseGoHome() {
  return { type: "go_home" as const };
}

import type { SiteToolDefinition } from "@/voice/types";

export const openResumeTool: SiteToolDefinition = {
  name: "open_resume",
  description: "Open Harsh's PDF résumé in a new tab.",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
};

export function parseOpenResume() {
  return { type: "open_resume" as const };
}

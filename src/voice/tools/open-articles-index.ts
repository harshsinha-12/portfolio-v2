import type { SiteToolDefinition } from "@/voice/types";

export const openArticlesIndexTool: SiteToolDefinition = {
  name: "open_articles_index",
  description: "Open the /articles index of all field notes.",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
};

export function parseOpenArticlesIndex() {
  return { type: "open_articles_index" as const };
}

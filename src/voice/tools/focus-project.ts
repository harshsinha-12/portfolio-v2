import { isProjectId, projectCatalog } from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";
import type { SiteToolDefinition } from "@/voice/types";

export const focusProjectTool: SiteToolDefinition = {
  name: "focus_project",
  description:
    "Scroll to a specific project card on the homepage and highlight it. Use when the visitor asks to see, open, or look at a named project.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Project id from the catalog.",
        enum: projectCatalog.map((project) => project.id),
      },
    },
    required: ["id"],
    additionalProperties: false,
  },
};

export function parseFocusProject(args: unknown) {
  const id = readString(asRecord(args), "id");
  if (!isProjectId(id)) {
    throw new Error(`Unknown project: ${id || "(empty)"}`);
  }
  return { type: "focus_project" as const, id };
}

import { projectCatalog, isProjectId, getProject } from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";
import type { SiteToolDefinition } from "@/voice/types";

const demoIds = projectCatalog
  .filter((project) => project.hasDemo)
  .map((project) => project.id);

export const playProjectDemoTool: SiteToolDefinition = {
  name: "play_project_demo",
  description:
    "Play the hover/tap demo video on a project card that has one. Scrolls to the card first.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Project id that has a demo video.",
        enum: demoIds.length > 0 ? demoIds : projectCatalog.map((project) => project.id),
      },
    },
    required: ["id"],
    additionalProperties: false,
  },
};

export function parsePlayProjectDemo(args: unknown) {
  const id = readString(asRecord(args), "id");
  if (!isProjectId(id)) {
    throw new Error(`Unknown project: ${id || "(empty)"}`);
  }
  if (!getProject(id)?.hasDemo) {
    throw new Error(`No demo video for ${id}`);
  }
  return { type: "play_project_demo" as const, id };
}

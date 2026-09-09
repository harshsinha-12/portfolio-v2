import { PROJECT_LINK_KINDS, type SiteToolDefinition } from "@/voice/types";
import {
  getProjectLink,
  isProjectId,
  isProjectLinkKind,
  projectCatalog,
} from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";

export const openProjectLinkTool: SiteToolDefinition = {
  name: "open_project_link",
  description:
    "Open a project's live site, GitHub repo, README, or YouTube video in a new tab. Only use after the visitor clearly wants an outbound link.",
  parameters: {
    type: "object",
    properties: {
      projectId: {
        type: "string",
        description: "Project id from the catalog.",
        enum: projectCatalog.map((project) => project.id),
      },
      kind: {
        type: "string",
        description: "Which project URL to open.",
        enum: [...PROJECT_LINK_KINDS],
      },
    },
    required: ["projectId", "kind"],
    additionalProperties: false,
  },
};

export function parseOpenProjectLink(args: unknown) {
  const record = asRecord(args);
  const projectId = readString(record, "projectId");
  const kind = readString(record, "kind");
  if (!isProjectId(projectId)) {
    throw new Error(`Unknown project: ${projectId || "(empty)"}`);
  }
  if (!isProjectLinkKind(kind)) {
    throw new Error(`Unknown project link kind: ${kind || "(empty)"}`);
  }
  if (!getProjectLink(projectId, kind)) {
    throw new Error(`No ${kind} link for ${projectId}`);
  }
  return { type: "open_project_link" as const, projectId, kind };
}

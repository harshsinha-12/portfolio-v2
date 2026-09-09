import {
  PROJECT_LINK_KINDS,
  type OutboundWhere,
  type SiteToolDefinition,
} from "@/voice/types";
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
    "Open a project's live site, GitHub, README, or YouTube. Pass projectId and kind from the catalog. Use only when the visitor clearly wants that outbound page — never when they just start talking. Prefer where=tab; use where=here to open in this tab.",
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
      where: {
        type: "string",
        description:
          "tab = try a new tab, then this tab if blocked. here = this tab only.",
        enum: ["tab", "here"],
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
  const where = readString(record, "where");
  if (!isProjectId(projectId)) {
    throw new Error(`Unknown project: ${projectId || "(empty)"}`);
  }
  if (!isProjectLinkKind(kind)) {
    throw new Error(`Unknown project link kind: ${kind || "(empty)"}`);
  }
  if (!getProjectLink(projectId, kind)) {
    throw new Error(`No ${kind} link for ${projectId}`);
  }
  const dest = parseWhere(where);
  return dest
    ? { type: "open_project_link" as const, projectId, kind, where: dest }
    : { type: "open_project_link" as const, projectId, kind };
}

function parseWhere(value: string): OutboundWhere | undefined {
  if (!value) return undefined;
  if (value === "tab" || value === "here") return value;
  throw new Error(`Unknown where: ${value}`);
}

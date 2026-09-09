import { experienceCatalog, isExperienceId } from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";
import type { SiteToolDefinition } from "@/voice/types";

export const focusExperienceTool: SiteToolDefinition = {
  name: "focus_experience",
  description:
    "Scroll to a work experience entry on the homepage and expand its details. Use for Multibagg or other listed roles.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Experience id from the catalog.",
        enum: experienceCatalog.map((item) => item.id),
      },
    },
    required: ["id"],
    additionalProperties: false,
  },
};

export function parseFocusExperience(args: unknown) {
  const id = readString(asRecord(args), "id");
  if (!isExperienceId(id)) {
    throw new Error(`Unknown experience: ${id || "(empty)"}`);
  }
  return { type: "focus_experience" as const, id };
}

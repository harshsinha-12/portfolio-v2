import { educationCatalog, isEducationId } from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";
import type { SiteToolDefinition } from "@/voice/types";

export const focusEducationTool: SiteToolDefinition = {
  name: "focus_education",
  description:
    "Scroll to the education entry on the homepage (IIT Patna).",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Education id from the catalog.",
        enum: educationCatalog.map((item) => item.id),
      },
    },
    required: ["id"],
    additionalProperties: false,
  },
};

export function parseFocusEducation(args: unknown) {
  const id = readString(asRecord(args), "id");
  if (!isEducationId(id)) {
    throw new Error(`Unknown education entry: ${id || "(empty)"}`);
  }
  return { type: "focus_education" as const, id };
}

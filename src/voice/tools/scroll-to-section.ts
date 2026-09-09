import { NAV_SECTION_IDS, type SiteToolDefinition } from "@/voice/types";
import { isNavSectionId } from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";

export const scrollToSectionTool: SiteToolDefinition = {
  name: "scroll_to_section",
  description:
    "Scroll the homepage to a named section. Use for about, experience, projects, tech, hackathons/certs, or writing.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Section id on the homepage.",
        enum: [...NAV_SECTION_IDS],
      },
    },
    required: ["id"],
    additionalProperties: false,
  },
};

export function parseScrollToSection(args: unknown) {
  const id = readString(asRecord(args), "id");
  if (!isNavSectionId(id)) {
    throw new Error(`Unknown section: ${id || "(empty)"}`);
  }
  return { type: "scroll_to_section" as const, id };
}

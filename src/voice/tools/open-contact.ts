import { CONTACT_KINDS, type SiteToolDefinition } from "@/voice/types";
import { isContactKind } from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";

export const openContactTool: SiteToolDefinition = {
  name: "open_contact",
  description:
    "Open LinkedIn, GitHub, X/Twitter, email, or the résumé. Use only when the visitor asks to go there.",
  parameters: {
    type: "object",
    properties: {
      kind: {
        type: "string",
        description: "Which contact surface to open.",
        enum: [...CONTACT_KINDS],
      },
    },
    required: ["kind"],
    additionalProperties: false,
  },
};

export function parseOpenContact(args: unknown) {
  const kind = readString(asRecord(args), "kind");
  if (!isContactKind(kind)) {
    throw new Error(`Unknown contact kind: ${kind || "(empty)"}`);
  }
  return { type: "open_contact" as const, kind };
}

import {
  SCROLL_AMOUNTS,
  SCROLL_DIRECTIONS,
  type ScrollAmount,
  type ScrollDirection,
  type SiteToolDefinition,
} from "@/voice/types";
import { asRecord, readString } from "@/voice/functions/parse-args";

export const scrollPageTool: SiteToolDefinition = {
  name: "scroll_page",
  description:
    "Scroll the current page up or down by roughly one viewport or one section. Use for vague requests like 'scroll down'.",
  parameters: {
    type: "object",
    properties: {
      direction: {
        type: "string",
        enum: [...SCROLL_DIRECTIONS],
      },
      amount: {
        type: "string",
        enum: [...SCROLL_AMOUNTS],
        description: "How far to scroll. Defaults to page.",
      },
    },
    required: ["direction"],
    additionalProperties: false,
  },
};

export function parseScrollPage(args: unknown) {
  const record = asRecord(args);
  const direction = readString(record, "direction");
  const amount = readString(record, "amount") || "page";
  if (direction !== "up" && direction !== "down") {
    throw new Error(`Unknown scroll direction: ${direction || "(empty)"}`);
  }
  if (amount !== "page" && amount !== "section") {
    throw new Error(`Unknown scroll amount: ${amount}`);
  }
  const parsedDirection: ScrollDirection = direction;
  const parsedAmount: ScrollAmount = amount;
  return { type: "scroll_page" as const, direction: parsedDirection, amount: parsedAmount };
}

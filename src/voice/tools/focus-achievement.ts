import {
  achievementCatalog,
  isAchievementId,
} from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";
import type { SiteToolDefinition } from "@/voice/types";

export const focusAchievementTool: SiteToolDefinition = {
  name: "focus_achievement",
  description:
    "Show a specific hackathon, olympiad, or certification card, paging the clothesline if needed.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Achievement id from the catalog.",
        enum: achievementCatalog.map((item) => item.id),
      },
    },
    required: ["id"],
    additionalProperties: false,
  },
};

export function parseFocusAchievement(args: unknown) {
  const id = readString(asRecord(args), "id");
  if (!isAchievementId(id)) {
    throw new Error(`Unknown achievement: ${id || "(empty)"}`);
  }
  return { type: "focus_achievement" as const, id };
}

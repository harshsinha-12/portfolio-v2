import { isArticleSlug } from "@/voice/functions/site-catalog";
import { asRecord, readString } from "@/voice/functions/parse-args";
import type { SiteToolDefinition } from "@/voice/types";

export function createOpenArticleTool(slugs: string[]): SiteToolDefinition {
  return {
    name: "open_article",
    description:
      "Open a published article on this site. Use the slug from the article catalog.",
    parameters: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Article slug.",
          ...(slugs.length > 0 ? { enum: slugs } : {}),
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  };
}

export function parseOpenArticle(args: unknown) {
  const slug = readString(asRecord(args), "slug");
  if (!isArticleSlug(slug)) {
    throw new Error(`Invalid article slug: ${slug || "(empty)"}`);
  }
  return { type: "open_article" as const, slug };
}

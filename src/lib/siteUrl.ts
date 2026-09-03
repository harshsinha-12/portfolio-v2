import { siteConfig } from "@/data/portfolio";

/** The single canonical production origin used by metadata and public feeds. */
export const SITE_URL = new URL(siteConfig.url).origin;

export function getSiteUrl(): string {
  return SITE_URL;
}

import { siteConfig } from "@/data/portfolio";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  return raw.replace(/\/$/, "");
}

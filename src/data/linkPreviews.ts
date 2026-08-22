import { getDomain } from "@/lib/linkIcons";
import sources from "./link-preview-sources.json";

export type LinkPreviewSource = {
  href: string;
  image: string;
  fallback?: string;
};

const PREVIEW_DIR = "/assets/link-previews";

const linkPreviewSources = sources as LinkPreviewSource[];

export function canonicalizePreviewHref(href: string): string {
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return href;

    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const videoId = host === "youtube.com" ? url.searchParams.get("v") : null;
    const query = videoId ? `?v=${videoId}` : "";
    return `https://${host}${pathname}${query}`;
  } catch {
    return href;
  }
}

const linkPreviewImages: Record<string, string> = {};

for (const source of linkPreviewSources) {
  const src = `${PREVIEW_DIR}/${source.image}`;
  linkPreviewImages[canonicalizePreviewHref(source.href)] = src;
}

export function isHttpUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function getLinkPreviewImage(href: string): string | null {
  return linkPreviewImages[canonicalizePreviewHref(href)] ?? null;
}

export function getLinkPreviewCaption(href: string): string {
  return getDomain(href);
}

export function getLinkPreviewImageSources(): string[] {
  return Array.from(new Set(Object.values(linkPreviewImages)));
}

import { siteConfig } from "@/data/portfolio";
import {
  articleOgContentType,
  articleOgSize,
  renderArticleOgImage,
} from "@/lib/articleOgImage";

export const runtime = "nodejs";
export const alt = `Articles & write-ups by ${siteConfig.name}`;
export const size = articleOgSize;
export const contentType = articleOgContentType;

export default async function Image() {
  return renderArticleOgImage({
    eyebrow: "Field Notes",
    title: "Articles & write-ups",
    description:
      "Longer notes on the systems I build, the problems behind them, and the lessons that survive beyond a launch post.",
  });
}

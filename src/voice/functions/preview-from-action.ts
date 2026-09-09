import { navSections } from "@/data/portfolio";
import { getProjectLink } from "@/voice/functions/site-catalog";
import type { SiteAction, VoicePreview } from "@/voice/types";

export const sectionBlurbs: Record<string, string> = {
  profile: "Who Harsh is, what he’s looking for, and how to reach him.",
  experience: "Multibagg AI, Founder's Office & AI Engineer, plus IIT Patna.",
  projects: "RecoveryOS, LiDAR Room Capture, Trading Arena, Vritta, and more.",
  "tech-stack": "The workshop map — product, data, agents, and delivery.",
  hackathons: "Olympiads, hackathons, and certifications on the clothesline.",
  articles: "Field notes on agents, backend, and building in public.",
};

export function previewFromAction(action: SiteAction): VoicePreview | undefined {
  switch (action.type) {
    case "scroll_to_section":
      return { type: "section", id: action.id };
    case "go_home":
      return { type: "section", id: "profile" };
    case "open_articles_index":
      return { type: "section", id: "articles", href: "/articles" };
    case "focus_project":
    case "play_project_demo":
      return { type: "project", id: action.id };
    case "open_project_link":
      return {
        type: "project",
        id: action.projectId,
        href: getProjectLink(action.projectId, action.kind) ?? undefined,
      };
    case "focus_experience":
      return { type: "experience", id: action.id };
    case "focus_education":
      return { type: "education", id: action.id };
    case "focus_achievement":
      return { type: "achievement", id: action.id };
    case "open_article":
      return { type: "article", slug: action.slug };
    case "open_resume":
      return { type: "contact", kind: "resume" };
    case "open_contact":
      return { type: "contact", kind: action.kind };
    default:
      return undefined;
  }
}

export function sectionLabel(id: string) {
  return navSections.find((section) => section.id === id)?.label ?? id;
}

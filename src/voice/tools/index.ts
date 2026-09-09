import type { SiteAction, SiteToolDefinition, SiteToolName } from "@/voice/types";
import { createOpenArticleTool, parseOpenArticle } from "@/voice/tools/open-article";
import { goHomeTool, parseGoHome } from "@/voice/tools/go-home";
import {
  focusAchievementTool,
  parseFocusAchievement,
} from "@/voice/tools/focus-achievement";
import {
  focusEducationTool,
  parseFocusEducation,
} from "@/voice/tools/focus-education";
import {
  focusExperienceTool,
  parseFocusExperience,
} from "@/voice/tools/focus-experience";
import { focusProjectTool, parseFocusProject } from "@/voice/tools/focus-project";
import { openContactTool, parseOpenContact } from "@/voice/tools/open-contact";
import {
  openArticlesIndexTool,
  parseOpenArticlesIndex,
} from "@/voice/tools/open-articles-index";
import {
  openProjectLinkTool,
  parseOpenProjectLink,
} from "@/voice/tools/open-project-link";
import { openResumeTool, parseOpenResume } from "@/voice/tools/open-resume";
import {
  playProjectDemoTool,
  parsePlayProjectDemo,
} from "@/voice/tools/play-project-demo";
import { scrollPageTool, parseScrollPage } from "@/voice/tools/scroll-page";
import {
  scrollToSectionTool,
  parseScrollToSection,
} from "@/voice/tools/scroll-to-section";

const staticTools: SiteToolDefinition[] = [
  scrollToSectionTool,
  focusProjectTool,
  focusExperienceTool,
  focusEducationTool,
  focusAchievementTool,
  openProjectLinkTool,
  openArticlesIndexTool,
  openResumeTool,
  openContactTool,
  goHomeTool,
  playProjectDemoTool,
  scrollPageTool,
];

export function getSiteTools(articleSlugs: string[] = []): SiteToolDefinition[] {
  return [...staticTools, createOpenArticleTool(articleSlugs)];
}

export function toRealtimeTools(articleSlugs: string[] = []) {
  return getSiteTools(articleSlugs).map((tool) => ({
    type: "function" as const,
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
}

export function toChatTools(articleSlugs: string[] = []) {
  return getSiteTools(articleSlugs).map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

export function parseSiteAction(name: string, args: unknown): SiteAction {
  switch (name as SiteToolName) {
    case "scroll_to_section":
      return parseScrollToSection(args);
    case "focus_project":
      return parseFocusProject(args);
    case "focus_experience":
      return parseFocusExperience(args);
    case "focus_education":
      return parseFocusEducation(args);
    case "focus_achievement":
      return parseFocusAchievement(args);
    case "open_project_link":
      return parseOpenProjectLink(args);
    case "open_article":
      return parseOpenArticle(args);
    case "open_articles_index":
      return parseOpenArticlesIndex();
    case "open_resume":
      return parseOpenResume();
    case "open_contact":
      return parseOpenContact(args);
    case "go_home":
      return parseGoHome();
    case "play_project_demo":
      return parsePlayProjectDemo(args);
    case "scroll_page":
      return parseScrollPage(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

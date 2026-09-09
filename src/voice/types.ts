export const NAV_SECTION_IDS = [
  "profile",
  "experience",
  "projects",
  "tech-stack",
  "hackathons",
  "articles",
] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];

export const PROJECT_LINK_KINDS = [
  "live",
  "github",
  "readme",
  "youtube",
] as const;

export type ProjectLinkKind = (typeof PROJECT_LINK_KINDS)[number];

export const CONTACT_KINDS = [
  "linkedin",
  "github",
  "twitter",
  "email",
  "resume",
] as const;

export type ContactKind = (typeof CONTACT_KINDS)[number];

export const SCROLL_DIRECTIONS = ["up", "down"] as const;
export type ScrollDirection = (typeof SCROLL_DIRECTIONS)[number];

export const SCROLL_AMOUNTS = ["page", "section"] as const;
export type ScrollAmount = (typeof SCROLL_AMOUNTS)[number];

export type SiteAction =
  | { type: "scroll_to_section"; id: NavSectionId }
  | { type: "focus_project"; id: string }
  | { type: "focus_experience"; id: string }
  | { type: "focus_education"; id: string }
  | { type: "focus_achievement"; id: string }
  | { type: "open_project_link"; projectId: string; kind: ProjectLinkKind }
  | { type: "open_article"; slug: string }
  | { type: "open_articles_index" }
  | { type: "open_resume" }
  | { type: "open_contact"; kind: ContactKind }
  | { type: "go_home" }
  | { type: "play_project_demo"; id: string }
  | { type: "scroll_page"; direction: ScrollDirection; amount: ScrollAmount };

export type SiteToolName = SiteAction["type"];

export type JsonSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties: false;
};

export type SiteToolDefinition = {
  name: SiteToolName;
  description: string;
  parameters: JsonSchema;
};

export type ActionResult = {
  ok: boolean;
  tool: SiteToolName;
  message: string;
  details?: Record<string, string | number | boolean | null>;
};

export type PageState = {
  route: string;
  hash: string;
  section: NavSectionId | null;
  visibleTargets: string[];
};

export type VoiceTranscriptRole = "user" | "assistant" | "system";

export type VoicePreview =
  | { type: "article"; slug: string }
  | { type: "project"; id: string; href?: string }
  | { type: "experience"; id: string }
  | { type: "education"; id: string }
  | { type: "achievement"; id: string }
  | { type: "section"; id: NavSectionId; href?: string }
  | { type: "contact"; kind: ContactKind };

export type VoiceTranscriptItem = {
  id: string;
  role: VoiceTranscriptRole;
  text: string;
  toolName?: SiteToolName;
  preview?: VoicePreview;
};

export type ChatTurnMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ChatToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

export type ChatToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type TextTurnRequest = {
  messages: ChatTurnMessage[];
  pageState: PageState;
};

export type TextTurnResponse = {
  message: string | null;
  toolCalls: ChatToolCall[];
};

export type RealtimeSessionPayload = {
  clientSecret: string;
  expiresAt: number;
  model: string;
};

export type ActionContext = {
  pathname: string;
  navigate: (href: string) => void | Promise<void>;
};

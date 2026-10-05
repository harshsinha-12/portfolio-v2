export const OPENAI_API_BASE = "https://api.openai.com/v1";

export const OPENAI_PATHS = {
  clientSecrets: "/realtime/client_secrets",
  chatCompletions: "/chat/completions",
  speech: "/audio/speech",
  realtimeCalls: "/realtime/calls",
} as const;

export type OpenAIPath = (typeof OPENAI_PATHS)[keyof typeof OPENAI_PATHS];

export function openaiUrl(path: OpenAIPath) {
  return `${OPENAI_API_BASE}${path}`;
}

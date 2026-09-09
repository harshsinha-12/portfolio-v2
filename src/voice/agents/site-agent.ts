import { toChatTools, toRealtimeTools } from "@/voice/tools";
import { buildSiteAgentPrompt } from "@/voice/prompts/site-agent";
import type { PageState } from "@/voice/types";

export const SITE_AGENT = {
  name: "site-concierge",
  realtimeModel: "gpt-realtime-2.1",
  textModel: "gpt-4.1",
  ttsModel: "gpt-4o-mini-tts",
  transcribeModel: "gpt-4o-mini-transcribe",
  voice: "marin",
} as const;

export function buildRealtimeSessionConfig(
  knowledge: string,
  articleSlugs: string[],
  pageState?: PageState,
) {
  return {
    type: "realtime" as const,
    model: SITE_AGENT.realtimeModel,
    output_modalities: ["audio"] as const,
    instructions: buildSiteAgentPrompt(knowledge, pageState),
    tools: toRealtimeTools(articleSlugs),
    tool_choice: "auto" as const,
    audio: {
      input: {
        noise_reduction: { type: "near_field" as const },
        transcription: {
          model: SITE_AGENT.transcribeModel,
          language: "en",
        },
        turn_detection: {
          type: "semantic_vad" as const,
          eagerness: "medium" as const,
          create_response: true,
          interrupt_response: true,
        },
      },
      output: {
        voice: SITE_AGENT.voice,
      },
    },
  };
}

export function buildTextTurnConfig(
  knowledge: string,
  articleSlugs: string[],
  pageState?: PageState,
) {
  return {
    model: SITE_AGENT.textModel,
    instructions: buildSiteAgentPrompt(knowledge, pageState),
    tools: toChatTools(articleSlugs),
  };
}

import { toChatTools, toRealtimeTools } from "@/voice/tools";
import { OPENAI_PATHS } from "@/voice/openai";
import { buildSiteAgentPrompt } from "@/voice/prompts/site-agent";
import type { ChatTurnMessage, PageState } from "@/voice/types";

export const SITE_AGENT = {
  name: "site-concierge",
  realtimeModel: "gpt-realtime-2.1",
  textModel: "gpt-4.1",
  ttsModel: "gpt-4o-mini-tts",
  transcribeModel: "gpt-4o-mini-transcribe",
  voice: "marin",
  speechFormat: "mp3",
  clientSecretTtlSeconds: 600,
} as const;

export type OpenAIRequestConfig = {
  path: string;
  init: RequestInit;
};

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

export type RealtimeSessionConfig = ReturnType<typeof buildRealtimeSessionConfig>;
export type TextTurnConfig = ReturnType<typeof buildTextTurnConfig>;

export function buildClientSecretConfig(session: RealtimeSessionConfig): OpenAIRequestConfig {
  return {
    path: OPENAI_PATHS.clientSecrets,
    init: {
      method: "POST",
      body: JSON.stringify({
        expires_after: {
          anchor: "created_at",
          seconds: SITE_AGENT.clientSecretTtlSeconds,
        },
        session,
      }),
    },
  };
}

export function buildChatCompletionConfig(
  config: TextTurnConfig,
  messages: ChatTurnMessage[],
): OpenAIRequestConfig {
  return {
    path: OPENAI_PATHS.chatCompletions,
    init: {
      method: "POST",
      body: JSON.stringify({
        model: config.model,
        messages,
        tools: config.tools,
        tool_choice: "auto",
      }),
    },
  };
}

export function buildSpeechConfig(input: string): OpenAIRequestConfig {
  return {
    path: OPENAI_PATHS.speech,
    init: {
      method: "POST",
      body: JSON.stringify({
        model: SITE_AGENT.ttsModel,
        voice: SITE_AGENT.voice,
        input,
        response_format: SITE_AGENT.speechFormat,
      }),
    },
  };
}

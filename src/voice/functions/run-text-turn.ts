import "server-only";

import { buildVoiceKnowledge, getPublishedArticleSlugs } from "@/voice/functions/build-knowledge";
import { openaiFetch } from "@/voice/functions/openai";
import { buildTextTurnConfig } from "@/voice/agents/site-agent";
import type {
  ChatTurnMessage,
  ChatToolCall,
  PageState,
  TextTurnResponse,
} from "@/voice/types";

type CompletionsResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
      tool_calls?: ChatToolCall[];
    };
  }>;
};

const MAX_MESSAGES = 20;

function sanitizeMessages(messages: ChatTurnMessage[]): ChatTurnMessage[] {
  return messages
    .filter((message) => message.role !== "system")
    .slice(-MAX_MESSAGES);
}

export async function runTextTurn(
  messages: ChatTurnMessage[],
  pageState: PageState,
): Promise<TextTurnResponse> {
  const knowledge = buildVoiceKnowledge();
  const articleSlugs = getPublishedArticleSlugs();
  const config = buildTextTurnConfig(knowledge, articleSlugs, pageState);

  const response = await openaiFetch("/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: config.model,
      temperature: 0.4,
      messages: [
        { role: "system", content: config.instructions },
        ...sanitizeMessages(messages),
      ],
      tools: config.tools,
      tool_choice: "auto",
    }),
  });

  const payload = (await response.json()) as CompletionsResponse;
  const message = payload.choices?.[0]?.message;

  return {
    message: message?.content?.trim() || null,
    toolCalls: message?.tool_calls ?? [],
  };
}

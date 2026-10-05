import "server-only";

import { openaiFetch } from "@/voice/functions/openai";
import { buildSpeechConfig } from "@/voice/agents/site-agent";

const MAX_SPEECH_CHARS = 1200;

export async function speakText(text: string) {
  const clipped = text.trim().slice(0, MAX_SPEECH_CHARS);
  if (!clipped) {
    throw new Error("Nothing to speak");
  }

  const request = buildSpeechConfig(clipped);
  const response = await openaiFetch(request.path, request.init);

  return response.arrayBuffer();
}

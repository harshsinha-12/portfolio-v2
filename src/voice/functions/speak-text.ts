import "server-only";

import { openaiFetch } from "@/voice/functions/openai";
import { SITE_AGENT } from "@/voice/agents/site-agent";

const MAX_SPEECH_CHARS = 1200;

export async function speakText(text: string) {
  const clipped = text.trim().slice(0, MAX_SPEECH_CHARS);
  if (!clipped) {
    throw new Error("Nothing to speak");
  }

  const response = await openaiFetch("/audio/speech", {
    method: "POST",
    body: JSON.stringify({
      model: SITE_AGENT.ttsModel,
      voice: SITE_AGENT.voice,
      input: clipped,
      response_format: "mp3",
    }),
  });

  return response.arrayBuffer();
}

import "server-only";

import { buildVoiceKnowledge, getPublishedArticleSlugs } from "@/voice/functions/build-knowledge";
import { openaiFetch } from "@/voice/functions/openai";
import { buildRealtimeSessionConfig } from "@/voice/agents/site-agent";
import type { PageState, RealtimeSessionPayload } from "@/voice/types";

type ClientSecretResponse = {
  value?: string;
  expires_at?: number;
  client_secret?: {
    value?: string;
    expires_at?: number;
  };
};

export async function createRealtimeClientSecret(
  pageState?: PageState,
): Promise<RealtimeSessionPayload> {
  const knowledge = buildVoiceKnowledge();
  const articleSlugs = getPublishedArticleSlugs();
  const session = buildRealtimeSessionConfig(knowledge, articleSlugs, pageState);

  const response = await openaiFetch("/realtime/client_secrets", {
    method: "POST",
    body: JSON.stringify({
      expires_after: {
        anchor: "created_at",
        seconds: 600,
      },
      session,
    }),
  });

  const payload = (await response.json()) as ClientSecretResponse;
  const clientSecret = payload.value ?? payload.client_secret?.value;
  const expiresAt = payload.expires_at ?? payload.client_secret?.expires_at;

  if (!clientSecret) {
    throw new Error("OpenAI did not return a realtime client secret");
  }

  return {
    clientSecret,
    expiresAt: expiresAt ?? Math.floor(Date.now() / 1000) + 600,
    model: session.model,
  };
}

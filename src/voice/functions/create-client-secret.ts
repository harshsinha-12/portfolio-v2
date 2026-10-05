import "server-only";

import { buildVoiceKnowledge, getPublishedArticleSlugs } from "@/voice/functions/build-knowledge";
import { openaiFetch } from "@/voice/functions/openai";
import { buildClientSecretConfig, buildRealtimeSessionConfig, SITE_AGENT } from "@/voice/agents/site-agent";
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

  const request = buildClientSecretConfig(session);
  const response = await openaiFetch(request.path, request.init);

  const payload = (await response.json()) as ClientSecretResponse;
  const clientSecret = payload.value ?? payload.client_secret?.value;
  const expiresAt = payload.expires_at ?? payload.client_secret?.expires_at;

  if (!clientSecret) {
    throw new Error("OpenAI did not return a realtime client secret");
  }

  return {
    clientSecret,
    expiresAt: expiresAt ?? Math.floor(Date.now() / 1000) + SITE_AGENT.clientSecretTtlSeconds,
    model: session.model,
  };
}

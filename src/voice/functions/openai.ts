const OPENAI_API_BASE = "https://api.openai.com/v1";

export function getOpenAIApiKey() {
  return process.env.OPENAI_API_KEY?.trim() ?? "";
}

export function isVoiceConfigured() {
  return getOpenAIApiKey().length > 0;
}

export async function openaiFetch(path: string, init: RequestInit = {}) {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${apiKey}`);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${OPENAI_API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${path} failed (${response.status}): ${detail.slice(0, 500)}`);
  }

  return response;
}

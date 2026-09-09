import { NextResponse } from "next/server";
import { createRealtimeClientSecret } from "@/voice/functions/create-client-secret";
import { isVoiceConfigured } from "@/voice/functions/openai";
import { clientKeyFromRequest, rateLimit } from "@/voice/functions/rate-limit";
import type { PageState } from "@/voice/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { configured: isVoiceConfigured() },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: Request) {
  if (!isVoiceConfigured()) {
    return NextResponse.json(
      { error: "Voice is not configured. Set OPENAI_API_KEY." },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const limited = rateLimit(`voice-session:${clientKeyFromRequest(request)}`, 8, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many voice sessions. Try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Cache-Control": "private, no-store",
          "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
        },
      },
    );
  }

  let pageState: PageState | undefined;
  try {
    const body = (await request.json()) as { pageState?: PageState };
    pageState = body.pageState;
  } catch {
    pageState = undefined;
  }

  try {
    const session = await createRealtimeClientSecret(pageState);
    return NextResponse.json(session, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start voice session";
    return NextResponse.json(
      { error: message },
      { status: 502, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}

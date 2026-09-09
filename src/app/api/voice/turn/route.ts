import { NextResponse } from "next/server";
import { runTextTurn } from "@/voice/functions/run-text-turn";
import { isVoiceConfigured } from "@/voice/functions/openai";
import { clientKeyFromRequest, rateLimit } from "@/voice/functions/rate-limit";
import type { ChatTurnMessage, PageState } from "@/voice/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TurnBody = {
  messages?: ChatTurnMessage[];
  pageState?: PageState;
};

function isTurnMessage(value: unknown): value is ChatTurnMessage {
  if (!value || typeof value !== "object") return false;
  const role = (value as { role?: unknown }).role;
  return (
    role === "user" ||
    role === "assistant" ||
    role === "tool" ||
    role === "system"
  );
}

export async function POST(request: Request) {
  if (!isVoiceConfigured()) {
    return NextResponse.json(
      { error: "Voice is not configured. Set OPENAI_API_KEY." },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const limited = rateLimit(`voice-turn:${clientKeyFromRequest(request)}`, 40, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  let body: TurnBody;
  try {
    body = (await request.json()) as TurnBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter(isTurnMessage)
    : [];
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "messages is required." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const pageState: PageState = body.pageState ?? {
    route: "/",
    hash: "",
    section: null,
    visibleTargets: [],
  };

  try {
    const result = await runTextTurn(messages, pageState);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Turn failed";
    return NextResponse.json(
      { error: message },
      { status: 502, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}

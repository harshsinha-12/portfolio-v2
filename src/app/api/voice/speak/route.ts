import { NextResponse } from "next/server";
import { speakText } from "@/voice/functions/speak-text";
import { isVoiceConfigured } from "@/voice/functions/openai";
import { clientKeyFromRequest, rateLimit } from "@/voice/functions/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isVoiceConfigured()) {
    return NextResponse.json(
      { error: "Voice is not configured. Set OPENAI_API_KEY." },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const limited = rateLimit(`voice-speak:${clientKeyFromRequest(request)}`, 40, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many speech requests." },
      { status: 429, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  let text = "";
  try {
    const body = (await request.json()) as { text?: unknown };
    text = typeof body.text === "string" ? body.text : "";
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const audio = await speakText(text);
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Speech failed";
    return NextResponse.json(
      { error: message },
      { status: 502, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}

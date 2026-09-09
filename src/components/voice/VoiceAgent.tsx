"use client";

import { useEffect, useRef, useState } from "react";
import { Keyboard, Mic, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceAgent, type VoiceStatus } from "@/components/voice/useVoiceAgent";
import { useVoiceLevels } from "@/components/voice/useVoiceLevels";
import { VoiceSpinner, VoiceWaveform } from "@/components/voice/VoiceWaveform";
import { VoiceHint, useVoiceHint } from "@/components/voice/VoiceHint";
import { VoicePreviewCard } from "@/components/voice/VoicePreviewCard";

const statusCopy: Record<VoiceStatus, string> = {
  idle: "Tap to talk",
  connecting: "Connecting…",
  listening: "Listening — go ahead",
  thinking: "Thinking…",
  speaking: "Speaking",
  error: "Try again",
};

export function VoiceAgent() {
  const [compose, setCompose] = useState(false);
  const [sheetHidden, setSheetHidden] = useState(false);
  const {
    open,
    setOpen,
    configured,
    status,
    error,
    live,
    micStream,
    remoteStream,
    transcript,
    draft,
    setDraft,
    connect,
    disconnect,
    sendText,
  } = useVoiceAgent({ speakTextReplies: true });
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isListening = status === "listening";
  const voiceActive = Boolean(live || micStream) || status === "connecting";
  const analyserOn = Boolean(micStream) && status !== "speaking" && status !== "thinking";
  const localLevels = useVoiceLevels(micStream, analyserOn);
  const remoteLevels = useVoiceLevels(remoteStream, status === "speaking");
  const levels = status === "speaking" ? remoteLevels : localLevels;
  const waveActive = isListening || status === "speaking";
  const spinning = status === "connecting" || status === "thinking";
  const ready = configured === true;
  const showSheet = !sheetHidden && (compose || (open && transcript.length > 0));
  const hintSuppressed = showSheet || voiceActive;
  const hint = useVoiceHint(hintSuppressed);
  const label = configured === false ? "Add OPENAI_API_KEY" : (error ?? statusCopy[status]);
  const showCaption =
    status === "connecting" || isListening || status === "thinking" || status === "speaking";

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const cards = node.querySelectorAll(".voice-preview, .article-preview--voice");
    const lastCard = cards[cards.length - 1];
    if (lastCard instanceof HTMLElement) {
      lastCard.scrollIntoView({ block: "start", inline: "nearest" });
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [transcript, status, showSheet]);

  useEffect(() => {
    if (compose) inputRef.current?.focus();
  }, [compose]);

  function stopVoice() {
    disconnect();
  }

  function hideSheet() {
    setSheetHidden(true);
    setCompose(false);
  }

  function revealSheet() {
    setSheetHidden(false);
    setOpen(true);
  }

  async function toggleTalk() {
    if (!ready) {
      hint.dismiss();
      revealSheet();
      setCompose(true);
      return;
    }
    if (voiceActive) {
      stopVoice();
      return;
    }
    hint.dismiss();
    revealSheet();
    await connect();
  }

  function tryTalkFromHint() {
    hint.dismiss();
    void toggleTalk();
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center px-3 sm:bottom-5">
      <VoiceHint
        visible={hint.visible}
        onDismiss={hint.dismiss}
        onTryTalk={tryTalkFromHint}
      />
      {showSheet ? (
        <section
          aria-label="Voice transcript"
          className="voice-sheet pointer-events-auto relative mb-2 w-[min(52rem,calc(100vw-1.5rem))] overflow-hidden rounded-[18px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] shadow-[3px_5px_0_var(--color-shadow)]"
        >
          <button
            type="button"
            onClick={hideSheet}
            aria-label="Hide transcript"
            className="voice-sheet__close absolute top-2 right-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-ink)]/6 hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <X size={14} strokeWidth={2.4} />
          </button>
          <div
            ref={scrollerRef}
            className="max-h-[min(26rem,56dvh)] space-y-2 overflow-y-auto px-3 py-3 pr-10"
          >
            {transcript.length === 0 ? (
              <p className="text-[12px] leading-snug text-[var(--color-ink-muted)]">
                Ask what Harsh builds, or say “open RecoveryOS.”
              </p>
            ) : (
              transcript.map((item) =>
                item.preview ? (
                  <VoicePreviewCard key={item.id} preview={item.preview} />
                ) : (
                  <p
                    key={item.id}
                    className={cn(
                      "text-[12px] leading-snug",
                      item.role === "user" && "text-[var(--color-ink)]",
                      item.role === "assistant" && "text-[var(--color-ink-muted)]",
                      item.role === "system" && "text-[var(--color-accent-hover)]",
                    )}
                  >
                    {item.text}
                  </p>
                ),
              )
            )}
          </div>
          {compose ? (
            <form
              className="flex items-center gap-1.5 border-t border-[var(--color-ink)]/8 px-2.5 py-2"
              onSubmit={(event) => {
                event.preventDefault();
                void sendText(draft);
              }}
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type instead…"
                disabled={spinning || !ready}
                className="min-w-0 flex-1 rounded-lg bg-transparent px-1.5 py-1 text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:opacity-60"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={spinning || !draft.trim() || !ready}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] disabled:opacity-35"
              >
                <Send size={12} strokeWidth={2.4} />
              </button>
            </form>
          ) : null}
        </section>
      ) : null}

      {showCaption ? (
        <p
          className={cn(
            "pointer-events-none mb-1.5 font-hand text-[15px] leading-none",
            isListening
              ? "text-[var(--color-accent-on-mat)]"
              : "text-[var(--color-on-mat)]/80",
          )}
          aria-live="polite"
        >
          {statusCopy[status]}
        </p>
      ) : null}

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => void toggleTalk()}
          disabled={configured === null}
          aria-label={isListening ? "Listening. Tap to stop voice." : voiceActive ? "Stop voice" : "Start voice"}
          aria-pressed={voiceActive}
          title={label}
          className={cn(
            "voice-pill flex h-11 min-w-[13.5rem] items-center gap-3 rounded-full py-2 pr-1.5 pl-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-on-mat)] disabled:opacity-70",
            status === "error" && "voice-pill--error",
            isListening && "voice-pill--listening",
            hint.visible && "voice-pill--nudge",
          )}
        >
          <VoiceWaveform levels={levels} active={waveActive} listening={isListening} />
          <span className="sr-only">{label}</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center">
            {spinning ? (
              <VoiceSpinner />
            ) : (
              <Mic
                size={15}
                strokeWidth={2.2}
                className={isListening ? "text-[var(--color-accent-on-mat)]" : "text-[var(--color-on-mat)]/70"}
              />
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            hint.dismiss();
            if (sheetHidden) {
              revealSheet();
              setCompose(true);
              return;
            }
            setCompose((value) => !value);
            revealSheet();
          }}
          aria-label={compose && !sheetHidden ? "Hide keyboard" : "Type a question"}
          aria-pressed={compose && !sheetHidden}
          className="voice-pill-side flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-paper)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          <Keyboard size={15} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

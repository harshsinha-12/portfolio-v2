"use client";

import { useEffect, useRef, useState } from "react";
import { Keyboard, Mic, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceAgent, type VoiceStatus } from "@/components/voice/useVoiceAgent";
import { useVoiceLevels } from "@/components/voice/useVoiceLevels";
import { VoiceSpinner, VoiceWaveform } from "@/components/voice/VoiceWaveform";
import { VoiceHint, useVoiceHint } from "@/components/voice/VoiceHint";
import { VoiceTranscript } from "@/components/voice/VoiceTranscript";
import {
  messageLooksLikeOutbound,
  reserveOutboundWindow,
} from "@/voice/functions/open-url";

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
  const dockRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
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
    if (!showSheet) {
      document.documentElement.style.scrollPaddingBottom = "";
      return;
    }
    const dock = dockRef.current;
    if (!dock) return;

    const apply = () => {
      document.documentElement.style.scrollPaddingBottom = `${Math.ceil(dock.getBoundingClientRect().height + 12)}px`;
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(dock);
    return () => {
      observer.disconnect();
      document.documentElement.style.scrollPaddingBottom = "";
    };
  }, [showSheet]);

  useEffect(() => {
    const pane = sheetRef.current;
    const scroller = scrollerRef.current;
    if (!showSheet || !pane) return;
    const sheetNode: HTMLElement = pane;

    let startY = 0;

    function onTouchStart(event: TouchEvent) {
      startY = event.touches[0]?.clientY ?? 0;
    }

    function onTouchMove(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      const point = event.touches[0];
      const target = event.target;
      if (!point || !(target instanceof Node) || !sheetNode.contains(target)) return;

      if (!scroller || !scroller.contains(target)) {
        event.preventDefault();
        return;
      }

      const delta = point.clientY - startY;
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const canScroll = scrollHeight > clientHeight + 1;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      if (!canScroll || (atTop && delta > 0) || (atBottom && delta < 0)) {
        event.preventDefault();
      }
    }

    sheetNode.addEventListener("touchstart", onTouchStart, { passive: true });
    sheetNode.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      sheetNode.removeEventListener("touchstart", onTouchStart);
      sheetNode.removeEventListener("touchmove", onTouchMove);
    };
  }, [showSheet]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const fromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    if (fromBottom < 96) {
      node.scrollTop = node.scrollHeight;
    }
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

  function startTalk() {
    if (ready && !voiceActive) {
      reserveOutboundWindow();
    }
    void toggleTalk();
  }

  function tryTalkFromHint() {
    hint.dismiss();
    startTalk();
  }

  return (
    <div
      ref={dockRef}
      className={cn(
        "fixed inset-x-0 bottom-4 z-50 flex flex-col items-center px-3 sm:bottom-5",
        showSheet ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <VoiceHint
        visible={hint.visible}
        onDismiss={hint.dismiss}
        onTryTalk={tryTalkFromHint}
      />
      {showSheet ? (
        <section
          ref={sheetRef}
          aria-label="Conversation"
          className="voice-sheet pointer-events-auto relative mb-2 flex max-h-[min(28rem,58dvh)] w-[min(52rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[18px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] shadow-[3px_5px_0_var(--color-shadow)]"
        >
          <button
            type="button"
            onClick={hideSheet}
            aria-label="Hide transcript"
            className="voice-sheet__close absolute top-2.5 right-2.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-ink)]/6 hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <X size={14} strokeWidth={2.4} />
          </button>
          <div
            ref={scrollerRef}
            className="voice-sheet__scroller min-h-0 flex-1 px-4 py-4 pr-11"
          >
            {transcript.length === 0 ? (
              <p className="voice-sheet__empty">
                Ask what Harsh builds, or say “open RecoveryOS.”
              </p>
            ) : (
              <VoiceTranscript items={transcript} />
            )}
          </div>
          {compose ? (
            <form
              className="flex shrink-0 items-center gap-1.5 border-t border-[var(--color-ink)]/8 px-3 py-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                if (messageLooksLikeOutbound(draft)) {
                  reserveOutboundWindow();
                }
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
          onClick={() => startTalk()}
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

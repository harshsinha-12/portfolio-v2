"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { collectPageState } from "@/voice/functions/collect-page-state";
import {
  captureMicrophone,
  stopMediaStream,
} from "@/voice/functions/capture-microphone";
import { executeSiteAction } from "@/voice/functions/execute-action";
import { previewFromAction } from "@/voice/functions/preview-from-action";
import { parseSiteAction } from "@/voice/tools";
import { connectRealtimeSession, type RealtimeConnection } from "@/voice/realtime/connect";
import {
  functionCallsFromResponse,
  type RealtimeServerEvent,
} from "@/voice/realtime/events";
import type {
  ChatTurnMessage,
  RealtimeSessionPayload,
  TextTurnResponse,
  VoiceTranscriptItem,
} from "@/voice/types";

export type VoiceStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

type UseVoiceAgentOptions = {
  speakTextReplies: boolean;
};

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload;
}

export function useVoiceAgent({ speakTextReplies }: UseVoiceAgentOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [transcript, setTranscript] = useState<VoiceTranscriptItem[]>([]);
  const [draft, setDraft] = useState("");

  const connectionRef = useRef<RealtimeConnection | null>(null);
  const chatRef = useRef<ChatTurnMessage[]>([]);
  const assistantBufferRef = useRef("");
  const assistantLineRef = useRef<string | null>(null);
  const speechRef = useRef<HTMLAudioElement | null>(null);
  const handlingToolsRef = useRef(false);
  const liveRef = useRef(false);
  const micStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    liveRef.current = live;
  }, [live]);

  useEffect(() => {
    micStreamRef.current = micStream;
  }, [micStream]);

  const actionContext = useCallback(
    () => ({
      pathname,
      navigate: (href: string) => router.push(href),
    }),
    [pathname, router],
  );

  const appendTranscript = useCallback((item: VoiceTranscriptItem) => {
    setTranscript((current) => [...current.slice(-40), item]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/voice/session", { cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json()) as { configured?: boolean };
        if (!cancelled) setConfigured(Boolean(body.configured));
      })
      .catch(() => {
        if (!cancelled) setConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stopSpeech = useCallback(() => {
    const speech = speechRef.current;
    if (!speech) return;
    speech.pause();
    speech.removeAttribute("src");
    speechRef.current = null;
  }, []);

  const playSpeech = useCallback(
    async (text: string) => {
      if (!speakTextReplies || liveRef.current || !text.trim()) return;
      stopSpeech();
      const response = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) return;
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      speechRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (speechRef.current === audio) {
          speechRef.current = null;
          setStatus((current) => (current === "speaking" ? "idle" : current));
        }
      };
      setStatus("speaking");
      await audio.play().catch(() => undefined);
    },
    [speakTextReplies, stopSpeech],
  );

  const runTool = useCallback(
    async (name: string, args: unknown) => {
      const action = parseSiteAction(name, args);
      const outcome = await executeSiteAction(action, actionContext());
      track("voice_tool_executed", {
        tool: action.type,
        ok: outcome.ok,
      });
      appendTranscript({
        id: newId("tool"),
        role: "system",
        text: outcome.message,
        toolName: action.type,
        preview: outcome.ok ? previewFromAction(action) : undefined,
      });
      return outcome;
    },
    [actionContext, appendTranscript],
  );

  const runTextLoop = useCallback(
    async (userText: string) => {
      setStatus("thinking");
      chatRef.current = [...chatRef.current, { role: "user", content: userText }];
      appendTranscript({ id: newId("user"), role: "user", text: userText });

      for (let round = 0; round < 4; round += 1) {
        const payload = await fetchJson<TextTurnResponse>("/api/voice/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatRef.current,
            pageState: collectPageState(),
          }),
        });

        if (payload.toolCalls.length > 0) {
          chatRef.current = [
            ...chatRef.current,
            {
              role: "assistant",
              content: payload.message,
              tool_calls: payload.toolCalls,
            },
          ];
          for (const call of payload.toolCalls) {
            try {
              const outcome = await runTool(call.function.name, call.function.arguments);
              chatRef.current = [
                ...chatRef.current,
                {
                  role: "tool",
                  tool_call_id: call.id,
                  content: JSON.stringify(outcome),
                },
              ];
            } catch (error) {
              const message = error instanceof Error ? error.message : "Tool failed";
              chatRef.current = [
                ...chatRef.current,
                {
                  role: "tool",
                  tool_call_id: call.id,
                  content: JSON.stringify({ ok: false, message }),
                },
              ];
            }
          }
          continue;
        }

        const reply = payload.message?.trim() || "Done.";
        chatRef.current = [...chatRef.current, { role: "assistant", content: reply }];
        appendTranscript({ id: newId("assistant"), role: "assistant", text: reply });
        await playSpeech(reply);
        if (!speakTextReplies) setStatus("idle");
        return;
      }

      setStatus("idle");
    },
    [appendTranscript, playSpeech, runTool, speakTextReplies],
  );

  const handleRealtimeEvent = useCallback(
    async (event: RealtimeServerEvent) => {
      if (event.type === "input_audio_buffer.speech_started") {
        setStatus("listening");
        return;
      }
      if (event.type === "response.created") {
        setStatus("thinking");
        assistantBufferRef.current = "";
        assistantLineRef.current = newId("assistant");
        return;
      }
      if (
        event.type === "response.output_audio_transcript.delta" ||
        event.type === "response.audio_transcript.delta"
      ) {
        setStatus("speaking");
        assistantBufferRef.current += event.delta ?? "";
        const lineId = assistantLineRef.current ?? newId("assistant");
        assistantLineRef.current = lineId;
        const text = assistantBufferRef.current;
        setTranscript((current) => {
          const existing = current.find((item) => item.id === lineId);
          if (!existing) {
            return [...current.slice(-40), { id: lineId, role: "assistant", text }];
          }
          return current.map((item) => (item.id === lineId ? { ...item, text } : item));
        });
        return;
      }
      if (event.type === "conversation.item.input_audio_transcription.completed") {
        const text = event.transcript?.trim();
        if (text) {
          appendTranscript({ id: newId("user"), role: "user", text });
          chatRef.current = [...chatRef.current, { role: "user", content: text }];
        }
        return;
      }
      if (event.type === "error") {
        setError(event.error?.message ?? "Voice session error");
        setStatus("error");
        track("voice_error", { source: "realtime" });
        return;
      }
      if (event.type !== "response.done") return;

      const calls = functionCallsFromResponse(event);
      const finalText = assistantBufferRef.current.trim();
      if (finalText) {
        chatRef.current = [...chatRef.current, { role: "assistant", content: finalText }];
      }
      assistantBufferRef.current = "";
      assistantLineRef.current = null;

      if (calls.length === 0) {
        setStatus("listening");
        return;
      }
      if (handlingToolsRef.current) return;
      handlingToolsRef.current = true;
      try {
        const results = [];
        for (const call of calls) {
          try {
            const outcome = await runTool(call.name, call.arguments);
            results.push({ callId: call.callId, output: JSON.stringify(outcome) });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Tool failed";
            results.push({
              callId: call.callId,
              output: JSON.stringify({ ok: false, message }),
            });
          }
        }
        connectionRef.current?.sendToolResults(results);
        connectionRef.current?.sendPageContext(JSON.stringify(collectPageState()));
      } finally {
        handlingToolsRef.current = false;
      }
    },
    [appendTranscript, runTool],
  );

  const disconnect = useCallback(() => {
    connectionRef.current?.close();
    connectionRef.current = null;
    stopMediaStream(micStream);
    setMicStream(null);
    setRemoteStream(null);
    setLive(false);
    setStatus("idle");
    stopSpeech();
  }, [micStream, stopSpeech]);

  const connect = useCallback(async () => {
    if (connectionRef.current || status === "connecting") return;
    setError(null);
    setStatus("connecting");
    let stream: MediaStream | null = null;
    try {
      stream = await captureMicrophone();
      setMicStream(stream);
      const session = await fetchJson<RealtimeSessionPayload>("/api/voice/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageState: collectPageState() }),
      });
      const connection = await connectRealtimeSession(
        session.clientSecret,
        {
          onEvent: (event) => {
            void handleRealtimeEvent(event);
          },
          onRemoteStream: setRemoteStream,
          onConnectionChange: (openConnection) => {
            setLive(openConnection);
            if (openConnection) {
              setStatus("listening");
              connectionRef.current?.sendPageContext(JSON.stringify(collectPageState()));
            } else if (connectionRef.current) {
              setStatus("idle");
            }
          },
        },
        stream,
      );
      connectionRef.current = connection;
      connection.sendPageContext(JSON.stringify(collectPageState()));
      track("voice_session_started", { model: session.model });
    } catch (caught) {
      stopMediaStream(stream);
      setMicStream(null);
      setRemoteStream(null);
      const message = caught instanceof Error ? caught.message : "Could not start voice";
      setError(message);
      setStatus("error");
      setLive(false);
      track("voice_error", { source: "connect" });
    }
  }, [handleRealtimeEvent, status]);

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setDraft("");
      setError(null);
      stopSpeech();
      if (connectionRef.current) {
        appendTranscript({ id: newId("user"), role: "user", text: trimmed });
        chatRef.current = [...chatRef.current, { role: "user", content: trimmed }];
        connectionRef.current.sendPageContext(JSON.stringify(collectPageState()));
        connectionRef.current.sendText(trimmed);
        setStatus("thinking");
        return;
      }
      try {
        await runTextLoop(trimmed);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "Could not answer";
        setError(message);
        setStatus("error");
      }
    },
    [appendTranscript, runTextLoop, stopSpeech],
  );

  useEffect(() => {
    return () => {
      connectionRef.current?.close();
      stopMediaStream(micStreamRef.current);
      stopSpeech();
    };
  }, [stopSpeech]);

  return {
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
  };
}

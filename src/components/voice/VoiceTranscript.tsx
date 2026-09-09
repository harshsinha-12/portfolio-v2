"use client";

import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoicePreviewCard } from "@/components/voice/VoicePreviewCard";
import type { VoiceTranscriptItem, VoiceTranscriptRole } from "@/voice/types";

type TurnRole = "user" | "assistant";

type TranscriptTurn = {
  id: string;
  role: TurnRole;
  items: VoiceTranscriptItem[];
};

function turnRole(item: VoiceTranscriptItem): TurnRole {
  return item.role === "user" ? "user" : "assistant";
}

function groupTurns(items: VoiceTranscriptItem[]): TranscriptTurn[] {
  const turns: TranscriptTurn[] = [];
  for (const item of items) {
    const role = turnRole(item);
    const last = turns.at(-1);
    if (last && last.role === role) {
      last.items.push(item);
      continue;
    }
    turns.push({ id: item.id, role, items: [item] });
  }
  return turns;
}

function TurnAvatar({ role }: { role: TurnRole }) {
  const Icon = role === "user" ? User : Sparkles;
  return (
    <span
      className={cn(
        "voice-turn__avatar",
        role === "user" ? "voice-turn__avatar--you" : "voice-turn__avatar--agent",
      )}
      aria-hidden="true"
    >
      <Icon size={11} strokeWidth={2.4} />
    </span>
  );
}

function TurnBody({ item }: { item: VoiceTranscriptItem }) {
  if (item.preview) {
    return <VoicePreviewCard preview={item.preview} />;
  }

  if (!item.text.trim()) return null;

  const kind: VoiceTranscriptRole = item.role;
  return (
    <p
      className={cn(
        kind === "user" && "voice-turn__ask",
        kind === "assistant" && "voice-turn__reply",
        kind === "system" && "voice-turn__note",
      )}
    >
      {item.text}
    </p>
  );
}

export function VoiceTranscript({ items }: { items: VoiceTranscriptItem[] }) {
  const turns = groupTurns(items);

  return (
    <div className="voice-log" role="log" aria-live="polite" aria-relevant="additions">
      {turns.map((turn) => (
        <article
          key={turn.id}
          className={cn("voice-turn", turn.role === "user" && "voice-turn--user")}
          aria-label={turn.role === "user" ? "You asked" : "Agent replied"}
        >
          <TurnAvatar role={turn.role} />
          <p className="voice-turn__who">{turn.role === "user" ? "You asked" : "Agent"}</p>
          <div className="voice-turn__body">
            {turn.items.map((item) => (
              <TurnBody key={item.id} item={item} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

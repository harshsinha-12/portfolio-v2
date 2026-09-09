"use client";

import { cn } from "@/lib/utils";
import { VOICE_BAR_COUNT } from "@/components/voice/useVoiceLevels";

const REST_SIZE = 4;
const MAX_HEIGHT = 18;

export function VoiceWaveform({
  levels,
  active,
  listening = false,
}: {
  levels: number[];
  active: boolean;
  listening?: boolean;
}) {
  const bars = Array.from({ length: VOICE_BAR_COUNT }, (_, index) => levels[index] ?? 0);

  return (
    <div
      className={cn("voice-wave flex h-[18px] flex-1 items-center justify-center gap-[3px]", listening && "voice-wave--listening")}
      aria-hidden="true"
    >
      {bars.map((level, index) => {
        const height = REST_SIZE + level * (MAX_HEIGHT - REST_SIZE);
        const live = active && level > 0.08;
        return (
          <span
            key={index}
            className={cn(
              "voice-wave__bar",
              listening && "voice-wave__bar--armed",
              live && "voice-wave__bar--live",
            )}
            style={{
              width: REST_SIZE,
              height,
              borderRadius: live ? 1.5 : 1,
            }}
          />
        );
      })}
    </div>
  );
}

export function VoiceSpinner({ className }: { className?: string }) {
  return (
    <span className={cn("voice-spinner", className)} aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} style={{ transform: `rotate(${index * 36}deg)` }} />
      ))}
    </span>
  );
}

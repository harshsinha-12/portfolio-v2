"use client";

import { useRef } from "react";
import { TimelineSteamTrain } from "@/components/decor/TimelineSteamTrain";
import { useHoverLoopSound } from "@/components/decor/useHoverLoopSound";

const TRAIN_SOUND_SRC = "/assets/sounds/train-chukchuk.mp3";

export function TimelineTrainDecal() {
  const trainRef = useRef<HTMLDivElement>(null);
  const { handlers } = useHoverLoopSound(TRAIN_SOUND_SRC, trainRef);

  return (
    <div
      ref={trainRef}
      className="pointer-events-auto absolute top-0 z-30 cursor-default max-xl:pointer-events-none"
      style={{
        left: "calc(var(--logo-w) / 2)",
        top: "calc(var(--logo-w) - 1rem)",
        transform: "translateX(-50%)",
      }}
      role="img"
      aria-label="Steam train at the start of the experience timeline"
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
    >
      <div className="timeline-train-idle">
        <TimelineSteamTrain />
      </div>
    </div>
  );
}

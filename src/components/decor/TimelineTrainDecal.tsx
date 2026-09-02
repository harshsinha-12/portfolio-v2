"use client";

import { useRef } from "react";
import { TimelineSteamTrain } from "@/components/decor/TimelineSteamTrain";
import { useHoverLoopSound } from "@/components/decor/useHoverLoopSound";
import { useCanHover } from "@/components/decor/useStickerLayout";
import { cn } from "@/lib/utils";

const TRAIN_SOUND_SRC = "/assets/sounds/train-chukchuk.mp3";

export function TimelineTrainDecal() {
  const trainRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();
  const { handlers } = useHoverLoopSound(TRAIN_SOUND_SRC, trainRef);

  return (
    <div
      ref={trainRef}
      className={cn(
        "pointer-events-auto absolute top-0 z-30 touch-manipulation",
        canHover ? "cursor-default" : "cursor-pointer",
      )}
      style={{
        left: "calc(var(--logo-w) / 2)",
        top: "calc(var(--logo-w) - 1rem)",
        transform: "translateX(-50%)",
      }}
      role={canHover ? "img" : "button"}
      aria-label="Steam train at the start of the experience timeline"
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      onClick={() => handlers.onTap()}
    >
      <div className="timeline-train-idle">
        <TimelineSteamTrain />
      </div>
    </div>
  );
}

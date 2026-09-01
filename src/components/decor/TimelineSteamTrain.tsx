import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type TimelineSteamTrainProps = {
  className?: string;
  style?: CSSProperties;
};

const steamPuffs = [
  "timeline-steam-puff--1",
  "timeline-steam-puff--2",
  "timeline-steam-puff--3",
];

export function TimelineSteamTrain({ className, style }: TimelineSteamTrainProps) {
  return (
    <div
      className={cn("timeline-steam-train pointer-events-none relative h-28 w-12", className)}
      style={style}
      aria-hidden="true"
    >
      <div className="timeline-steam-plume absolute inset-0">
        {steamPuffs.map((puffClass) => (
          <Image
            key={puffClass}
            src="/assets/timeline/timeline-steam-puff.png"
            alt=""
            width={64}
            height={61}
            sizes="18px"
            className={cn("timeline-steam-puff", puffClass)}
          />
        ))}
      </div>

      <Image
        src="/assets/timeline/timeline-steam-engine.webp"
        alt=""
        width={144}
        height={325}
        sizes="36px"
        className="timeline-steam-engine absolute bottom-0 left-1/2 h-auto w-9 -translate-x-1/2"
      />
    </div>
  );
}

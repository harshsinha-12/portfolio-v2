import { TimelineSteamTrain } from "@/components/decor/TimelineSteamTrain";

export function TimelineTrainDecal() {
  return (
    <div
      className="pointer-events-none absolute top-0 z-30"
      style={{
        left: "calc(var(--logo-w) / 2)",
        top: "calc(var(--logo-w) - 1rem)",
        transform: "translateX(-50%)",
      }}
      role="img"
      aria-label="Steam train at the start of the experience timeline"
    >
      <div className="timeline-train-idle">
        <TimelineSteamTrain />
      </div>
    </div>
  );
}

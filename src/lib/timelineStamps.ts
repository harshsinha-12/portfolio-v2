import { achievements } from "@/data/portfolio";

export type StampPlacement = {
  src: string;
  top: string;
  right: string;
  rotate: number;
};

const STAMP_SLOTS: Omit<StampPlacement, "src" | "rotate">[] = [
  { top: "6%", right: "2%" },
  { top: "38%", right: "0%" },
  { top: "22%", right: "10%" },
];

const ROTATION_OFFSETS = [-8, 11, -4, 7, -12, 5];

export const timelineStampPool = [
  ...new Set(
    achievements.flatMap((item) => [item.photo, item.icon].filter(Boolean) as string[]),
  ),
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getTimelineStamps(entryId: string, count = 2): StampPlacement[] {
  const stampCount = Math.max(2, count);
  if (timelineStampPool.length === 0) return [];

  return Array.from({ length: stampCount }, (_, index) => {
    const seed = hashString(`${entryId}-${index}`);
    const slot = STAMP_SLOTS[index % STAMP_SLOTS.length];
    const src = timelineStampPool[seed % timelineStampPool.length];
    const rotate = ROTATION_OFFSETS[(seed + index) % ROTATION_OFFSETS.length];

    return {
      src,
      top: slot.top,
      right: slot.right,
      rotate,
    };
  });
}

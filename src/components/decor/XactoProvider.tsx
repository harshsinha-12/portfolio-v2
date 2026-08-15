"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Point = {
  x: number;
  y: number;
};

export type CutTarget = {
  sampler: () => Point[];
  onCut: (at: Point) => void;
};

type ScratchStroke =
  | { kind: "drawing"; id: number; points: Point[] }
  | { kind: "healing"; id: number; points: Point[] };

type XactoContextValue = {
  addScratchPoint: (point: Point) => void;
  endStroke: () => void;
  registerCutTarget: (id: string, target: CutTarget) => () => void;
  testCut: (from: Point, to: Point, speed: number) => void;
  strokes: ScratchStroke[];
};

const MIN_SCRATCH_DIST_PX = 2;
const HOLD_MS = 1000;
const HEAL_MS = 1200;
const CUT_SPEED_PX_PER_MS = 0.55;
const HIT_RADIUS_PX = 18;

const XactoContext = createContext<XactoContextValue | null>(null);

export function useXacto(): XactoContextValue {
  const ctx = useContext(XactoContext);
  if (!ctx) {
    throw new Error("useXacto must be used within XactoProvider");
  }
  return ctx;
}

function nextStrokeId(counter: { current: number }): number {
  counter.current += 1;
  return counter.current;
}

function distPointToSegment(point: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(point.x - a.x, point.y - a.y);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / len2));
  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy));
}

export function XactoScratchLayer() {
  const { strokes } = useXacto();

  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-0 h-full w-full"
      aria-hidden="true"
    >
      {strokes.map((stroke) => {
        if (stroke.points.length < 2) return null;
        return (
          <polyline
            key={stroke.id}
            className={stroke.kind === "healing" ? "mat-scratch-heal" : undefined}
            points={stroke.points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="var(--color-scratch)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.7}
          />
        );
      })}
    </svg>
  );
}

export function XactoProvider({ children }: { children: ReactNode }) {
  const [strokes, setStrokes] = useState<ScratchStroke[]>([]);
  const strokeId = useRef(0);
  const targetsRef = useRef(new Map<string, CutTarget>());
  const scheduledHeal = useRef(new Set<number>());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const addScratchPoint = useCallback((point: Point) => {
    const mapped = {
      x: point.x + window.scrollX,
      y: point.y + window.scrollY,
    };
    setStrokes((prev) => {
      const active = prev.find((stroke) => stroke.kind === "drawing");
      if (!active) {
        return [...prev, { kind: "drawing", id: nextStrokeId(strokeId), points: [mapped] }];
      }
      const last = active.points[active.points.length - 1];
      if (last && Math.hypot(mapped.x - last.x, mapped.y - last.y) < MIN_SCRATCH_DIST_PX) {
        return prev;
      }
      return prev.map((stroke) =>
        stroke.kind === "drawing" && stroke.id === active.id
          ? { ...stroke, points: [...stroke.points, mapped] }
          : stroke,
      );
    });
  }, []);

  const endStroke = useCallback(() => {
    setStrokes((prev) =>
      prev.map((stroke) =>
        stroke.kind === "drawing" ? { kind: "healing", id: stroke.id, points: stroke.points } : stroke,
      ),
    );
  }, []);

  useEffect(() => {
    for (const stroke of strokes) {
      if (stroke.kind !== "healing" || scheduledHeal.current.has(stroke.id)) continue;
      scheduledHeal.current.add(stroke.id);
      window.setTimeout(() => {
        if (!mountedRef.current) return;
        scheduledHeal.current.delete(stroke.id);
        setStrokes((prev) => prev.filter((s) => s.id !== stroke.id));
      }, HOLD_MS + HEAL_MS);
    }
  }, [strokes]);

  const registerCutTarget = useCallback((id: string, target: CutTarget) => {
    targetsRef.current.set(id, target);
    return () => {
      targetsRef.current.delete(id);
    };
  }, []);

  const testCut = useCallback((from: Point, to: Point, speed: number) => {
    if (speed < CUT_SPEED_PX_PER_MS) return;
    for (const target of targetsRef.current.values()) {
      const samples = target.sampler();
      for (const sample of samples) {
        if (distPointToSegment(sample, from, to) <= HIT_RADIUS_PX) {
          target.onCut(sample);
          return;
        }
      }
    }
  }, []);

  const value = useMemo(
    () => ({ addScratchPoint, endStroke, registerCutTarget, testCut, strokes }),
    [addScratchPoint, endStroke, registerCutTarget, testCut, strokes],
  );

  return <XactoContext.Provider value={value}>{children}</XactoContext.Provider>;
}

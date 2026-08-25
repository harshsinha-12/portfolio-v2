"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WashiTape } from "@/components/decor/PushPin";
import { useXacto, type Point } from "@/components/decor/XactoProvider";
import { track } from "@/lib/analytics";
import { playPortfolioSound } from "@/lib/portfolio-sounds";

const ROPE_PATH = "M 0 5 Q 50 30 100 5";
const ROPE_VIEW_H = 36;
const ROPE_Y_ANCHOR = 5;
const ROPE_Y_SAG = 30;
const WIRE_CONTAINER_H_PX = 64;

const CLIP_SPRING_FROM_TOP_FALLBACK = 27;
const CLIP_JAW_OVERLAP_FALLBACK = 22;
const CLIP_SOURCE_PX = 960;
// Square source is object-cover'd to --clip-height, so sizes must match the
// covering edge (6rem), not the CSS width (3.25rem). Otherwise Next serves a
// ~52px bitmap that is then upscaled to 96px and looks blurry on desktop.
const CLIP_COVER_SIZES = "6rem";
const ROPE_SAMPLE_STEPS = 40;
const ROPE_SNAP_HOLD_MS = 3200;
const ROPE_HEAL_MS = 700;
const HACKATHON_ROPE_TARGET = "hackathon-rope";

type RopeStatus =
  | { kind: "intact" }
  | { kind: "cut"; phase: "snapped" | "healing"; leftPoints: string; rightPoints: string };

function samplePathInViewport(path: SVGPathElement): Point[] {
  const length = path.getTotalLength();
  const ctm = path.getScreenCTM();
  if (!ctm || length === 0) return [];
  const steps = Math.max(ROPE_SAMPLE_STEPS, Math.ceil(length / 4));
  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = path.getPointAtLength((i / steps) * length);
    const mapped = new DOMPoint(p.x, p.y).matrixTransform(ctm);
    points.push({ x: mapped.x, y: mapped.y });
  }
  return points;
}

function polylineFromPath(path: SVGPathElement, fromStep: number, toStep: number, steps: number): string {
  const length = path.getTotalLength();
  if (length === 0 || toStep < fromStep) return "";
  const coords: string[] = [];
  for (let i = fromStep; i <= toStep; i++) {
    const p = path.getPointAtLength((i / steps) * length);
    coords.push(`${p.x},${p.y}`);
  }
  return coords.join(" ");
}

function splitPathAtPoint(path: SVGPathElement, at: Point): { leftPoints: string; rightPoints: string } | null {
  const samples = samplePathInViewport(path);
  if (samples.length < 2) return null;
  let closest = 0;
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    if (!sample) continue;
    const d = Math.hypot(sample.x - at.x, sample.y - at.y);
    if (d < best) {
      best = d;
      closest = i;
    }
  }
  const steps = samples.length - 1;
  const split = Math.min(steps - 1, Math.max(1, closest));
  return {
    leftPoints: polylineFromPath(path, 0, split, steps),
    rightPoints: polylineFromPath(path, split, steps, steps),
  };
}

type SlotLayout = {
  marginTop: number;
  clipTop: number;
};

function wireYAtPercent(pct: number, containerPx: number): number {
  const t = pct / 100;
  const y =
    (1 - t) ** 2 * ROPE_Y_ANCHOR +
    2 * (1 - t) * t * ROPE_Y_SAG +
    t ** 2 * ROPE_Y_ANCHOR;
  return (y / ROPE_VIEW_H) * containerPx;
}

function slotWirePercent(index: number, total: number): number {
  if (total <= 1) return 50;
  return 10 + (index / (total - 1)) * 80;
}

function parseCssLength(raw: string, rootFontSize: number): number | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.endsWith("rem")) return parseFloat(value) * rootFontSize;
  if (value.endsWith("px")) return parseFloat(value);
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getClipLayoutConstants(): { springFromTop: number; jawOverlap: number } {
  if (typeof window === "undefined") {
    return {
      springFromTop: CLIP_SPRING_FROM_TOP_FALLBACK,
      jawOverlap: CLIP_JAW_OVERLAP_FALLBACK,
    };
  }

  const style = getComputedStyle(document.documentElement);
  const rootFontSize = parseFloat(style.fontSize) || 16;

  return {
    springFromTop:
      parseCssLength(style.getPropertyValue("--clip-spring-from-top"), rootFontSize) ??
      CLIP_SPRING_FROM_TOP_FALLBACK,
    jawOverlap:
      parseCssLength(style.getPropertyValue("--clip-jaw-overlap"), rootFontSize) ??
      CLIP_JAW_OVERLAP_FALLBACK,
  };
}

function computeSlotLayout(
  wireY: number,
  springFromTop: number,
  jawOverlap: number,
): SlotLayout {
  return {
    marginTop: wireY + jawOverlap,
    clipTop: -(springFromTop + jawOverlap),
  };
}

function getEstimatedHangingLayout(index: number, total: number): SlotLayout {
  const wireY = wireYAtPercent(slotWirePercent(index, total), WIRE_CONTAINER_H_PX);
  const { springFromTop, jawOverlap } = getClipLayoutConstants();
  return computeSlotLayout(wireY, springFromTop, jawOverlap);
}

/** Symmetric fan tilt: outer cards lean inward toward center. */
export function getClotheslineFanRotation(index: number, total: number): number {
  if (total <= 1) return 0;
  const center = (total - 1) / 2;
  if (center === 0) return 0;
  const maxTilt = 2;
  return (-(index - center) * maxTilt) / center;
}

type ClotheslineLayoutContextValue = {
  layouts: SlotLayout[];
  registerSlot: (index: number, el: HTMLDivElement | null) => void;
  slotCount: number;
  ropeCut: boolean;
};

const ClotheslineLayoutContext = createContext<ClotheslineLayoutContextValue | null>(null);

function useClotheslineLayout() {
  const ctx = useContext(ClotheslineLayoutContext);
  if (!ctx) {
    throw new Error("HangingSlot must be used within Clothesline");
  }
  return ctx;
}

export function Clothespin({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0", className)}>
      {/* grip shadow where jaws meet the polaroid */}
      <div
        className="absolute bottom-[8%] left-1/2 z-0 h-2.5 w-[72%] -translate-x-1/2 rounded-full bg-[var(--color-shadow)] opacity-65 blur-[4px]"
        aria-hidden="true"
      />
      <Image
        src="/clip.webp"
        alt=""
        width={CLIP_SOURCE_PX}
        height={CLIP_SOURCE_PX}
        sizes={CLIP_COVER_SIZES}
        quality={90}
        className="relative z-[1] h-[var(--clip-height)] w-[var(--clip-width)] object-cover object-top drop-shadow-[0_3px_4px_var(--color-clothespin-shadow)]"
        aria-hidden="true"
      />
    </div>
  );
}

type ClotheslineProps = {
  children: React.ReactNode;
  className?: string;
  swapKey?: number;
};

type RopeStrokeLayersProps =
  | { kind: "path"; d: string }
  | { kind: "polyline"; points: string };

function RopeStrokeLayers(props: RopeStrokeLayersProps) {
  switch (props.kind) {
    case "path":
      return (
        <>
          <path
            d={props.d}
            fill="none"
            stroke="var(--color-twine-shadow)"
            strokeWidth="2.4"
            strokeLinecap="round"
            transform="translate(0 0.6)"
          />
          <path
            d={props.d}
            fill="none"
            stroke="var(--color-twine)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#rope-roughness)"
          />
          <path
            d={props.d}
            fill="none"
            stroke="var(--color-twine-highlight)"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeDasharray="1.8 2.6 0.9 3.1"
            transform="translate(0 -0.25)"
          />
          <path
            d={props.d}
            fill="none"
            stroke="var(--color-twine-fiber)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray="0.4 1.8"
            transform="translate(0 0.35)"
          />
        </>
      );
    case "polyline":
      return (
        <>
          <polyline
            points={props.points}
            fill="none"
            stroke="var(--color-twine-shadow)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0 0.6)"
          />
          <polyline
            points={props.points}
            fill="none"
            stroke="var(--color-twine)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#rope-roughness)"
          />
          <polyline
            points={props.points}
            fill="none"
            stroke="var(--color-twine-highlight)"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1.8 2.6 0.9 3.1"
            transform="translate(0 -0.25)"
          />
          <polyline
            points={props.points}
            fill="none"
            stroke="var(--color-twine-fiber)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0.4 1.8"
            transform="translate(0 0.35)"
          />
        </>
      );
    default: {
      const _exhaustive: never = props;
      return _exhaustive;
    }
  }
}

type RopeWireProps = {
  pathRef: RefObject<SVGPathElement | null>;
  status: RopeStatus;
};

function RopeVisible({ status, cutClass }: { status: RopeStatus; cutClass?: string }) {
  switch (status.kind) {
    case "intact":
      return <RopeStrokeLayers kind="path" d={ROPE_PATH} />;
    case "cut":
      return (
        <>
          <g className={cn("rope-cut-left", cutClass)}>
            <RopeStrokeLayers kind="polyline" points={status.leftPoints} />
          </g>
          <g className={cn("rope-cut-right", cutClass)}>
            <RopeStrokeLayers kind="polyline" points={status.rightPoints} />
          </g>
        </>
      );
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function RopeWire({ pathRef, status }: RopeWireProps) {
  const cutClass = status.kind === "cut" && status.phase === "healing" ? "is-healing" : undefined;

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 36"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="rope-roughness" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.45" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={ROPE_PATH}
        fill="none"
        stroke="transparent"
        strokeWidth="2"
      />

      <RopeVisible status={status} cutClass={cutClass} />
    </svg>
  );
}

export function Clothesline({ children, className, swapKey = 0 }: ClotheslineProps) {
  const edgeWireY = wireYAtPercent(4, WIRE_CONTAINER_H_PX);
  const ropeRef = useRef<HTMLDivElement>(null);
  const ropePathRef = useRef<SVGPathElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [layouts, setLayouts] = useState<SlotLayout[]>([]);
  const [ropeStatus, setRopeStatus] = useState<RopeStatus>({ kind: "intact" });
  const [statusSwapKey, setStatusSwapKey] = useState(swapKey);
  const ropeStatusRef = useRef<RopeStatus>(ropeStatus);
  const slotCount = Array.isArray(children) ? children.length : children ? 1 : 0;
  const { registerCutTarget } = useXacto();

  if (statusSwapKey !== swapKey) {
    setStatusSwapKey(swapKey);
    setRopeStatus({ kind: "intact" });
  }

  const ropeCut = ropeStatus.kind === "cut" && ropeStatus.phase === "snapped";

  const measureLayouts = useCallback(() => {
    const rope = ropeRef.current;
    if (!rope || slotRefs.current.size === 0) return;

    const ropeRect = rope.getBoundingClientRect();
    if (ropeRect.width <= 0) return;

    const { springFromTop, jawOverlap } = getClipLayoutConstants();
    const nextLayouts: SlotLayout[] = [];

    for (const [index, slot] of [...slotRefs.current.entries()].sort(([a], [b]) => a - b)) {
      const slotRect = slot.getBoundingClientRect();
      const centerX = slotRect.left + slotRect.width / 2;
      const pct = ((centerX - ropeRect.left) / ropeRect.width) * 100;
      const wireY = wireYAtPercent(pct, WIRE_CONTAINER_H_PX);
      nextLayouts[index] = computeSlotLayout(wireY, springFromTop, jawOverlap);
    }

    setLayouts(nextLayouts);
  }, []);

  const registerSlot = useCallback(
    (index: number, el: HTMLDivElement | null) => {
      if (el) slotRefs.current.set(index, el);
      else slotRefs.current.delete(index);
      measureLayouts();
    },
    [measureLayouts],
  );

  useLayoutEffect(() => {
    measureLayouts();

    const rope = ropeRef.current;
    const row = rowRef.current;
    if (!rope || !row) return;

    const observer = new ResizeObserver(measureLayouts);
    observer.observe(rope);
    observer.observe(row);
    slotRefs.current.forEach((slot) => observer.observe(slot));

    return () => observer.disconnect();
  }, [measureLayouts, swapKey, slotCount]);

  useEffect(() => {
    ropeStatusRef.current = ropeStatus;
  }, [ropeStatus]);

  useLayoutEffect(() => {
    return registerCutTarget(HACKATHON_ROPE_TARGET, {
      sampler: () => {
        const path = ropePathRef.current;
        if (!path) return [];
        return samplePathInViewport(path);
      },
      onCut: (at) => {
        if (ropeStatusRef.current.kind !== "intact") return;
        const path = ropePathRef.current;
        if (!path) return;
        const split = splitPathAtPoint(path, at);
        if (!split) return;
        playPortfolioSound("cut");
        playPortfolioSound("fall");
        track("rope_cut", { section: "achievements" });
        setRopeStatus({ kind: "cut", phase: "snapped", ...split });
      },
    });
  }, [registerCutTarget]);

  useEffect(() => {
    switch (ropeStatus.kind) {
      case "intact":
        return;
      case "cut": {
        switch (ropeStatus.phase) {
          case "snapped": {
            const timer = window.setTimeout(() => {
              setRopeStatus((prev) => (prev.kind === "cut" ? { ...prev, phase: "healing" } : prev));
            }, ROPE_SNAP_HOLD_MS);
            return () => window.clearTimeout(timer);
          }
          case "healing": {
            playPortfolioSound("swoosh");
            const timer = window.setTimeout(() => {
              setRopeStatus({ kind: "intact" });
            }, ROPE_HEAL_MS);
            return () => window.clearTimeout(timer);
          }
          default: {
            const _exhaustive: never = ropeStatus.phase;
            return _exhaustive;
          }
        }
      }
      default: {
        const _exhaustive: never = ropeStatus;
        return _exhaustive;
      }
    }
  }, [ropeStatus]);

  return (
    <ClotheslineLayoutContext.Provider value={{ layouts, registerSlot, slotCount, ropeCut }}>
      <div
        className={cn(
          "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
          className,
        )}
      >
        <div
          key={swapKey}
          className="clothesline-swap relative px-5 sm:px-3 md:px-4"
          role="list"
          aria-live="polite"
        >
          {/* Rope behind clips (z-20), polaroids sit below in document flow */}
          <div
            ref={ropeRef}
            data-rope
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16"
            aria-hidden="true"
          >
            <RopeWire pathRef={ropePathRef} status={ropeStatus} />

            <div
              className="absolute left-[3%] z-30"
              style={{ top: `${Math.max(edgeWireY - 8, 2)}px` }}
            >
              <WashiTape className="!relative !h-4 !w-14 opacity-80" rotation={-16} />
            </div>
            <div
              className="absolute right-[3%] z-30"
              style={{ top: `${Math.max(edgeWireY - 8, 2)}px` }}
            >
              <WashiTape className="!relative !h-4 !w-14 opacity-80" rotation={14} />
            </div>
          </div>

          <div
            ref={rowRef}
            className="relative flex items-start justify-center gap-3 sm:gap-5 md:gap-6 lg:gap-8"
          >
            {children}
          </div>
        </div>
      </div>
    </ClotheslineLayoutContext.Provider>
  );
}

type HangingSlotProps = {
  children: ReactNode;
  index: number;
  total?: number;
  className?: string;
};

export function HangingSlot({ children, index, total, className }: HangingSlotProps) {
  const { layouts, registerSlot, slotCount, ropeCut } = useClotheslineLayout();
  const slotRef = useRef<HTMLDivElement>(null);
  const resolvedTotal = total ?? slotCount;
  const measuredLayout = layouts[index];
  const layout = measuredLayout ?? getEstimatedHangingLayout(index, resolvedTotal);
  const cutStyle: CSSProperties & {
    "--cut-delay": string;
    "--cut-tilt": string;
    "--sway-delay": string;
  } = {
    "--cut-delay": `${index * 45}ms`,
    "--cut-tilt": `${index % 2 === 0 ? 7 : -9}deg`,
    "--sway-delay": `${(index * -0.9).toFixed(2)}s`,
  };

  useLayoutEffect(() => {
    registerSlot(index, slotRef.current);
    return () => registerSlot(index, null);
  }, [index, registerSlot]);

  return (
    <div
      ref={slotRef}
      className={cn(
        "flex min-w-0 max-w-[calc(50%-0.375rem)] flex-1 flex-col items-center sm:max-w-[16rem] lg:max-w-[12.5rem] xl:max-w-[13.5rem]",
        className,
      )}
      style={{ marginTop: layout.marginTop }}
      role="listitem"
    >
      <div
        className={cn("hanging-slot-inner relative w-full", ropeCut && "is-cut")}
        style={cutStyle}
      >
        {/* Polaroid entirely below the rope */}
        <div className={cn("relative z-10 polaroid-sway", ropeCut && "polaroid-sway-paused")}>{children}</div>

        {/* Clip straddles rope: mostly above, jaw grips polaroid top (z-30 over rope) */}
        <div
          className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
          style={{ top: layout.clipTop }}
        >
          <Clothespin />
        </div>
      </div>
    </div>
  );
}

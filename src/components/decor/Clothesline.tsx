"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WashiTape } from "@/components/decor/PushPin";

const ROPE_PATH = "M 0 5 Q 50 30 100 5";
const ROPE_VIEW_H = 36;
const ROPE_Y_ANCHOR = 5;
const ROPE_Y_SAG = 30;
const WIRE_CONTAINER_H_PX = 64;

const CLIP_SPRING_FROM_TOP_FALLBACK = 27;
const CLIP_JAW_OVERLAP_FALLBACK = 22;

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
        width={88}
        height={140}
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

function RopeWire() {
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
        d={ROPE_PATH}
        fill="none"
        stroke="var(--color-twine-shadow)"
        strokeWidth="2.4"
        strokeLinecap="round"
        transform="translate(0 0.6)"
      />
      <path
        d={ROPE_PATH}
        fill="none"
        stroke="var(--color-twine)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#rope-roughness)"
      />
      <path
        d={ROPE_PATH}
        fill="none"
        stroke="var(--color-twine-highlight)"
        strokeWidth="0.85"
        strokeLinecap="round"
        strokeDasharray="1.8 2.6 0.9 3.1"
        transform="translate(0 -0.25)"
      />
      <path
        d={ROPE_PATH}
        fill="none"
        stroke="var(--color-twine-fiber)"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeDasharray="0.4 1.8"
        transform="translate(0 0.35)"
      />
    </svg>
  );
}

export function Clothesline({ children, className, swapKey = 0 }: ClotheslineProps) {
  const edgeWireY = wireYAtPercent(4, WIRE_CONTAINER_H_PX);
  const ropeRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [layouts, setLayouts] = useState<SlotLayout[]>([]);
  const slotCount = Array.isArray(children) ? children.length : children ? 1 : 0;

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

  return (
    <ClotheslineLayoutContext.Provider value={{ layouts, registerSlot, slotCount }}>
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
            <RopeWire />

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
  const { layouts, registerSlot, slotCount } = useClotheslineLayout();
  const slotRef = useRef<HTMLDivElement>(null);
  const resolvedTotal = total ?? slotCount;
  const measuredLayout = layouts[index];
  const layout = measuredLayout ?? getEstimatedHangingLayout(index, resolvedTotal);

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
      <div className="relative w-full">
        {/* Polaroid entirely below the rope */}
        <div className="relative z-10">{children}</div>

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

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { track } from "@/lib/analytics";
import { markPointerDragEnd, preloadStickerSounds, unlockPortfolioSounds } from "@/lib/portfolio-sounds";

const STORAGE_PREFIX = "drag-pos-v2-";
const RESET_EVENT = "portfolio:reset-stickers";

type DragOffset = { x: number; y: number };

type DragBounds = "none" | "viewport";

type DraggableOptions = {
  id: string;
  disabled?: boolean;
  persist?: boolean;
  bounds?: DragBounds;
  rotate?: number;
  onDragStart?: () => void;
  onDrag?: (offset: DragOffset) => void;
  onDragEnd?: () => void;
};

function isDragOffset(value: unknown): value is DragOffset {
  if (typeof value !== "object" || value === null) return false;
  if (!("x" in value) || !("y" in value)) return false;
  return typeof value.x === "number" && typeof value.y === "number";
}

function storageKey(id: string): string {
  return `${STORAGE_PREFIX}${id}`;
}

function readOffset(id: string): DragOffset {
  try {
    const stored = localStorage.getItem(storageKey(id));
    if (!stored) return { x: 0, y: 0 };
    const parsed: unknown = JSON.parse(stored);
    if (isDragOffset(parsed)) return parsed;
  } catch {
    /* ignore */
  }
  return { x: 0, y: 0 };
}

function composeTransform(offset: DragOffset, rotate: number): string {
  return `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotate}deg)`;
}

function setGlobalDragCursor(active: boolean): void {
  if (typeof document === "undefined") return;
  document.body.style.cursor = active ? "grabbing" : "";
}

function applyVisual(
  el: HTMLElement | null,
  offset: DragOffset,
  rotate: number,
  dragging: boolean,
): void {
  if (!el) return;
  el.style.transform = composeTransform(offset, rotate);
  if (dragging) {
    el.dataset.dragging = "true";
    el.style.willChange = "transform";
    el.style.cursor = "grabbing";
    return;
  }
  delete el.dataset.dragging;
  el.style.willChange = "";
  el.style.cursor = "grab";
}

function suppressTooltipUntilLeave(el: HTMLElement | null): void {
  if (!el) return;
  el.dataset.justDropped = "true";
  const clear = () => {
    delete el.dataset.justDropped;
    el.removeEventListener("pointerleave", clear);
  };
  el.addEventListener("pointerleave", clear);
}

function clampOffsetToViewport(el: HTMLElement, current: DragOffset, next: DragOffset): DragOffset {
  const rect = el.getBoundingClientRect();
  const dx = next.x - current.x;
  const dy = next.y - current.y;
  let x = next.x;
  let y = next.y;
  const left = rect.left + dx;
  const right = rect.right + dx;
  const top = rect.top + dy;
  const bottom = rect.bottom + dy;
  if (left < 0) x -= left;
  if (right > window.innerWidth) x -= right - window.innerWidth;
  if (top < 0) y -= top;
  if (bottom > window.innerHeight) y -= bottom - window.innerHeight;
  return { x, y };
}

export function resetAllStickerPositions(): void {
  if (typeof window === "undefined") return;
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
  window.dispatchEvent(new Event(RESET_EVENT));
}

export function useDraggable({
  id,
  disabled = false,
  persist = true,
  bounds = "none",
  rotate = 0,
  onDragStart,
  onDrag,
  onDragEnd,
}: DraggableOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const applied = useRef({ x: 0, y: 0 });
  const pointerId = useRef<number | null>(null);
  const stopWindowDrag = useRef<(() => void) | null>(null);
  const rotateRef = useRef(rotate);
  const boundsRef = useRef(bounds);
  const persistRef = useRef(persist);
  const onDragStartRef = useRef(onDragStart);
  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);

  useEffect(() => {
    rotateRef.current = rotate;
    boundsRef.current = bounds;
    persistRef.current = persist;
    onDragStartRef.current = onDragStart;
    onDragRef.current = onDrag;
    onDragEndRef.current = onDragEnd;
  }, [bounds, onDrag, onDragEnd, onDragStart, persist, rotate]);

  useEffect(() => {
    if (!persist) {
      localStorage.removeItem(storageKey(id));
      return;
    }
    const stored = readOffset(id);
    applied.current = stored;
    applyVisual(ref.current, stored, rotateRef.current, false);
    // Load persisted drag offset after mount (client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration from localStorage
    setOffset(stored);
  }, [id, persist]);

  useEffect(() => {
    const onReset = () => {
      applied.current = { x: 0, y: 0 };
      applyVisual(ref.current, { x: 0, y: 0 }, rotateRef.current, false);
      setOffset({ x: 0, y: 0 });
    };
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, []);

  useEffect(() => {
    return () => {
      stopWindowDrag.current?.();
      if (dragging.current) {
        dragging.current = false;
        setGlobalDragCursor(false);
      }
    };
  }, []);

  const onPointerEnter = useCallback(() => {
    if (disabled) return;
    unlockPortfolioSounds();
    preloadStickerSounds();
  }, [disabled]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      unlockPortfolioSounds();
      onDragStartRef.current?.();
      dragging.current = true;
      setIsDragging(true);
      pointerId.current = e.pointerId;
      start.current = {
        x: e.clientX,
        y: e.clientY,
        ox: applied.current.x,
        oy: applied.current.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
      setGlobalDragCursor(true);
      applyVisual(e.currentTarget, applied.current, rotateRef.current, true);

      const move = (ev: PointerEvent) => {
        if (!dragging.current || ev.pointerId !== pointerId.current) return;
        let next = {
          x: start.current.ox + (ev.clientX - start.current.x),
          y: start.current.oy + (ev.clientY - start.current.y),
        };
        switch (boundsRef.current) {
          case "none":
            break;
          case "viewport":
            if (ref.current) {
              next = clampOffsetToViewport(ref.current, applied.current, next);
            }
            break;
          default: {
            const _exhaustive: never = boundsRef.current;
            void _exhaustive;
          }
        }
        applied.current = next;
        applyVisual(ref.current, next, rotateRef.current, true);
        onDragRef.current?.(next);
      };

      const end = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId.current) return;
        stopWindowDrag.current?.();
        if (!dragging.current) return;
        dragging.current = false;
        setIsDragging(false);
        pointerId.current = null;
        setGlobalDragCursor(false);
        const current = applied.current;
        applyVisual(ref.current, current, rotateRef.current, false);
        suppressTooltipUntilLeave(ref.current);
        if (persistRef.current) {
          localStorage.setItem(storageKey(id), JSON.stringify(current));
        }
        setOffset(current);
        markPointerDragEnd();
        track("sticker_moved", { sticker_id: id });
        onDragEndRef.current?.();
      };

      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      stopWindowDrag.current = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        stopWindowDrag.current = null;
      };
    },
    [disabled, id],
  );

  const style: CSSProperties = {
    transform: composeTransform(offset, rotate),
    touchAction: disabled ? undefined : "none",
    cursor: disabled ? undefined : isDragging ? "grabbing" : "grab",
  };

  return {
    ref,
    style,
    dragHandlers: {
      onPointerEnter,
      onPointerDown,
    },
  };
}

function subscribeMediaQuery(query: string, cb: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useDraggableEnabled() {
  const coarse = useSyncExternalStore(
    (cb) => subscribeMediaQuery("(pointer: coarse)", cb),
    () => window.matchMedia("(pointer: coarse)").matches,
    () => true,
  );
  const reduced = useSyncExternalStore(
    (cb) => subscribeMediaQuery("(prefers-reduced-motion: reduce)", cb),
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  return !coarse && !reduced;
}

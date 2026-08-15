"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type DragOffset = { x: number; y: number };

type DragBounds = "none" | "viewport";

type DraggableOptions = {
  id: string;
  disabled?: boolean;
  persist?: boolean;
  bounds?: DragBounds;
  onDrag?: (offset: DragOffset) => void;
  onDragEnd?: () => void;
};

function isDragOffset(value: unknown): value is DragOffset {
  if (typeof value !== "object" || value === null) return false;
  if (!("x" in value) || !("y" in value)) return false;
  return typeof value.x === "number" && typeof value.y === "number";
}

function readOffset(id: string): DragOffset {
  try {
    const stored = localStorage.getItem(`drag-pos-${id}`);
    if (!stored) return { x: 0, y: 0 };
    const parsed: unknown = JSON.parse(stored);
    if (isDragOffset(parsed)) return parsed;
  } catch {
    /* ignore */
  }
  return { x: 0, y: 0 };
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

export function useDraggable({
  id,
  disabled = false,
  persist = true,
  bounds = "none",
  onDrag,
  onDragEnd,
}: DraggableOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const applied = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!persist) {
      localStorage.removeItem(`drag-pos-${id}`);
      return;
    }
    const stored = readOffset(id);
    applied.current = stored;
    // Load persisted drag offset after mount (client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration from localStorage
    setOffset(stored);
  }, [id, persist]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      dragging.current = true;
      start.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled, offset.x, offset.y],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current || disabled) return;
      let next = {
        x: start.current.ox + (e.clientX - start.current.x),
        y: start.current.oy + (e.clientY - start.current.y),
      };
      switch (bounds) {
        case "none":
          break;
        case "viewport":
          if (ref.current) {
            next = clampOffsetToViewport(ref.current, applied.current, next);
          }
          break;
        default: {
          const _exhaustive: never = bounds;
          void _exhaustive;
        }
      }
      applied.current = next;
      setOffset(next);
      onDrag?.(next);
    },
    [bounds, disabled, onDrag],
  );

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setOffset((current) => {
      if (persist) {
        localStorage.setItem(`drag-pos-${id}`, JSON.stringify(current));
      }
      return current;
    });
    onDragEnd?.();
  }, [id, onDragEnd, persist]);

  const style: React.CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    touchAction: disabled ? undefined : "none",
    cursor: disabled ? undefined : "grab",
  };

  return {
    ref,
    style,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
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

"use client";

import Image from "next/image";
import { useDraggable } from "@/components/decor/useDraggable";
import { cn } from "@/lib/utils";

type PostcardStampProps = {
  id: string;
  src: string;
  rotate?: number;
  draggable: boolean;
  top?: string;
  right?: string;
  className?: string;
};

export function PostcardStamp({
  id,
  src,
  rotate = 0,
  draggable,
  top,
  right,
  className,
}: PostcardStampProps) {
  const { ref, style, dragHandlers } = useDraggable({ id, disabled: !draggable });

  return (
    <div
      ref={ref}
      {...(draggable ? dragHandlers : {})}
      className={cn(
        "stamp-perforated absolute z-20 h-12 w-12 select-none sm:h-14 sm:w-14",
        draggable && "pointer-events-auto active:cursor-grabbing",
        className,
      )}
      style={{
        top,
        right,
        transform: draggable
          ? `${style.transform} rotate(${rotate}deg)`
          : `rotate(${rotate}deg)`,
        touchAction: style.touchAction,
        cursor: draggable ? style.cursor : undefined,
      }}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        width={80}
        height={80}
        quality={45}
        sizes="56px"
        draggable={false}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

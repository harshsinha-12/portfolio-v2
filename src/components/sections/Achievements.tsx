"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight, ExternalLink, Medal, Newspaper, Trophy } from "lucide-react";
import { AiFillGithub, AiFillYoutube } from "@/lib/icons";
import { achievements, type Achievement } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DraggableSticker } from "@/components/decor/DraggableSticker";
import { Polaroid } from "@/components/decor/Decor";
import { useDraggableEnabled } from "@/components/decor/useDraggable";
import {
  Clothesline,
  getClotheslineFanRotation,
  HangingSlot,
} from "@/components/decor/Clothesline";
import { cn } from "@/lib/utils";

const MOBILE_BREAKPOINT = "(max-width: 1023px)";
const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 5;

function useMobileLayout() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(MOBILE_BREAKPOINT);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(MOBILE_BREAKPOINT).matches,
    () => false,
  );
}

const linkIcons = [
  { key: "article" as const, Icon: Newspaper, label: "Article" },
  { key: "project" as const, Icon: ExternalLink, label: "Project" },
  { key: "youtube" as const, Icon: AiFillYoutube, label: "YouTube" },
  { key: "github" as const, Icon: AiFillGithub, label: "GitHub" },
];

type MedalTier = "gold" | "silver" | "bronze" | "neutral";

function getMedalTier(position: string): MedalTier {
  const p = position.toLowerCase();
  if (/\bwinner\b/.test(p) && !/runner/.test(p)) return "gold";
  if (/1st runner|runners up/.test(p)) return "silver";
  if (/2nd runner|\brunner up\b/.test(p)) return "bronze";
  return "neutral";
}

const medalStyles: Record<MedalTier, { Icon: typeof Trophy; color: string }> = {
  gold: { Icon: Trophy, color: "var(--color-medal-gold)" },
  silver: { Icon: Medal, color: "var(--color-medal-silver)" },
  bronze: { Icon: Medal, color: "var(--color-medal-bronze)" },
  neutral: { Icon: Award, color: "var(--color-ink-muted)" },
};

function PositionBadge({ position }: { position: string }) {
  const tier = getMedalTier(position);
  const { Icon, color } = medalStyles[tier];

  return (
    <span className="inline-flex items-center gap-1 text-[var(--color-ink-muted)]">
      <Icon size={11} strokeWidth={2.25} style={{ color }} aria-hidden="true" />
      <span className="line-clamp-1 font-hand text-sm leading-none text-[var(--color-accent)] sm:text-base">{position}</span>
    </span>
  );
}

function AchievementPolaroid({ item, rotation }: { item: Achievement; rotation: number }) {
  const imageSrc = item.photo ?? item.icon;
  const hasPhoto = Boolean(item.photo);

  return (
    <Polaroid
      rotation={rotation}
      imageClassName="aspect-[5/4]"
      className="!pb-4 sm:!pb-5"
      image={
        hasPhoto ? (
          <Image
            src={imageSrc}
            alt=""
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Image
              src={item.icon}
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 object-contain opacity-40 sm:h-12 sm:w-12"
            />
          </div>
        )
      }
      caption={
        <>
          <PositionBadge position={item.position} />
          <h3 className="mt-1 line-clamp-3 text-[10px] font-semibold leading-snug text-[var(--color-ink)] sm:text-xs">
            {item.event}
          </h3>
          <p className="mt-0.5 line-clamp-3 text-[9px] leading-relaxed text-[var(--color-ink-muted)] sm:text-[10px]">
            {item.highlight}
          </p>
        </>
      }
      footer={
        <div className="mt-1.5 flex flex-wrap gap-1">
          {linkIcons.map(({ key, Icon, label }) => {
            const href = item[key];
            if (!href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} for ${item.event}`}
                className="flex h-5 w-5 items-center justify-center rounded border border-[var(--color-ink-subtle)]/25 text-[var(--color-ink-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-focus)] sm:h-6 sm:w-6"
              >
                <Icon size={10} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      }
    />
  );
}

export function AchievementsSection() {
  const draggable = useDraggableEnabled();
  const isMobile = useMobileLayout();
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;
  const pageCount = Math.ceil(achievements.length / pageSize);
  const [page, setPage] = useState(0);

  useEffect(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("drag-pos-ach-")) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(pageCount - 1, 0)));
  }, [pageCount]);

  const visible = achievements.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <section
      id="hackathons"
      aria-labelledby="hackathons-heading"
      className="relative animate-fade-up pb-9 sm:pb-10"
    >
      <SectionHeading
        id="hackathons-heading"
        title="Hackathons"
        onMat
        className="px-1"
        trailing={
          <DraggableSticker
            id="trophy"
            Icon={Trophy}
            layout="inline"
            rotate={8}
            draggable={draggable}
            iconSize={18}
          />
        }
      />

      <Clothesline swapKey={page}>
        {visible.map((item, index) => (
          <HangingSlot key={item.id} index={index} total={visible.length}>
            <AchievementPolaroid
              item={item}
              rotation={getClotheslineFanRotation(index, visible.length)}
            />
          </HangingSlot>
        ))}
      </Clothesline>

      {pageCount > 1 && (
        <div
          className="absolute bottom-0 right-0 flex items-center gap-1.5"
          role="group"
          aria-label="Browse hackathons"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            aria-label="Show earlier hackathons"
            className={cn(
              "clothesline-swap-btn flex h-9 w-9 items-center justify-center rounded-full",
              "border-2 border-[var(--color-sticker-outline)] bg-[var(--color-paper)] text-[var(--color-accent)] shadow-[2px_3px_0_var(--color-shadow)]",
              "hover:-translate-y-px hover:bg-[var(--color-paper-muted)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
              "active:translate-y-px active:scale-95",
              "disabled:pointer-events-none disabled:border-[var(--color-on-mat)]/15 disabled:bg-[var(--color-paper)]/40 disabled:text-[var(--color-on-mat)]/30 disabled:shadow-none",
            )}
          >
            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
            disabled={page === pageCount - 1}
            aria-label="Show more hackathons"
            className={cn(
              "clothesline-swap-btn flex h-9 w-9 items-center justify-center rounded-full",
              "border-2 border-[var(--color-sticker-outline)] bg-[var(--color-paper)] text-[var(--color-accent)] shadow-[2px_3px_0_var(--color-shadow)]",
              "hover:-translate-y-px hover:bg-[var(--color-paper-muted)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
              "active:translate-y-px active:scale-95",
              "disabled:pointer-events-none disabled:border-[var(--color-on-mat)]/15 disabled:bg-[var(--color-paper)]/40 disabled:text-[var(--color-on-mat)]/30 disabled:shadow-none",
            )}
          >
            <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

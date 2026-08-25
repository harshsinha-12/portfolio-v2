"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type TouchEvent } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight, ExternalLink, Medal, Newspaper, Trophy } from "lucide-react";
import { AiFillGithub, AiFillYoutube } from "@/lib/icons";
import { achievements, type Achievement } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DraggableSticker } from "@/components/decor/DraggableSticker";
import { Polaroid } from "@/components/decor/Decor";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { XactoKnife } from "@/components/decor/XactoKnife";
import { useDraggableEnabled } from "@/components/decor/useDraggable";
import {
  Clothesline,
  getClotheslineFanRotation,
  HangingSlot,
} from "@/components/decor/Clothesline";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const MOBILE_BREAKPOINT = "(max-width: 1023px)";
const MOBILE_PAGE_SIZE = 2;
const DESKTOP_PAGE_SIZE = 5;
const SWIPE_THRESHOLD_PX = 40;
const ARC_TRANSITION_MS = 260;
const ACHIEVEMENT_PHOTO_SIZES = "(min-width: 1024px) 216px, 50vw";

type SlideDirection = "next" | "prev";

type OutgoingPage = {
  items: Achievement[];
};

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
            sizes={ACHIEVEMENT_PHOTO_SIZES}
            loading="eager"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Image
              src={item.icon}
              alt=""
              width={48}
              height={48}
              sizes="48px"
              loading="eager"
              className="h-10 w-10 object-contain opacity-40 sm:h-12 sm:w-12"
            />
          </div>
        )
      }
      caption={
        <>
          <PositionBadge position={item.position} />
          <h3 className="mt-1 flex items-center gap-1.5 text-xs font-semibold leading-snug text-[var(--color-ink)]">
            {item.companyIcon && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src={item.companyIcon}
                  alt=""
                  width={16}
                  height={16}
                  sizes="16px"
                  className="h-full w-full object-cover"
                />
              </span>
            )}
            <span className="min-w-0">{item.event}</span>
          </h3>
          <p className="mt-0.5 text-[10px] leading-relaxed text-[var(--color-ink-muted)]">
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
              <LinkPreview
                key={key}
                href={href}
                ariaLabel={`${label} for ${item.event}`}
                onClick={() => track("achievement_link_clicked", { achievement_id: item.id, link_type: key })}
                className="flex h-5 w-5 items-center justify-center rounded border border-[var(--color-ink-subtle)]/25 text-[var(--color-ink-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-focus)] sm:h-6 sm:w-6"
              >
                <Icon size={10} aria-hidden="true" />
              </LinkPreview>
            );
          })}
        </div>
      }
    />
  );
}

function AchievementImagePreloader() {
  return (
    <div className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
      {achievements.map((item) => {
        if (!item.photo) return null;
        return (
          <Image
            key={item.id}
            src={item.photo}
            alt=""
            width={200}
            height={200}
            sizes={ACHIEVEMENT_PHOTO_SIZES}
            loading="eager"
          />
        );
      })}
    </div>
  );
}

type MobileClotheslineProps = {
  visible: Achievement[];
  outgoing: OutgoingPage | null;
  direction: SlideDirection | null;
  onExitAnimationEnd: () => void;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchCancel: () => void;
};

function MobileHackathonClothesline({
  visible,
  outgoing,
  direction,
  onExitAnimationEnd,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
}: MobileClotheslineProps) {
  const outgoingCount = outgoing?.items.length ?? 0;
  const displaySlotCount = Math.max(visible.length, outgoingCount);
  const arcEnterClass =
    direction === "next" ? "arc-enter-forward" : direction === "prev" ? "arc-enter-back" : null;
  const arcExitClass =
    direction === "next" ? "arc-exit-forward" : direction === "prev" ? "arc-exit-back" : null;

  return (
    <div
      className="relative touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      <Clothesline swapKey={0} className="[&_.clothesline-swap]:!animate-none">
        {Array.from({ length: displaySlotCount }, (_, slotIndex) => {
          const item = visible[slotIndex];
          const outgoingItem = outgoing?.items[slotIndex];
          if (!item && !outgoingItem) return null;

          const rotation = getClotheslineFanRotation(slotIndex, displaySlotCount);

          return (
            <HangingSlot key={slotIndex} index={slotIndex} total={displaySlotCount}>
              <div className="relative w-full">
                {outgoingItem && arcExitClass && (
                  <div
                    className={cn("absolute inset-0 z-10", arcExitClass)}
                    onAnimationEnd={onExitAnimationEnd}
                  >
                    <AchievementPolaroid item={outgoingItem} rotation={rotation} />
                  </div>
                )}
                {item && (
                  <div className={cn(outgoing && arcEnterClass)}>
                    <AchievementPolaroid item={item} rotation={rotation} />
                  </div>
                )}
              </div>
            </HangingSlot>
          );
        })}
      </Clothesline>
    </div>
  );
}

function DesktopHackathonClothesline({ visible, page }: { visible: Achievement[]; page: number }) {
  return (
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
  );
}

export function AchievementsSection() {
  const draggable = useDraggableEnabled();
  const isMobile = useMobileLayout();
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;
  const pageCount = Math.ceil(achievements.length / pageSize);
  const [page, setPage] = useState(0);
  const [outgoing, setOutgoing] = useState<OutgoingPage | null>(null);
  const [direction, setDirection] = useState<SlideDirection | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const exitEndedRef = useRef(0);
  const transitioning = outgoing !== null;
  const safePage = Math.min(page, Math.max(pageCount - 1, 0));

  useEffect(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("drag-pos-ach-")) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  useEffect(() => {
    if (!outgoing) return;
    exitEndedRef.current = 0;
    const timeout = window.setTimeout(() => {
      setOutgoing(null);
      setDirection(null);
    }, ARC_TRANSITION_MS + 80);
    return () => window.clearTimeout(timeout);
  }, [outgoing]);

  const visible = achievements.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const navigateTo = useCallback(
    (nextPage: number) => {
      if (nextPage === safePage || nextPage < 0 || nextPage >= pageCount || transitioning) return;

      track("hackathons_page_navigated", {
        navigation_method: isMobile ? "swipe_or_pagination" : "button",
        page_number: nextPage + 1,
      });

      if (!isMobile) {
        setPage(nextPage);
        return;
      }

      const slideDirection: SlideDirection = nextPage > safePage ? "next" : "prev";
      setOutgoing({ items: visible });
      setDirection(slideDirection);
      setPage(nextPage);
    },
    [isMobile, safePage, pageCount, transitioning, visible],
  );

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (transitioning) return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, [transitioning]);

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (!isMobile || !touchStartRef.current || transitioning) {
        touchStartRef.current = null;
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
        touchStartRef.current = null;
        return;
      }

      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

      if (deltaX < 0) {
        navigateTo(safePage + 1);
      } else {
        navigateTo(safePage - 1);
      }
    },
    [isMobile, navigateTo, safePage, transitioning],
  );

  const handleTransitionEnd = useCallback(() => {
    setOutgoing(null);
    setDirection(null);
  }, []);

  const handleExitAnimationEnd = useCallback(() => {
    exitEndedRef.current += 1;
    const exitingCount = outgoing?.items.length ?? 0;
    if (exitEndedRef.current >= exitingCount) {
      handleTransitionEnd();
    }
  }, [outgoing, handleTransitionEnd]);

  return (
    <section
      id="hackathons"
      aria-labelledby="hackathons-heading"
      className="relative animate-fade-up pb-9 sm:pb-10"
    >
      <AchievementImagePreloader />

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

      <div
        className="pointer-events-none absolute inset-0 z-30 hidden xl:block"
        aria-hidden="true"
      >
        <XactoKnife
          id="xacto"
          top="12.1rem"
          right="max(-14.5rem, calc(-50vw + 50% + 0.1rem))"
          rotate={-26}
          draggable={draggable}
        />
      </div>

      {isMobile ? (
        <div className="relative min-h-[25.5rem]">
          <MobileHackathonClothesline
            visible={visible}
            outgoing={outgoing}
            direction={direction}
            onExitAnimationEnd={handleExitAnimationEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          />

          {pageCount > 1 && (
            <div
              className="absolute inset-x-0 top-[25rem] z-10 flex justify-center"
              role="tablist"
              aria-label="Hackathon pages"
            >
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === safePage}
                  aria-label={`Hackathons ${index * pageSize + 1}–${Math.min((index + 1) * pageSize, achievements.length)} of ${achievements.length}`}
                  disabled={transitioning}
                  onClick={() => navigateTo(index)}
                  className={cn(
                    "mx-[3px] h-1.5 rounded-full transition-all duration-200",
                    index === safePage
                      ? "w-5 bg-[var(--color-accent)]"
                      : "w-1.5 bg-[var(--color-on-mat)]/35 hover:bg-[var(--color-on-mat)]/55",
                    "disabled:pointer-events-none",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <DesktopHackathonClothesline visible={visible} page={safePage} />
      )}

      {!isMobile && pageCount > 1 && (
        <div
          className="absolute bottom-0 right-0 flex items-center gap-1.5"
          role="group"
          aria-label="Browse hackathons"
        >
          <button
            type="button"
            onClick={() => navigateTo(safePage - 1)}
            disabled={safePage === 0}
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
            onClick={() => navigateTo(safePage + 1)}
            disabled={safePage === pageCount - 1}
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

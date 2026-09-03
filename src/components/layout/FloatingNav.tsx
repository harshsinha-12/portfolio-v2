"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { connectLink, navSections } from "@/data/portfolio";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type PillPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
};

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState(navSections[0].id);
  const [pill, setPill] = useState<PillPosition>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  const [overflow, setOverflow] = useState({ start: false, end: false });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const interactingRef = useRef(false);

  const syncOverflow = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const start = nav.scrollLeft > 1;
    const end = nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1;
    setOverflow((previous) =>
      previous.start === start && previous.end === end
        ? previous
        : { start, end },
    );
  }, []);

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      frame = 0;
      const readingLine = Math.min(window.innerHeight * 0.34, 280);
      let current = navSections[0].id;

      for (const section of navSections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= readingLine) {
          current = section.id;
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8
      ) {
        current = navSections.at(-1)?.id ?? current;
      }

      setActiveSection((previous) => (previous === current ? previous : current));
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    function endInteraction() {
      interactingRef.current = false;
    }
    window.addEventListener("pointerup", endInteraction);
    window.addEventListener("pointercancel", endInteraction);
    window.addEventListener("resize", syncOverflow);
    return () => {
      window.removeEventListener("pointerup", endInteraction);
      window.removeEventListener("pointercancel", endInteraction);
      window.removeEventListener("resize", syncOverflow);
    };
  }, [syncOverflow]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const activeLink = linkRefs.current[activeSection];
    if (!nav || !activeLink) return;
    const navElement = nav;

    function placePill() {
      const link = linkRefs.current[activeSection];
      if (!link) return;

      setPill({
        x: link.offsetLeft,
        y: link.offsetTop,
        width: link.offsetWidth,
        height: link.offsetHeight,
        visible: true,
      });

      if (!interactingRef.current) {
        const leftEdge = link.offsetLeft - navElement.clientWidth * 0.2;
        const rightEdge =
          link.offsetLeft + link.offsetWidth - navElement.clientWidth * 0.8;
        if (leftEdge < navElement.scrollLeft) {
          navElement.scrollTo({
            left: Math.max(0, leftEdge),
            behavior: "smooth",
          });
        } else if (rightEdge > navElement.scrollLeft) {
          navElement.scrollTo({ left: rightEdge, behavior: "smooth" });
        }
      }

      syncOverflow();
    }

    placePill();
    const resizeObserver = new ResizeObserver(placePill);
    resizeObserver.observe(navElement);
    resizeObserver.observe(activeLink);
    return () => resizeObserver.disconnect();
  }, [activeSection, syncOverflow]);

  const edgeFade =
    overflow.start || overflow.end
      ? `linear-gradient(to right, ${
          overflow.start ? "transparent" : "#000"
        }, #000 1.75rem, #000 calc(100% - 1.75rem), ${
          overflow.end ? "transparent" : "#000"
        })`
      : undefined;

  return (
    <header className="sticky top-4 z-40 mx-auto mb-[var(--space-xl)] flex w-full justify-center">
      <nav
        ref={navRef}
        aria-label="Primary"
        onScroll={syncOverflow}
        onPointerDown={() => {
          interactingRef.current = true;
          const nav = navRef.current;
          if (nav) nav.scrollTo({ left: nav.scrollLeft });
        }}
        style={{ maskImage: edgeFade, WebkitMaskImage: edgeFade }}
        className="relative flex max-w-full flex-nowrap items-center justify-start gap-0.5 overflow-x-auto rounded-full border-2 border-[var(--color-on-mat)]/30 bg-[var(--color-mat)]/78 px-1.5 py-1 shadow-[3px_4px_0_var(--color-shadow)] backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-1 sm:px-2 sm:py-1.5 [&::-webkit-scrollbar]:hidden"
      >
        <span
          aria-hidden="true"
          className="nav-liquid-pill absolute left-0 top-0 z-0 rounded-full"
          style={{
            width: pill.width,
            height: pill.height,
            opacity: pill.visible ? 1 : 0,
            transform: `translate3d(${pill.x}px, ${pill.y}px, 0)`,
          }}
        />
        {navSections.map((section) => (
          <a
            key={section.id}
            ref={(element) => {
              linkRefs.current[section.id] = element;
            }}
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? "location" : undefined}
            onClick={() => {
              setActiveSection(section.id);
              track("nav_click", { section_id: section.id });
            }}
            className={cn(
              "relative z-10 inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-[var(--dur-base)] hover:text-[var(--color-heading-on-mat)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-sm",
              activeSection === section.id
                ? "text-white"
                : "text-[var(--color-on-mat)]/78",
            )}
          >
            {section.label}
          </a>
        ))}
        <LinkPreview
          href={connectLink}
          onClick={() => track("connect_link_clicked", { placement: "nav" })}
          className="relative z-10 ml-0.5 inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-on-mat)]/30 bg-[var(--color-on-mat)]/8 px-3.5 text-xs font-medium text-[var(--color-on-mat)]/85 transition-[color,background-color,transform] hover:-translate-y-px hover:bg-[var(--color-on-mat)]/14 hover:text-[var(--color-heading-on-mat)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:ml-1 sm:h-8 sm:px-3 sm:text-xs"
        >
          Connect
        </LinkPreview>
      </nav>
    </header>
  );
}

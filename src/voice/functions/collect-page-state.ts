import { NAV_SECTION_IDS, type NavSectionId, type PageState } from "@/voice/types";

function inViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  const height = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom > 80 && rect.top < height - 40;
}

export function collectPageState(): PageState {
  const hash = window.location.hash;
  const readingLine = Math.min(window.innerHeight * 0.34, 280);
  let section: NavSectionId | null = null;

  for (const id of NAV_SECTION_IDS) {
    const element = document.getElementById(id);
    if (element && element.getBoundingClientRect().top <= readingLine) {
      section = id;
    }
  }

  const visibleTargets = [...document.querySelectorAll("[data-voice-target]")]
    .filter(inViewport)
    .map((element) => element.id)
    .filter(Boolean);

  return {
    route: window.location.pathname,
    hash,
    section,
    visibleTargets,
  };
}

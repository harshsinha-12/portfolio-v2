const HIGHLIGHT_CLASS = "voice-target-flash";
const HIGHLIGHT_MS = 2400;
let highlightTimer = 0;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string, block: ScrollLogicalPosition = "center") {
  const element = document.getElementById(id);
  if (!element) return false;

  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block,
    inline: "nearest",
  });
  return true;
}

export function highlightElement(id: string) {
  const element = document.getElementById(id);
  if (!element) return false;

  document
    .querySelectorAll(`.${HIGHLIGHT_CLASS}`)
    .forEach((node) => node.classList.remove(HIGHLIGHT_CLASS));

  element.classList.add(HIGHLIGHT_CLASS);
  window.clearTimeout(highlightTimer);
  highlightTimer = window.setTimeout(() => {
    element.classList.remove(HIGHLIGHT_CLASS);
  }, HIGHLIGHT_MS);
  return true;
}

export async function waitForElement(id: string, timeoutMs = 1600) {
  const existing = document.getElementById(id);
  if (existing) return existing;

  const started = Date.now();
  return new Promise<HTMLElement | null>((resolve) => {
    const tick = () => {
      const element = document.getElementById(id);
      if (element) {
        resolve(element);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }
      window.requestAnimationFrame(tick);
    };
    tick();
  });
}

export async function focusDomTarget(id: string, hash?: string) {
  if (hash) {
    history.replaceState(null, "", hash);
  }
  const found = await waitForElement(id);
  if (!found) return false;
  scrollToId(id);
  highlightElement(id);
  return true;
}

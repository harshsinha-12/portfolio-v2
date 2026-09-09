import type { OutboundWhere } from "@/voice/types";

function isForeignWindow(win: Window | null): win is Window {
  return win != null && !win.closed && win !== window;
}

export function openOutboundUrl(url: string, where: OutboundWhere = "tab") {
  if (typeof window === "undefined") {
    return { ok: false, mode: "blocked" as const };
  }

  if (where === "here") {
    window.location.assign(url);
    return { ok: true, mode: "same" as const };
  }

  const opened = window.open(url, "_blank");
  if (isForeignWindow(opened)) {
    try {
      opened.opener = null;
    } catch {
      /* ignore */
    }
    return { ok: true, mode: "tab" as const };
  }

  if (opened === window) {
    return { ok: false, mode: "blocked" as const };
  }

  window.location.assign(url);
  return { ok: true, mode: "same" as const };
}

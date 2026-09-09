function isForeignWindow(win: Window | null): win is Window {
  return win != null && !win.closed && win !== window;
}

function clickBlankAnchor(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.referrerPolicy = "no-referrer";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export function openOutboundUrl(url: string) {
  if (typeof window === "undefined") return false;

  const opened = window.open(url, "_blank");
  if (opened === window) {
    clickBlankAnchor(url);
    return false;
  }
  if (isForeignWindow(opened)) {
    try {
      opened.opener = null;
    } catch {
      /* ignore */
    }
    return true;
  }

  clickBlankAnchor(url);
  return Boolean(navigator.userActivation?.isActive);
}

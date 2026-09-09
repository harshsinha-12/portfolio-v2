const PLACEHOLDER = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Opening…</title>
</head>
<body style="margin:0;background:#1c1917;color:#f5f5f4;font:15px ui-sans-serif,system-ui;display:grid;place-items:center;min-height:100vh">
  Opening…
</body>
</html>`;

const OUTBOUND_INTENT =
  /\b(open|launch|visit|pull up|go to|github|readme|live site|website|resume|linkedin|youtube)\b/i;

let reserved: Window | null = null;
let serial = 0;

function isUsable(win: Window | null): win is Window {
  return win != null && !win.closed;
}

function navigateWindow(win: Window, url: string) {
  try {
    win.location.replace(url);
    return true;
  } catch {
    try {
      win.location.href = url;
      return true;
    } catch {
      return false;
    }
  }
}

function dropOpener(win: Window) {
  try {
    win.opener = null;
  } catch {
    /* cross-origin after navigation */
  }
}

/** Call from a click/submit handler so the browser allows a later tab open. */
export function reserveOutboundWindow() {
  if (typeof window === "undefined") return;
  if (isUsable(reserved)) return;

  serial += 1;
  const win = window.open("about:blank", `portfolio-voice-${serial}`);
  if (!win) {
    reserved = null;
    return;
  }

  try {
    win.document.open();
    win.document.write(PLACEHOLDER);
    win.document.close();
  } catch {
    /* keep about:blank */
  }

  reserved = win;
  window.focus();
}

export function messageLooksLikeOutbound(text: string) {
  return OUTBOUND_INTENT.test(text);
}

export function openOutboundUrl(url: string) {
  if (typeof window === "undefined") return false;

  if (isUsable(reserved)) {
    if (navigateWindow(reserved, url)) {
      dropOpener(reserved);
      reserved.focus();
      return true;
    }
    const named = window.open(url, reserved.name);
    if (named) {
      reserved = named;
      dropOpener(named);
      named.focus();
      return true;
    }
  }

  const direct = window.open(url, "_blank");
  if (direct) {
    reserved = direct;
    dropOpener(direct);
    direct.focus();
    return true;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.referrerPolicy = "no-referrer";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  return Boolean(navigator.userActivation?.isActive);
}

export function releaseUnusedOutboundWindow() {
  if (!isUsable(reserved)) {
    reserved = null;
    return;
  }

  try {
    const { href } = reserved.location;
    if (href === "about:blank" || href.startsWith("about:")) {
      reserved.close();
    }
  } catch {
    /* Cross-origin means a real site is already showing. */
  }
  reserved = null;
}

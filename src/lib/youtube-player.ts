/**
 * YouTube IFrame Player API loader and type declarations.
 *
 * The script is injected lazily — only when a component first needs it —
 * rather than site-wide via next/script. This keeps the API off the page on
 * mobile and below-XL desktop where the headphones sticker never renders.
 */

// --- Minimal YT type surface (subset we use) -------------------------------

export enum YTPlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export interface YTPlayerVars {
  autoplay?: 0 | 1;
  loop?: 0 | 1;
  playlist?: string;
  controls?: 0 | 1;
  disablekb?: 0 | 1;
  fs?: 0 | 1;
  modestbranding?: 0 | 1;
  rel?: 0 | 1;
  iv_load_policy?: 1 | 3;
  playsinline?: 0 | 1;
}

export interface YTPlayerOptions {
  videoId?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: YTPlayerVars;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { target: YTPlayer; data: YTPlayerState }) => void;
    onError?: (event: { target: YTPlayer; data: number }) => void;
  };
}

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getVolume(): number;
  destroy(): void;
}

// --- Global declarations ----------------------------------------------------

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement | string, options: YTPlayerOptions) => YTPlayer;
      PlayerState: typeof YTPlayerState;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// --- Loader -----------------------------------------------------------------

let apiPromise: Promise<void> | null = null;

/**
 * Injects the YouTube IFrame API script once and resolves when
 * `window.YT.Player` is available.
 *
 * We poll for `window.YT?.Player` rather than relying solely on the global
 * `onYouTubeIframeAPIReady` callback, which can race if the script is already
 * cached and fires the callback before our handler is attached. The promise is
 * memoized so repeated calls are cheap.
 */
export function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube IFrame API cannot load on the server"));
  }

  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve, reject) => {
    // Already available (e.g. script was injected by a prior mount).
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const existing = document.getElementById("youtube-iframe-api");
    const script =
      existing ??
      (() => {
        const s = document.createElement("script");
        s.id = "youtube-iframe-api";
        s.src = "https://www.youtube.com/iframe_api";
        s.async = true;
        document.head.appendChild(s);
        return s;
      })();

    // Wire the global callback the API calls when ready. If a prior consumer
    // already set one, chain ours after it.
    const priorCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      priorCallback?.();
      resolve();
    };

    // Belt-and-suspenders: poll for window.YT?.Player in case the callback
    // raced (script cached, callback fired before we attached the handler).
    let polls = 0;
    const maxPolls = 100; // ~5s at 50ms intervals
    const interval = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(interval);
        resolve();
        return;
      }
      polls += 1;
      if (polls >= maxPolls) {
        window.clearInterval(interval);
        reject(new Error("YouTube IFrame API failed to load"));
      }
    }, 50);

    // If the script tag itself fails to load (network error), reject.
    script.addEventListener("error", () => {
      window.clearInterval(interval);
      reject(new Error("YouTube IFrame API script failed to load"));
    });
  });

  return apiPromise;
}

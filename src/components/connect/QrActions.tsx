"use client";

import { useState } from "react";
import Link from "next/link";
import { connectCardSize } from "@/lib/connect";

const CARD_WIDTH = connectCardSize.width;
const CARD_HEIGHT = connectCardSize.height;
const PNG_SCALE = 2;
const MAT = "#1f432f";

function downloadUrl(href: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
}

function rasterizeCard(svg: SVGElement): Promise<Blob> {
  const xml = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = CARD_WIDTH * PNG_SCALE;
      canvas.height = CARD_HEIGHT * PNG_SCALE;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas is unavailable"));
        return;
      }
      context.fillStyle = MAT;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((png) => {
        URL.revokeObjectURL(url);
        if (!png) {
          reject(new Error("Could not encode PNG"));
          return;
        }
        resolve(png);
      }, "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not draw the card"));
    };
    image.src = url;
  });
}

function standaloneHtml(svg: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Harsh Sinha — QR card</title>
  <style>
    :root { color-scheme: light; }
    html, body { margin: 0; background: ${MAT}; }
    body { min-height: 100vh; }
    .stage { width: min(440px, calc(100vw - 32px)); margin: 28px auto 112px; }
    .stage svg { display: block; width: 100%; height: auto; }
    .bar {
      position: fixed; left: 0; right: 0; bottom: 0;
      display: flex; justify-content: center; gap: 8px;
      padding: 18px 16px calc(18px + env(safe-area-inset-bottom));
      background: linear-gradient(transparent, #0f301f 42%);
    }
    button {
      font: 600 14px/1 system-ui, sans-serif;
      border: 2px solid #fff;
      background: #f4f2ea;
      color: #17221c;
      border-radius: 999px;
      padding: 12px 16px;
      cursor: pointer;
    }
    button.primary { background: #17221c; color: #f4f2ea; }
    .note { margin: 0 0 8px; color: #e8e5d6; font: 14px/1.4 system-ui, sans-serif; text-align: center; }
    @media print {
      .bar { display: none; }
      .stage { width: 100%; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="stage">${svg}</div>
  <div class="bar">
    <p class="note" id="note"></p>
    <button class="primary" type="button" id="save-png">Save PNG</button>
    <button type="button" id="print-card">Print</button>
  </div>
  <script>
    const note = document.getElementById("note");
    document.getElementById("print-card").addEventListener("click", () => window.print());
    document.getElementById("save-png").addEventListener("click", async () => {
      const svg = document.getElementById("connect-card");
      const xml = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = ${CARD_WIDTH * PNG_SCALE};
        canvas.height = ${CARD_HEIGHT * PNG_SCALE};
        const context = canvas.getContext("2d");
        context.fillStyle = "${MAT}";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((png) => {
          URL.revokeObjectURL(url);
          const objectUrl = URL.createObjectURL(png);
          const anchor = document.createElement("a");
          anchor.href = objectUrl;
          anchor.download = "harsh-sinha-qr.png";
          anchor.click();
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
          note.textContent = "Saved harsh-sinha-qr.png";
        }, "image/png");
      };
      image.src = url;
    });
  </script>
</body>
</html>`;
}

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full border-2 border-white px-4 text-sm font-semibold shadow-[3px_4px_0_rgba(9,26,17,0.45)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-on-mat)]";

export function QrActions() {
  const [note, setNote] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function savePng() {
    const svg = document.getElementById("connect-card");
    if (!(svg instanceof SVGElement) || pending) return;
    setPending(true);
    setNote(null);
    try {
      const png = await rasterizeCard(svg);
      const url = URL.createObjectURL(png);
      downloadUrl(url, "harsh-sinha-qr.png");
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setNote("Saved harsh-sinha-qr.png");
    } catch {
      setNote("Could not save the PNG. Try Save HTML instead.");
    } finally {
      setPending(false);
    }
  }

  function saveHtml() {
    const svg = document.getElementById("connect-card");
    if (!svg) return;
    const html = standaloneHtml(svg.outerHTML);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, "harsh-sinha-qr.html");
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setNote("Saved harsh-sinha-qr.html");
  }

  return (
    <div className="print:hidden">
      <p className="font-hand text-[1.8rem] leading-none text-[var(--color-accent-on-mat)] lg:text-[2rem]">
        print it or save it
      </p>
      <h1 className="text-shadow-on-mat mt-2 text-[1.85rem] leading-[1.05] font-semibold tracking-tight text-[var(--color-heading-on-mat)] sm:text-4xl">
        One card for the website, LinkedIn, and Twitter.
      </h1>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-[var(--color-on-mat)]/78">
        The code opens harshsinha.dev/go. Whoever scans it picks a place from that page.
      </p>
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-wrap justify-center gap-2 bg-gradient-to-t from-[var(--color-mat-deep)] via-[var(--color-mat-deep)] to-transparent px-4 pt-8 pb-[max(0.9rem,env(safe-area-inset-bottom))] lg:static lg:mt-5 lg:justify-start lg:bg-none lg:p-0">
        <button type="button" className={`${buttonClass} bg-[var(--color-ink)] text-[var(--color-paper)]`} onClick={() => void savePng()} disabled={pending}>
          {pending ? "Saving…" : "Save PNG"}
        </button>
        <button type="button" className={`${buttonClass} bg-[var(--color-paper)] text-[var(--color-ink)]`} onClick={saveHtml}>
          Save HTML
        </button>
        <button
          type="button"
          className={`${buttonClass} bg-[var(--color-paper)] text-[var(--color-ink)]`}
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <p className="mt-3 min-h-5 text-sm text-[var(--color-on-mat)]/80" aria-live="polite">
        {note}
      </p>
      <Link
        href="/go"
        className="mt-2 inline-flex text-sm font-medium text-[var(--color-on-mat)] underline decoration-[var(--color-accent-on-mat)] decoration-1 underline-offset-4"
      >
        Preview the scan page
      </Link>
    </div>
  );
}

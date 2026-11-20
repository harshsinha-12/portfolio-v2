import { readFileSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";
import { connectCardSize, connectDestinations, connectUrl } from "@/lib/connect";

const WIDTH = connectCardSize.width;
const HEIGHT = connectCardSize.height;
/** The sticker was drawn on a 3:4 board. Shift it so it sits in the middle of the phone. */
const CARD_SHIFT_Y = Math.round((HEIGHT - 1440) / 2);

const ink = "#17221c";
const inkMuted = "#54615a";
const paper = "#f4f2ea";
const paperMuted = "#ebe8df";
const accent = "#f57050";
const mat = "#1f432f";
const matDeep = "#0f301f";
const onMat = "#e8e5d6";
const major = "#d2d574";
const minor = "#3a5445";

type QrSymbol = {
  size: number;
  cells: boolean[];
};

function connectSymbol(): QrSymbol {
  const qr = QRCode.create(connectUrl, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const cells: boolean[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      cells.push(Boolean(qr.modules.get(row, col)));
    }
  }
  return { size, cells };
}

function fontCss(): string {
  const load = (filename: string) =>
    readFileSync(join(process.cwd(), "src/fonts", filename)).toString("base64");

  const regular = load("Inter-Regular.ttf");
  const semibold = load("Inter-SemiBold.ttf");
  const hand = load("IndieFlower-Regular.ttf");

  return `
    @font-face {
      font-family: CardSans;
      src: url("data:font/ttf;base64,${regular}") format("truetype");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: CardSans;
      src: url("data:font/ttf;base64,${semibold}") format("truetype");
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: CardHand;
      src: url("data:font/ttf;base64,${hand}") format("truetype");
      font-weight: 400;
      font-style: normal;
    }
  `;
}

function qrPath(symbol: QrSymbol, originX: number, originY: number, moduleSize: number): string {
  let path = "";
  symbol.cells.forEach((dark, index) => {
    if (!dark) return;
    const col = index % symbol.size;
    const row = Math.floor(index / symbol.size);
    const x = originX + col * moduleSize;
    const y = originY + row * moduleSize;
    path += `M${x} ${y}h${moduleSize}v${moduleSize}h-${moduleSize}z`;
  });
  return path;
}

function rulerLabels(): string {
  const labels = [5, 10, 15, 20, 25];
  return labels
    .map((label, index) => {
      const x = 180 + index * 180;
      return `<text x="${x}" y="46" text-anchor="middle" fill="${onMat}" fill-opacity="0.55" font-family="CardSans" font-size="13" font-weight="600">${label}</text>`;
    })
    .join("");
}

let cachedSvg: string | undefined;

/** Portrait card: cutting-mat ground, paper sticker, one scannable code. */
export function connectCardSvg(): string {
  if (cachedSvg) return cachedSvg;

  const symbol = connectSymbol();
  const quietModules = 4;
  const qrBox = 640;
  const moduleSize = Math.floor(qrBox / (symbol.size + quietModules * 2));
  const drawn = moduleSize * (symbol.size + quietModules * 2);
  const qrX = Math.round((WIDTH - drawn) / 2);
  const qrY = 456;
  const quiet = quietModules * moduleSize;
  const matrixX = qrX + quiet;
  const matrixY = qrY + quiet;
  const corner = Math.min(28, quiet - 6);

  const paperX = 108;
  const paperY = 108;
  const paperW = 864;
  const paperH = 1224;

  const textX = qrX;
  const textRight = qrX + drawn;
  const legendTop = qrY + drawn + 48;

  const columns = connectDestinations
    .map((destination, index) => {
      const center = qrX + ((index + 0.5) * drawn) / 3;
      const dash = 22;
      return `
        <rect x="${center - dash / 2}" y="${legendTop}" width="${dash}" height="4" rx="2" fill="${accent}"/>
        <text x="${center}" y="${legendTop + 40}" text-anchor="middle" fill="${ink}" font-family="CardSans" font-size="20" font-weight="600">${destination.label}</text>
        <text x="${center}" y="${legendTop + 68}" text-anchor="middle" fill="${inkMuted}" font-family="CardSans" font-size="15">${destination.hint}</text>
      `;
    })
    .join("");

  const dividers = [1, 2]
    .map((index) => {
      const x = Math.round(qrX + (drawn / 3) * index);
      return `<line x1="${x}" y1="${legendTop + 8}" x2="${x}" y2="${legendTop + 72}" stroke="${ink}" stroke-opacity="0.12" stroke-width="1.5"/>`;
    })
    .join("");

  cachedSvg = `<svg id="connect-card" xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="connect-card-title connect-card-desc">
  <title id="connect-card-title">Harsh Sinha QR card</title>
  <desc id="connect-card-desc">One QR code for ${connectUrl}. Scanning opens a page with Harsh Sinha's website, LinkedIn, and Twitter.</desc>
  <defs>
    <radialGradient id="connect-mat" cx="50%" cy="42%" r="78%">
      <stop offset="0%" stop-color="${mat}"/>
      <stop offset="100%" stop-color="${matDeep}"/>
    </radialGradient>
    <pattern id="connect-minor" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M36 0H0V36" fill="none" stroke="${minor}" stroke-opacity="0.55" stroke-width="1"/>
    </pattern>
    <pattern id="connect-major" width="180" height="180" patternUnits="userSpaceOnUse">
      <path d="M180 0H0V180" fill="none" stroke="${major}" stroke-opacity="0.28" stroke-width="1.25"/>
    </pattern>
    <style><![CDATA[${fontCss()}]]></style>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#connect-mat)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#connect-minor)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#connect-major)"/>
  <rect x="28" y="28" width="${WIDTH - 56}" height="${HEIGHT - 56}" fill="none" stroke="${onMat}" stroke-opacity="0.28" stroke-width="1.25"/>
  ${rulerLabels()}
  <path d="M48 36 v18 M36 48 h18" fill="none" stroke="${onMat}" stroke-opacity="0.5" stroke-width="1.5"/>
  <path d="M${WIDTH - 48} ${HEIGHT - 36} v-18 M${WIDTH - 36} ${HEIGHT - 48} h-18" fill="none" stroke="${onMat}" stroke-opacity="0.5" stroke-width="1.5"/>
  <g transform="translate(0 ${CARD_SHIFT_Y})">
    <rect x="${paperX + 12}" y="${paperY + 14}" width="${paperW}" height="${paperH}" rx="42" fill="#091a11" fill-opacity="0.34"/>
    <rect x="${paperX - 8}" y="${paperY - 8}" width="${paperW + 16}" height="${paperH + 16}" rx="48" fill="#ffffff"/>
    <rect x="${paperX}" y="${paperY}" width="${paperW}" height="${paperH}" rx="40" fill="${paper}" stroke="${paperMuted}" stroke-width="2"/>
    <g transform="rotate(-7 540 108)">
      <rect x="456" y="92" width="168" height="32" rx="3" fill="#ffd060" fill-opacity="0.82"/>
    </g>
    <text x="${textX}" y="196" fill="${inkMuted}" font-family="CardSans" font-size="15" font-weight="600" letter-spacing="3.4">AI ENGINEER · SCALIO</text>
    <text x="${textX}" y="272" fill="${ink}" font-family="CardSans" font-size="68" font-weight="600" letter-spacing="-1.4">Harsh Sinha</text>
    <text x="${textX + 2}" y="336" fill="${accent}" font-family="CardHand" font-size="44" transform="rotate(-2.2 ${textX + 2} 336)">scan once.</text>
    <path d="M${textX} 358 C ${textX + 90} 348, ${textX + 180} 368, ${textX + 260} 352" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
    <text x="${textX}" y="412" fill="${inkMuted}" font-family="CardSans" font-size="22">Website, LinkedIn, or Twitter</text>
    <g transform="rotate(8 868 214)">
      <circle cx="868" cy="214" r="46" fill="${paper}" stroke="${accent}" stroke-width="2.25" stroke-dasharray="3 3.5"/>
      <text x="868" y="228" text-anchor="middle" fill="${accent}" font-family="CardHand" font-size="36">HS</text>
    </g>
    <rect x="${qrX}" y="${qrY}" width="${drawn}" height="${drawn}" rx="${corner}" fill="#ffffff" stroke="${paperMuted}" stroke-width="2"/>
    <path fill="${ink}" shape-rendering="crispEdges" d="${qrPath(symbol, matrixX, matrixY, moduleSize)}"/>
    ${dividers}
    ${columns}
    <line x1="${textX}" y1="${legendTop + 108}" x2="${textRight}" y2="${legendTop + 108}" stroke="${ink}" stroke-opacity="0.12" stroke-width="1.5"/>
    <text x="${(textX + textRight) / 2}" y="${legendTop + 148}" text-anchor="middle" fill="${inkMuted}" font-family="CardSans" font-size="18" font-weight="600" letter-spacing="1.6">harshsinha.dev/go</text>
  </g>
</svg>`;

  return cachedSvg;
}

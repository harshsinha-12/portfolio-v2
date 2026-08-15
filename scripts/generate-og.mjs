import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const UNIT = 32;
const MAJOR_EVERY = 5;
const FRAME_INSET = 10;
const TICK_MINOR = 7;
const TICK_MAJOR = 14;
const LABEL_INSET = 28;
const ANGLE_DEGREES = [15, 30, 45];
const RADIUS_UNITS = [5, 10, 15];
const LABEL_EDGE_PAD = 48;

/** Site tokens, chroma bumped so sRGB JPEG matches the live oklch mat. */
const MAT = "#004420";
const MAT_DEEP = "#003011";
const PAPER = "#F4F2EA";
const HEADING = "#F4F2EA";
const ACCENT = "#FF714A";
const PIN = "#FF714A";
const PIN_STEM = "#8A9088";
const PHOTO_FRAME = "#EBE8DF";
const SHADOW = "8px 12px 0 rgba(9, 26, 17, 0.28)";
const GRID_MINOR = "rgba(58, 84, 69, 0.28)";
const GRID_MAJOR = "rgba(210, 213, 116, 0.16)";
const GUIDE = "#D2D574";

const NAME = "Parth Mittal";
const TAGLINE = "MTS @ Oracle · 15x Hackathon Winner · NITK'24 · PBA-5";

const socials = [
  {
    handle: "mittal-parth",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${HEADING}" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.21 0 22.23 0z"/></svg>`,
  },
  {
    handle: "mittal-parth",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${HEADING}" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2.01-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  },
  {
    handle: "@mittalparth_",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${HEADING}" d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.01 4.06H5.04l12.04 15.71z"/></svg>`,
  },
];

function el(type, props, ...children) {
  return h(type, props, ...children);
}

async function svgToDataUri(svg, size = 48) {
  const png = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

function buildMatSvg() {
  const cols = Math.floor(WIDTH / UNIT);
  const rows = Math.floor(HEIGHT / UNIT);
  const originX = 0;
  const originY = HEIGHT;
  const font = "ui-sans-serif, system-ui, sans-serif";
  const parts = [];

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">`);
  parts.push(`<defs>`);
  parts.push(`<radialGradient id="mat" cx="50%" cy="45%" r="90%"><stop offset="0%" stop-color="${MAT}"/><stop offset="100%" stop-color="${MAT_DEEP}"/></radialGradient>`);
  parts.push(`<radialGradient id="edgeFade" cx="50%" cy="42%" r="75%"><stop offset="18%" stop-color="white" stop-opacity="0"/><stop offset="100%" stop-color="white" stop-opacity="1"/></radialGradient>`);
  parts.push(`<mask id="edgeMask"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#edgeFade)"/></mask>`);
  parts.push(`</defs>`);
  parts.push(`<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#mat)"/>`);

  for (let i = 0; i <= cols; i++) {
    const x = i * UNIT;
    parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}" stroke="${GRID_MINOR}" stroke-width="1"/>`);
  }
  for (let i = 0; i <= rows; i++) {
    const y = HEIGHT - i * UNIT;
    parts.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${GRID_MINOR}" stroke-width="1"/>`);
  }

  const majorStep = UNIT * MAJOR_EVERY;
  for (let x = 0; x <= WIDTH; x += majorStep) {
    parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}" stroke="${GRID_MAJOR}" stroke-width="1"/>`);
  }
  for (let y = HEIGHT; y >= 0; y -= majorStep) {
    parts.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${GRID_MAJOR}" stroke-width="1"/>`);
  }

  parts.push(`<g mask="url(#edgeMask)" fill="none" stroke="${GUIDE}" stroke-width="1" opacity="0.28">`);
  parts.push(`<rect x="${FRAME_INSET}" y="${FRAME_INSET}" width="${WIDTH - FRAME_INSET * 2}" height="${HEIGHT - FRAME_INSET * 2}"/>`);

  for (const units of RADIUS_UNITS) {
    const r = units * UNIT;
    parts.push(`<path d="M ${originX + r} ${originY} A ${r} ${r} 0 0 0 ${originX} ${originY - r}"/>`);
  }

  const rayLength = Math.hypot(WIDTH, HEIGHT);
  const labelRadius = 8 * UNIT;
  for (const deg of ANGLE_DEGREES) {
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const endX = originX + rayLength * cos;
    const endY = originY - rayLength * sin;
    const labelX = originX + labelRadius * cos + 8 * sin;
    const labelY = originY - labelRadius * sin + 8 * cos;
    parts.push(`<line x1="${originX}" y1="${originY}" x2="${endX}" y2="${endY}" stroke-dasharray="8 7"/>`);
    parts.push(`<text x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" fill="${GUIDE}" stroke="none" font-size="10" font-family="${font}">${deg}°</text>`);
  }

  for (let i = 0; i <= cols; i++) {
    const isMajor = i % MAJOR_EVERY === 0;
    const tick = isMajor ? TICK_MAJOR : TICK_MINOR;
    const x = i * UNIT;
    parts.push(`<line x1="${x}" y1="${FRAME_INSET}" x2="${x}" y2="${FRAME_INSET + tick}"/>`);
    parts.push(`<line x1="${x}" y1="${HEIGHT - FRAME_INSET}" x2="${x}" y2="${HEIGHT - FRAME_INSET - tick}"/>`);
    const onLattice = x > LABEL_EDGE_PAD && x < WIDTH - LABEL_EDGE_PAD;
    if (isMajor && i > 0 && onLattice) {
      parts.push(`<text x="${x}" y="${LABEL_INSET + 6}" fill="${GUIDE}" stroke="none" font-size="10" font-family="${font}" text-anchor="middle">${i}</text>`);
    }
  }

  for (let i = 0; i <= rows; i++) {
    const isMajor = i % MAJOR_EVERY === 0;
    const tick = isMajor ? TICK_MAJOR : TICK_MINOR;
    const y = HEIGHT - i * UNIT;
    parts.push(`<line x1="${FRAME_INSET}" y1="${y}" x2="${FRAME_INSET + tick}" y2="${y}"/>`);
    parts.push(`<line x1="${WIDTH - FRAME_INSET}" y1="${y}" x2="${WIDTH - FRAME_INSET - tick}" y2="${y}"/>`);
    const onLattice = y > LABEL_EDGE_PAD && y < HEIGHT - LABEL_EDGE_PAD;
    if (isMajor && i > 0 && onLattice) {
      parts.push(`<text x="${LABEL_INSET}" y="${y + 3}" fill="${GUIDE}" stroke="none" font-size="10" font-family="${font}" text-anchor="middle">${i}</text>`);
    }
  }

  parts.push("</g></svg>");
  return parts.join("");
}

async function matToDataUri() {
  const png = await sharp(Buffer.from(buildMatSvg())).resize(WIDTH, HEIGHT).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

function card(photoSrc, socialIcons, matSrc) {
  return el(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: MAT,
        color: HEADING,
      },
    },
    el("img", {
      src: matSrc,
      width: WIDTH,
      height: HEIGHT,
      alt: "",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: WIDTH,
        height: HEIGHT,
      },
    }),
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "56px 68px",
          gap: 52,
        },
      },
      el(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            transform: "rotate(-4deg)",
            flexShrink: 0,
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              top: -16,
            },
          },
          el("div", {
            style: {
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: PIN,
              boxShadow: "0 2px 3px rgba(9, 26, 17, 0.35)",
            },
          }),
          el("div", {
            style: {
              width: 4,
              height: 10,
              backgroundColor: PIN_STEM,
              marginTop: -2,
            },
          }),
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              backgroundColor: PAPER,
              padding: 14,
              paddingBottom: 48,
              boxShadow: SHADOW,
            },
          },
          el("img", {
            src: photoSrc,
            width: 248,
            height: 248,
            alt: "",
            style: {
              width: 248,
              height: 248,
              objectFit: "cover",
              border: `1px solid ${PHOTO_FRAME}`,
            },
          }),
        ),
      ),
      el(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            minWidth: 0,
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              fontFamily: "Inter",
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            },
          },
          NAME,
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              fontFamily: "Indie Flower",
              fontSize: 30,
              color: ACCENT,
              marginTop: 14,
              lineHeight: 1.35,
            },
          },
          TAGLINE,
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              gap: 14,
            },
          },
          ...socials.map((social, index) =>
            el(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                },
              },
              el("img", {
                src: socialIcons[index],
                width: 28,
                height: 28,
                alt: "",
                style: { width: 28, height: 28 },
              }),
              el(
                "div",
                {
                  style: {
                    display: "flex",
                    fontFamily: "Inter",
                    fontSize: 24,
                    fontWeight: 400,
                    color: HEADING,
                  },
                },
                social.handle,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

const photoSrc = `data:image/jpeg;base64,${await readFile(
  join(process.cwd(), "public/assets/profile-pic.jpg"),
  "base64",
)}`;

const [socialIcons, matSrc] = await Promise.all([
  Promise.all(socials.map((social) => svgToDataUri(social.svg))),
  matToDataUri(),
]);

const interSemiBold = await readFile(
  join(process.cwd(), "src/fonts/Inter-SemiBold.ttf"),
);
const interRegular = await readFile(
  join(process.cwd(), "src/fonts/Inter-Regular.ttf"),
);
const indieFlower = await readFile(
  join(process.cwd(), "src/fonts/IndieFlower-Regular.ttf"),
);

const png = new ImageResponse(card(photoSrc, socialIcons, matSrc), {
  width: WIDTH,
  height: HEIGHT,
  fonts: [
    { name: "Inter", data: interSemiBold, style: "normal", weight: 600 },
    { name: "Inter", data: interRegular, style: "normal", weight: 400 },
    { name: "Indie Flower", data: indieFlower, style: "normal", weight: 400 },
  ],
});

const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
  .jpeg({ quality: 84, progressive: false })
  .toBuffer();

const outPath = join(process.cwd(), "public/og.jpg");
await writeFile(outPath, jpeg);
console.log(`wrote ${outPath} (${jpeg.length} bytes)`);

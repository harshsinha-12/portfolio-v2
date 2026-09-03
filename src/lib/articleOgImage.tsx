/* eslint-disable @next/next/no-img-element -- ImageResponse renders JSX with Satori; next/image is a browser component and is not supported here. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/data/portfolio";

export const articleOgSize = { width: 1200, height: 630 };
export const articleOgContentType = "image/png";

const WIDTH = 1200;
const HEIGHT = 630;
const MAT = "#004420";
const PAPER = "#F4F2EA";
const HEADING = "#F4F2EA";
const ACCENT = "#FF714A";
const PIN = "#FF714A";
const PIN_STEM = "#8A9088";
const PHOTO_FRAME = "#EBE8DF";
const MUTED = "rgba(244, 242, 234, 0.78)";
const GRID_MINOR = "rgba(58, 84, 69, 0.34)";
const GRID_MAJOR = "rgba(210, 213, 116, 0.14)";
const SHADOW = "8px 12px 0 rgba(9, 26, 17, 0.28)";

const articleOgSocials = [
  {
    platform: "LinkedIn",
    handle: "harshsinha12",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${HEADING}" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.21 0 22.23 0z"/></svg>`,
  },
  {
    platform: "GitHub",
    handle: siteConfig.githubUsername,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${HEADING}" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2.01-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  },
  {
    platform: "X",
    handle: "@sinhaharsh12",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${HEADING}" d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.01 4.06H5.04l12.04 15.71z"/></svg>`,
  },
] as const;

export type ArticleOgCard = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  tags?: string[];
};

type OgAssets = {
  photoSrc: string;
  socialIcons: string[];
  fonts: {
    name: string;
    data: Buffer;
    style: "normal";
    weight: 400 | 600;
  }[];
};

let assetsPromise: Promise<OgAssets> | undefined;

async function loadOgAssets() {
  assetsPromise ??= Promise.all([
    readFile(join(process.cwd(), "src/fonts/Inter-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "src/fonts/IndieFlower-Regular.ttf")),
    readFile(join(process.cwd(), "public/assets/profile-pic.jpg"), "base64"),
  ]).then(([interSemiBold, interRegular, indieFlower, photo]) => ({
    photoSrc: `data:image/jpeg;base64,${photo}`,
    socialIcons: articleOgSocials.map(
      ({ svg }) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    ),
    fonts: [
      { name: "Inter", data: interSemiBold, style: "normal" as const, weight: 600 },
      { name: "Inter", data: interRegular, style: "normal" as const, weight: 400 },
      { name: "Indie Flower", data: indieFlower, style: "normal" as const, weight: 400 },
    ],
  }));

  return assetsPromise;
}

function titleFontSize(title: string) {
  if (title.length > 80) return 34;
  if (title.length > 56) return 40;
  if (title.length > 36) return 48;
  return 54;
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function articleOgPath(slug: string) {
  return `/articles/${slug}/opengraph-image`;
}

export const articlesIndexOgPath = "/articles/opengraph-image";

function Polaroid({ photoSrc }: { photoSrc: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transform: "rotate(-4deg)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: -16,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: PIN,
            boxShadow: "0 2px 3px rgba(9, 26, 17, 0.35)",
          }}
        />
        <div
          style={{
            width: 4,
            height: 10,
            backgroundColor: PIN_STEM,
            marginTop: -2,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: PAPER,
          padding: 12,
          paddingBottom: 40,
          boxShadow: SHADOW,
        }}
      >
        <img
          src={photoSrc}
          width={200}
          height={200}
          alt=""
          style={{
            width: 200,
            height: 200,
            objectFit: "cover",
            border: `1px solid ${PHOTO_FRAME}`,
          }}
        />
      </div>
    </div>
  );
}

export async function renderArticleOgImage(card: ArticleOgCard) {
  const { photoSrc, socialIcons, fonts } = await loadOgAssets();
  const tags = (card.tags ?? []).slice(0, 4);
  const description = clip(card.description, 168);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: MAT,
          color: HEADING,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: WIDTH,
            height: HEIGHT,
            display: "flex",
            backgroundImage: `linear-gradient(${GRID_MINOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_MINOR} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: WIDTH,
            height: HEIGHT,
            display: "flex",
            backgroundImage: `linear-gradient(${GRID_MAJOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_MAJOR} 1px, transparent 1px)`,
            backgroundSize: "160px 160px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "56px 64px",
            gap: 48,
          }}
        >
          <Polaroid photoSrc={photoSrc} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Indie Flower",
                fontSize: 30,
                color: ACCENT,
                lineHeight: 1.2,
              }}
            >
              {card.eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: titleFontSize(card.title),
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                marginTop: 10,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                width: 72,
                height: 4,
                backgroundColor: ACCENT,
                marginTop: 16,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: 24,
                fontWeight: 400,
                color: MUTED,
                lineHeight: 1.35,
                marginTop: 18,
              }}
            >
              {description}
            </div>
            {tags.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 22,
                }}
              >
                {tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      display: "flex",
                      fontFamily: "Inter",
                      fontSize: 18,
                      fontWeight: 400,
                      color: HEADING,
                      backgroundColor: "rgba(244, 242, 234, 0.12)",
                      borderRadius: 999,
                      padding: "6px 14px",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: 22,
                fontWeight: 400,
                color: MUTED,
                marginTop: 22,
              }}
            >
              {card.meta ? `${siteConfig.name} · ${card.meta}` : siteConfig.name}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 22,
                marginTop: 16,
              }}
            >
              {articleOgSocials.map((social, index) => (
                <div
                  key={social.platform}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  <img
                    src={socialIcons[index]}
                    width={21}
                    height={21}
                    alt=""
                    style={{ width: 21, height: 21 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "Inter",
                      fontSize: 17,
                      fontWeight: 400,
                      color: HEADING,
                    }}
                  >
                    {social.handle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...articleOgSize,
      fonts,
    },
  );
}

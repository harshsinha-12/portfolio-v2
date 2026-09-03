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

export type ArticleOgCard = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  tags?: string[];
};

type OgAssets = {
  photoSrc: string;
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
  const { photoSrc, fonts } = await loadOgAssets();
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

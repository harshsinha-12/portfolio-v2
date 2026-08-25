"use client";

import { createElement, useState } from "react";
import Image from "next/image";
import { Polaroid } from "@/components/decor/Decor";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  getDisplayDomain,
  getFaviconUrl,
  getLinkIcon,
  getLocalFavicon,
} from "@/lib/linkIcons";
import {
  getLinkPreviewCaption,
  getLinkPreviewImage,
  getLinkPreviewImageSources,
} from "@/data/linkPreviews";
import { useOpenGraphPreview } from "@/lib/useOpenGraphPreview";
import { cn } from "@/lib/utils";

const PREVIEW_SIZES = "9rem";
const PREVIEW_WIDTH = 480;
const PREVIEW_HEIGHT = 360;

type LinkPreviewProps = {
  href: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

type PreviewImage =
  | { kind: "local"; src: string }
  | { kind: "remote"; src: string };

function isLocalAsset(src: string) {
  return src.startsWith("/");
}

function LinkIcon({ href }: { href: string }) {
  const [faviconFailed, setFaviconFailed] = useState(false);
  const brandIcon = getLinkIcon(href);
  const local = getLocalFavicon(href);

  if (brandIcon) {
    return createElement(brandIcon, {
      size: 20,
      "aria-hidden": true,
      className: "shrink-0 text-[var(--color-ink)]",
    });
  }

  if (local && !faviconFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={local}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 shrink-0 rounded-sm object-cover"
        onError={() => setFaviconFailed(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getFaviconUrl(href)}
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 shrink-0 rounded-sm"
      onError={() => setFaviconFailed(true)}
    />
  );
}

function PreviewPhoto({
  image,
  onError,
}: {
  image: PreviewImage;
  onError: () => void;
}) {
  switch (image.kind) {
    case "local":
      return (
        <Image
          src={image.src}
          alt=""
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          sizes={PREVIEW_SIZES}
          className="h-full w-full object-cover"
          onError={onError}
        />
      );
    case "remote":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt=""
          className="h-full w-full object-cover"
          onError={onError}
        />
      );
    default: {
      const _exhaustive: never = image;
      return _exhaustive;
    }
  }
}

function TextPreview({
  href,
  title,
  description,
  domain,
}: {
  href: string;
  title?: string;
  description?: string;
  domain: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3">
      <LinkIcon href={href} />
      <div className="min-w-0">
        {title && (
          <p className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
            {title}
          </p>
        )}
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
            {description}
          </p>
        )}
        <p className="mt-1.5 truncate text-xs text-[var(--color-ink-subtle)]">{domain}</p>
      </div>
    </div>
  );
}

function PolaroidPreview({
  image,
  caption,
  onImageError,
}: {
  image: PreviewImage;
  caption: string;
  onImageError: () => void;
}) {
  return (
    <div className="link-preview-pop">
      <Polaroid
        rotation={-2}
        className="w-36 shrink-0 !p-1.5 !pb-0 sm:!p-1.5 sm:!pb-0"
        imageClassName="aspect-[4/3]"
        captionClassName="!mt-0 flex h-6 items-center justify-center"
        image={<PreviewPhoto image={image} onError={onImageError} />}
        caption={
          <p className="text-center font-hand text-[0.8125rem] leading-none text-[var(--color-ink)]">
            {caption}
          </p>
        }
      />
    </div>
  );
}

export function LinkPreview({
  href,
  children,
  title,
  description,
  className,
  ariaLabel,
  onClick,
}: LinkPreviewProps) {
  const domain = getDisplayDomain(href);
  const caption = getLinkPreviewCaption(href);
  const mappedImage = getLinkPreviewImage(href);
  const localPreviewKey = mappedImage ? `${href}|${mappedImage}` : null;
  const [failedLocalKey, setFailedLocalKey] = useState<string | null>(null);
  const [failedRemoteSrc, setFailedRemoteSrc] = useState<string | null>(null);

  const localFailed = localPreviewKey !== null && failedLocalKey === localPreviewKey;
  const ogPreview = useOpenGraphPreview(href, !mappedImage || localFailed);

  const localSrc = mappedImage && !localFailed ? mappedImage : null;
  const remoteSrc = ogPreview?.image;
  const remoteFailed = remoteSrc !== null && remoteSrc !== undefined && failedRemoteSrc === remoteSrc;
  const imageSrc = localSrc ?? (remoteSrc && !remoteFailed ? remoteSrc : null);
  const previewImage: PreviewImage | null = imageSrc
    ? isLocalAsset(imageSrc)
      ? { kind: "local", src: imageSrc }
      : { kind: "remote", src: imageSrc }
    : null;

  return (
    <HoverCard openDelay={140} closeDelay={120}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          onClick={onClick}
          className={className ?? "marker-link"}
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="center"
        sideOffset={10}
        className={cn(
          previewImage
            ? "w-max overflow-visible border-0 bg-transparent p-0 shadow-none animate-none"
            : "w-64",
        )}
      >
        {previewImage ? (
          <PolaroidPreview
            image={previewImage}
            caption={caption}
            onImageError={() => {
              if (localSrc && localPreviewKey) setFailedLocalKey(localPreviewKey);
              else if (remoteSrc) setFailedRemoteSrc(remoteSrc);
            }}
          />
        ) : (
          <TextPreview
            href={href}
            title={title}
            description={description}
            domain={domain}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export function MarkerLink(props: LinkPreviewProps) {
  return <LinkPreview {...props} className="marker-link" />;
}

export function LinkPreviewImagePreloader() {
  const sources = getLinkPreviewImageSources();

  return (
    <div className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
      {sources.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          sizes={PREVIEW_SIZES}
          loading="eager"
        />
      ))}
    </div>
  );
}

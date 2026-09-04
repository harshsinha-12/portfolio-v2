"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import {
  githubGraphConfig,
  introBullets,
  profileStickers,
  resumeLink,
  siteConfig,
  socialMedia,
} from "@/data/portfolio";
import { isHttpUrl } from "@/data/linkPreviews";
import { socialIconMap } from "@/lib/icons";
import { LinkPreview, LinkPreviewImagePreloader } from "@/components/ui/LinkPreview";
import { IntroSegments } from "@/components/ui/IntroSegments";
import { GitHubGraph } from "@/components/sections/GitHubGraph";
import { SpotifyLastPlayed } from "@/components/sections/SpotifyLastPlayed";
import { CutoutStickers } from "@/components/decor/CutoutStickers";
import { Polaroid, Stamp, StickyNote, TapedCard } from "@/components/decor/Decor";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { track, trackOutboundClick } from "@/lib/analytics";
import type { ContributionDay } from "@/lib/githubContributions";

function SocialStamps() {
  const stampLinkClassName =
    "flex h-4 w-4 items-center justify-center transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:h-6 sm:w-6";

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {socialMedia.map((social) => {
        const Icon = socialIconMap[social.platform];
        const onSocialClick = () =>
          track("social_link_clicked", {
            platform: social.platform,
            placement: "profile",
          });

        return (
          <Stamp
            key={social.id}
            rotation={social.platform === "github" ? 3 : -3}
            className="!border !px-1 !py-0.5 sm:!border-2 sm:!px-1.5 sm:!py-1"
          >
            {isHttpUrl(social.link) ? (
              <LinkPreview
                href={social.link}
                ariaLabel={social.label}
                className={stampLinkClassName}
                analytics={{ kind: "social", platform: social.platform, placement: "profile" }}
                onClick={onSocialClick}
              >
                <Icon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
              </LinkPreview>
            ) : (
              <a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={stampLinkClassName}
                onClick={() => {
                  trackOutboundClick(social.link, {
                    kind: "social",
                    label: social.label,
                    platform: social.platform,
                    placement: "profile",
                  });
                  onSocialClick();
                }}
              >
                <Icon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
              </a>
            )}
          </Stamp>
        );
      })}
    </div>
  );
}

function MobileTagline() {
  const lastBreak = siteConfig.tagline.lastIndexOf(" · ");

  if (lastBreak === -1) {
    return (
      <span className="inline-flex flex-wrap items-center gap-x-1.5">
        {siteConfig.tagline}
        <SoundToggle />
      </span>
    );
  }

  return (
    <>
      {siteConfig.tagline.slice(0, lastBreak)}
      <br />
      <span className="inline-flex items-center gap-x-1.5">
        {siteConfig.tagline.slice(lastBreak + 3)}
        <SoundToggle />
      </span>
    </>
  );
}

function ProfileHeader() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 lg:items-start lg:gap-x-3">
      <h1
        id="profile-heading"
        className="col-start-1 row-start-1 min-w-0 text-xl font-semibold leading-none tracking-tight text-shadow-on-mat text-[var(--color-heading-on-mat)] sm:text-2xl lg:text-3xl"
      >
        {siteConfig.name}
      </h1>
      <div className="col-start-2 row-start-1 self-center lg:self-start">
        <SocialStamps />
      </div>
      <p className="col-start-1 row-start-2 mt-1.5 hidden items-center gap-x-1.5 font-hand leading-snug text-[var(--color-accent-on-mat)] lg:flex lg:text-lg">
        <span>{siteConfig.tagline}</span>
        <SoundToggle />
      </p>
    </div>
  );
}

function IntroList() {
  return (
    <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)] sm:text-sm">
      {introBullets.map((bullet) => (
        <li key={bullet.id} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
          <span>
            <IntroSegments segments={bullet.segments} />
          </span>
        </li>
      ))}
    </ul>
  );
}

type ProfileSectionProps = {
  initialContributions?: ContributionDay[];
};

export function ProfileSection({ initialContributions }: ProfileSectionProps) {
  return (
    <section id="profile" aria-labelledby="profile-heading" className="relative animate-fade-up">
      <LinkPreviewImagePreloader />
      <div className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-[minmax(0,11rem)_1fr] lg:items-start lg:gap-6">
        <div className="flex items-start gap-3 lg:contents">
          <div className="flex w-fit shrink-0 flex-col items-start lg:col-start-1 lg:row-start-1 lg:row-span-3 lg:z-[35]">
            <Polaroid
              rotation={-4}
              pinned
              className="w-fit shrink-0 !rotate-[-2deg] !p-1.5 !pb-5 sm:!p-2 sm:!pb-6 lg:!rotate-[-4deg] lg:!pb-8"
            >
              <Image
                src="/assets/profile-pic.jpg"
                alt="Harsh Sinha"
                width={140}
                height={140}
                sizes="(min-width: 1024px) 140px, (min-width: 640px) 80px, 64px"
                className="h-16 w-16 object-cover sm:h-20 sm:w-20 lg:h-[8.75rem] lg:w-[8.75rem]"
                preload
              />
            </Polaroid>
          </div>

          <div className="min-w-0 flex-1 lg:col-start-2 lg:row-start-1">
            <ProfileHeader />
            <p className="mt-3 block w-full font-hand text-base leading-snug text-[var(--color-accent-on-mat)] lg:hidden">
              <MobileTagline />
            </p>
            <SpotifyLastPlayed className="mt-2.5" />
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("resume_clicked", { kind: "resume" });
                trackOutboundClick(resumeLink, { kind: "resume", label: "resume" });
              }}
              className="mt-2 inline-flex h-7 items-center gap-1.5 rounded-full border border-[var(--color-on-mat)]/35 bg-[var(--color-mat-deep)]/45 px-2.5 text-[11px] font-medium text-[var(--color-on-mat)] shadow-[1px_2px_0_var(--color-shadow)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-mat-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:text-xs"
            >
              <FileText className="h-3.5 w-3.5 text-[var(--color-accent-on-mat)]" aria-hidden="true" />
              Résumé
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <StickyNote
          rotation={1.2}
          color="yellow"
          className="mt-[2pt] w-full lg:col-start-2 lg:row-start-2 lg:mt-0"
        >
          <IntroList />
        </StickyNote>

        <div className="relative w-full lg:col-start-2 lg:row-start-3">
          <CutoutStickers stickers={profileStickers} />
          <TapedCard
            rotation={-0.4}
            className="w-full max-lg:!rotate-0 lg:w-fit lg:max-w-full [&>div]:p-3"
          >
            <GitHubGraph
              username={siteConfig.githubUsername}
              {...githubGraphConfig}
              initialDays={initialContributions}
              className="w-full min-w-0"
            />
          </TapedCard>
        </div>
      </div>
    </section>
  );
}

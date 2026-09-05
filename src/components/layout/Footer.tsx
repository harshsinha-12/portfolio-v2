"use client";

import { connectLink, socialMedia } from "@/data/portfolio";
import { socialIconMap } from "@/lib/icons";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { isHttpUrl } from "@/data/linkPreviews";
import { VisitorQuoteCard } from "@/components/layout/VisitorQuoteCard";
import { CreditsLink } from "@/components/layout/CreditsNote";
import { track, trackOutboundClick } from "@/lib/analytics";

const socialButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-on-mat)]/40 bg-[var(--color-mat)]/50 text-[var(--color-on-mat)] shadow-[2px_3px_0_var(--color-shadow)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-[var(--space-3xl)] pb-[var(--space-2xl)] text-center text-shadow-on-mat">
      <VisitorQuoteCard />
      <div className="mb-[var(--space-md)] flex justify-center gap-3">
        {socialMedia.map((social) => {
          const Icon = socialIconMap[social.platform];
          const onSocialClick = () =>
            track("social_link_clicked", {
              platform: social.platform,
              placement: "footer",
            });

          if (isHttpUrl(social.link)) {
            return (
              <LinkPreview
                key={social.id}
                href={social.link}
                ariaLabel={social.label}
                className={socialButtonClassName}
                analytics={{ kind: "social", platform: social.platform, placement: "footer" }}
                onClick={onSocialClick}
              >
                <Icon size={16} aria-hidden="true" />
              </LinkPreview>
            );
          }

          return (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={socialButtonClassName}
              onClick={() => {
                trackOutboundClick(social.link, {
                  kind: "social",
                  label: social.label,
                  platform: social.platform,
                  placement: "footer",
                });
                onSocialClick();
              }}
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          );
        })}
      </div>
      <div className="mt-2 text-sm text-[var(--color-on-mat)]/85">
        <LinkPreview
          href={connectLink}
          title="Connect"
          description="Connect on LinkedIn"
          onClick={() => track("connect_link_clicked", { placement: "footer" })}
          analytics={{ kind: "connect", placement: "footer" }}
        >
          <span className="marker-link marker-link--on-mat !text-[var(--color-on-mat)]">Connect</span>
        </LinkPreview>
        {" · "}© {year} Harsh Sinha
        {" · "}
        <CreditsLink />
      </div>
      <p className="mt-3 text-sm text-[var(--color-on-mat)]/85">
        AI agent?{" "}
        <a
          href="/llms-full.txt"
          className="marker-link marker-link--on-mat !text-[var(--color-on-mat)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
        >
          Here’s my llms-full.txt
        </a>
      </p>
    </footer>
  );
}

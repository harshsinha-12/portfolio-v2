"use client";

import { connectLink, socialMedia } from "@/data/portfolio";
import { socialIconMap } from "@/lib/icons";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { isHttpUrl } from "@/data/linkPreviews";

const socialButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-on-mat)]/40 bg-[var(--color-mat)]/50 text-[var(--color-on-mat)] shadow-[2px_3px_0_var(--color-shadow)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-[var(--space-3xl)] pb-[var(--space-2xl)] text-center text-shadow-on-mat">
      <div className="mb-[var(--space-md)] flex justify-center gap-3">
        {socialMedia.map((social) => {
          const Icon = socialIconMap[social.platform];
          if (isHttpUrl(social.link)) {
            return (
              <LinkPreview
                key={social.id}
                href={social.link}
                ariaLabel={social.label}
                className={socialButtonClassName}
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
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-[var(--color-on-mat)]/85">
        <LinkPreview href={connectLink} title="Connect" description="Say hi on X">
          <span className="marker-link marker-link--on-mat !text-[var(--color-on-mat)]">Connect</span>
        </LinkPreview>
        {" · "}© {year} Harsh Sinha
      </p>
    </footer>
  );
}

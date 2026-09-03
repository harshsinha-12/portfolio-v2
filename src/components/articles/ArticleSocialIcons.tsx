"use client";

import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { socialMedia } from "@/data/portfolio";
import { isHttpUrl } from "@/data/linkPreviews";
import { track, trackOutboundClick } from "@/lib/analytics";

type ArticleSocialIconsProps = {
  variant: "topbar" | "footer";
};

const ICONS = [
  { platform: "linkedin" as const, label: "LinkedIn", Icon: AiFillLinkedin },
  { platform: "github" as const, label: "GitHub", Icon: AiFillGithub },
  { platform: "twitter" as const, label: "X", Icon: FaXTwitter },
];

function socialUrl(platform: "twitter" | "linkedin" | "github") {
  return socialMedia.find((item) => item.platform === platform)?.link ?? "#";
}

export function ArticleSocialIcons({ variant }: ArticleSocialIconsProps) {
  const placement = variant === "topbar" ? "article_topbar" : "article_footer";

  return (
    <>
      {ICONS.map(({ platform, label, Icon }) => {
        const href = socialUrl(platform);
        const onSocialClick = () =>
          track("social_link_clicked", { platform, placement });

        if (!isHttpUrl(href)) {
          return (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onClick={() => {
                trackOutboundClick(href, { label, platform });
                onSocialClick();
              }}
            >
              <Icon aria-hidden="true" />
            </a>
          );
        }

        return (
          <LinkPreview
            key={platform}
            href={href}
            ariaLabel={label}
            className=""
            side={variant === "topbar" ? "bottom" : "top"}
            onClick={onSocialClick}
          >
            <Icon aria-hidden="true" />
          </LinkPreview>
        );
      })}
    </>
  );
}

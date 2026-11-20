import { siteConfig, socialMedia, type SocialLink } from "@/data/portfolio";

export type ConnectKey = "site" | "linkedin" | "twitter";

export type ConnectDestination = {
  key: ConnectKey;
  label: string;
  hint: string;
  href: string;
};

function socialHref(platform: SocialLink["platform"]): string {
  const link = socialMedia.find((item) => item.platform === platform)?.link;
  if (!link) {
    throw new Error(`Missing ${platform} link in portfolio data`);
  }
  return link;
}

/** The address encoded in the QR. Scanning opens the chooser, not one network. */
export const connectUrl = `${siteConfig.url}/go`;

export const connectDestinations: readonly ConnectDestination[] = [
  {
    key: "site",
    label: "Website",
    hint: "harshsinha.dev",
    href: siteConfig.url,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    hint: "harshsinha12",
    href: socialHref("linkedin"),
  },
  {
    key: "twitter",
    label: "Twitter",
    hint: "@sinhaharsh12",
    href: socialHref("twitter"),
  },
];

export function connectDestination(key: string | undefined): ConnectDestination | undefined {
  return connectDestinations.find((destination) => destination.key === key);
}

import type { Metadata } from "next";
import { Inter, Indie_Flower } from "next/font/google";
import { siteConfig } from "@/data/portfolio";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const indieFlower = Indie_Flower({
  variable: "--font-indie-flower",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Harsh Sinha",
    "AI Engineer",
    "Multibagg AI",
    "IFF-FinTech Olympiad’24",
    "IITP'27",
    "Software Developer",
    "Quant",
    "Backend",
    "AI Agents",
    "Portfolio",
  ],
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@mittalparth_",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Harsh Sinha",
  jobTitle: "Looking for AI Engineering roles",
  worksFor: {
    "@type": "Organization",
    name: "Multibagg AI",
    url: "https://www.oracle.com",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "National Institute of Technology Karnataka",
      url: "https://www.nitk.ac.in/",
    },
  ],
  url: siteUrl,
  sameAs: [
    "https://www.linkedin.com/in/mittal-parth",
    "https://github.com/mittal-parth",
    "https://www.twitter.com/mittalparth_",
  ],
  image: `${siteUrl}/assets/profile-pic.jpg`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${indieFlower.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

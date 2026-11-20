import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MatSurface } from "@/components/canvas/MatSurface";
import { SiteVisitorTracker } from "@/components/analytics/SiteVisitorTracker";
import { ConnectChooser } from "@/components/connect/ConnectChooser";
import { connectDestination } from "@/lib/connect";

export const metadata: Metadata = {
  title: "Connect",
  description: "Harsh Sinha — website, LinkedIn, or Twitter.",
  alternates: { canonical: "/go" },
  openGraph: {
    title: "Harsh Sinha",
    description: "Website, LinkedIn, or Twitter.",
    url: "/go",
    images: ["/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Sinha",
    description: "Website, LinkedIn, or Twitter.",
    creator: "@sinhaharsh12",
    images: ["/og.jpg"],
  },
};

type GoPageProps = {
  searchParams: Promise<{ to?: string | string[] }>;
};

export default async function GoPage({ searchParams }: GoPageProps) {
  const params = await searchParams;
  const key = Array.isArray(params.to) ? params.to[0] : params.to;
  const destination = connectDestination(key);
  if (destination) redirect(destination.href);

  return (
    <>
      <MatSurface />
      <SiteVisitorTracker />
      <ConnectChooser />
    </>
  );
}

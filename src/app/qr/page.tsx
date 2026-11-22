import type { Metadata } from "next";
import { MatSurface } from "@/components/canvas/MatSurface";
import { QrActions } from "@/components/connect/QrActions";
import { connectCardSvg } from "@/lib/connect-card";

export const metadata: Metadata = {
  title: "QR card",
  description: "A single QR card for Harsh Sinha's website, LinkedIn, Twitter, and GitHub.",
  alternates: { canonical: "/qr" },
  robots: { index: false, follow: false },
};

export default function QrPage() {
  const svg = connectCardSvg();

  return (
    <>
      <style>{`@media print { body { background: white !important; } }`}</style>
      <MatSurface className="print:hidden" />
      <main className="relative z-10 mx-auto grid min-h-dvh w-full max-w-5xl items-center gap-8 px-4 py-8 pb-36 sm:px-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16 lg:py-12 lg:pb-12">
        <div
          className="order-2 mx-auto w-full max-w-[440px] lg:order-1 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div className="order-1 lg:order-2">
          <QrActions />
        </div>
      </main>
    </>
  );
}

"use client";

import Image from "next/image";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { Polaroid } from "@/components/decor/Decor";
import { connectDestinations, type ConnectDestination } from "@/lib/connect";
import { track, trackOutboundClick } from "@/lib/analytics";
import { siteConfig } from "@/data/portfolio";

const tilts = [-1.15, 0.65, -0.4, 0.85] as const;

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="3.4" ry="8.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12h16M6.2 8.2h11.6M6.2 15.8h11.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DestinationIcon({ destination }: { destination: ConnectDestination }) {
  if (destination.key === "linkedin") return <AiFillLinkedin className="h-5 w-5" aria-hidden="true" />;
  if (destination.key === "twitter") return <FaXTwitter className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />;
  if (destination.key === "github") return <AiFillGithub className="h-5 w-5" aria-hidden="true" />;
  return <GlobeIcon />;
}

export function ConnectChooser() {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:justify-center sm:py-16">
      <header className="animate-fade-up flex items-end gap-3.5">
        <Polaroid
          pinned
          rotation={-6}
          className="w-[5.4rem] shrink-0 !p-1.5 !pb-4 shadow-[3px_4px_0_var(--color-shadow)]"
        >
          <Image
            src="/assets/profile-pic.jpg"
            alt="Harsh Sinha"
            width={140}
            height={140}
            sizes="80px"
            preload
            className="h-[4.4rem] w-full object-cover"
          />
        </Polaroid>
        <div className="min-w-0 pb-1">
          <p className="font-hand text-[1.65rem] leading-none text-[var(--color-accent-on-mat)]">you scanned</p>
          <h1 className="text-shadow-on-mat mt-1.5 text-[1.85rem] leading-none font-semibold tracking-tight text-[var(--color-heading-on-mat)]">
            {siteConfig.name}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-on-mat)]/80">AI engineer at Scalio</p>
        </div>
      </header>

      <p className="animate-fade-up mt-8 text-[0.95rem] leading-relaxed text-[var(--color-on-mat)]/75" style={{ animationDelay: "60ms" }}>
        Pick where to go. This code always opens the same four places.
      </p>

      <ul className="mt-4 flex list-none flex-col gap-3.5 p-0">
        {connectDestinations.map((destination, index) => (
          <li key={destination.key} className="animate-fade-up" style={{ animationDelay: `${140 + index * 70}ms` }}>
            <a
              href={destination.href}
              className="group flex min-h-[4.75rem] items-center gap-3.5 rounded-[1.35rem] border-4 border-white bg-[var(--color-paper)] px-3.5 py-3 shadow-[4px_6px_0_var(--color-shadow)] transition-[transform,box-shadow] duration-200 motion-safe:[transform:rotate(var(--tilt))] motion-safe:hover:[transform:rotate(0deg)_translateY(-3px)] motion-safe:hover:shadow-[5px_8px_0_var(--color-shadow)] motion-safe:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-on-mat)]"
              style={{ "--tilt": `${tilts[index]}deg` } as React.CSSProperties}
              onClick={() => {
                track("connect_destination_clicked", {
                  destination: destination.key,
                  placement: "connect",
                });
                if (destination.key !== "site") {
                  trackOutboundClick(destination.href, {
                    kind: "connect",
                    platform: destination.key,
                    placement: "connect",
                  });
                }
              }}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-[var(--color-paper)]">
                <DestinationIcon destination={destination} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.05rem] leading-tight font-semibold text-[var(--color-ink)]">
                  {destination.label}
                </span>
                <span className="mt-0.5 block truncate text-sm text-[var(--color-ink-muted)]">{destination.hint}</span>
              </span>
              <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-[var(--color-accent)] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M7 4.5 12.5 10 7 15.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AiFillGithub } from "react-icons/ai";
import { WashiTape } from "@/components/decor/PushPin";
import { buttonVariants } from "@/components/ui/button";
import { track, trackOutboundClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const UPSTREAM_HREF = "https://github.com/mittal-parth/portfolio-v2";
const UPSTREAM_LABEL = "mittal-parth/portfolio-v2";

function closeDurationMs(): number {
  if (typeof window === "undefined") return 240;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : 240;
}

export function CreditsLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.classList.remove("is-closing");
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (!dialog.open) return;

    dialog.classList.add("is-closing");
    const timeout = window.setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-closing");
    }, closeDurationMs());

    return () => window.clearTimeout(timeout);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "marker-link marker-link--on-mat inline-flex items-center gap-1 !text-[var(--color-on-mat)]",
          className,
        )}
        onClick={() => {
          track("credits_opened");
          setOpen(true);
        }}
      >
        Credits
        <span aria-hidden="true">❤️</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="credits-title"
        className="credits-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        onClose={() => setOpen(false)}
      >
        <div className="credits-card relative w-[min(100%,34rem)] rounded-[1.15rem] bg-[var(--color-paper)] px-8 pb-5 pt-7 shadow-[5px_8px_0_var(--color-shadow)]">
          <WashiTape className="left-1/2 top-0 h-4 w-14 -translate-x-1/2 -translate-y-1/2 opacity-80" rotation={-3} />

          <button
            type="button"
            aria-label="Close credits"
            className="absolute right-3 top-3 rounded-full p-1 text-[var(--color-ink-subtle)] transition-colors hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            onClick={() => setOpen(false)}
          >
            <X size={16} strokeWidth={2.25} />
          </button>

          <h2
            id="credits-title"
            className="font-hand text-2xl leading-none text-[var(--color-ink)]"
          >
            credits
            <span className="ml-1.5 text-[1.05rem] text-[var(--color-accent)]" aria-hidden="true">
              ❤
            </span>
          </h2>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)] antialiased">
            originally based on and redesigned on top of
          </p>
          <a
            href={UPSTREAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="marker-link mt-1 inline-block text-[0.9375rem] font-medium antialiased"
            onClick={() =>
              trackOutboundClick(UPSTREAM_HREF, {
                label: UPSTREAM_LABEL,
                placement: "credits",
              })
            }
          >
            {UPSTREAM_LABEL}
          </a>

          <a
            href={UPSTREAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-5 ml-auto flex w-fit",
            )}
            onClick={() =>
              trackOutboundClick(UPSTREAM_HREF, {
                label: "view repository",
                placement: "credits",
              })
            }
          >
            <AiFillGithub size={14} aria-hidden="true" />
            view repository
          </a>
        </div>
      </dialog>
    </>
  );
}

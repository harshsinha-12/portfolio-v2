import Image from "next/image";
import { createElement } from "react";
import { TapedCard } from "@/components/decor/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techStack } from "@/data/portfolio";
import { getStackIcon, getStackImageIcon } from "@/lib/icons";

const brandColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#e2c313",
  Python: "#3776ab",
  React: "#087ea4",
  "Next.js": "#111111",
  "Node.js": "#5fa04e",
  Fastify: "#111111",
  "Tailwind CSS": "#06b6d4",
  OpenAI: "#111111",
  PostgreSQL: "#4169e1",
  Prisma: "#2d3748",
  Redis: "#ff4438",
  Qdrant: "#dc244c",
  Docker: "#2496ed",
  Azure: "#0078d4",
  Grafana: "#f46800",
  Git: "#f05032",
  GitHub: "#181717",
  Razorpay: "#2b59ff",
  FFmpeg: "#007808",
  Vitest: "#6e9f18",
  Zod: "#3e67b1",
};

function TechMark({ name }: { name: string }) {
  const Icon = getStackIcon(name);
  const imageIcon = getStackImageIcon(name);

  return (
    <li className="group relative flex min-w-0 justify-center">
      <span
        tabIndex={0}
        aria-label={name}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-ink)]/10 bg-white/45 shadow-[1px_2px_0_var(--color-shadow)] transition-[transform,background-color] duration-[var(--dur-fast)] hover:-translate-y-1 hover:bg-white/80 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:h-14 sm:w-14"
        style={{ color: brandColors[name] ?? "var(--color-ink)" }}
      >
        {imageIcon ? (
          <Image
            src={imageIcon}
            alt=""
            width={30}
            height={30}
            sizes="30px"
            className="h-[1.65rem] w-[1.65rem] object-contain sm:h-[1.9rem] sm:w-[1.9rem]"
          />
        ) : Icon ? (
          createElement(Icon, {
            className: "h-7 w-7 sm:h-8 sm:w-8",
            "aria-hidden": true,
          })
        ) : (
          <span className="text-sm font-semibold" aria-hidden="true">
            {name.slice(0, 2)}
          </span>
        )}
      </span>
      <span className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] left-1/2 z-20 w-max max-w-36 -translate-x-1/2 translate-y-1 rounded-md bg-[var(--color-ink)] px-2.5 py-1 text-center text-[11px] font-medium leading-tight text-[var(--color-paper)] opacity-0 shadow-[2px_3px_0_var(--color-shadow)] transition-[opacity,transform] duration-[var(--dur-fast)] before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-[var(--color-ink)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {name}
      </span>
    </li>
  );
}

export function TechStackSection() {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="relative animate-fade-up scroll-mt-24"
    >
      <SectionHeading id="tech-stack-heading" title="Tech" accent="I build with" onMat />
      <TapedCard rotation={0.35} className="max-lg:!rotate-0">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-subtle)]">
              Production toolkit
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              The languages, frameworks and infrastructure behind my work.
            </p>
          </div>
          <p className="font-hand text-sm text-[var(--color-accent)]">hover a mark ✦</p>
        </div>
        <ul
          className="grid grid-cols-4 gap-x-3 gap-y-5 min-[440px]:grid-cols-6 sm:grid-cols-8 lg:grid-cols-12"
          aria-label="Technology stack"
        >
          {techStack.map((tech) => (
            <TechMark key={tech.name} name={tech.name} />
          ))}
        </ul>
      </TapedCard>
    </section>
  );
}

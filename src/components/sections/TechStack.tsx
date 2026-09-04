import Image from "next/image";
import { createElement } from "react";
import {
  FiBell,
  FiClock,
  FiDatabase,
  FiLayers,
  FiMail,
  FiRefreshCw,
  FiSend,
} from "react-icons/fi";
import {
  LuWorkflow,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { TapedCard } from "@/components/decor/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  techWorkshopMap,
  type ProjectStackItem,
  type TechWorkshopGroup,
} from "@/data/portfolio";
import { getStackIcon, getStackImageIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const brandColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#d4b600",
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
  "Vue.js": "#42b883",
  "Express.js": "#111111",
  Jest: "#99425b",
  MongoDB: "#47a248",
  "WhatsApp Business API": "#25d366",
  "C++": "#00599c",
  "RESTful APIs": "#6b5bd2",
  "Authentication and 2FA": "#eb5424",
  "AWS SES": "#d97706",
  LangChain: "#1c3c3c",
  LangGraph: "#241c1d",
  TensorFlow: "#ff6f00",
  PyTorch: "#ee4c2c",
  "scikit-learn": "#f7931e",
  Keras: "#d00000",
  Pandas: "#150458",
  NumPy: "#4d77cf",
};

const conceptIcons: Record<string, IconType> = {
  SQL: FiDatabase,
  "Cron jobs": FiClock,
  Caching: FiRefreshCw,
  "Background processing": FiLayers,
  "Event-driven architecture": LuWorkflow,
  "AWS SES": FiMail,
  "Realtime alerting": FiBell,
  "Transactional email": FiSend,
  OOP: FiLayers,
};

function ToolIcon({ name, compact = false }: { name: string; compact?: boolean }) {
  const Icon = getStackIcon(name) ?? conceptIcons[name];
  const imageIcon = getStackImageIcon(name);
  const size = compact ? 14 : 18;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-[var(--color-ink)]/10 bg-white/60 shadow-[1px_2px_0_var(--color-shadow)]",
        compact ? "h-8 w-8" : "h-8 w-8 sm:h-9 sm:w-9",
      )}
      style={{ color: brandColors[name] ?? "var(--color-ink-muted)" }}
      aria-hidden="true"
    >
      {imageIcon ? (
        <Image
          src={imageIcon}
          alt=""
          width={size}
          height={size}
          sizes={`${size}px`}
          className="object-contain"
          style={{ width: size, height: size }}
        />
      ) : Icon ? (
        createElement(Icon, { size })
      ) : null}
    </span>
  );
}

function ToolRow({ tool }: { tool: ProjectStackItem }) {
  return (
    <li className="group flex min-w-0 items-center gap-2 rounded-lg px-1 py-0.5 transition-transform duration-[var(--dur-fast)] hover:translate-x-1">
      <ToolIcon name={tool.name} />
      <span className="font-hand text-[15px] font-semibold leading-tight text-[var(--color-ink)] sm:text-base">
        {tool.name}
      </span>
    </li>
  );
}

function groupId(title: string) {
  return `workshop-${title.toLowerCase().replaceAll(" ", "-").replace("/", "-")}`;
}

function MapGroup({
  group,
  columns = 1,
  className,
}: {
  group: TechWorkshopGroup;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const headingId = groupId(group.title);

  return (
    <section className={className} aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="font-hand text-[1.35rem] font-semibold uppercase tracking-wide text-[var(--color-mat)] underline decoration-[var(--color-accent)]/55 decoration-2 underline-offset-4"
      >
        {group.title}
      </h3>
      <p className="mt-1 max-w-44 font-hand text-sm leading-snug text-[var(--color-ink-muted)]">
        {group.description}
      </p>
      <ul
        className={cn(
          "mt-3 grid gap-x-3 gap-y-0.5",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-2 sm:grid-cols-3",
        )}
      >
        {group.items.map((tool) => <ToolRow key={tool.name} tool={tool} />)}
      </ul>
    </section>
  );
}

function FlowArrow() {
  return <span className="workshop-flow-arrow" aria-hidden="true" />;
}

function BranchConnector() {
  return (
    <div className="workshop-branch" aria-hidden="true">
      <span className="workshop-branch__stem" />
      <span className="workshop-branch__curl workshop-branch__curl--left" />
      <span className="workshop-branch__curl workshop-branch__curl--right" />
    </div>
  );
}

function ShelfTool({ tool, priority = false }: { tool: ProjectStackItem; priority?: boolean }) {
  return (
    <li className="group flex min-w-0 flex-col items-center gap-1.5 text-center transition-transform duration-[var(--dur-fast)] hover:-translate-y-1">
      <ToolIcon name={tool.name} compact={!priority} />
      <span className={cn(
        "max-w-24 font-hand font-semibold leading-tight text-[var(--color-ink-muted)]",
        priority ? "text-[11px] sm:text-xs" : "text-[10px] sm:text-[11px]",
      )}>
        {tool.name}
      </span>
    </li>
  );
}

function ToolShelf({ group, priority = false }: { group: TechWorkshopGroup; priority?: boolean }) {
  const headingId = groupId(group.title);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(priority && "relative -mx-2 bg-[oklch(94%_0.018_145)]/55 px-2 py-4 sm:-mx-3 sm:px-3")}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 id={headingId} className={cn(
          "font-hand font-semibold uppercase tracking-wide text-[var(--color-mat)]",
          priority ? "text-2xl" : "text-lg",
        )}>
          {group.title}
        </h3>
        <p className={cn(
          "font-hand text-[var(--color-ink-subtle)]",
          priority ? "text-sm" : "text-xs",
        )}>{group.description}</p>
      </div>
      <ul className={cn(
        "mt-3 grid gap-x-2 gap-y-4",
        priority
          ? "grid-cols-3 min-[480px]:grid-cols-4 sm:grid-cols-6 lg:grid-cols-12"
          : "grid-cols-4 min-[480px]:grid-cols-6 sm:grid-cols-7 lg:grid-cols-[repeat(13,minmax(0,1fr))]",
      )}>
        {group.items.map((tool) => <ShelfTool key={tool.name} tool={tool} priority={priority} />)}
      </ul>
    </section>
  );
}

export function TechStackSection() {
  return (
    <section id="tech-stack" aria-labelledby="tech-stack-heading" className="relative animate-fade-up scroll-mt-24">
      <SectionHeading id="tech-stack-heading" title="Tech" accent="I build with" onMat />
      <TapedCard rotation={0.2} className="max-lg:!rotate-0">
        <div className="flex flex-col gap-2 border-b border-dashed border-[var(--color-ink)]/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-subtle)]">Workshop map</p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">How the pieces connect to build and ship things.</p>
          </div>
          <p className="font-hand text-sm text-[var(--color-accent)]">follow the build →</p>
        </div>

        <div className="relative mt-5 grid gap-6 lg:grid-cols-[8.5rem_minmax(0,1fr)]">
          <aside className="relative z-10 h-fit -rotate-2 rounded-sm bg-[oklch(93%_0.035_145)] p-3 shadow-[2px_3px_0_var(--color-shadow)]">
            <p className="font-hand text-base font-semibold text-[var(--color-mat)]">Built around the problem</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">Not a checklist—a map of the systems I reach for.</p>
          </aside>

          <div className="relative z-10">
            <div className="grid gap-2 lg:grid-cols-[1fr_auto_.7fr_auto_1.45fr] lg:items-start">
              <MapGroup group={techWorkshopMap.product} className="workshop-stage workshop-stage--bracketed" />
              <FlowArrow />
              <MapGroup group={techWorkshopMap.api} className="workshop-stage workshop-stage--bracketed" />
              <FlowArrow />
              <div className="relative">
                <MapGroup group={techWorkshopMap.data} columns={2} />
                <p className="ml-auto mt-1 hidden max-w-24 rotate-[-5deg] text-right font-hand text-sm leading-tight text-[var(--color-mat)]/70 xl:block">
                  data powers features + insights ↙
                </p>
              </div>
            </div>

            <BranchConnector />

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
              <MapGroup group={techWorkshopMap.automation} columns={3} />
              <MapGroup group={techWorkshopMap.delivery} columns={2} />
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-6 border-t border-dashed border-[var(--color-ink)]/20 pt-5">
          <ToolShelf group={techWorkshopMap.aiMl} priority />
          <ToolShelf group={techWorkshopMap.tools} />
        </div>
      </TapedCard>
    </section>
  );
}

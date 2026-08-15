import { cn } from "@/lib/utils";

type MatSurfaceProps = {
  variant?: "fixed" | "panel";
  className?: string;
  children?: React.ReactNode;
};

type Axis = "top" | "bottom" | "left" | "right";

/** Matches the CSS minor grid so ticks sit on the same lattice. */
const UNIT = 24;
const VIEW_WIDTH = 1920;
const VIEW_HEIGHT = 1200;
const COLS = VIEW_WIDTH / UNIT;
const ROWS = VIEW_HEIGHT / UNIT;
const MAJOR_EVERY = 5;
const FRAME_INSET = 10;
const TICK_MINOR = 7;
const TICK_MAJOR = 14;
const LABEL_INSET = 32;
const ANGLE_DEGREES = [15, 30, 45, 60] as const;
const RADIUS_UNITS = [10, 20, 30] as const;

const GUIDE = "var(--color-mat-guide)";
const GUIDE_FONT = "ui-sans-serif, system-ui, sans-serif";

const overlayMaskStyle = {
  opacity: 0.28,
  maskImage: "radial-gradient(ellipse 65% 75% at 50% 42%, transparent 20%, black 72%)",
  WebkitMaskImage: "radial-gradient(ellipse 65% 75% at 50% 42%, transparent 20%, black 72%)",
} as const;

function guideStroke(width: number) {
  return {
    stroke: GUIDE,
    strokeWidth: width,
    vectorEffect: "nonScalingStroke" as const,
    fill: "none" as const,
  };
}

function TickLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={GUIDE}
      fontSize="10"
      fontFamily={GUIDE_FONT}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {children}
    </text>
  );
}

function HorizontalTicks({ axis }: { axis: "top" | "bottom" }) {
  const isTop = axis === "top";
  const edgeY = isTop ? FRAME_INSET : VIEW_HEIGHT - FRAME_INSET;
  const labelY = isTop ? LABEL_INSET + 6 : VIEW_HEIGHT - LABEL_INSET + 4;

  return (
    <>
      {Array.from({ length: COLS + 1 }, (_, i) => {
        const isMajor = i % MAJOR_EVERY === 0;
        const tick = isMajor ? TICK_MAJOR : TICK_MINOR;
        const x = i * UNIT;
        const tickEndY = isTop ? edgeY + tick : edgeY - tick;
        const label = isMajor && i > 0 ? String(i) : null;

        return (
          <g key={`${axis}-${i}`}>
            <line x1={x} y1={edgeY} x2={x} y2={tickEndY} {...guideStroke(1)} />
            {label ? (
              <TickLabel x={x} y={labelY}>
                {label}
              </TickLabel>
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function VerticalTicks({ axis }: { axis: "left" | "right" }) {
  const isLeft = axis === "left";
  const edgeX = isLeft ? FRAME_INSET : VIEW_WIDTH - FRAME_INSET;
  const labelX = isLeft ? LABEL_INSET : VIEW_WIDTH - LABEL_INSET;

  return (
    <>
      {Array.from({ length: ROWS + 1 }, (_, i) => {
        const isMajor = i % MAJOR_EVERY === 0;
        const tick = isMajor ? TICK_MAJOR : TICK_MINOR;
        const y = VIEW_HEIGHT - i * UNIT;
        const tickEndX = isLeft ? edgeX + tick : edgeX - tick;
        const label = isMajor && i > 0 ? String(i) : null;

        return (
          <g key={`${axis}-${i}`}>
            <line x1={edgeX} y1={y} x2={tickEndX} y2={y} {...guideStroke(1)} />
            {label ? (
              <TickLabel x={labelX} y={y + 3}>
                {label}
              </TickLabel>
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function RulerTicks({ axis }: { axis: Axis }) {
  switch (axis) {
    case "top":
    case "bottom":
      return <HorizontalTicks axis={axis} />;
    case "left":
    case "right":
      return <VerticalTicks axis={axis} />;
    default: {
      const _exhaustive: never = axis;
      throw new Error(`Unhandled axis: ${_exhaustive}`);
    }
  }
}

function RadiusGuides() {
  const originX = 0;
  const originY = VIEW_HEIGHT;

  return (
    <>
      {RADIUS_UNITS.map((units) => {
        const r = units * UNIT;
        const startX = originX + r;
        const startY = originY;
        const endX = originX;
        const endY = originY - r;
        return (
          <path
            key={`radius-${units}`}
            d={`M ${startX} ${startY} A ${r} ${r} 0 0 0 ${endX} ${endY}`}
            {...guideStroke(1)}
          />
        );
      })}
    </>
  );
}

function AngleGuides() {
  const originX = 0;
  const originY = VIEW_HEIGHT;
  const rayLength = Math.hypot(VIEW_WIDTH, VIEW_HEIGHT);
  const labelRadius = 16 * UNIT;

  return (
    <>
      {ANGLE_DEGREES.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const endX = originX + rayLength * cos;
        const endY = originY - rayLength * sin;
        const labelX = originX + labelRadius * cos + 10 * sin;
        const labelY = originY - labelRadius * sin + 10 * cos;

        return (
          <g key={`angle-${deg}`}>
            <line
              x1={originX}
              y1={originY}
              x2={endX}
              y2={endY}
              strokeDasharray="8 7"
              {...guideStroke(1)}
            />
            <text
              x={labelX}
              y={labelY}
              fill={GUIDE}
              fontSize="11"
              fontFamily={GUIDE_FONT}
            >
              {deg}°
            </text>
          </g>
        );
      })}
    </>
  );
}

function MatSvgOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      preserveAspectRatio="xMinYMax slice"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={overlayMaskStyle}
    >
      <rect
        x={FRAME_INSET}
        y={FRAME_INSET}
        width={VIEW_WIDTH - FRAME_INSET * 2}
        height={VIEW_HEIGHT - FRAME_INSET * 2}
        {...guideStroke(1)}
      />
      <RadiusGuides />
      <AngleGuides />
      <RulerTicks axis="top" />
      <RulerTicks axis="bottom" />
      <RulerTicks axis="left" />
      <RulerTicks axis="right" />
    </svg>
  );
}

export function MatSurface({ variant = "fixed", className, children }: MatSurfaceProps) {
  const isFixed = variant === "fixed";

  return (
    <div
      className={cn(
        isFixed
          ? "pointer-events-none fixed top-0 left-0 -z-10 h-screen w-screen overflow-hidden"
          : "relative overflow-hidden rounded-[var(--radius-xl)]",
        className,
      )}
      aria-hidden={isFixed ? true : undefined}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 90% at 50% 45%, var(--color-mat) 0%, var(--color-mat-deep) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-grid-minor) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-grid-minor) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          backgroundPosition: "left bottom",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-grid-major) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-grid-major) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
          backgroundPosition: "left bottom",
        }}
      />
      <MatSvgOverlay />
      {children}
    </div>
  );
}

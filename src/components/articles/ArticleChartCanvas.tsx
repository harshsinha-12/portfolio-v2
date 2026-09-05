"use client";

import {
  Area, Bar, CartesianGrid, ComposedChart, Legend, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { ArticleChartProps } from "./ArticleChart";

const colors = ["#356b51", "#b65332", "#456a9a", "#88619a", "#927018"];

export default function ArticleChartCanvas({
  type = "line", rows, xKey, series, title, stacked = false, yUnit = "",
}: ArticleChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <ComposedChart data={rows} accessibilityLayer title={title} margin={{ top: 16, right: 20, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="var(--color-ink-subtle)" strokeOpacity={0.2} vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "var(--color-ink-subtle)", fontSize: 12 }} tickLine={false} minTickGap={24} />
        <YAxis unit={yUnit} width={64} tick={{ fill: "var(--color-ink-subtle)", fontSize: 12 }} tickLine={false} />
        <Tooltip contentStyle={{ background: "var(--color-paper)", borderColor: "var(--color-ink-subtle)", borderRadius: 6, color: "var(--color-ink)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((item, index) => {
          const color = item.color ?? colors[index % colors.length];
          const common = { dataKey: item.key, name: item.label ?? item.key, stroke: color, fill: color, unit: yUnit, isAnimationActive: false };
          if (type === "bar") return <Bar key={item.key} {...common} stackId={stacked ? "values" : undefined} maxBarSize={56} />;
          if (type === "area") return <Area key={item.key} {...common} type="linear" stackId={stacked ? "values" : undefined} fillOpacity={0.15} strokeWidth={2} />;
          return <Line key={item.key} {...common} type="linear" strokeWidth={2} dot={{ r: 3 }} />;
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

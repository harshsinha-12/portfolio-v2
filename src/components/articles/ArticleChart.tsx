"use client";

import dynamic from "next/dynamic";

export type ArticleChartProps = {
  type?: "line" | "bar" | "area";
  rows: Record<string, string | number | null>[];
  xKey: string;
  series: { key: string; label?: string; color?: string }[];
  title: string;
  height?: number;
  stacked?: boolean;
  yUnit?: string;
};

const ChartCanvas = dynamic(() => import("./ArticleChartCanvas"), {
  ssr: false,
  loading: () => <p role="status">Loading chart… Data is available below.</p>,
});

export function ArticleChart(props: ArticleChartProps) {
  return (
    <div className="article-chart__canvas" style={{ height: props.height ?? 320 }}>
      <ChartCanvas {...props} />
    </div>
  );
}

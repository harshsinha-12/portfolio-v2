import { ArticleChart, type ArticleChartProps } from "./ArticleChart";

export type DatasetChartProps = Omit<ArticleChartProps, "rows" | "series" | "height"> & {
  series: ArticleChartProps["series"] | string;
  height?: number | string;
  dataset: string;
  caption?: string;
};

export function DatasetChart({
  data, dataset, caption, type = "line", height = 320, ...props
}: DatasetChartProps & { data: Record<string, unknown> }) {
  const value = data[dataset];
  const { xKey, title } = props;
  const series = (typeof props.series === "string" ? data[props.series] : props.series) as ArticleChartProps["series"];
  const chartHeight = Number(height);
  const validSeries = Array.isArray(series) && series.length > 0 && series.every(
    (item) => item && typeof item.key === "string" && item.key !== xKey,
  ) && new Set(series.map((item) => item.key)).size === series.length;
  const validRows = validSeries && Array.isArray(value) && value.length > 0 && value.every((row) =>
    row && typeof row === "object" && !Array.isArray(row) &&
    (typeof row[xKey] === "string" || (typeof row[xKey] === "number" && Number.isFinite(row[xKey]))) &&
    series.every(({ key }) => row[key] === null || (typeof row[key] === "number" && Number.isFinite(row[key]))),
  ) && series.every(({ key }) => value.some((row) => typeof row[key] === "number"));

  if (!validRows || !["line", "bar", "area"].includes(type) || !title || !Number.isFinite(chartHeight) || chartHeight < 200 || chartHeight > 800) {
    return <p role="status">Chart unavailable: check the “{dataset}” dataset and chart settings.</p>;
  }

  // Send only the plotted columns across the client boundary.
  const columns = [xKey, ...series.map(({ key }) => key)];
  const rows = value.map((row) => Object.fromEntries(columns.map((key) => [key, row[key]])));

  return (
    <figure className="article-chart article-table-wrap" aria-label={title}>
      <strong className="article-chart__title">{title}</strong>
      <ArticleChart {...props} series={series} type={type} height={chartHeight} rows={rows} />
      {caption ? <figcaption>{caption}</figcaption> : null}
      <details className="article-chart__data">
        <summary>View chart data</summary>
        <div className="article-table-scroll">
          <table>
            <caption className="sr-only">{title}</caption>
            <thead><tr><th scope="col">{xKey}</th>{series.map((item) => <th scope="col" key={item.key}>{item.label ?? item.key}{props.yUnit ? ` (${props.yUnit})` : ""}</th>)}</tr></thead>
            <tbody>{rows.map((row, index) => <tr key={index}>{columns.map((key) => <td key={key}>{row[key] ?? "—"}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

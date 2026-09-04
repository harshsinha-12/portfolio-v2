import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import {
  TrackedExternalLink,
  TrackedMarkdownLink,
} from "@/components/analytics/TrackedLink";

type ArticleImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function ArticleImage({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: ArticleImageProps) {
  return (
    <figure className="article-figure">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 680px"
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

type CalloutProps = {
  title?: string;
  children: ReactNode;
};

export function Callout({ title = "Field note", children }: CalloutProps) {
  return (
    <aside className="article-callout">
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}

export function MarginNote({ children }: { children: ReactNode }) {
  return <aside className="article-margin-note">{children}</aside>;
}

type VideoEmbedProps = {
  src: string;
  title: string;
  caption?: string;
  poster?: string;
};

export function VideoEmbed({ src, title, caption, poster }: VideoEmbedProps) {
  const isRemoteEmbed = /^https:\/\//.test(src);

  return (
    <figure className="article-video">
      {isRemoteEmbed ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video controls preload="metadata" poster={poster} aria-label={title}>
          <source src={src} type="video/webm" />
        </video>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

type DatasetTableProps = {
  dataset: string;
  data: Record<string, unknown>;
  caption?: string;
};

type ReferenceListProps = {
  dataset?: string;
  data: Record<string, unknown>;
  title?: string;
};

export function DatasetTable({ dataset, data, caption }: DatasetTableProps) {
  const value = data[dataset];
  if (!Array.isArray(value) || value.length === 0) return null;

  const rows = value.filter(
    (row): row is Record<string, unknown> =>
      Boolean(row) && typeof row === "object" && !Array.isArray(row),
  );
  if (rows.length === 0) return null;

  const columns = Object.keys(rows[0]);

  return (
    <figure className="article-table-wrap">
      <div className="article-table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column}>{String(row[column] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function ReferenceList({
  dataset = "citations",
  data,
  title = "Sources and further reading",
}: ReferenceListProps) {
  const value = data[dataset];
  if (!Array.isArray(value) || value.length === 0) return null;

  const references = value.filter(
    (entry): entry is Record<string, unknown> =>
      Boolean(entry) && typeof entry === "object" && !Array.isArray(entry),
  );
  if (references.length === 0) return null;

  return (
    <details className="article-references">
      <summary>
        <span>{title}</span>
        <small>{references.length} references</small>
      </summary>
      <ol>
        {references.map((reference, index) => {
          const url = typeof reference.url === "string" ? reference.url : "";
          const referenceTitle =
            typeof reference.title === "string"
              ? reference.title
              : `Reference ${index + 1}`;
          const publisher =
            typeof reference.publisher === "string" ? reference.publisher : "";
          const note = typeof reference.note === "string" ? reference.note : "";

          return (
            <li key={`${referenceTitle}-${index}`}>
              {url ? (
                <TrackedExternalLink
                  href={url}
                  kind="article_reference"
                  label={referenceTitle}
                >
                  {referenceTitle}
                </TrackedExternalLink>
              ) : (
                <strong>{referenceTitle}</strong>
              )}
              {publisher ? <span>{publisher}</span> : null}
              {note ? <p>{note}</p> : null}
            </li>
          );
        })}
      </ol>
    </details>
  );
}

function MarkdownImage(props: ComponentProps<"img">) {
  const src = typeof props.src === "string" ? props.src : "";
  const alt = props.alt ?? "";

  if (!src) return null;
  if (/^https?:\/\//.test(src)) {
    // Remote article hosts are intentionally arbitrary, so these stay native.
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={src} alt={alt} loading="lazy" />;
  }

  return <ArticleImage src={src} alt={alt} />;
}

export function createArticleComponents(data: Record<string, unknown>): MDXComponents {
  return {
    img: MarkdownImage,
    a: TrackedMarkdownLink,
    ArticleImage,
    Callout,
    MarginNote,
    Mermaid: MermaidDiagram,
    Video: VideoEmbed,
    DataTable: (props: Omit<DatasetTableProps, "data">) => (
      <DatasetTable {...props} data={data} />
    ),
    References: (props: Omit<ReferenceListProps, "data">) => (
      <ReferenceList {...props} data={data} />
    ),
  };
}

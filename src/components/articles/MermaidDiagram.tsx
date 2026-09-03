"use client";

import { useEffect, useId, useState } from "react";

type MermaidApi = (typeof import("mermaid"))["default"];

let mermaidPromise: Promise<MermaidApi> | undefined;
let renderSequence = 0;

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        primaryColor: "#f7f3e9",
        primaryTextColor: "#163d2d",
        primaryBorderColor: "#356b51",
        lineColor: "#356b51",
        secondaryColor: "#fff8dc",
        tertiaryColor: "#f6a082",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      },
    });

    return mermaid;
  });

  return mermaidPromise;
}

type MermaidDiagramProps = {
  chart?: string;
  caption?: string;
};

export function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const source = typeof chart === "string" ? chart.trim() : "";

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        if (!source) {
          throw new Error("Mermaid diagram source is missing.");
        }

        const mermaid = await loadMermaid();
        const safeReactId = reactId.replace(/[^a-zA-Z0-9]/g, "");
        const id = `mermaid-${safeReactId}-${Date.now()}-${++renderSequence}`;
        await mermaid.parse(source);
        const result = await mermaid.render(id, source);
        if (active) {
          setSvg(result.svg);
          setError("");
        }
      } catch (cause) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Unable to render Mermaid diagram", cause);
        }
        if (active) {
          setError("The visual diagram could not be rendered. Its source is shown below.");
        }
      }
    }

    void renderDiagram();
    return () => {
      active = false;
    };
  }, [reactId, source]);

  return (
    <figure className="article-diagram">
      {error ? (
        <div className="article-diagram__error">
          <p role="alert">{error}</p>
          {source ? (
            <pre>
              <code>{source}</code>
            </pre>
          ) : null}
        </div>
      ) : svg ? (
        <div
          className="article-diagram__canvas"
          role="img"
          aria-label={caption ?? "Article diagram"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="article-diagram__loading" aria-label="Rendering diagram" />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

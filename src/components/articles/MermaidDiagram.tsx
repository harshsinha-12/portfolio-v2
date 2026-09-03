"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
  caption?: string;
};

export function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
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

        const id = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
        const result = await mermaid.render(id, chart.trim());
        if (active) {
          setSvg(result.svg);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    }

    void renderDiagram();
    return () => {
      active = false;
    };
  }, [chart, reactId]);

  return (
    <figure className="article-diagram">
      {error ? (
        <div role="alert" className="article-diagram__error">
          This diagram could not be rendered.
        </div>
      ) : svg ? (
        <div
          className="article-diagram__canvas"
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

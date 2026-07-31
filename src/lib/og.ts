const META_LIMIT = 500_000;

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export type OpenGraphData = {
  image: string | null;
  title: string | null;
  description: string | null;
};

export async function fetchOpenGraph(url: string): Promise<OpenGraphData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
      Accept: "text/html",
    },
    next: { revalidate: 86_400 },
  });

  if (!response.ok) {
    return { image: null, title: null, description: null };
  }

  const html = (await response.text()).slice(0, META_LIMIT);

  return {
    image:
      extractMeta(html, "og:image") ??
      extractMeta(html, "twitter:image") ??
      extractMeta(html, "twitter:image:src"),
    title: extractMeta(html, "og:title"),
    description: extractMeta(html, "og:description"),
  };
}

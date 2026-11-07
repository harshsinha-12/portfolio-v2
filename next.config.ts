import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog's reverse proxy needs trailing-slash API paths left untouched.
  skipTrailingSlashRedirect: true,
  outputFileTracingIncludes: {
    "/api/og/spotify": ["./src/fonts/*.ttf", "./public/assets/profile-pic.jpg", "./public/og.jpg"],
  },
  // Same-origin path for PostHog so ad blockers don't drop analytics requests.
  async rewrites() {
    return [
      {
        source: "/relay-hs/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/relay-hs/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/og.jpg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</llms.txt>; rel="describedby"; type="text/markdown", </llms-full.txt>; rel="alternate"; type="text/markdown", </api/about>; rel="alternate"; type="application/json"',
          },
        ],
      },
    ];
  },
  images: {
    // Prefer AVIF (smaller) and fall back to WebP for broad support.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires the quality allowlist to be explicit.
    qualities: [50, 75, 90],
    // All optimizable images are small, thumbnail-scale variants; drop the
    // very large device widths so oversized variants are never generated.
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384],
    // Cache optimized images for 31 days to avoid repeated re-optimization.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;

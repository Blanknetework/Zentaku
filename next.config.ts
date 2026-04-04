import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Pin tracing to this app so Next doesn’t pick a parent folder lockfile (e.g. `C:\\Users\\…\\package-lock.json`). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  async headers() {
    if (process.env.NODE_ENV === "production") return [];
    return [
      {
        source: "/Images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "myanimelist.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api-cdn.myanimelist.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  serverExternalPackages: ["@consumet/extensions", "got-scraping"],
};

export default nextConfig;

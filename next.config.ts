import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [],
  },
  outputFileTracingIncludes: {
    "/api/book/download": ["./private/**/*.pdf"],
  },
};

export default nextConfig;

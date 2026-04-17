import path from "node:path";

import type { NextConfig } from "next";

const workspaceRoot = path.resolve(__dirname, "..", "..");

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: workspaceRoot,
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;

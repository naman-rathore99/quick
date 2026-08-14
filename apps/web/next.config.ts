import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    turbopack: {
      root: path.resolve(process.cwd(), "../.."),
    },
  },
};

export default nextConfig;

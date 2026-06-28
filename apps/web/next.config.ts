import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@financial-tracker/shared-types',
    '@financial-tracker/shared-utils',
    '@financial-tracker/api-client',
    '@financial-tracker/query-hooks',
    '@financial-tracker/store',
  ],
  output: 'standalone',
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

export default nextConfig;

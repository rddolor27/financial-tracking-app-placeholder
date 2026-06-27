import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@financial-tracker/shared-types',
    '@financial-tracker/shared-utils',
    '@financial-tracker/api-client',
    '@financial-tracker/query-hooks',
    '@financial-tracker/store',
  ],
  output: 'standalone',
};

export default nextConfig;

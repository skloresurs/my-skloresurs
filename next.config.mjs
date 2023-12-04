import './src/env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        hostname: 'placehold.co',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

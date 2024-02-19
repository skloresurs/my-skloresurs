import './src/env.mjs';

import withPWAInit from '@ducanh2912/next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withBunbleAbalyzerWithConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  images: {
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        hostname: 'placehold.co',
        protocol: 'https',
      },
      {
        hostname: 'cdn.simpleicons.org',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: false,
};

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

export default withBunbleAbalyzerWithConfig(withPWA(nextConfig));

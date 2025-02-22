import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // This will ignore all build errors
  webpack: (config, { isServer }) => {
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;

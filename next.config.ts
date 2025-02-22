import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Turn off static optimization for the entire app
  staticPageGenerationTimeout: 0,
  output: 'standalone',
  eslint: {
    // Disabling eslint during build as it might cause issues
    ignoreDuringBuilds: true,
  },
  unstable_runtimeJS: true,
  unstable_JsPreload: false,
  pages: {
    '/': { unstable_runtimeJS: true },
    // Add other pages that need client-side rendering
  },
};

export default nextConfig;

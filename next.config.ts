import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: Disable TypeScript type checking during builds (if needed)
    // ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '80',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.yourdomain.com', // Replace with your production domain
      },
    ],
  },
};

export default nextConfig;

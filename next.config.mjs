/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif"],
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
  cacheComponents: true,
  experimental: {
    clientSegmentCache: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable detailed fetch logging in development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;

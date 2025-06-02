/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif"],
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
  experimental: {
    ppr: true,
    dynamicIO: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

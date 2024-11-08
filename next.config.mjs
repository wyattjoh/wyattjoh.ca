/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif"],
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
  experimental: {
    ppr: true,
    pprFallbacks: true,
    dynamicIO: true,
  },
};

export default nextConfig;

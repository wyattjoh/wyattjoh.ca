/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif"],
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
  cacheComponents: true,
  // Enable detailed fetch logging in development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;

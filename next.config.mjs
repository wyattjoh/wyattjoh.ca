/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif"],
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
  experimental: {
    ppr: true,
    // Disabled due to a bug with I18n date formatting.
    // dynamicIO: true,
  },
};

export default nextConfig;

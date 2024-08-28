/** @type {import('next').NextConfig} */
export default {
  images: {
    formats: ["image/avif"],
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    ppr: true,
    pprFallbacks: true,
  },
};

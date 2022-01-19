module.exports = {
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  images: {
    formats: ["image/avif"],
    domains: ["avatars.githubusercontent.com"]
  },
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    return config;
  },
};

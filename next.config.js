/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
  },
  distDir: process.env.BUILD_DIR || ".next",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            dimensions: false,
            ref: true,
            replaceAttrValues: {
              "#000": "currentColor",
              black: "currentColor",
            },
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;

const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["pack.phosphoricons.com"] },
    esmExternals: true,
  },
};

module.exports = withVanillaExtract(nextConfig);

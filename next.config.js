/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
    esmExternals: true,
  },
};

module.exports = nextConfig;

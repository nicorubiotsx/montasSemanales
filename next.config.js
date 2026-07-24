/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['recharts'],
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  }
};

module.exports = nextConfig;
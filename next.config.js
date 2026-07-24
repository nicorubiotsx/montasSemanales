/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  transpilePackages: ['recharts'],
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  }
};

module.exports = nextConfig;
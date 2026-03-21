/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['replicate.delivery', 'r2.flux-network.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '**.r2.flux-network.dev',
      },
    ],
  },
  env: {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  },
  // 添加类型检查
  typescript: {
    ignoreBuildErrors: true,
  },
  // 尾部斜杠
  trailingSlash: true,
}

module.exports = nextConfig

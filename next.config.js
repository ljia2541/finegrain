/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
  // 为静态导出优化
  trailingSlash: true,
  // 禁用 ESLint 以加快构建
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

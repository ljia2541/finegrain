/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 移除静态导出以支持 API Routes
  // output: 'export',
}

module.exports = nextConfig

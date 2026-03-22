/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 启用静态导出
  output: 'export',
  // 静态导出的基础路径（如果部署在子目录）
  // basePath: '',
}

module.exports = nextConfig

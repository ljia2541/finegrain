import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Finegrain - AI 图像增强平台',
  description: '基于 AI 的在线图像增强服务，专注于细节修复和超分辨率放大',
  keywords: ['图像增强', 'AI', '超分辨率', '图像修复', 'Finegrain'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

import ImageUploader from '@/components/ImageUploader'
import Features from '@/components/Features'
import ExampleShowcase from '@/components/ExampleShowcase'
import Pricing from '@/components/Pricing'
import PrivacyNotice from '@/components/PrivacyNotice'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Finegrain AI 图像增强
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            基于 AI 的在线图像增强服务，专注于细节修复和超分辨率放大。
            支持多种格式，24小时自动删除，保护您的隐私。
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#upload"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              立即体验
            </a>
            <a
              href="#pricing"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-600"
            >
              查看定价
            </a>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">上传您的图片</h2>
          <ImageUploader />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Features />
        </div>
      </section>

      {/* Example Showcase Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <ExampleShowcase />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">选择您的方案</h2>
          <Pricing />
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="py-8 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <PrivacyNotice />
        </div>
      </section>
    </div>
  )
}

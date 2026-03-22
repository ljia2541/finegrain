import ImageUploader from '@/components/ImageUploader'
import Features from '@/components/Features'
import ExampleShowcase from '@/components/ExampleShowcase'
import Pricing from '@/components/Pricing'
import PrivacyNotice from '@/components/PrivacyNotice'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - 简洁风格 */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white/90 text-sm font-medium">专业画质，不是滤镜</span>
          </div>
          
          {/* 主标题 */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI 图像增强
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              8K 超高清
            </span>
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            拖放到任意位置上传，最高 <span className="text-white font-semibold">512 百万像素</span>
          </p>
          
          {/* 特性标签 */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-white/70 text-sm">最多 20 张</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-white/70 text-sm">24 小时删除</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-white/70 text-sm">8x 超高清</span>
            </div>
          </div>
          
          {/* CTA 按钮 */}
          <div className="flex justify-center gap-4">
            <a
              href="#upload"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              免费开始
            </a>
          </div>
        </div>
      </section>

      {/* Upload Section - 简化 */}
      <section id="upload" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              拖放到任意位置上传
            </h2>
            <p className="text-lg text-gray-600">
              支持 JPG、PNG 和 WebP 格式，最高 512 百万像素
            </p>
          </div>
          <ImageUploader />
        </div>
      </section>

      {/* Example Showcase - 放在前面 */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <ExampleShowcase />
        </div>
      </section>

      {/* Features Section - 改进版 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              专业画质，不是滤镜
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              多数工具处理过度，容易出现塑料感皮肤、奇怪光晕和不真实的效果。
              Finegrain 能恢复真实细节并自然校色。
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Use Cases Section - 新增 */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              适用于各种场景
            </h2>
            <p className="text-xl text-gray-600">
              从缩略图到海报，从产品图到 AI art
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 电商 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">适用于电商</h3>
              <p className="text-gray-600 leading-relaxed">
                为你的产品目录自动化图像增强。可批量提升质量并放大尺寸，让整个目录效果一致，无需重拍。
              </p>
            </div>
            
            {/* 印刷 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">任意尺寸都可印刷</h3>
              <p className="text-gray-600 leading-relaxed">
                低分辨率图片一打印就会糊。Finegrain 可放大并锐化，让你的照片在海报、画布、T 恤和大屏展示上依然清晰。
              </p>
            </div>
            
            {/* AI Art */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">优化并放大 AI art</h3>
              <p className="text-gray-600 leading-relaxed">
                Midjourney、Stable Diffusion 的输出常需要二次清理。增强发虚区域、去除伪影，并放大到 4K 或 8K。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">选择您的方案</h2>
            <p className="text-xl text-gray-600">免费试用，按需付费</p>
          </div>
          <Pricing />
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="py-12 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <PrivacyNotice />
        </div>
      </section>
    </div>
  )
}

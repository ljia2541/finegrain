import ImageUploader from '@/components/ImageUploader'
import Features from '@/components/Features'
import ComparisonSlider from '@/components/ComparisonSlider'
import Pricing from '@/components/Pricing'
import PrivacyNotice from '@/components/PrivacyNotice'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - 左右布局 */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧：文字内容 */}
            <div className="text-left">
              {/* 标签 */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white/90 text-sm font-medium">专业画质，不是滤镜</span>
              </div>
              
              {/* 主标题 */}
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                AI 图像增强
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  8K 超高清
                </span>
              </h1>
              
              {/* 副标题 */}
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                拖放到任意位置上传，最高 <span className="text-white font-semibold">512 百万像素</span>
              </p>
              
              {/* 特性标签 */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white/70 text-sm">最多 20 张</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-white/70 text-sm">24 小时删除</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-white/70 text-sm">8x 超高清</span>
                </div>
              </div>
            </div>
            
            {/* 右侧：上传组件 */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <ImageUploader />
            </div>
          </div>
        </div>
      </section>

      {/* 示例展示 - 单案例 */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              8K 超高清效果展示
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              真实的 AI 增强效果，不是滤镜
            </p>
          </div>
          
          {/* 单个案例展示 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>8x 超高清 • 实时处理 • 24小时删除</span>
              </div>
            </div>
            
            {/* 对比滑块 */}
            <div className="px-8 pb-8">
              <div 
                className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 relative cursor-ew-resize"
                onMouseMove={handleSliderMove}
              >
                {/* 原图（左侧，模糊） */}
                <img
                  src="/examples/original.jpg"
                  alt="原图"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'blur(4px) brightness(0.9)' }}
                />
                {/* 增强图（右侧，清晰） */}
                <img
                  src="/examples/enhanced.jpg"
                  alt="增强后"
                  className="absolute top-0 right-0 h-full object-cover"
                  style={{ 
                    left: `${sliderPosition}%`,
                    width: `${100 - sliderPosition}%`
                  }}
                />
                {/* 滑块指示器 */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-blue-500 z-10"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-blue-500 flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-gray-400 rounded-full" />
                      <div className="w-1 h-4 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
                {/* 标签 */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg z-10">
                  原图
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-blue-600/90 text-white text-sm rounded-lg z-10">
                  增强后 ✨
                </div>
              </div>
            </div>
            
            {/* 描述 */}
            <div className="px-8 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                人像照片增强
              </h3>
              <p className="text-gray-600">
                低分辨率人像 → 8K 超高清（8x 放大）
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Use Cases Section */}
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

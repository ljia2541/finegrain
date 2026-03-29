'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import PrivacyNotice from '@/components/PrivacyNotice'

export default function Home() {
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(percent, 100)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const percent = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(percent, 100)))
  }

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
                  真实细节恢复
                </span>
              </h1>
              
              {/* 副标题 */}
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                单张上传，AI 修复模糊、恢复细节、优化人像皮肤，专业画质无滤镜
              </p>
              
              {/* 特性标签 */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-white/70 text-sm">人像细节优化</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-white/70 text-sm">24 小时删除</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-white/70 text-sm">轻度去模糊/去噪</span>
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
              AI 增强效果展示
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              真实的细节恢复，不是滤镜
            </p>
          </div>
          
          {/* 单个案例展示 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>4x 超高清 • 人像细节优化 • 24小时删除</span>
              </div>
            </div>
            
            {/* 对比滑块 */}
            <div className="px-8 pb-8">
              <div 
                className="relative w-full aspect-video rounded-lg overflow-hidden cursor-ew-resize"
                style={{ maxHeight: '70vh' }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* 底层：清晰增强图 */}
                <img
                  src="/examples/enhanced.jpg"
                  alt="Enhanced"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                
                {/* 上层：模糊原图 */}
                <img
                  src="/examples/original.jpg"
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ 
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    filter: 'blur(2px) brightness(0.95)'
                  }}
                />
                
                {/* 滑块线 */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                />
                
                {/* 圆形手柄 */}
                <div 
                  className="absolute top-1/2 w-8 h-8 -mt-4 bg-white rounded-full shadow-lg z-20 flex items-center justify-center text-gray-600 font-bold pointer-events-none"
                  style={{ left: `calc(${sliderPosition}% - 16px)` }}
                >
                  ↔
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                拖动滑块查看差异
              </p>
            </div>
            
            {/* 描述 */}
            <div className="px-8 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                人像照片增强
              </h3>
              <p className="text-gray-600">
                低分辨率人像 → 高清修复（4x 放大 + 人像细节优化）
              </p>
            </div>

            {/* 10x 付费入口 */}
            <div className="px-8 pb-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">极致 10x 超清人像</p>
                  <p className="text-xs text-gray-600">支持 10 倍极限放大，人像细节拉满 · 单次付费 $3.99（不走积分）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}

      {/* 真实细节恢复示例 */}

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 flex flex-col lg:flex-row gap-8 items-center">
              {/* 左侧文字 */}
              <div className="flex-1 lg:text-left text-center">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium justify-center lg:justify-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    真实细节恢复
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mt-4 text-gray-800">
                  不是简单的滤镜或锐化
                </h3>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  AI 真正恢复图像中的丢失细节，让照片看起来更自然、更真实。
                </p>
                <p className="text-gray-500 mt-4 text-sm">
                  从缩略图到高清，AI 真正恢复细节，不是滤镜
                </p>
              </div>
              
              {/* 右侧图片（并排） */}
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img 
                    src="/examples/portrait_real_original.jpg" 
                    alt="原图" 
                    className="w-full aspect-square object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 py-1 rounded">原图</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img 
                    src="/examples/portrait_real_enhanced.jpg" 
                    alt="增强后" 
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">增强后</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 老照片修复示例 */}
      <section className="py-6 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 flex flex-col lg:flex-row gap-12 items-center">
              {/* 左侧图片（并排） */}
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/examples/oldphoto_original.jpg" 
                    alt="修复前" 
                    className="w-full aspect-square object-cover"
                    style={{ 
                      filter: 'grayscale(100%) sepia(60%) blur(0.5px) contrast(90%) brightness(85%)'
                    }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 py-1 rounded">修复前</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg ring-2 ring-orange-200">
                  <img 
                    src="/examples/oldphoto_enhanced.jpg" 
                    alt="修复后" 
                    className="w-full aspect-square object-cover"
                    style={{ 
                      filter: 'contrast(105%) saturate(110%)'
                    }}
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-orange-600/80 px-2 py-1 rounded">修复后 ✨</span>
                </div>
              </div>

              {/* 右侧文字 */}
              <div className="flex-1 lg:text-left text-center">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                    老照片修复
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-gray-800 mt-4">
                  珍贵记忆，清晰重现
                </p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  恢复模糊的老照片，增强面部细节，让珍贵的记忆重新清晰。
                </p>
                <p className="text-gray-500 mt-4 text-sm">
                  Real-ESRGAN 模型修复模糊和压缩块，GFPGAN 增强面部细节
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 300 DPI 印刷质量展示 */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              专业印刷，支持 300 DPI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              从手机照片到专业印刷，AI 超分辨率放大技术让每一处细节都清晰呈现
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* 左侧图片对比 */}
              <div className="flex-1 flex gap-3">
                <div className="flex-1 relative rounded-lg overflow-hidden shadow">
                  <img 
                    src="/examples/print_original.jpg" 
                    alt="原图" 
                    className="w-full aspect-square object-cover"
                    style={{ filter: 'blur(2px) brightness(0.9)' }}
                  />
                  <span className="absolute bottom-1 left-1 text-xs text-white bg-black/60 px-1.5 py-0.5 rounded">普通</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden shadow ring-2 ring-blue-200">
                  <img 
                    src="/examples/print_enhanced.jpg" 
                    alt="增强后" 
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-1 right-1 text-xs text-white bg-blue-600/80 px-1.5 py-0.5 rounded">300 DPI</span>
                </div>
              </div>
              
              {/* 右侧文字 */}
              <div className="flex-1 lg:text-left text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  最高 4K 高清输出
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  免费版支持最高 4K 分辨率输出，满足日常高清需求。
                  付费 Crystal 模型可输出最高 10K 超高清。
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {/* 4×6 英寸 */}
            <div className="bg-white rounded-lg p-2 shadow border border-gray-100 text-center">
              <div className="text-xl mb-1">📷</div>
              <h3 className="text-xs font-bold text-gray-900">4"×6"</h3>
              <p className="text-xs text-gray-500">1200×1800</p>
              <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">300 DPI</span>
            </div>
            
            {/* A4 */}
            <div className="bg-white rounded-lg p-2 shadow border border-gray-100 text-center">
              <div className="text-xl mb-1">📄</div>
              <h3 className="text-xs font-bold text-gray-900">A4</h3>
              <p className="text-xs text-gray-500">2480×3508</p>
              <span className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded-full">300 DPI</span>
            </div>
            
            {/* 海报 */}
            <div className="bg-white rounded-lg p-2 shadow border border-gray-100 text-center">
              <div className="text-xl mb-1">🖼️</div>
              <h3 className="text-xs font-bold text-gray-900">海报</h3>
              <p className="text-xs text-gray-500">4K</p>
              <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full">150+ DPI</span>
            </div>
            
            {/* 10K 大幅 */}
            <div className="bg-white rounded-lg p-2 shadow border border-gray-100 text-center">
              <div className="text-xl mb-1">🎨</div>
              <h3 className="text-xs font-bold text-gray-900">10K</h3>
              <p className="text-xs text-gray-500">Crystal 10x</p>
              <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">VIP 付费</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              💡 <strong>提示：</strong>大多数屏幕显示 72-150 DPI 即可清晰，专业印刷建议 300 DPI
            </p>
          </div>
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
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/product_original.jpg" 
                    alt="原图" 
                    className="w-full aspect-square object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">原图</span>
                </div>
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/product_enhanced.jpg" 
                    alt="增强后" 
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">增强后</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">适用于电商</h3>
                <p className="text-gray-600 text-sm">为你的产品目录自动化图像增强</p>
              </div>
            </div>
            
            {/* 印刷 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/landscape_original.jpg" 
                    alt="原图" 
                    className="w-full aspect-square object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">原图</span>
                </div>
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/landscape_enhanced.jpg" 
                    alt="增强后" 
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">增强后</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">任意尺寸都可印刷</h3>
                <p className="text-gray-600 text-sm">低分辨率图片一打印就会糊</p>
              </div>
            </div>
            
            {/* AI Art */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/aiart_original.jpg" 
                    alt="原图" 
                    className="w-full aspect-square object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">原图</span>
                </div>
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/aiart_enhanced.jpg" 
                    alt="增强后" 
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">增强后</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">放大 AI 生成图片</h3>
                <p className="text-gray-600 text-sm">Crystal 模型专为 AI 生成人像优化，自然放大无塑料感</p>
              </div>
            </div>
          </div>
        </div>
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              专业画质，不是滤镜
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              多数工具处理过度，容易出现塑料感皮肤和不真实的效果。
              Finegrain 使用 AI 真正恢复细节，保持自然真实。
            </p>
          </div>
          <Features />
        </div>
      </section>

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

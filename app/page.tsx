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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white/90 text-sm font-medium">Professional quality, not a filter</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Free AI Image Enhancer
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Upscale Photos to 4K/10K Online
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Upload any image, enhance for free with AI. Multiple models: Real-ESRGAN, Google, Recraft, Crystal. No signup required.
              </p>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-white/70 text-sm">Portrait Detail Optimization</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-white/70 text-sm">Auto-deleted after 24h</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-white/70 text-sm">Super Upscale</span>
                </div>
              </div>
            </div>
            
            {/* Right: Upload Component */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <ImageUploader />
            </div>
          </div>
        </div>
      </section>

      {/* Example Showcase */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI Enhancement Results
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real detail restoration, not a filter
            </p>
          </div>
          
          {/* Single Case Display */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>4x Super HD • Portrait Enhancement • 24h Auto-delete</span>
              </div>
            </div>
            
            {/* Comparison Slider */}
            <div className="px-8 pb-8">
              <div 
                className="relative w-full aspect-video rounded-lg overflow-hidden cursor-ew-resize"
                style={{ maxHeight: '70vh' }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* Bottom: Enhanced image */}
                <img
                  src="/examples/enhanced.jpg"
                  alt="Enhanced"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                
                {/* Top: Original (blurred) */}
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
                
                {/* Slider line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                />
                
                {/* Handle */}
                <div 
                  className="absolute top-1/2 w-8 h-8 -mt-4 bg-white rounded-full shadow-lg z-20 flex items-center justify-center text-gray-600 font-bold pointer-events-none"
                  style={{ left: `calc(${sliderPosition}% - 16px)` }}
                >
                  ↔
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Drag slider to compare
              </p>
            </div>
            
            {/* Description */}
            <div className="px-8 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Portrait Photo Enhancement
              </h3>
              <p className="text-gray-600">
                Low-res portrait → High quality upscale (4x + Portrait Enhancement)
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* Features Section */}

      {/* Real detail restoration examples */}

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 flex flex-col lg:flex-row gap-8 items-center">
              {/* Left text */}
              <div className="flex-1 lg:text-left text-center">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium justify-center lg:justify-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    Authentic Quality Upscale
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mt-4 text-gray-800">
                  Not simple filtering or sharpening
                </h3>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  AI super resolution upscaling, clearer and sharper while staying natural.
                </p>
                <p className="text-gray-500 mt-4 text-sm">
                  Best for moderately clear images. Clear images work best.
                </p>
                <p className="text-gray-500 mt-2 text-sm">
                  Great for portraits, product photos, and designs. Preserves authentic texture without over-processing.
                </p>
              </div>
              
              {/* Right image (side by side) */}
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img 
                    src="/examples/portrait_real_original.jpg" 
                    alt="Original" 
                    className="w-full aspect-square object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Original</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img 
                    src="/examples/portrait_real_enhanced.jpg" 
                    alt="Enhanced" 
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">Enhanced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vintage Photo Enhancement example */}
      <section className="py-6 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 flex flex-col lg:flex-row gap-12 items-center">
              {/* Left image (side by side) */}
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/examples/oldphoto_original.jpg" 
                    alt="Before" 
                    className="w-full aspect-square object-cover"
                    style={{ 
                      filter: 'grayscale(100%) sepia(60%) blur(0.5px) contrast(90%) brightness(85%)'
                    }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 py-1 rounded">Before</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg ring-2 ring-orange-200">
                  <img 
                    src="/examples/oldphoto_enhanced.jpg" 
                    alt="After" 
                    className="w-full aspect-square object-cover"
                    style={{ 
                      filter: 'contrast(105%) saturate(110%)'
                    }}
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-orange-600/80 px-2 py-1 rounded">After ✨</span>
                </div>
              </div>

              {/* Right text */}
              <div className="flex-1 lg:text-left text-center">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                    Vintage Photo Enhancement
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-gray-800 mt-4">
                  Precious memories, clearly restored
                </p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  Upscale compressed blocks, enhance facial details, make old photos clearer.
                </p>
                <p className="text-gray-500 mt-4 text-sm">
                  Real-ESRGAN model upscales and enhances quality, GFPGAN optimizes facial details
                </p>
                <p className="text-gray-400 mt-2 text-xs">
                  Note: Only enhances clarity, does not remove scratches/yellowing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 300 DPI print quality showcase */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Professional printing, supports 300 DPI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From phone photos to professional printing, AI super resolution makes every detail crisp
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Left image comparison */}
              <div className="flex-1 flex gap-3">
                <div className="flex-1 relative rounded-lg overflow-hidden shadow">
                  <img 
                    src="/examples/print_original.jpg" 
                    alt="Original" 
                    className="w-full aspect-square object-cover"
                    style={{ filter: 'blur(2px) brightness(0.9)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Standard</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden shadow ring-2 ring-blue-200">
                  <img 
                    src="/examples/print_enhanced.jpg" 
                    alt="Enhanced" 
                    className="w-full aspect-square object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">300 DPI</span>
                  {/* Magnifier effect */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden bg-blue-100">
                    <img 
                      src="/examples/print_enhanced.jpg" 
                      alt="Detail" 
                      className="w-full h-full object-cover"
                      style={{ transform: 'scale(3)', objectPosition: '30% 40%' }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Right text */}
              <div className="flex-1 lg:text-left text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Up to 4K HD Output
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Free version supports up to 4K display, perfect for daily HD needs.
                  Paid models deliver even sharper, print-ready quality.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* 4×6 inches */}
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
            
            {/* Poster */}
            <div className="bg-white rounded-lg p-2 shadow border border-gray-100 text-center">
              <div className="text-xl mb-1">🖼️</div>
              <h3 className="text-xs font-bold text-gray-900">Poster</h3>
              <p className="text-xs text-gray-500">4K</p>
              <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full">≥ 150 DPI</span>
            </div>
            
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              💡 <strong>Tip:</strong> Most screens display clearly at 72-150 DPI. Professional printing requires 300 DPI
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Any Scene
            </h2>
            <p className="text-xl text-gray-600">
              From thumbnails to posters, product photos to AI art
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* E-commerce */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex h-48">
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/product_original.jpg" 
                    alt="Original" 
                    className="w-full h-full object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Original</span>
                </div>
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/product_enhanced.jpg" 
                    alt="Enhanced" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">Enhanced</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">🛒 For E-commerce</h3>
                <p className="text-gray-600 text-sm">Automated image enhancement for your product catalog</p>
              </div>
            </div>
            
            {/* Print */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex h-48">
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/landscape_original.jpg" 
                    alt="Original" 
                    className="w-full h-full object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Original</span>
                </div>
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/landscape_enhanced.jpg" 
                    alt="Enhanced" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">Enhanced</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">🖨️ After upscaling, supports professional printing</h3>
                <p className="text-gray-600 text-sm">Low-res images can be upscaled for crisp printing</p>
              </div>
            </div>
            
            {/* AI Art */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex h-48">
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/aiart_original.jpg" 
                    alt="Original" 
                    className="w-full h-full object-cover"
                    style={{ filter: 'blur(2px) brightness(0.95)' }}
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Original</span>
                </div>
                <div className="w-1/2 relative">
                  <img 
                    src="/examples/aiart_enhanced.jpg" 
                    alt="Enhanced" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-blue-600/80 px-2 py-1 rounded">Enhanced</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">🎨 Upscale AI-Generated Images</h3>
                <p className="text-gray-600 text-sm">Upscale AI-generated images with natural quality, preserving authentic texture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional quality section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional quality, not a filter
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Most tools over-process, often resulting in plastic-looking skin and unrealistic effects.
              Finegrain uses AI super resolution technology to upscale while staying natural and realistic.
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Free trial, pay as you go</p>
          </div>
          <Pricing headingLevel={3} />
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


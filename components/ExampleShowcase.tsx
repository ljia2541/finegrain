'use client'

import { useState } from 'react'
import ComparisonSlider from './ComparisonSlider'
import { CheckCircle2, Image as ImageIcon } from 'lucide-react'

interface Example {
  id: string
  title: string
  description: string
  originalImage: string
  enhancedImage: string
  category: 'portrait' | 'landscape' | 'product'
}

// 4 个 8K 超高清示例
const examples: Example[] = [
  {
    id: '1',
    title: '人像照片增强',
    description: '低分辨率人像 → 8K 超高清（8x 放大）',
    originalImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3Cfilter id="blur"%3E%3CfeGaussianBlur in="SourceGraphic" stdDeviation="3"/%3E%3C/filter%E3E%3C/defs%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Crect x="50" y="80" width="300" height="140" fill="%23666" rx="10"/%E%3Ccircle cx="200" cy="120" r="40" fill="%23444"/%E%3C/svg%3E',
    enhancedImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3Cfilter id="blur"%3E%3CfeGaussianBlur in="SourceGraphic stdDeviation="0"/%3E%3C/filter%E3E%3C/defs%E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Crect x="50" y="80" width="300" height="140" fill="%23666" rx="10"/%E%3Ccircle cx="200" cy="120" r="40" fill="%23444"/%E%3Ctext x="320" y="280" font-size="12" fill="%23666" text-anchor="end"%3E7680x4320 (8K)%3C/text%3E%3C/svg%3E',
    category: 'portrait'
  },
  {
    id: '2',
    title: '风景照片超分',
    description: '模糊风景 → 8x 超分辨率放大',
    originalImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3Cfilter id="blur"%3E%3CfeGaussianBlur in="SourceGraphic stdDeviation="4"/%E%3C/filter%E%3E%3C/defs%E3E%3Crect width="400" height="300" fill="%2387CEEB"/%3E%3Ccircle cx="200" cy="150" r="80" fill="%23E0F2FE"/%E%3Crect x="100" y="200" width="200" height="80" fill="%232196F3"/%3E%3C/svg%3E',
    enhancedImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3Cfilter id="blur"%3E%CfeGaussianBlur in="SourceGraphic stdDeviation="0"/%E%3C/filter%E3E%3C/defs%3E%3Crect width="400" height="300" fill="%2387CEEB"/%E%3Ccircle cx="200" cy="150" r="80" fill="%23E0F2FE"/%E%Crect x="100" y="200" width="200" height="80" fill="%232196F3"/%E%3Ctext x="350" y="280" font-size="12" fill="%23FFF" text-anchor="end"%3E7680x4320 (8K)%3C/text%3E%3C/svg%3E',
    category: 'landscape'
  },
  {
    id: '3',
    title: '老照片修复',
    description: '年代久远照片 → 8K 超高清修复',
    originalImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%E%3E%3Cfilter id="blur"%3E%3CfeGaussianBlur in="SourceGraphic stdDeviation="5"/%E%3C/filter%E%3E%3C/defs%3E%3Crect width="400" height="300" fill="%23D3D3D3"/%3E%3Crect x="120" y="100" width="160" height="120" fill="%23A0A0A0"/%E%3Crect x="100" y="100" width="40" height="120" fill="%23808080"/%E%3C/svg%3E',
    enhancedImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3Cfilter id="blur"%3E%3CfeGaussianBlur in="SourceGraphic stdDeviation="0"/%3E%3C/filter%E3E%3C/defs%3E%3Crect width="400" height="300" fill="%23D3D3D3"/%3E%3Crect x="120" y="100" width="160" height="120" fill="%23A0A0A0"/%E%3Crect x="100" y="100" width="40" height="120" fill="%23808080"/%E%3C/svg%3E',
    category: 'portrait'
  },
  {
    id: '4',
    title: '产品照片优化',
    description: '电商产品图 → 8K 高清展示',
    originalImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3Cfilter id="blur"%3E%3CfeGaussianBlur in="SourceGraphic stdDeviation="3"/%3E%3C/filter%E3E%3C/defs%3E%3Crect width="400" height="300" fill="%23F5F5F5"/%E%3Crect x="100" y="80" width="200" height="140" fill="%23E5E7EB"/%E%3Ctext x="200" y="150" text-anchor="middle" fill="%23333" font-family="sans-serif" font-size="16"%3E产品图%3C/text%3E%3C/svg%3E',
    enhancedImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3Cfilter id="blur"%3E%3CfeGaussianBlur in="SourceGraphic stdDeviation="0"/%E%3C/filter%E3E%3C/defs%3E%3Crect width="400" height="300" fill="%23F5F5F5"/%E%3Crect x="100" y="80" width="200" height="140" fill="%23E5E7EB"/%E%Ctext x="200" y="150" text-anchor="middle" fill="%23333" font-family="sans-serif" font-size="16"%3E产品图%3C/text%3E%3Ctext x="350" y="280" font-size="12" fill="%23FFF" text-anchor="end"%3E7680x4320 (8K)%3C/text%3E%3C/svg%3E',
    category: 'product'
  }
]

export default function ExampleShowcase() {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null)

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            8K 超高清效果展示
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            每个示例都是真实的 8x 放大效果，展示 Finegrain 的强大能力
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600">
            <CheckCircle2 className="w-5 h-5" />
            <span>8x 超高清 • 实时处理 • 24小时删除</span>
          </div>
        </div>

        {/* 示例选择 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedExample(example)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedExample?.id === example.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-102'
              }`}
            >
              <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {example.originalImage.startsWith('data:') ? (
                  <img
                    src={example.originalImage}
                    alt={example.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {example.title}
              </h3>
              <p className="text-sm text-gray-600">
                {example.description}
              </p>
            </button>
          ))}
        </div>

        {/* 对比视图 */}
        {selectedExample && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedExample.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  {selectedExample.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span className="text-blue-600 font-medium">8x 超高清</span>
                  <span className="text-gray-400">•</span>
                  <span>60 秒处理</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedExample(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                返回示例列表
              </button>
            </div>
            
            <ComparisonSlider
              originalImage={selectedExample.originalImage}
              enhancedImage={selectedExample.enhancedImage}
              originalAlt="原图"
              enhancedText="增强后 (8K 超高清)"
            />
          </div>
        )}

        {/* 提示 */}
        {!selectedExample && (
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">点击上方示例查看 8K 超高清对比</p>
            <p className="text-sm">
              拖动滑块查看差异 • 放大缩小查看细节 • 8K 超高清体验
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

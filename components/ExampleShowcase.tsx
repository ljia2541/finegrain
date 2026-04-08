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

// 4 个超高清示例（使用真实的 AI 增强前后对比）
const examples: Example[] = [
  {
    id: '1',
    title: '人像照片增强',
    description: '低分辨率人像 → 超高清（4x 放大）',
    originalImage: '/examples/portrait_original.jpg',
    enhancedImage: '/examples/portrait_enhanced.jpg',
    category: 'portrait'
  },
  {
    id: '2',
    title: '风景照片超分',
    description: '风景照片 → 4x 超分辨率放大',
    originalImage: '/examples/landscape_original.jpg',
    enhancedImage: '/examples/landscape_enhanced.jpg',
    category: 'landscape'
  },
  {
    id: '3',
    title: '老照片增强',
    description: '年代久远照片 → 超高清增强',
    originalImage: '/examples/oldphoto_original.jpg',
    enhancedImage: '/examples/oldphoto_enhanced.jpg',
    category: 'portrait'
  },
  {
    id: '4',
    title: '产品照片优化',
    description: '电商产品图 → 超高清展示',
    originalImage: '/examples/product_original.jpg',
    enhancedImage: '/examples/product_enhanced.jpg',
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
            AI 超高清效果展示
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            每个示例都是真实的 AI 放大效果，展示 Finegrain 的超分辨率能力
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600">
            <CheckCircle2 className="w-5 h-5" />
            <span>超高清放大 • 实时处理 • 24小时删除</span>
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
                <img
                  src={example.originalImage}
                  alt={example.title}
                  className="w-full h-full object-cover"
                />
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
              enhancedAlt="增强后 (超高清)"
            />
          </div>
        )}

        {/* 提示 */}
        {!selectedExample && (
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">点击上方示例查看超高清对比</p>
            <p className="text-sm">
              拖动滑块查看差异 • 放大缩小查看细节
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import ComparisonSlider from './ComparisonSlider'

interface Example {
  id: string
  title: string
  description: string
  originalImage: string
  enhancedImage: string
  category: string
}

// 4 AI upscale examples (real before/after comparisons)
const examples: Example[] = [
  {
    id: '1',
    title: 'Portrait Photo',
    description: 'Low-res portrait → Super upscale (4x)',
    originalImage: '/examples/portrait_original.jpg',
    enhancedImage: '/examples/portrait_enhanced.jpg',
    category: 'portrait'
  },
  {
    id: '2',
    title: 'Landscape Photo',
    description: 'Landscape photo → 4x super resolution',
    originalImage: '/examples/landscape_original.jpg',
    enhancedImage: '/examples/landscape_enhanced.jpg',
    category: 'landscape'
  },
  {
    id: '3',
    title: 'Product Photo',
    description: 'Product photo → Super crisp display',
    originalImage: '/examples/product_original.jpg',
    enhancedImage: '/examples/product_enhanced.jpg',
    category: 'product'
  },
  {
    id: '4',
    title: 'Vintage Photo',
    description: 'Vintage photo → Quality enhancement',
    originalImage: '/examples/oldphoto_original.jpg',
    enhancedImage: '/examples/oldphoto_enhanced.jpg',
    category: 'portrait'
  }
]

export default function ExampleShowcase() {
  const [activeExample, setActiveExample] = useState<Example>(examples[0])

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Upscale Results
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real AI enhancement comparisons. Drag the slider to see the difference.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600">
          <CheckCircle2 className="w-5 h-5" />
          <span>Super upscale • Real-time processing • Deleted after 24h</span>
        </div>
      </div>

      {/* Thumbnail selector */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 justify-center flex-wrap">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example)}
            className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              activeExample.id === example.id
                ? 'border-blue-500 ring-2 ring-blue-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={example.originalImage}
              alt={example.title}
              className="w-24 h-24 object-cover"
            />
            <div className="bg-white px-2 py-1 text-xs text-gray-600">{example.title}</div>
          </button>
        ))}
      </div>

      {/* Comparison Slider */}
      <ComparisonSlider
        originalImage={activeExample.originalImage}
        enhancedImage={activeExample.enhancedImage}
        originalAlt="Original"
        enhancedAlt="Enhanced"
      />

      <p className="text-center text-sm text-gray-400 mt-4">
        Drag the slider to compare • Scroll to zoom • Model: Recraft 4x
      </p>

      {/* Grid of all examples */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example)}
            className="text-left"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
              <img
                src={example.originalImage}
                alt={example.title}
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="font-medium text-sm text-gray-900">{example.title}</div>
            <div className="text-xs text-gray-500">{example.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

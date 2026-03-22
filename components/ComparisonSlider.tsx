'use client'

import { useState, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'

interface ComparisonSliderProps {
  originalImage: string
  enhancedImage: string
  originalAlt?: string
  enhancedAlt?: string
}

export default function ComparisonSlider({
  originalImage,
  enhancedImage,
  originalAlt = '原图',
  enhancedAlt = '增强后'
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const position = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, position)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const position = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, position)))
  }

  const handleZoomIn = () => {
    if (zoomLevel < 400) {
      setZoomLevel(prev => prev + 50)
      if (zoomLevel >= 100) setIsZoomed(true)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 100) {
      setZoomLevel(prev => prev - 50)
      if (zoomLevel <= 100) setIsZoomed(false)
    }
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
    setIsZoomed(false)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 对比容器 */}
      <div 
        ref={containerRef}
        className={`relative w-full flex-1 rounded-lg overflow-hidden select-none bg-gray-900 ${
          isZoomed ? 'cursor-zoom-in' : ''
        }`}
        onMouseMove={handleSliderMove}
        onTouchMove={handleTouchMove}
        onMouseUp={handleSliderMove}
        onTouchEnd={handleSliderMove}
        onClick={handleResetZoom}
      >
        {/* 原图（底层） */}
        <img
          src={originalImage}
          alt={originalAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ userSelect: 'none' }}
        />
        
        {/* 增强图（顶层，通过裁剪显示） */}
        <div
          className="absolute inset-0 overflow-hidden border-l-2 border-blue-500"
          style={{ left: `${sliderPosition}%` }}
        >
          <img
            src={enhancedImage}
            alt={enhancedAlt}
            className="absolute top-0 h-full object-cover"
            style={{ 
              left: `${sliderPosition}%`,
              transform: 'translateX(-100%)',
              userSelect: 'none',
              width: `${100 / (100 - sliderPosition) * 100}%`
            }}
          />
        </div>

        {/* 滑块控制条 */}
        <div 
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-1 bg-blue-500 cursor-ew-resize shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-blue-500 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
              <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* 标签 */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg backdrop-blur-sm">
          {originalAlt}
        </div>
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-blue-600/90 text-white text-sm rounded-lg backdrop-blur-sm">
          {enhancedAlt} ✨
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useCallback } from 'react'
import 'react-image-crop/dist/ReactCrop.css'

interface CrystalCropperProps {
  imageSrc: string
  imageWidth: number
  imageHeight: number
  onCropped: (croppedDataUrl: string, croppedWidth: number, croppedHeight: number) => void
  onCancel: () => void
}

const MAX_CRYSTAL_PIXELS = 1000

export default function CrystalCropper({
  imageSrc,
  imageWidth,
  imageHeight,
  onCropped,
  onCancel,
}: CrystalCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // 显示缩放（最大 500px 宽）
  const displayScale = Math.min(500 / imageWidth, 500 / imageHeight, 1)
  const displayWidth = imageWidth * displayScale
  const displayHeight = imageHeight * displayScale

  // 裁剪框尺寸（1000px 映射到显示尺寸）
  const cropDisplaySize = MAX_CRYSTAL_PIXELS * displayScale

  // 裁剪框在显示尺寸内的位置限制
  const maxX = Math.max(0, displayWidth - cropDisplaySize)
  const maxY = Math.max(0, displayHeight - cropDisplaySize)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX - cropPos.x, y: e.clientY - cropPos.y }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const newX = Math.max(0, Math.min(maxX, e.clientX - dragStart.current.x))
    const newY = Math.max(0, Math.min(maxY, e.clientY - dragStart.current.y))
    setCropPos({ x: newX, y: newY })
  }, [isDragging, maxX, maxY])

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleConfirm = () => {
    if (!imgRef.current) return

    const img = imgRef.current
    // 计算实际像素的裁剪区域
    const scaleX = imageWidth / displayWidth
    const scaleY = imageHeight / displayHeight

    const cropX = cropPos.x * scaleX
    const cropY = cropPos.y * scaleY
    const cropW = Math.round(cropDisplaySize * scaleX)
    const cropH = Math.round(cropDisplaySize * scaleY)

    const canvas = document.createElement('canvas')
    canvas.width = cropW
    canvas.height = cropH
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
    const dataUrl = canvas.toDataURL('image/png')
    onCropped(dataUrl, cropW, cropH)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Adjust Crop Area</h3>
        <p className="text-sm text-gray-500 mb-4">
          Crystal only supports images ≤ 1000px on the long edge. Drag to select the crop area.
        </p>

        {/* Image Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 mx-auto select-none"
          style={{ width: displayWidth, height: displayHeight }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="To crop"
            style={{ width: displayWidth, height: displayHeight }}
            crossOrigin="anonymous"
            draggable={false}
          />

          {/* Translucent Mask */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Left Side */}
            <div
              className="absolute top-0 bg-black/50"
              style={{ left: 0, top: 0, width: cropPos.x, height: displayHeight }}
            />
            {/* Right Side */}
            <div
              className="absolute top-0 bg-black/50"
              style={{ left: cropPos.x + cropDisplaySize, top: 0, width: displayWidth - cropPos.x - cropDisplaySize, height: displayHeight }}
            />
            {/* 上 */}
            <div
              className="absolute top-0 bg-black/50"
              style={{ left: cropPos.x, top: 0, width: cropDisplaySize, height: cropPos.y }}
            />
            {/* 下 */}
            <div
              className="absolute bg-black/50"
              style={{ left: cropPos.x, top: cropPos.y + cropDisplaySize, width: cropDisplaySize, height: displayHeight - cropPos.y - cropDisplaySize }}
            />
          </div>

          {/* Crop Box */}
          <div
            className="absolute border-2 border-white cursor-move z-10"
            style={{
              left: cropPos.x,
              top: cropPos.y,
              width: cropDisplaySize,
              height: cropDisplaySize,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
            }}
            onMouseDown={handleMouseDown}
          >
            {/* 四个角 */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full border-2 border-purple-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-purple-600" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full border-2 border-purple-600" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-purple-600" />
            {/* 中心十字 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-mono opacity-70 pointer-events-none">
              {Math.round(cropDisplaySize * (imageWidth / displayWidth))}px
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2 mb-4">
          Drag the crop box to select the 1000px area for Crystal
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
          >
            Confirm Crop
          </button>
        </div>
      </div>
    </div>
  )
}

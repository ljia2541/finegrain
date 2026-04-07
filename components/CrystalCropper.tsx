'use client'

import { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface CrystalCropperProps {
  imageSrc: string
  imageWidth: number
  imageHeight: number
  onCropped: (croppedDataUrl: string) => void
  onCancel: () => void
}

const MAX_CRYSTAL_PIXELS = 1000 // Crystal 长边最大像素

export default function CrystalCropper({
  imageSrc,
  imageWidth,
  imageHeight,
  onCropped,
  onCancel,
}: CrystalCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  // 计算最大裁剪尺寸（不超过 1000px）
  const displayScale = Math.min(500 / imageWidth, 500 / imageHeight, 1)
  const displayWidth = imageWidth * displayScale
  const displayHeight = imageHeight * displayScale

  // Crystal 允许的比例范围 1:3 ~ 3:1，即 0.33 ~ 3
  const aspect = imageWidth / imageHeight

  const getCroppedBlob = useCallback(async (): Promise<string> => {
    if (!imgRef.current || !completedCrop) return imageSrc

    const img = imgRef.current
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    // 计算实际像素的裁剪区域
    const scaleX = img.naturalWidth / displayWidth
    const scaleY = img.naturalHeight / displayHeight

    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY
    const cropWidth = completedCrop.width * scaleX
    const cropHeight = completedCrop.height * scaleY

    // 确保裁剪后尺寸不超过 1000px
    const longEdge = Math.max(cropWidth, cropHeight)
    const scale = longEdge > MAX_CRYSTAL_PIXELS ? MAX_CRYSTAL_PIXELS / longEdge : 1

    canvas.width = cropWidth * scale
    canvas.height = cropHeight * scale

    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, canvas.width, canvas.height,
    )

    return canvas.toDataURL('image/png')
  }, [completedCrop, displayWidth, displayHeight, imageSrc])

  const handleConfirm = async () => {
    const cropped = await getCroppedBlob()
    onCropped(cropped)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-2">调整裁剪区域</h3>
        <p className="text-sm text-gray-500 mb-4">
          Crystal 仅支持 1000px 以内的图片。请裁剪到合适区域（支持 1:3 ~ 3:1 比例）
        </p>

        <div className="flex justify-center overflow-hidden rounded-lg border border-gray-200 mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, pct) => setCrop(pct)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={undefined}
            minWidth={100}
            minHeight={100}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="待裁剪"
              style={{ width: displayWidth, height: displayHeight }}
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!completedCrop?.width}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            确认裁剪
          </button>
        </div>
      </div>
    </div>
  )
}

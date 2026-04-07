'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ImageUploader() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      if (e.target.files.length > 1) {
        alert('当前仅支持单张图片上传')
        e.target.value = ''
        return
      }
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']
    if (!validTypes.includes(file.type)) {
      alert('不支持的文件类型。请上传 JPG、PNG、WebP、HEIC 或 AVIF 格式的图片。')
      return
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('文件太大。请上传小于 10MB 的图片。')
      return
    }

    setSelectedFile(file)
    
    // 创建预览
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleEnhance = () => {
    if (!selectedFile) return
    // 跳转到增强页面，通过 sessionStorage 传递文件信息
    const reader = new FileReader()
    reader.onloadend = () => {
      sessionStorage.setItem('pendingImage', JSON.stringify({
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        dataUrl: reader.result,
      }))
      router.push('/enhance/general')
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleReupload = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-8 transition-all hover:border-blue-300 hover:shadow-lg"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {!selectedFile ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              拖放到任意位置上传
            </h3>
            
            <p className="text-gray-600 mb-4 text-sm">
              或者点击选择文件 • 单张上传 • 支持常见手机/相机照片
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-500">
              <span className="px-2 py-1 bg-white rounded border">JPG</span>
              <span className="px-2 py-1 bg-white rounded border">PNG</span>
              <span className="px-2 py-1 bg-white rounded border">WebP</span>
              <span className="px-2 py-1 bg-white rounded border">HEIC</span>
              <span className="px-2 py-1 bg-white rounded border">AVIF</span>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/heic,image/avif"
              multiple
              onChange={handleChange}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              选择图片
            </label>
          </div>
          
          {/* 隐私提示 */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>24 小时自动删除 • 加密处理 • 不存储用户图片</span>
          </div>

          {/* Crystal 模式尺寸提示 */}
          <div className="mt-2 text-center">
            <p className="text-xs text-amber-600">
              💡 Crystal 人像模式仅支持 1000px 以内长边图片
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <img
            src={preview || ''}
            alt="Preview"
            className="w-full rounded-lg shadow-lg"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReupload}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              重新选择
            </button>
            <button
              onClick={handleEnhance}
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '处理中...' : (
                <>
                  开始增强
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

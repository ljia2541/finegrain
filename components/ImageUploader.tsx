'use client'

import { useState, useCallback } from 'react'
import { Upload } from 'lucide-react'

export default function ImageUploader() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

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

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // TODO: 实现上传逻辑
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })
      
      // 模拟上传
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('上传成功！（演示）')
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            拖拽图片到这里，或点击选择文件
          </p>
          <p className="text-sm text-gray-500 mb-4">
            支持 JPG、PNG、WebP、HEIC、AVIF 格式，最大 10MB
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/heic,image/avif"
            onChange={handleChange}
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            选择图片
          </label>
          
          <PrivacyNotice />
        </div>
      ) : (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setSelectedFile(null)
                setPreview(null)
              }}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              重新选择
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '上传中...' : '开始增强'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PrivacyNotice() {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🔒</span>
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">隐私保护承诺</p>
          <p>您上传的图片将在 24 小时内自动删除。我们不存储用户图片，所有处理均在加密环境中进行。</p>
        </div>
      </div>
    </div>
  )
}

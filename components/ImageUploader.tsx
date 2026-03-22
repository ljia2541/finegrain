'use client'

import { useState, useCallback } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

export default function ImageUploader() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    // 验证文件数量（最多 20 张）
    if (selectedFiles.length + files.length > 20) {
      alert('最多只能上传 20 张图片')
      return
    }

    files.forEach(file => {
      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} 格式不支持。请上传 JPG、PNG、WebP、HEIC 或 AVIF 格式的图片。`)
        return
      }

      // 验证文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} 太大。请上传小于 10MB 的图片。`)
        return
      }

      setSelectedFiles(prev => [...prev, file])
      
      // 创建预览
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    
    try {
      // TODO: 实现上传逻辑
      // const formData = new FormData()
      // selectedFiles.forEach(file => formData.append('files', file))
      
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })
      
      // 模拟上传
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`成功上传 ${selectedFiles.length} 张图片！（演示）`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {/* 上传区域 */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Upload className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            拖放到任意位置上传
          </h3>
          
          <p className="text-gray-600 mb-6">
            或者点击选择文件 • 最多 20 张 • 最高 512 百万像素
          </p>
          
          <div className="flex items-center gap-3 mb-8 text-sm text-gray-500">
            <span className="px-3 py-1 bg-white rounded-full border">JPG</span>
            <span className="px-3 py-1 bg-white rounded-full border">PNG</span>
            <span className="px-3 py-1 bg-white rounded-full border">WebP</span>
            <span className="px-3 py-1 bg-white rounded-full border">HEIC</span>
            <span className="px-3 py-1 bg-white rounded-full border">AVIF</span>
          </div>
          
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/heic,image/avif"
            multiple
            onChange={handleChange}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            选择图片
          </label>
        </div>
        
        {/* 隐私提示 */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>24 小时自动删除 • 加密处理 • 不存储用户图片</span>
        </div>
      </div>

      {/* 预览区域 */}
      {previews.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              已选择 {selectedFiles.length} 张图片
            </h3>
            <button
              onClick={() => {
                setSelectedFiles([])
                setPreviews([])
              }}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              清空全部
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg">
                  {selectedFiles[index].name}
                </div>
              </div>
            ))}
          </div>
          
          {/* 操作按钮 */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setSelectedFiles([])
                setPreviews([])
              }}
              className="bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              重新选择
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0 4.411-3.589 8-8 8s-8-3.589-8-8 3.589-8 8 8z"></path>
                  </svg>
                  处理中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  开始增强
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

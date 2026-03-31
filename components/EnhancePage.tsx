'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Download, X, Loader2, Sparkles, ArrowRight } from 'lucide-react'

interface ModelOption {
  id: string
  name: string
  credits: number
}

interface EnhancePageProps {
  title: string
  subtitle: string
  models: ModelOption[]
  scales: number[]
  isFree: boolean
  directPrice?: string
  currentCredits?: number
  maxLongEdge?: number
  badge?: string
  badgeColor?: string
  tips?: string[]
}

type Phase = 'upload' | 'preview' | 'processing' | 'result'

export default function EnhancePage({
  title,
  subtitle,
  models,
  scales,
  isFree,
  directPrice,
  currentCredits = 0,
  maxLongEdge,
  badge,
  badgeColor = 'bg-green-500',
  tips,
}: EnhancePageProps) {
  const [phase, setPhase] = useState<Phase>('upload')
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [imageWidth, setImageWidth] = useState(0)
  const [imageHeight, setImageHeight] = useState(0)
  const [selectedModel, setSelectedModel] = useState<ModelOption>(models[0])
  const [selectedScale, setSelectedScale] = useState<number>(scales[0])
  const [error, setError] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)

  const currentModel = selectedModel
  const cost = isFree ? 0 : (directPrice ? undefined : currentModel.credits)
  const remainingAfterProcess = !isFree && !directPrice && cost !== undefined
    ? currentCredits - cost
    : null

  // Drag & drop handlers
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)
    setResultUrl(null)

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']
    if (!validTypes.includes(file.type)) {
      setError('不支持的文件类型，请上传 JPG、PNG、WebP、HEIC 或 AVIF 格式的图片。')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('文件大小超过 10MB 限制，请压缩后再上传。')
      return
    }

    // Read file for preview and dimensions
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    const img = new Image()
    img.onload = () => {
      setImageWidth(img.naturalWidth)
      setImageHeight(img.naturalHeight)

      // Check max long edge
      if (maxLongEdge) {
        const longEdge = Math.max(img.naturalWidth, img.naturalHeight)
        if (longEdge > maxLongEdge) {
          setError(`图片长边 ${longEdge}px 超过限制 ${maxLongEdge}px，请缩小图片后重试。`)
          return
        }
      }

      setSelectedFile(file)
      setPhase('preview')
    }
    img.onerror = () => {
      setError('无法读取图片，请尝试其他文件。')
    }
    img.src = URL.createObjectURL(file)
  }

  const handleProcess = async () => {
    if (!selectedFile || !preview) return

    setPhase('processing')
    setProcessingProgress(0)

    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 80) {
          clearInterval(interval)
          return 80
        }
        return prev + Math.random() * 8
      })
    }, 500)

    try {
      // 检查像素是否超过 Replicate 限制（约 200 万像素）
      // Real-ESRGAN 限制 ~2M 像素，Crystal 限制 ~1448x1448
      const MAX_PIXELS = maxLongEdge ? maxLongEdge * maxLongEdge : 2_000_000
      let fileToUpload: File = selectedFile
      let uploadWidth = imageWidth
      let uploadHeight = imageHeight

      if (imageWidth * imageHeight > MAX_PIXELS) {
        // 用 canvas 压缩到限制以内
        const scale = Math.sqrt(MAX_PIXELS / (imageWidth * imageHeight))
        const newWidth = Math.round(imageWidth * scale)
        const newHeight = Math.round(imageHeight * scale)

        const canvas = document.createElement('canvas')
        canvas.width = newWidth
        canvas.height = newHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas not supported')

        const img = new Image()
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error('图片加载失败'))
          img.src = preview
        })
        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92)
        })
        fileToUpload = new File([blob], selectedFile.name, { type: 'image/jpeg' })
        uploadWidth = newWidth
        uploadHeight = newHeight
      }

      // 步骤 1：获取 COS 预签名上传 URL（请求体极小，只有文件名）
      const presignRes = await fetch('/api/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: fileToUpload.type,
        }),
      })

      const presignData = await presignRes.json()
      if (!presignRes.ok || !presignData.success) {
        clearInterval(interval)
        setError(presignData.error || '获取上传凭证失败，请重试。')
        setPhase('preview')
        return
      }

      setProcessingProgress(15)

      // 步骤 2：直接 PUT 上传到 COS（绕过 Vercel 4.5MB 限制）
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        body: fileToUpload,
        headers: { 'Content-Type': fileToUpload.type },
      })

      if (!uploadRes.ok) {
        clearInterval(interval)
        setError('图片上传失败，请重试。')
        setPhase('preview')
        return
      }

      setProcessingProgress(30)

      // 步骤 3：调 enhance API（只传 COS 下载 URL，请求体极小）
      let apiModel = selectedModel.id
      let apiScale = selectedScale
      if (apiModel === 'crystal10x') {
        apiModel = 'crystal'
        apiScale = 10
      }

      const res = await fetch('/api/enhance-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: presignData.downloadUrl,
          model: apiModel,
          scale: apiScale,
          imageWidth: uploadWidth,
          imageHeight: uploadHeight,
        }),
        signal: AbortSignal.timeout(5 * 60 * 1000),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        clearInterval(interval)
        setError(data.error || '增强处理失败，请重试。')
        setPhase('preview')
        return
      }

      clearInterval(interval)
      setProcessingProgress(100)
      setResultUrl(data.imageUrl)
      setPhase('result')
    } catch (err) {
      clearInterval(interval)
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        setError('处理超时，请重试或换一张更小的图片。')
      } else {
        setError('网络错误，请检查网络连接后重试。')
      }
      setPhase('preview')
    }
  }

  const handleReset = () => {
    setPhase('upload')
    setSelectedFile(null)
    setPreview(null)
    setUploadedImageUrl(null)
    setImageWidth(0)
    setImageHeight(0)
    setError(null)
    setResultUrl(null)
    setProcessingProgress(0)
    setSliderPos(50)
    setSelectedModel(models[0])
    setSelectedScale(scales[0])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSliderMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
            {badge && (
              <span className={`${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-lg">{subtitle}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-500">剩余积分：</span>
              <span className="font-semibold text-gray-900">{currentCredits}</span>
            </div>

            {models.length === 1 ? (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-500">使用模型：</span>
                <span className="font-semibold text-gray-900">{models[0].name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-500 shrink-0">使用模型：</span>
                <select
                  value={selectedModel.id}
                  onChange={(e) => {
                    const m = models.find(m => m.id === e.target.value)
                    if (m) setSelectedModel(m)
                  }}
                  className="flex-1 bg-transparent font-semibold text-gray-900 outline-none cursor-pointer"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}（{m.credits} 积分）</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-500">本次消耗：</span>
              {isFree ? (
                <span className="font-semibold text-green-600">免费</span>
              ) : directPrice ? (
                <span className="font-semibold text-orange-600">{directPrice}</span>
              ) : (
                <span className="font-semibold text-blue-600">{cost} 积分</span>
              )}
            </div>

            {remainingAfterProcess !== null && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-500">处理后剩余：</span>
                <span className={`font-semibold ${remainingAfterProcess < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {remainingAfterProcess < 0 ? '积分不足' : `${remainingAfterProcess}`}
                </span>
              </div>
            )}
          </div>

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>提示</span>
              </div>
              <ul className="text-sm text-amber-700 space-y-0.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-red-700">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Phase */}
          {phase === 'upload' && (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  拖放图片到此处上传
                </h3>

                <p className="text-gray-500 mb-4 text-sm">
                  或点击选择文件 · 支持 JPG / PNG / WebP / HEIC / AVIF · 最大 10MB
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-white rounded border">JPG</span>
                  <span className="px-2 py-1 bg-white rounded border">PNG</span>
                  <span className="px-2 py-1 bg-white rounded border">WebP</span>
                  <span className="px-2 py-1 bg-white rounded border">HEIC</span>
                  <span className="px-2 py-1 bg-white rounded border">AVIF</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/heic,image/avif"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Preview Phase */}
          {phase === 'preview' && preview && (
            <div className="space-y-5">
              {/* Image preview */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {imageWidth} × {imageHeight}px
                </div>
              </div>

              {/* Scale selection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm font-medium text-gray-700 shrink-0">
                  <ArrowRight className="w-4 h-4 inline mr-1" />
                  放大倍率：
                </span>

                {scales.length === 1 ? (
                  <span className="text-lg font-bold text-blue-600">
                    {scales[0]}x
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {scales.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedScale(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedScale === s
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Output info */}
              <div className="text-xs text-gray-400">
                输出尺寸：{imageWidth * selectedScale} × {imageHeight * selectedScale}px
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  重新选择
                </button>
                <button
                  onClick={handleProcess}
                  disabled={!isFree && !directPrice && currentCredits < currentModel.credits}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  开始增强
                </button>
              </div>
            </div>
          )}

          {/* Processing Phase */}
          {phase === 'processing' && (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">正在增强图片…</p>
                <p className="text-sm text-gray-500">
                  {selectedModel.name} · {selectedScale}x 放大
                </p>
              </div>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(processingProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {Math.round(Math.min(processingProgress, 100))}%
                </p>
              </div>
            </div>
          )}

          {/* Result Phase - Comparison Slider */}
          {phase === 'result' && preview && (
            <div className="space-y-5">
              {/* Comparison Slider */}
              <div
                ref={sliderRef}
                className="relative rounded-xl overflow-hidden cursor-col-resize select-none bg-gray-100"
                onMouseMove={handleSliderMove}
              >
                {/* Original (left side) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={preview}
                    alt="Original"
                    className="h-full w-auto min-w-full object-cover"
                    style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: 'none' }}
                  />
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                    原图
                  </div>
                </div>

                {/* Result (right side / full) */}
                <img
                  src={resultUrl || preview}
                  alt="Result"
                  className="w-full block"
                  draggable={false}
                />
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  增强后 {selectedScale}x
                </div>

                {/* Slider line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                      <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Output info */}
              <div className="text-center text-sm text-gray-500">
                {imageWidth * selectedScale} × {imageHeight * selectedScale}px · {selectedModel.name} · {selectedScale}x
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  继续增强
                </button>
                <a
                  // TODO: 替换为真实下载链接
                  href={resultUrl || preview}
                  download={`enhanced_${selectedScale}x.png`}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载图片
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

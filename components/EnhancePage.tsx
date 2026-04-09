'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, X, Loader2, Sparkles, ArrowRight } from 'lucide-react'

interface ModelOption {
  id: string
  name: string
  credits: number
  description?: string
  tag?: string       // e.g. "Recommended", "Sharpest"
  tagColor?: string  // e.g. "bg-green-500"
}

interface EnhancePageProps {
  title: string
  subtitle: string
  models: ModelOption[]
  scales: number[]
  isFree: boolean
  directPrice?: string
  currentCredits?: number
  purchaseCredits?: number
  subscriptionCredits?: number
  maxLongEdge?: number
  badge?: string
  badgeColor?: string
  tips?: string[]
  creditsExpirySoon?: string | null
  subExpirySoon?: string | null
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
  purchaseCredits = 0,
  subscriptionCredits = 0,
  badge,
  badgeColor = 'bg-green-500',
  tips,
  creditsExpirySoon,
  subExpirySoon,
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
  const [selectedCreditSource, setSelectedCreditSource] = useState<'auto' | 'subscription' | 'purchase'>('auto')
  const [error, setError] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)

  // 从首页跳转过来时，Auto读取待处理图片
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem('pendingImage')
      if (pending) {
        sessionStorage.removeItem('pendingImage')
        const { name, type, dataUrl } = JSON.parse(pending)
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], name, { type })
            setSelectedFile(file)
            setPreview(dataUrl)
          })
      }
    } catch {}
  }, [])

  const currentModel = selectedModel

  // 动态计算可用倍率
  const effectiveScales = selectedModel.id === 'recraft' ? scales.filter(s => s === 2)
    : scales

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
      setError('Unsupported file type. Please upload JPG, PNG, WebP, HEIC or AVIF.')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds 10MB limit. Please compress and try again.')
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
      setSelectedFile(file)
      setPhase('preview')
    }
    img.onerror = () => {
      setError('Cannot read image file. Please try a different one.')
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
      // Real-ESRGAN / Recraft / Google Upscaler 限制 ~4M 像素
      const MAX_PIXELS = 4_000_000
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
          img.onerror = () => reject(new Error('Image failed to load'))
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

      // 步骤 1：上传到 R2（通过后端 API 代理，避免 CORS 问题）
      const formData = new FormData()
      formData.append('file', fileToUpload, fileToUpload.name)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.success) {
        clearInterval(interval)
        setError(uploadData.error || 'Image upload failed. Please try again.')
        setPhase('preview')
        return
      }

      setProcessingProgress(30)

      // 步骤 2：调 enhance API（传 R2 签名 URL）
      const apiModel = selectedModel.id
      const apiScale = selectedScale

      const res = await fetch('/api/enhance-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          model: apiModel,
          scale: apiScale,
          imageWidth: uploadWidth,
          imageHeight: uploadHeight,
          creditSource: selectedCreditSource,
        }),
        signal: AbortSignal.timeout(5 * 60 * 1000),
      })

      const data = await res.json()

      if (res.status === 401 && data.error === 'LOGIN_REQUIRED') {
        clearInterval(interval)
        setError('Please sign in to use paid models')
        setPhase('preview')
        // 触发登录
        const { signIn } = await import('next-auth/react')
        signIn('google', { callbackUrl: window.location.pathname })
        return
      }

      if (res.status === 402 && data.error === 'INSUFFICIENT_CREDITS') {
        clearInterval(interval)
        let hint = `Insufficient credits. Need ${data.required}, you have ${data.balance}.`
        if (data.purchaseBalance > 0 && selectedCreditSource === 'subscription') {
          hint = `Subscription credits insufficient (${data.subscriptionBalance}/${data.required}). Purchase balance: ${data.purchaseBalance}. Switch deduction order to "Purchase first".`
        } else if (data.subscriptionBalance > 0 && selectedCreditSource === 'purchase') {
          hint = `Purchase credits insufficient (${data.purchaseBalance}/${data.required}). Subscription balance: ${data.subscriptionBalance}. Switch deduction order to "Subscription first".`
        }
        setError(hint)
        setPhase('preview')
        return
      }

      if (res.status === 429 && data.error === 'FREE_LIMIT_REACHED') {
        clearInterval(interval)
        setError(data.message || 'Daily free limit reached')
        setPhase('preview')
        return
      }

      if (!res.ok || !data.success) {
        clearInterval(interval)
        setError(data.error || 'Enhancement failed. Please try again.')
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
        setError('Processing timed out. Please try again or use a smaller image.')
      } else {
        setError('Network error. Please check your connection and try again.')
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
              <span className="text-gray-500">Credits: </span>
              <span className="font-semibold text-gray-900">{currentCredits}</span>
              {creditsExpirySoon && (
                <span className="text-xs text-orange-600 font-medium">({creditsExpirySoon})</span>
              )}
              {subscriptionCredits > 0 && (
                <span className="text-xs text-purple-600 font-medium ml-1">
                  📅 Subscription: {subscriptionCredits}
                  {subExpirySoon && `(${subExpirySoon})`}
                </span>
              )}
              {purchaseCredits > 0 && (
                <span className="text-xs text-blue-600 font-medium ml-1">
                  🛒 Purchase: {purchaseCredits}
                </span>
              )}
            </div>

            {/* Credit source selector (shown for paid models) */}
            {!isFree && !directPrice && currentCredits > 0 && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-500 shrink-0">Deduction order: </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedCreditSource('auto')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedCreditSource === 'auto'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Auto
                  </button>
                  {subscriptionCredits > 0 && (
                    <button
                      onClick={() => setSelectedCreditSource('subscription')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        selectedCreditSource === 'subscription'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Subscription first
                    </button>
                  )}
                  {purchaseCredits > 0 && (
                    <button
                      onClick={() => setSelectedCreditSource('purchase')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        selectedCreditSource === 'purchase'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Purchase first
                    </button>
                  )}
                </div>
              </div>
            )}

            {models.length === 1 ? (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-500">Model: </span>
                <span className="font-semibold text-gray-900">{models[0].name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-500 shrink-0">Model: </span>
                <div className="flex-1 flex flex-wrap gap-2">
                  {models.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m)
                        // Auto调整可选倍率
                        const newScales = m.id === 'recraft' ? scales.filter(s => s === 2) : scales
                        if (!newScales.includes(selectedScale)) {
                          setSelectedScale(newScales[0])
                        }
                      }}
                      className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedModel.id === m.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {m.tag && (
                        <span className={`absolute -top-2 -right-2 ${m.tagColor || 'bg-green-500'} text-white text-[10px] px-1.5 py-0 rounded-full leading-none`}>
                          {m.tag}
                        </span>
                      )}
                      {m.name}
                      {m.credits > 0 && <span className="opacity-70 ml-1">({m.credits})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-500">This use: </span>
              {isFree ? (
                <span className="font-semibold text-green-600">Free</span>
              ) : directPrice ? (
                <span className="font-semibold text-orange-600">{directPrice}</span>
              ) : (
                <span className="font-semibold text-blue-600">{cost} credits</span>
              )}
            </div>

            {remainingAfterProcess !== null && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-500">After: </span>
                <span className={`font-semibold ${remainingAfterProcess < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {remainingAfterProcess < 0 ? 'Insufficient credits' : `${remainingAfterProcess}`}
                </span>
              </div>
            )}
          </div>

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Tips</span>
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
                  Drop image here
                </h3>

                <p className="text-gray-500 mb-4 text-sm">
                  or click to select • JPG / PNG / WebP / HEIC / AVIF • Max 10MB
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
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {imageWidth} × {imageHeight}px
                </div>
              </div>

              {/* Scale selection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm font-medium text-gray-700 shrink-0">
                  <ArrowRight className="w-4 h-4 inline mr-1" />
                  Upscale: 
                </span>

                {effectiveScales.length === 1 ? (
                  <span className="text-lg font-bold text-blue-600">
                    {effectiveScales[0]}x
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {effectiveScales.map(s => (
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
                Output size: {imageWidth * selectedScale} × {imageHeight * selectedScale}px
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Change image
                </button>
                <button
                  onClick={handleProcess}
                  disabled={!isFree && !directPrice && currentCredits < currentModel.credits}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Enhancement
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
                <p className="text-lg font-semibold text-gray-900">Enhancing image…</p>
                <p className="text-sm text-gray-500">
                  {selectedModel.name} · {selectedScale}x upscale
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
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                    Original
                  </div>
                </div>

                {/* Result (right side / full) */}
                <img
                  src={resultUrl || preview}
                  alt="Result"
                  className="w-full block"
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  Enhanced {selectedScale}x
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
                  Enhance another
                </button>
                <a
                  href={resultUrl || preview}
                  download={`enhanced_${selectedScale}x.png`}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

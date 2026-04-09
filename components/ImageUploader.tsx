'use client'

import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ImageUploader() {
  const router = useRouter()

  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-8 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
        <Upload className="w-8 h-8 text-blue-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">
          Drop image here
        </h3>
        <p className="text-gray-600 text-sm">
          or click to select • Single image • Works with phone/camera photos
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <span className="px-2 py-1 bg-white rounded border">JPG</span>
        <span className="px-2 py-1 bg-white rounded border">PNG</span>
        <span className="px-2 py-1 bg-white rounded border">WebP</span>
        <span className="px-2 py-1 bg-white rounded border">HEIC</span>
        <span className="px-2 py-1 bg-white rounded border">AVIF</span>
      </div>

      <button
        onClick={() => router.push('/enhance/free')}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg cursor-pointer"
      >
        <Upload className="w-4 h-4" />
        Select Image
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Auto-deleted after 24h • Encrypted • No image storage</span>
      </div>
    </div>
  )
}

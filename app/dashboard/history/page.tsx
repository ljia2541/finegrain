'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Clock,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image,
  Loader2,
  AlertCircle,
} from 'lucide-react'

interface HistoryItem {
  id: string
  model: string
  scale: number
  credits_used: number
  input_url: string
  output_url: string
  status: string
  created_at: string
}

interface HistoryResponse {
  history: HistoryItem[]
  total: number
  limit: number
  offset: number
}

const MODEL_NAMES: Record<string, string> = {
  'realesrgan': 'Real-ESRGAN',
  'google-upscaler': 'Google Upscaler',
  'recraft': 'Recraft',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHistory()
    }
  }, [status, page])

  async function fetchHistory() {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/enhancement-history?limit=${limit}&offset=${page * limit}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      })
      
      if (!res.ok) throw new Error('Failed to fetch history')
      
      const data: HistoryResponse = await res.json()
      setHistory(data.history || [])
      setTotal(data.total || 0)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900">Processing History</h1>
              <span className="text-sm text-gray-500">{total} records total</span>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Back <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {history.length === 0 && !loading && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No processing records yet</p>
            <button
              onClick={() => router.push('/enhance/free')}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm"
            >
              Go process an image →
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Thumbnails */}
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden">
                      <img
                        src={item.input_url}
                        alt="Original"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden relative">
                      <img
                        src={item.output_url}
                        alt="Enhanced"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      {item.status === 'completed' && (
                        <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-1 rounded-tl">
                          {item.scale}x
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {MODEL_NAMES[item.model] || item.model}
                      </span>
                      {item.status === 'completed' && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Failed
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Processing
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatFullDate(item.created_at)}</span>
                      <span>|</span>
                      <span>{item.credits_used} Credits</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {item.output_url && item.status === 'completed' && (
                      <a
                        href={item.output_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                {item.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>Images are auto-deleted after 24h</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Info note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Enhanced images are auto-deleted from servers after 24h. Please download and save them in time.
          </p>
        </div>
      </div>
    </div>
  )
}

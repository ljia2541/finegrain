'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-bold text-red-200 mb-4">500</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">出错了</h1>
        <p className="text-gray-500 mb-2">抱歉，页面加载时出现了问题</p>
        {error.message && (
          <p className="text-sm text-red-400 mb-6 max-w-md mx-auto">{error.message}</p>
        )}
        <button
          onClick={() => reset()}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  )
}

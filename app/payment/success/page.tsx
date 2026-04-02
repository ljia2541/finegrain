'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'capturing' | 'success' | 'error'>('capturing')
  const [message, setMessage] = useState('正在确认支付...')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('缺少支付信息')
      return
    }

    capturePayment(token)
  }, [searchParams])

  async function capturePayment(orderId: string) {
    try {
      const res = await fetch('/api/payment/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        let planInfo = ''
        try {
          const customData = JSON.parse(data.customId)
          planInfo = customData.planId || ''
        } catch {}
        setMessage(`支付成功！订单号: ${data.orderId}`)
      } else {
        setStatus('error')
        setMessage('支付确认失败，请联系客服')
      }
    } catch {
      setStatus('error')
      setMessage('网络错误，请重试')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        {status === 'capturing' && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2">正在处理</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">支付成功</h2>
            <p className="text-gray-600">{message}</p>
            <a href="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              返回首页
            </a>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">支付失败</h2>
            <p className="text-gray-600">{message}</p>
            <a href="/pricing" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              重新购买
            </a>
          </>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-5xl">⏳</div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

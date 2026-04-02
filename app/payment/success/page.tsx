'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'capturing' | 'success' | 'error'>('capturing')
  const [message, setMessage] = useState('正在确认支付...')

  useEffect(() => {
    const token = searchParams.get('token')
    const PayerID = searchParams.get('PayerID')

    if (!token) {
      setStatus('error')
      setMessage('缺少支付信息')
      return
    }

    // 自动捕获支付
    capturePayment(token, PayerID)
  }, [searchParams])

  async function capturePayment(orderId: string, payerId: string | null) {
    try {
      const res = await fetch('/api/payment/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage(`支付成功！已购买 ${data.customId ? JSON.parse(data.customId).planId : ''} 方案`)
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

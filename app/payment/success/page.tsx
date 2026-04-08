'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'capturing' | 'success' | 'error'>('capturing')
  const [message, setMessage] = useState('正在确认支付...')
  const [subMessage, setSubMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const isSubscription = searchParams.get('subscription') === '1'

    if (!token && !isSubscription) {
      setStatus('error')
      setMessage('Missing payment information')
      return
    }

    if (isSubscription) {
      // 订阅：PayPal approve 后跳转，积分由 Webhook ACTIVATED 事件自动发放
      setStatus('success')
      setMessage('🎉 Subscription successful! Credits will arrive in a few minutes.')
      setSubMessage('PayPal is processing the subscription confirmation')
    } else if (token) {
      capturePayment(token)
    }
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
        if (data.creditsAdded) {
          setMessage(`🎉 Payment successful, ${data.creditsAdded} credits added!`)
          setSubMessage(`Order ID: ${data.orderId}`)
        } else if (data.description) {
          setMessage(`✅ ${data.description}`)
          setSubMessage(`Order ID: ${data.orderId}`)
        } else {
          setMessage('Payment successful!')
          setSubMessage(`Order ID: ${data.orderId}`)
        }
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
            <p className="text-gray-800 font-medium">{message}</p>
            {subMessage && <p className="text-gray-400 text-sm mt-1">{subMessage}</p>}
            <div className="flex gap-3 justify-center mt-6">
              <a href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                查看我的积分
              </a>
              <a href="/" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                Back to Home
              </a>
            </div>
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

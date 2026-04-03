'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface CreditsInfo {
  credits: number
  loading: boolean
  creditsExpireAt: string | null
  formattedExpiry: string | null
}

/**
 * 获取用户当前积分余额和最早过期时间
 * 未登录返回 credits=0
 */
export function useCredits(): CreditsInfo {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState(0)
  const [creditsExpireAt, setCreditsExpireAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      setCredits(0)
      setCreditsExpireAt(null)
      setLoading(false)
      return
    }

    if (!session?.user?.id) return

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.stats?.credits !== undefined) {
          setCredits(data.stats.credits)
        }
        if (data.stats?.creditsExpireAt) {
          setCreditsExpireAt(data.stats.creditsExpireAt)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session, status])

  // 格式化过期时间
  let formattedExpiry: string | null = null
  if (creditsExpireAt) {
    const d = new Date(creditsExpireAt)
    const now = new Date()
    const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 0) {
      formattedExpiry = '即将过期'
    } else if (daysLeft <= 7) {
      formattedExpiry = `${daysLeft} 天后过期`
    } else {
      formattedExpiry = d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' 过期'
    }
  }

  return { credits, loading, creditsExpireAt, formattedExpiry }
}

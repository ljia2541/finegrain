'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface CreditsInfo {
  credits: number
  purchaseCredits: number
  subscriptionCredits: number
  loading: boolean
  creditsExpireAt: string | null
  subscriptionPeriodEnd: string | null
  formattedExpiry: string | null
  formattedSubExpiry: string | null
}

/**
 * 获取用户当前积分余额（拆分订阅和购买积分）
 * 未登录返回 credits=0
 */
export function useCredits(): CreditsInfo {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState(0)
  const [purchaseCredits, setPurchaseCredits] = useState(0)
  const [subscriptionCredits, setSubscriptionCredits] = useState(0)
  const [creditsExpireAt, setCreditsExpireAt] = useState<string | null>(null)
  const [subscriptionPeriodEnd, setSubscriptionPeriodEnd] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      setCredits(0)
      setPurchaseCredits(0)
      setSubscriptionCredits(0)
      setCreditsExpireAt(null)
      setSubscriptionPeriodEnd(null)
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
        if (data.stats?.purchaseCredits !== undefined) {
          setPurchaseCredits(data.stats.purchaseCredits)
        }
        if (data.stats?.subscriptionCredits !== undefined) {
          setSubscriptionCredits(data.stats.subscriptionCredits)
        }
        if (data.stats?.creditsExpireAt) {
          setCreditsExpireAt(data.stats.creditsExpireAt)
        }
        if (data.subscription?.periodEnd) {
          setSubscriptionPeriodEnd(data.subscription.periodEnd)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session, status])

  // 格式化购买积分过期时间
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

  // 格式化订阅周期结束时间
  let formattedSubExpiry: string | null = null
  if (subscriptionPeriodEnd) {
    const d = new Date(subscriptionPeriodEnd)
    const now = new Date()
    const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 0) {
      formattedSubExpiry = '今日到期'
    } else if (daysLeft <= 3) {
      formattedSubExpiry = `${daysLeft} 天后续费`
    } else {
      formattedSubExpiry = d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) + ' 到期'
    }
  }

  return {
    credits,
    purchaseCredits,
    subscriptionCredits,
    loading,
    creditsExpireAt,
    subscriptionPeriodEnd,
    formattedExpiry,
    formattedSubExpiry,
  }
}

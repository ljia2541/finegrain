'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

/**
 * 获取用户当前积分余额
 * 未登录返回 0
 */
export function useCredits() {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      setCredits(0)
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
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session, status])

  return { credits, loading }
}

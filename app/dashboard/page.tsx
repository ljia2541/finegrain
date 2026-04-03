'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import {
  User,
  CreditCard,
  Clock,
  TrendingUp,
  Coins,
  ArrowRight,
  ChevronRight,
  LogOut,
  Shield,
  Gift,
  Crown,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react'

interface UserProfile {
  credits: number
  totalProcessed: number
  totalPurchased: number
  totalSpent: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  balanceAfter: number
  description: string | null
  model: string | null
  createdAt: string
}

interface SubscriptionInfo {
  planId: string
  planName: string
  creditsPerMonth: number
  currentCredits: number
  periodEnd: string
}

// 积分包快捷购买
const quickBuyPackages = [
  { credits: 100, price: '$5.99', popular: false },
  { credits: 200, price: '$9.99', popular: true },
  { credits: 500, price: '$19.99', popular: false },
  { credits: 1000, price: '$29.99', popular: false },
]

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview')
  const [stats, setStats] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setStats(data.stats)
      setTransactions(data.recentTransactions || [])
      if (data.subscription) setSubscription(data.subscription)
      setError(null)
    } catch (e) {
      console.error('Failed to fetch profile:', e)
      setError('加载失败，请刷新重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router, fetchProfile])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    )
  }

  if (!session?.user) return null

  const user = session.user

  const getTransactionIcon = (type: string, model?: string | null) => {
    if (type === 'purchase' || type === 'subscription' || type === 'bonus') return Gift
    if (type === 'refund') return Coins
    if (model?.includes('crystal')) return Sparkles
    return Zap
  }

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    } catch {
      return iso
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.image && (
                <img
                  src={user.image}
                  alt="头像"
                  className="w-16 h-16 rounded-full ring-2 ring-blue-100"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name || '用户'}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchProfile}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="刷新"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href="/pricing"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Coins className="w-4 h-4" />
                购买积分
              </a>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">退出</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Tab 切换 */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            总览
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            交易记录
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* 积分余额 - 大卡片 */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-5 h-5 text-blue-200" />
                    <span className="text-blue-200 text-sm">可用积分</span>
                  </div>
                  <div className="text-5xl font-bold">{stats?.credits ?? 0}</div>
                </div>
                <a
                  href="/pricing"
                  className="flex items-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  充值
                </a>
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalProcessed ?? 0}</div>
                <div className="text-xs text-gray-500">总处理量</div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalPurchased ?? 0}</div>
                <div className="text-xs text-gray-500">累计充值积分</div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalSpent ?? 0}</div>
                <div className="text-xs text-gray-500">累计消费积分</div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {subscription ? subscription.planName : '—'}
                </div>
                <div className="text-xs text-gray-500">
                  {subscription
                    ? `${subscription.creditsPerMonth}积分/月 · 到期 ${new Date(subscription.periodEnd).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`
                    : '未订阅'}
                </div>
              </div>
            </div>

            {/* 快捷购买 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">快速充值</h2>
                <a href="/pricing" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  查看全部 <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                {quickBuyPackages.map((pkg) => (
                  <div key={pkg.credits} className="p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    {pkg.popular && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          HOT
                        </span>
                      </div>
                    )}
                    <div className="text-2xl font-bold text-blue-600">{pkg.credits}</div>
                    <div className="text-xs text-gray-500 mb-1">积分</div>
                    <div className="text-lg font-bold text-gray-900">{pkg.price}</div>
                    <button className="mt-2 w-full py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors">
                      购买
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 最近记录 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">最近记录</h2>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  查看全部 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {transactions.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">暂无交易记录</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.slice(0, 5).map((tx) => {
                    const isPurchase = tx.type === 'purchase' || tx.type === 'subscription' || tx.type === 'bonus'
                    const Icon = getTransactionIcon(tx.type, tx.model)
                    return (
                      <div key={tx.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isPurchase ? 'bg-green-50' : 'bg-blue-50'
                        }`}>
                          <Icon className={`w-5 h-5 ${isPurchase ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{tx.description || tx.type}</div>
                          <div className="text-xs text-gray-400">{formatTime(tx.createdAt)}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${isPurchase ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} 积分
                          </div>
                          <div className="text-xs text-gray-400">余额 {tx.balanceAfter}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 账户设置 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">账户设置</h2>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">个人资料</div>
                    <div className="text-xs text-gray-400">通过 Google 账号登录</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">隐私与安全</div>
                    <div className="text-xs text-gray-400">管理账户安全设置</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 交易记录 Tab */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">全部交易记录</h2>
              <button
                onClick={fetchProfile}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> 刷新
              </button>
            </div>
            {transactions.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无交易记录</p>
                <a href="/pricing" className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700">
                  去购买积分 →
                </a>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const isPurchase = tx.type === 'purchase' || tx.type === 'subscription' || tx.type === 'bonus'
                  const Icon = getTransactionIcon(tx.type, tx.model)
                  return (
                    <div key={tx.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isPurchase ? 'bg-green-50' : 'bg-blue-50'
                      }`}>
                        <Icon className={`w-5 h-5 ${isPurchase ? 'text-green-600' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{tx.description || tx.type}</div>
                        <div className="text-xs text-gray-400">{formatTime(tx.createdAt)}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isPurchase ? 'text-green-600' : 'text-gray-900'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </div>
                        <div className="text-xs text-gray-400">余额 {tx.balanceAfter}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 底部信息 */}
        <div className="text-center text-xs text-gray-400 mt-8 mb-4">
          FineGrain AI 图像增强平台 · 如有问题请联系客服
        </div>
      </div>
    </div>
  )
}

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
  purchaseCredits: number
  subscriptionCredits: number
  totalProcessed: number
  totalPurchased: number
  totalSpent: number
  creditsExpireAt: string | null
}

interface Transaction {
  id: string
  type: string
  amount: number
  balanceAfter: number
  creditSource: string | null
  description: string | null
  model: string | null
  orderId: string | null
  planId: string | null
  createdAt: string
}

interface SubscriptionInfo {
  planId: string
  planName: string
  creditsPerMonth: number
  currentCredits: number
  periodEnd: string
}

// Credits Pack快捷购买
const quickBuyPackages = [
  { credits: 100, price: '$5.99', popular: false },
  { credits: 200, price: '$9.99', popular: true },
  { credits: 500, price: '$19.99', popular: false },
  { credits: 1000, price: '$29.99', popular: false },
]

// 月Subscribe方案
const subscriptionPlans = [
  { planId: 'pro', name: 'Pro', credits: 200, price: '$7.99/mo', highlight: false },
  { planId: 'max', name: 'Max', credits: 500, price: '$14.99/mo', highlight: true },
  { planId: 'ultra', name: 'Ultra', credits: 1000, price: '$24.99/mo', highlight: false },
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
      setError('Failed to load. Please refresh and try again.')
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

  const handleQuickBuy = useCallback(async (credits: number) => {
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: 'credits', planId: String(credits) }),
      })
      const data = await res.json()
      if (data.success && data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        alert('Payment creation failed: ' + (data.error || 'Unknown error'))
      }
    } catch {
      alert('Payment request failed. Please try again later.')
    }
  }, [])

  const handleSubscribe = useCallback(async (planId: string) => {
    try {
      const res = await fetch('/api/payment/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (data.success && data.approveUrl) {
        window.location.href = data.approveUrl
      } else {
        alert('Subscription creation failed: ' + (data.error || 'PayPal subscription plan not configured yet'))
      }
    } catch {
      alert('Subscription request failed. Please try again later.')
    }
  }, [])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
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
      return d.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
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
                  alt="avatar"
                  className="w-16 h-16 rounded-full ring-2 ring-blue-100"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name || 'User'}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchProfile}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href="#quick-buy"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Coins className="w-4 h-4" />
                Buy Credits
              </a>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Sign out</span>
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

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Transactions
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Credits Balance */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-5 h-5 text-blue-200" />
                    <span className="text-blue-200 text-sm">Available Credits</span>
                  </div>
                  <div className="text-5xl font-bold">{stats?.credits ?? 0}</div>
                  {/* Credits Pool Split */}
                  <div className="mt-2 space-y-1 text-sm text-blue-100">
                    <div className="flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-blue-200" />
                      <span>Subscription: {(stats?.subscriptionCredits ?? 0)}</span>
                      {subscription && (
                        <span className="text-blue-200 text-xs">
                          （{new Date(subscription.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} expires)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-blue-200" />
                      <span>Purchase: {(stats?.purchaseCredits ?? 0)}</span>
                      {stats?.creditsExpireAt && (
                        <span className="text-blue-200 text-xs">
                          （{new Date(stats.creditsExpireAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} expires)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href="/pricing#credit-packages"
                  className="flex items-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Top up
                </a>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalProcessed ?? 0}</div>
                <div className="text-xs text-gray-500">Total Processed</div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalPurchased ?? 0}</div>
                <div className="text-xs text-gray-500">Total Purchased</div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalSpent ?? 0}</div>
                <div className="text-xs text-gray-500">Total Spent</div>
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
                    ? `${subscription.creditsPerMonth} credits/mo · expires ${new Date(subscription.periodEnd).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`
                    : 'No subscription'}
                </div>
              </div>

              {/* History Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => router.push('/dashboard/history')}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">History</div>
                <div className="text-xs text-gray-500">View history</div>
              </div>
            </div>

            {/* Quick Buy */}
            <div id="quick-buy" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Quick Top-up</h2>
                <a href="/pricing" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
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
                    <div className="text-xs text-gray-500 mb-1">credits</div>
                    <div className="text-lg font-bold text-gray-900">{pkg.price}</div>
                    <button
                      onClick={() => handleQuickBuy(pkg.credits)}
                      className="mt-2 w-full py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Subscription */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">🔄 Monthly Subscription</h2>
                <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Best value auto-topup</span>
              </div>
              {subscription ? (
                <div className="p-5">
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-lg text-gray-900">{subscription.planName}</span>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Subscribed</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {subscription.creditsPerMonth} credits/mo · expires {new Date(subscription.periodEnd).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <a href="/pricing" className="text-sm text-blue-600 hover:text-blue-700">Manage Subscribe →</a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-indigo-100">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.planId} className={`p-4 text-center ${plan.highlight ? 'bg-white/60' : ''}`}>
                      {plan.highlight && (
                        <div className="mb-1">
                          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">Popular</span>
                        </div>
                      )}
                      <div className="text-lg font-bold text-gray-900">{plan.name}</div>
                      <div className="text-xs text-gray-500 mb-1">{plan.credits} credits/mo</div>
                      <div className="text-xl font-bold text-indigo-700">{plan.price}</div>
                      <button
                        onClick={() => handleSubscribe(plan.planId)}
                        className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                          plan.highlight
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                        }`}
                      >
                        Subscribe
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Records */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Recent Records</h2>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {transactions.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.slice(0, 5).map((tx) => {
                    const isPurchase = tx.type === 'purchase' || tx.type === 'subscription' || tx.type === 'bonus'
                    const isSubscription = tx.type === 'subscription'
                    const Icon = getTransactionIcon(tx.type, tx.model)
                    // Subscribe价格映射
                    const subPriceMap: Record<string, string> = { pro: '$7.99', max: '$14.99', ultra: '$24.99' }
                    // Credits Pack价格映射
                    const purchasePriceMap: Record<number, string> = { 100: '$5.99', 200: '$9.99', 500: '$19.99', 1000: '$29.99' }
                    const txPrice = isSubscription && tx.planId ? subPriceMap[tx.planId] : (!isSubscription && tx.amount > 0 ? purchasePriceMap[tx.amount] : null)
                    return (
                      <div key={tx.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSubscription ? 'bg-purple-50' : isPurchase ? 'bg-green-50' : 'bg-blue-50'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSubscription ? 'text-purple-600' : isPurchase ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate">{tx.description || tx.type}</span>
                            {isSubscription && (
                              <span className="shrink-0 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Subscribe</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{formatTime(tx.createdAt)}</span>
                            {txPrice && <span>· {txPrice}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${isSubscription ? 'text-purple-600' : isPurchase ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} credits
                          </div>
                          <div className="text-xs text-gray-400">Balance {tx.balanceAfter}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Account Settings</h2>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Profile</div>
                    <div className="text-xs text-gray-400">Signed in via Google</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Privacy & Security</div>
                    <div className="text-xs text-gray-400">Manage account security</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Transactions Tab */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">All Transactions</h2>
              <button
                onClick={fetchProfile}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            {transactions.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transactions yet</p>
                <a href="/pricing" className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700">
                  Go to Buy Credits →
                </a>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const isPurchase = tx.type === 'purchase' || tx.type === 'subscription' || tx.type === 'bonus'
                  const isSubscription = tx.type === 'subscription'
                  const Icon = getTransactionIcon(tx.type, tx.model)
                  const subPriceMap: Record<string, string> = { pro: '$7.99', max: '$14.99', ultra: '$24.99' }
                  const purchasePriceMap: Record<number, string> = { 100: '$5.99', 200: '$9.99', 500: '$19.99', 1000: '$29.99' }
                  const txPrice = isSubscription && tx.planId ? subPriceMap[tx.planId] : (!isSubscription && tx.amount > 0 ? purchasePriceMap[tx.amount] : null)
                  return (
                    <div key={tx.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSubscription ? 'bg-purple-50' : isPurchase ? 'bg-green-50' : 'bg-blue-50'
                      }`}>
                        <Icon className={`w-5 h-5 ${isSubscription ? 'text-purple-600' : isPurchase ? 'text-green-600' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{tx.description || tx.type}</span>
                          {isSubscription && (
                            <span className="shrink-0 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Subscribe</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{formatTime(tx.createdAt)}</span>
                          {txPrice && <span>· {txPrice}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isSubscription ? 'text-purple-600' : isPurchase ? 'text-green-600' : 'text-gray-900'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </div>
                        <div className="text-xs text-gray-400">Balance {tx.balanceAfter}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-400 mt-8 mb-4">
          FineGrain AI Image Enhancement · Contact support for issues
        </div>
      </div>
    </div>
  )
}

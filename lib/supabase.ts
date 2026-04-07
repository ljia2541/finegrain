import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Anon client (safe for client-side, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client (server-side only, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// ==================== 类型 ====================

export type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  last_login_at: string
}

export type CreditAccount = {
  user_id: string
  balance: number
  subscription_balance: number
  total_earned: number
  total_spent: number
  updated_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string
  amount: number
  balance_after: number
  type: string
  credit_source: string | null
  model: string | null
  task_id: string | null
  order_id: string | null
  plan_id: string | null
  description: string | null
  expires_at: string | null
  created_at: string
}

export type EnhancementRecord = {
  id: string
  user_id: string
  model: string
  scale: number | null
  credits_used: number
  input_url: string | null
  output_url: string | null
  status: string
  created_at: string
}

export type BalanceSplit = {
  purchaseBalance: number
  subscriptionBalance: number
  total: number
}

// ==================== 用户 ====================

/**
 * 初始化用户（首次登录时调用，幂等）
 * 在 JWT callback 中自动调用
 */
export async function initUser(userId: string, email: string, name?: string, avatarUrl?: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert({
      id: userId,
      email,
      name: name || null,
      avatar_url: avatarUrl || null,
      last_login_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error

  // 确保积分账户存在
  await supabaseAdmin
    .from('credit_accounts')
    .upsert({
      user_id: userId,
    }, { onConflict: 'user_id' })

  return data as User
}

/**
 * 获取用户积分余额（通过 RPC 函数，自动排除已过期积分）
 * 向后兼容：返回总余额
 */
export async function getUserBalance(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .rpc('get_user_balance', { p_user_id: userId })

  if (error) throw error
  return data as number
}

/**
 * 获取用户积分余额拆分（订阅积分 + 购买积分）
 */
export async function getUserBalanceSplit(userId: string): Promise<BalanceSplit> {
  const { data, error } = await supabaseAdmin
    .rpc('get_user_balance_split', { p_user_id: userId })

  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return {
    purchaseBalance: row?.purchase_balance || 0,
    subscriptionBalance: row?.subscription_balance || 0,
    total: row?.total_balance || 0,
  }
}

/**
 * 获取积分账户详情
 */
export async function getCreditAccount(userId: string): Promise<CreditAccount | null> {
  const { data, error } = await supabaseAdmin
    .from('credit_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as CreditAccount
}

// ==================== 积分操作 ====================

/**
 * 增加积分（购买、赠送、退款）
 * 根据 type 自动写入对应积分池：
 * - subscription → subscription_balance
 * - purchase / bonus / refund → balance (purchase pool)
 *
 * @returns 新总余额
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: string,
  description: string,
  options?: {
    planId?: string
    orderId?: string
    expiresAt?: string
    model?: string
    taskId?: string
    creditSource?: 'purchase' | 'subscription'
  }
): Promise<number> {
  // Determine which pool to update
  const creditSource = options?.creditSource || (type === 'subscription' ? 'subscription' : 'purchase')
  const isSubscription = creditSource === 'subscription'

  const currentBalance = await getUserBalance(userId)
  const newBalance = currentBalance + amount

  // 写入流水
  const { error: txError } = await supabaseAdmin
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount,
      balance_after: newBalance,
      type,
      credit_source: creditSource,
      description,
      plan_id: options?.planId || null,
      order_id: options?.orderId || null,
      model: options?.model || null,
      task_id: options?.taskId || null,
      expires_at: options?.expiresAt ? new Date(options.expiresAt).toISOString() : null,
    })

  if (txError) throw txError

  // 更新积分账户
  const updateFields: Record<string, any> = {
    balance: newBalance,
    updated_at: new Date().toISOString(),
  }

  if (isSubscription) {
    updateFields.subscription_balance = newBalance
  }

  // Update total_earned for purchases
  if (type === 'purchase' || type === 'bonus' || type === 'refund') {
    const acc = await getCreditAccount(userId)
    updateFields.total_earned = (acc?.total_earned || 0) + amount
  }

  const { error: accError } = await supabaseAdmin
    .from('credit_accounts')
    .update(updateFields)
    .eq('user_id', userId)

  if (accError) throw accError

  return newBalance
}

/**
 * 扣除积分（增强图片）
 * @param source - 积分来源：'auto'（先扣订阅）、'subscription'（仅订阅）、'purchase'（仅购买）
 * @throws Error('INSUFFICIENT_CREDITS') 余额不足
 * @returns 扣除后的余额和使用的积分来源
 */
export async function deductCredits(
  userId: string,
  amount: number,
  model: string,
  taskId: string,
  options?: {
    inputUrl?: string
    scale?: number
    source?: 'auto' | 'subscription' | 'purchase'
  }
): Promise<{ balance: number; creditSource: 'subscription' | 'purchase' }> {
  const source = options?.source || 'auto'
  const balanceSplit = await getUserBalanceSplit(userId)

  // Determine which pool to deduct from
  let deductFrom: 'subscription' | 'purchase' | null = null
  let deductedAmount = amount

  if (source === 'auto') {
    // Default: deduct subscription first, then purchase
    if (balanceSplit.subscriptionBalance >= amount) {
      deductFrom = 'subscription'
    } else if (balanceSplit.total >= amount) {
      // Split across both pools
      if (balanceSplit.subscriptionBalance > 0) {
        // Deduct all subscription + remaining from purchase
        const remaining = amount - balanceSplit.subscriptionBalance
        // For simplicity, deduct from the pool with enough balance
        if (balanceSplit.purchaseBalance >= amount) {
          deductFrom = 'purchase'
        } else {
          deductFrom = 'subscription'
        }
      } else {
        deductFrom = 'purchase'
      }
    }
  } else if (source === 'subscription') {
    if (balanceSplit.subscriptionBalance >= amount) {
      deductFrom = 'subscription'
    }
  } else {
    if (balanceSplit.purchaseBalance >= amount) {
      deductFrom = 'purchase'
    }
  }

  if (!deductFrom) {
    throw new Error('INSUFFICIENT_CREDITS')
  }

  const currentBalance = balanceSplit.total
  if (currentBalance < amount) {
    throw new Error('INSUFFICIENT_CREDITS')
  }

  const newBalance = currentBalance - amount

  // 写入流水
  const { error: txError } = await supabaseAdmin
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      balance_after: newBalance,
      type: 'enhance',
      credit_source: deductFrom,
      model,
      task_id: taskId,
      description: `${model} 增强消耗 ${amount} 积分`,
    })

  if (txError) throw txError

  // 更新积分账户
  const acc = await getCreditAccount(userId)
  const updateFields: Record<string, any> = {
    balance: newBalance,
    total_spent: (acc?.total_spent || 0) + amount,
    updated_at: new Date().toISOString(),
  }

  // Update the specific pool
  if (deductFrom === 'subscription') {
    updateFields.subscription_balance = balanceSplit.subscriptionBalance - amount
  }

  await supabaseAdmin
    .from('credit_accounts')
    .update(updateFields)
    .eq('user_id', userId)

  // 记录增强历史
  await supabaseAdmin.from('enhancement_history').insert({
    user_id: userId,
    model,
    scale: options?.scale || null,
    credits_used: amount,
    input_url: options?.inputUrl || null,
    status: 'processing',
  })

  return { balance: newBalance, creditSource: deductFrom }
}

// ==================== 查询 ====================

/**
 * 获取积分流水（分页）
 */
export async function getTransactions(
  userId: string,
  options?: {
    limit?: number
    offset?: number
    type?: string
  }
) {
  let query = supabaseAdmin
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  query = query.range(
    options?.offset || 0,
    (options?.offset || 0) + (options?.limit || 20) - 1
  )

  const { data, error } = await query
  return { transactions: (data as CreditTransaction[]) || [], error }
}

/**
 * 获取增强历史
 */
export async function getEnhancementHistory(userId: string, limit: number = 10) {
  const { data, error } = await supabaseAdmin
    .from('enhancement_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { history: (data as EnhancementRecord[]) || [], error }
}

/**
 * 获取用户购买积分最早过期时间
 */
export async function getUserPurchaseEarliestExpiry(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .rpc('get_user_purchase_earliest_expiry', { p_user_id: userId })

  if (error) return null
  return data || null
}

/**
 * 获取用户最早积分过期时间（兼容旧代码）
 */
export async function getUserEarliestExpiry(userId: string): Promise<string | null> {
  return getUserPurchaseEarliestExpiry(userId)
}

/**
 * 获取用户统计
 */
export async function getUserStats(userId: string) {
  const [balanceSplit, creditAccount, { history }] = await Promise.all([
    getUserBalanceSplit(userId),
    getCreditAccount(userId),
    getEnhancementHistory(userId, 999),
  ])

  return {
    purchaseCredits: balanceSplit.purchaseBalance,
    subscriptionCredits: balanceSplit.subscriptionBalance,
    totalCredits: balanceSplit.total,
    credits: balanceSplit.total, // 向后兼容
    totalProcessed: history?.length || 0,
    totalPurchased: creditAccount?.total_earned || 0,
    totalSpent: creditAccount?.total_spent || 0,
  }
}

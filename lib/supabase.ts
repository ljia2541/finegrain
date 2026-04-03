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
 */
export async function getUserBalance(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .rpc('get_user_balance', { p_user_id: userId })

  if (error) throw error
  return data as number
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
 * @returns 新余额
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
  }
): Promise<number> {
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
      description,
      plan_id: options?.planId || null,
      order_id: options?.orderId || null,
      model: options?.model || null,
      task_id: options?.taskId || null,
      expires_at: options?.expiresAt ? new Date(options.expiresAt).toISOString() : null,
    })

  if (txError) throw txError

  // 更新积分账户（原子操作）
  const { error: accError } = await supabaseAdmin
    .from('credit_accounts')
    .update({
      balance: newBalance,
      total_earned: (type === 'purchase' || type === 'bonus' || type === 'refund')
        ? currentBalance + (await supabaseAdmin.from('credit_accounts').select('total_earned').eq('user_id', userId).single()).data?.total_earned || 0 + amount
        : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (accError) throw accError

  return newBalance
}

/**
 * 扣除积分（增强图片）
 * @throws Error('INSUFFICIENT_CREDITS') 余额不足
 * @returns 扣除后的余额
 */
export async function deductCredits(
  userId: string,
  amount: number,
  model: string,
  taskId: string,
  options?: {
    inputUrl?: string
    scale?: number
  }
): Promise<number> {
  const currentBalance = await getUserBalance(userId)

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
      model,
      task_id: taskId,
      description: `${model} 增强消耗 ${amount} 积分`,
    })

  if (txError) throw txError

  // 更新积分账户
  const acc = await getCreditAccount(userId)
  await supabaseAdmin
    .from('credit_accounts')
    .update({
      balance: newBalance,
      total_spent: (acc?.total_spent || 0) + amount,
      updated_at: new Date().toISOString(),
    })
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

  return newBalance
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
 * 获取用户最早积分过期时间
 */
export async function getUserEarliestExpiry(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .rpc('get_user_earliest_expiry', { p_user_id: userId })

  if (error) return null
  return data || null
}

/**
 * 获取用户统计
 */
export async function getUserStats(userId: string) {
  const [balance, creditAccount, { history }] = await Promise.all([
    getUserBalance(userId),
    getCreditAccount(userId),
    getEnhancementHistory(userId, 999),
  ])

  return {
    credits: balance,
    totalProcessed: history?.length || 0,
    totalPurchased: creditAccount?.total_earned || 0,
    totalSpent: creditAccount?.total_spent || 0,
  }
}

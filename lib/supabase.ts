import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ==================== 用户 ====================

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

// ==================== 积分操作 ====================

/**
 * 初始化用户（首次登录时调用）
 */
export async function initUser(userId: string, email: string, name?: string, avatarUrl?: string) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      email,
      name,
      avatar_url: avatarUrl,
      last_login_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error

  // 确保积分账户存在
  const { error: creditError } = await supabase
    .from('credit_accounts')
    .upsert({
      user_id: userId,
      balance: 0,
      total_earned: 0,
      total_spent: 0,
    }, { onConflict: 'user_id' })

  if (creditError) throw creditError

  return data as User
}

/**
 * 获取用户积分余额
 */
export async function getUserBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_user_balance', { p_user_id: userId })

  if (error) throw error
  return data as number
}

/**
 * 获取积分账户详情
 */
export async function getCreditAccount(userId: string): Promise<CreditAccount | null> {
  const { data, error } = await supabase
    .from('credit_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as CreditAccount
}

/**
 * 增加积分（购买、赠送、退款）
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
  // 获取当前余额
  const currentBalance = await getUserBalance(userId)
  const newBalance = currentBalance + amount

  // 写入流水
  const { error: txError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount,
      balance_after: newBalance,
      type,
      description,
      plan_id: options?.planId,
      order_id: options?.orderId,
      model: options?.model,
      task_id: options?.taskId,
      expires_at: options?.expiresAt ? new Date(options.expiresAt).toISOString() : null,
    })

  if (txError) throw txError

  // 更新积分账户
  const { error: accError } = await supabase
    .from('credit_accounts')
    .update({
      balance: newBalance,
      total_earned: type === 'purchase' || type === 'bonus' || type === 'refund'
        ? `total_earned + ${amount}`
        : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (accError) throw accError

  return newBalance
}

/**
 * 扣除积分（增强图片）
 * 返回扣除后的余额
 */
export async function deductCredits(
  userId: string,
  amount: number,
  model: string,
  taskId: string
): Promise<number> {
  const currentBalance = await getUserBalance(userId)

  if (currentBalance < amount) {
    throw new Error('INSUFFICIENT_CREDITS')
  }

  const newBalance = currentBalance - amount

  // 写入流水
  const { error: txError } = await supabase
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
  const { error: accError } = await supabase
    .from('credit_accounts')
    .update({
      balance: newBalance,
      total_spent: `total_spent + ${amount}`,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (accError) throw accError

  // 记录增强历史
  await supabase.from('enhancement_history').insert({
    user_id: userId,
    model,
    credits_used: amount,
    status: 'processing',
    task_id: taskId,
  })

  return newBalance
}

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
  let query = supabase
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
  return { transactions: data || [], error }
}

/**
 * 获取增强历史
 */
export async function getEnhancementHistory(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('enhancement_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { history: data || [], error }
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

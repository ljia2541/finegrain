/**
 * Cloudflare Workers KV 存储工具
 * 
 * 注意：这个实现需要在 Cloudflare Workers 环境中运行
 * 本地开发时，需要使用 Cloudflare Workers 本地环境或模拟
 */

export interface KVStorageOptions {
  namespace?: string
}

/**
 * KV 存储类（用于 Cloudflare Workers 环境）
 */
export class KVStorage {
  private binding: any
  private namespace: string

  constructor(binding: any, options: KVStorageOptions = {}) {
    this.binding = binding
    this.namespace = options.namespace || 'finegrain'
  }

  /**
   * 存储数据
   */
  async set(key: string, value: any, options?: { ttl?: number }): Promise<void> {
    const fullKey = `${this.namespace}:${key}`
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    
    await this.binding.put(fullKey, stringValue, {
      expirationTtl: options?.ttl,
    })
  }

  /**
   * 获取数据
   */
  async get<T = any>(key: string): Promise<T | null> {
    const fullKey = `${this.namespace}:${key}`
    const value = await this.binding.get(fullKey, 'text')
    
    if (!value) {
      return null
    }

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  /**
   * 删除数据
   */
  async delete(key: string): Promise<void> {
    const fullKey = `${this.namespace}:${key}`
    await this.binding.delete(fullKey)
  }

  /**
   * 列出所有键
   */
  async list(prefix?: string): Promise<string[]> {
    const listOptions = prefix ? { prefix: `${this.namespace}:${prefix}` } : {}
    const result = await this.binding.list(listOptions)
    
    return result.keys.map((key: any) => key.name.replace(`${this.namespace}:`, ''))
  }
}

/**
 * Next.js API 路由中的 KV 使用示例
 * 
 * 在 Cloudflare Pages 中，KV 会通过环境变量自动注入
 */

/**
 * 获取 KV 命名空间绑定
 */
export function getKVBinding() {
  // 在 Cloudflare Pages 中，KV 通过环境变量绑定
  // 这里返回 null，实际使用时会在 worker 环境中自动注入
  return process.env.KV_BINDING || null
}

/**
 * 创建 KV 存储实例
 */
export function createKVStorage(binding: any, namespace?: string) {
  return new KVStorage(binding, { namespace })
}

/**
 * 图片存储专用类
 */
export class ImageKVStorage {
  private kv: KVStorage

  constructor(binding: any) {
    this.kv = new KVStorage(binding, { namespace: 'images' })
  }

  /**
   * 保存图片 URL
   * @param imageId 图片 ID
   * @param url 图片 URL
   * @param ttl 生存时间（秒），默认 24 小时
   */
  async saveImageUrl(imageId: string, url: string, ttl: number = 86400): Promise<void> {
    await this.kv.set(imageId, {
      url,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ttl * 1000),
    }, { ttl })
  }

  /**
   * 获取图片 URL
   */
  async getImageUrl(imageId: string): Promise<{ url: string; createdAt: number; expiresAt: number } | null> {
    return await this.kv.get(imageId)
  }

  /**
   * 删除图片 URL
   */
  async deleteImageUrl(imageId: string): Promise<void> {
    await this.kv.delete(imageId)
  }

  /**
   * 列出所有图片 ID
   */
  async listImageIds(): Promise<string[]> {
    return await this.kv.list()
  }
}

/**
 * 任务状态存储专用类
 */
export class TaskKVStorage {
  private kv: KVStorage

  constructor(binding: any) {
    this.kv = new KVStorage(binding, { namespace: 'tasks' })
  }

  /**
   * 保存任务状态
   */
  async saveTask(taskId: string, taskData: {
    status: 'pending' | 'processing' | 'completed' | 'failed'
    imageUrl?: string
    error?: string
    createdAt: number
    updatedAt: number
  }): Promise<void> {
    await this.kv.set(taskId, taskData)
  }

  /**
   * 获取任务状态
   */
  async getTask(taskId: string): Promise<any | null> {
    return await this.kv.get(taskId)
  }

  /**
   * 更新任务状态
   */
  async updateTask(taskId: string, updates: Partial<{
    status: 'pending' | 'processing' | 'completed' | 'failed'
    imageUrl?: string
    error?: string
  }>): Promise<void> {
    const task = await this.getTask(taskId)
    if (!task) {
      throw new Error('Task not found')
    }

    await this.kv.set(taskId, {
      ...task,
      ...updates,
      updatedAt: Date.now(),
    })
  }
}

/**
 * 用户积分存储专用类
 */
export class CreditsKVStorage {
  private kv: KVStorage

  constructor(binding: any) {
    this.kv = new KVStorage(binding, { namespace: 'credits' })
  }

  /**
   * 获取用户积分
   */
  async getUserCredits(userId: string): Promise<number> {
    const data = await this.kv.get<{ credits: number }>(`user:${userId}`)
    return data?.credits || 0
  }

  /**
   * 增加用户积分
   */
  async addCredits(userId: string, amount: number): Promise<number> {
    const current = await this.getUserCredits(userId)
    const newBalance = current + amount
    
    await this.kv.set(`user:${userId}`, {
      credits: newBalance,
      updatedAt: Date.now(),
    })
    
    return newBalance
  }

  /**
   * 扣除用户积分
   */
  async deductCredits(userId: string, amount: number): Promise<number> {
    const current = await this.getUserCredits(userId)
    
    if (current < amount) {
      throw new Error('Insufficient credits')
    }
    
    const newBalance = current - amount
    await this.kv.set(`user:${userId}`, {
      credits: newBalance,
      updatedAt: Date.now(),
    })
    
    return newBalance
  }

  /**
   * 记录积分使用历史
   */
  async recordUsage(userId: string, amount: number, taskId: string): Promise<void> {
    const history = await this.kv.get<Array<{ amount: number; taskId: string; timestamp: number }>>(`user:${userId}:history`) || []
    
    history.unshift({
      amount,
      taskId,
      timestamp: Date.now(),
    })
    
    // 只保留最近 100 条记录
    await this.kv.set(`user:${userId}:history`, history.slice(0, 100))
  }

  /**
   * 获取用户使用历史
   */
  async getUsageHistory(userId: string): Promise<Array<{ amount: number; taskId: string; timestamp: number }>> {
    return await this.kv.get(`user:${userId}:history`) || []
  }
}

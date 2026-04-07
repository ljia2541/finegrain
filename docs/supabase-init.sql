-- ========================================
-- FineGrain Supabase 数据库初始化脚本
-- 使用方式：在 Supabase Dashboard → SQL Editor 中粘贴执行
-- ========================================

-- 1. 用户表（Google OAuth 登录时自动创建）
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,              -- Google sub (JWT token.id)
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 积分账户表（每个用户一条）
CREATE TABLE IF NOT EXISTS credit_accounts (
  user_id       TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance       INTEGER NOT NULL DEFAULT 0,     -- 当前可用购买积分
  subscription_balance INTEGER NOT NULL DEFAULT 0, -- 当前可用订阅积分
  total_earned  INTEGER NOT NULL DEFAULT 0,     -- 历史总获得（购买）
  total_spent   INTEGER NOT NULL DEFAULT 0,     -- 历史总消费
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 积分流水表（每一笔积分变动）
CREATE TABLE IF NOT EXISTS credit_transactions (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL,               -- 正数=获得，负数=消费
  balance_after INTEGER NOT NULL,               -- 操作后余额快照
  type          TEXT NOT NULL,                  -- 'purchase'|'enhance'|'refund'|'bonus'|'subscription'|'subscription_expire'
  credit_source TEXT,                           -- 'purchase'|'subscription' — 标记积分所属池
  model         TEXT,                           -- 'crystal_4x'|'realesrgan' 等
  task_id       TEXT,                           -- 关联的增强任务 ID
  order_id      TEXT,                           -- 关联的支付订单 ID
  plan_id       TEXT,                           -- '100'|'200'|'500'|'1000' 或 'pro'|'max'|'ultra'
  description   TEXT,                           -- 可读描述
  expires_at    TIMESTAMPTZ,                    -- 积分过期时间（purchase/subscription 类型）
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：按用户查流水
CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON credit_transactions(user_id, created_at DESC);

-- 索引：按订单查流水
CREATE INDEX IF NOT EXISTS idx_credit_tx_order ON credit_transactions(order_id);

-- 4. 增强记录表（每次图片增强的历史）
CREATE TABLE IF NOT EXISTS enhancement_history (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model         TEXT NOT NULL,                  -- 使用的模型
  scale         INTEGER,                        -- 放大倍率
  credits_used  INTEGER NOT NULL DEFAULT 0,     -- 消耗的积分
  input_url     TEXT,                           -- 原图 URL
  output_url    TEXT,                           -- 增强图 URL
  status        TEXT DEFAULT 'completed',       -- 'pending'|'processing'|'completed'|'failed'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：按用户查增强历史
CREATE INDEX IF NOT EXISTS idx_enhance_history_user ON enhancement_history(user_id, created_at DESC);

-- 5. 订阅表（月订阅）
CREATE TABLE IF NOT EXISTS subscriptions (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id       TEXT NOT NULL,                  -- 'pro'|'max'|'ultra'
  paypal_subscription_id TEXT UNIQUE,            -- PayPal 订阅 ID
  status        TEXT DEFAULT 'active',          -- 'active'|'cancelled'|'expired'
  credits_per_month INTEGER NOT NULL,            -- 每月积分
  current_credits  INTEGER NOT NULL DEFAULT 0,  -- 本月剩余积分
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end   TIMESTAMPTZ,
  cancelled_at  TIMESTAMPTZ
);

-- 索引：按用户查订阅
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- 6. Row Level Security（安全策略）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhancement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 用户只能操作自己的数据
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own credits" ON credit_accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own credits" ON credit_accounts FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own transactions" ON credit_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON credit_transactions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own history" ON enhancement_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own history" ON enhancement_history FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (user_id = auth.uid());

-- 7. 函数：积分过期清理（定时任务调用）
CREATE OR REPLACE FUNCTION clean_expired_credits()
RETURNS void AS $$
BEGIN
  -- 将过期的 purchase/subscription 类型积分记录标记
  UPDATE credit_transactions
  SET description = description || ' [已过期]'
  WHERE type IN ('purchase', 'subscription')
    AND expires_at IS NOT NULL
    AND expires_at < NOW()
    AND description NOT LIKE '%[已过期]%';
END;
$$ LANGUAGE plpgsql;

-- 8. 函数：获取用户真实积分余额（排除已过期）
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_balance
  FROM credit_transactions
  WHERE user_id = p_user_id
    AND (
      -- 非积分来源不过期
      type NOT IN ('purchase', 'subscription')
      OR (
        -- 积分来源未过期
        type IN ('purchase', 'subscription')
        AND (expires_at IS NULL OR expires_at > NOW())
      )
    );

  RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- 9. 函数：获取用户积分拆分（购买积分 + 订阅积分）
CREATE OR REPLACE FUNCTION get_user_balance_split(p_user_id TEXT)
RETURNS TABLE(purchase_balance BIGINT, subscription_balance BIGINT, total_balance BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE
      WHEN type NOT IN ('purchase', 'subscription') THEN amount
      WHEN type = 'purchase' AND (expires_at IS NULL OR expires_at > NOW()) THEN amount
      ELSE 0
    END), 0)::BIGINT as purchase_balance,
    COALESCE(SUM(CASE
      WHEN type = 'subscription' AND (expires_at IS NULL OR expires_at > NOW()) THEN amount
      ELSE 0
    END), 0)::BIGINT as subscription_balance,
    COALESCE(SUM(CASE
      WHEN type NOT IN ('purchase', 'subscription') THEN amount
      WHEN type IN ('purchase', 'subscription') AND (expires_at IS NULL OR expires_at > NOW()) THEN amount
      ELSE 0
    END), 0)::BIGINT as total_balance
  FROM credit_transactions
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 10. 函数：获取购买积分最早过期时间
CREATE OR REPLACE FUNCTION get_user_purchase_earliest_expiry(p_user_id TEXT)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  v_expiry TIMESTAMPTZ;
BEGIN
  SELECT MIN(expires_at) INTO v_expiry
  FROM credit_transactions
  WHERE user_id = p_user_id
    AND type = 'purchase'
    AND amount > 0
    AND expires_at IS NOT NULL
    AND expires_at > NOW();

  RETURN v_expiry;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 完成提示
-- ========================================
-- 执行后记得去 Supabase → Settings → API 获取：
-- 1. Project URL
-- 2. Anon Key (public)
-- ========================================

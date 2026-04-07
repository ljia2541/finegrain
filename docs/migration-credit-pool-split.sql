-- ========================================
-- Migration: 积分池分离 — 订阅积分和购买积分
-- Date: 2026-04-07
-- ========================================

-- Step 1: Add subscription_balance column to credit_accounts
ALTER TABLE credit_accounts
  ADD COLUMN IF NOT EXISTS subscription_balance INTEGER NOT NULL DEFAULT 0;

-- Step 2: Add credit_source column to credit_transactions (for tracking which pool was used for deduction)
ALTER TABLE credit_transactions
  ADD COLUMN IF NOT EXISTS credit_source TEXT;

-- Step 3: Migrate existing data
-- Calculate subscription balance from subscription type transactions (not expired)
-- For each user: sum of subscription transactions that haven't expired
UPDATE credit_accounts ca
SET subscription_balance = subq.sub_balance,
    balance = subq.pur_balance
FROM (
  SELECT
    user_id,
    COALESCE(SUM(CASE WHEN type = 'subscription' AND (expires_at IS NULL OR expires_at > NOW()) THEN amount ELSE 0 END), 0) as sub_balance,
    COALESCE(SUM(CASE WHEN type = 'purchase' AND (expires_at IS NULL OR expires_at > NOW()) THEN amount
                       WHEN type NOT IN ('purchase', 'subscription') THEN amount
                       ELSE 0 END), 0) as pur_balance
  FROM credit_transactions
  GROUP BY user_id
) subq
WHERE ca.user_id = subq.user_id;

-- Step 4: Mark existing subscription transactions with credit_source
UPDATE credit_transactions
SET credit_source = 'subscription'
WHERE type = 'subscription' AND credit_source IS NULL;

UPDATE credit_transactions
SET credit_source = 'purchase'
WHERE type = 'purchase' AND credit_source IS NULL;

-- Step 5: Create new RPC functions

-- Get user balance split by pool
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

-- Get purchase credits earliest expiry
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

-- Keep the old get_user_balance function working (returns total for backward compat)
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_balance
  FROM credit_transactions
  WHERE user_id = p_user_id
    AND (
      type NOT IN ('purchase', 'subscription')
      OR (
        type IN ('purchase', 'subscription')
        AND (expires_at IS NULL OR expires_at > NOW())
      )
    );

  RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Verification queries (run manually to verify)
-- ========================================
-- SELECT * FROM credit_accounts;
-- SELECT user_id, credit_source, type, amount, expires_at FROM credit_transactions ORDER BY created_at;
-- SELECT * FROM get_user_balance_split('107243666572853043961');

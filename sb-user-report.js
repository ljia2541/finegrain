const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mkslighjzlifhkucnjuu.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc2xpZ2hqemxpZmhrdWNuanV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5ODM3OSwiZXhwIjoyMDkwNzc0Mzc5fQ.Q0EKQtjzEWDqW7ynhLXbgkSl7EBwktAxVW-eygqG-cE';

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function run() {
  // 1. All users
  const { data: users, error: e1 } = await sb.from('users').select('*').order('created_at', { ascending: false });
  if (e1) console.log('users error:', e1);
  console.log(`\n=== FineGrain 注册用户 (${users?.length || 0}) ===`);
  if (users) {
    for (const u of users) {
      console.log(`  ${u.email || u.id} | 创建: ${u.created_at?.slice(0,10)} | 名称: ${u.name || '-'}`);
    }
  }

  // 2. Credit accounts
  const { data: accounts, error: e2 } = await sb.from('credit_accounts').select('*');
  if (e2) console.log('accounts error:', e2);
  console.log(`\n=== 积分账户 ===`);
  if (accounts) {
    for (const a of accounts) {
      console.log(`  用户: ${a.user_id?.slice(0,12)}... | 余额: ${a.balance} | 总获得: ${a.total_earned || '-'} | 总消费: ${a.total_spent || '-'}`);
    }
  }

  // 3. Credit transactions
  const { data: txns, error: e3 } = await sb.from('credit_transactions').select('*').order('created_at', { ascending: false }).limit(50);
  if (e3) console.log('txns error:', e3);
  console.log(`\n=== 最近50条积分交易 ===`);
  if (txns) {
    for (const t of txns) {
      console.log(`  ${t.created_at?.slice(0,16)} | ${t.type} | 金额:${t.amount} | 用户:${t.user_id?.slice(0,12)}... | 描述:${t.description || '-'}`);
    }
  }

  // 4. Enhancement history
  const { data: enhances, error: e4 } = await sb.from('enhancement_history').select('*').order('created_at', { ascending: false }).limit(100);
  if (e4) console.log('enhances error:', e4);
  console.log(`\n=== 最近100条增强记录 ===`);
  if (enhances) {
    // Summary stats
    const byStatus = {};
    const byModel = {};
    const byUser = {};
    for (const h of enhances) {
      byStatus[h.status] = (byStatus[h.status] || 0) + 1;
      byModel[h.model || 'unknown'] = (byModel[h.model || 'unknown'] || 0) + 1;
      byUser[h.user_id?.slice(0,12)] = (byUser[h.user_id?.slice(0,12)] || 0) + 1;
    }
    console.log(`\n  状态分布:`, JSON.stringify(byStatus));
    console.log(`  模型分布:`, JSON.stringify(byModel));
    console.log(`  用户使用次数:`, JSON.stringify(byUser));

    // Recent 20
    console.log(`\n  最近20条:`);
    for (const h of enhances.slice(0, 20)) {
      console.log(`    ${h.created_at?.slice(0,16)} | ${h.status} | ${h.model || '?'} | 用户:${h.user_id?.slice(0,12)}... | 积分:${h.credits_used || 0} | 付费:${h.amount_paid || 0}`);
    }

    // Total count
    const { count: totalCount } = await sb.from('enhancement_history').select('*', { count: 'exact', head: true });
    console.log(`\n  总增强记录数: ${totalCount}`);
  }

  // 5. Subscriptions
  const { data: subs, error: e5 } = await sb.from('subscriptions').select('*').order('created_at', { ascending: false });
  if (e5) console.log('subs error:', e5);
  console.log(`\n=== 订阅记录 (${subs?.length || 0}) ===`);
  if (subs) {
    for (const s of subs) {
      console.log(`  ${s.created_at?.slice(0,10)} | ${s.status} | ${s.plan_id || '-'} | 用户:${s.user_id?.slice(0,12)}... | PayPal:${s.paypal_subscription_id || '-'}`);
    }
  }
}

run().catch(console.error);

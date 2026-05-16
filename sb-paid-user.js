const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mkslighjzlifhkucnjuu.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc2xpZ2hqemxpZmhrdWNuanV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5ODM3OSwiZXhwIjoyMDkwNzc0Mzc5fQ.Q0EKQtjzEWDqW7ynhLXbgkSl7EBwktAxVW-eygqG-cE';

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function run() {
  // Get paying user details
  const { data: accounts } = await sb.from('credit_accounts').select('*').gt('balance', 0);
  console.log('=== 有余额的用户 ===');
  if (accounts) {
    for (const a of accounts) {
      // Get user email
      const { data: user } = await sb.from('users').select('*').eq('id', a.user_id).single();
      console.log(`  用户ID: ${a.user_id}`);
      console.log(`  邮箱: ${user?.email || 'unknown'}`);
      console.log(`  名称: ${user?.name || 'unknown'}`);
      console.log(`  余额: ${a.balance} | 总获得: ${a.total_earned} | 总消费: ${a.total_spent}`);
      console.log(`  注册时间: ${user?.created_at}`);
      
      // Get their enhancement history
      const { data: enhances } = await sb.from('enhancement_history').select('*').eq('user_id', a.user_id).order('created_at', { ascending: false });
      if (enhances && enhances.length > 0) {
        console.log(`  增强记录 (${enhances.length} 条):`);
        const byModel = {};
        const byStatus = {};
        for (const h of enhances) {
          byModel[h.model || '?'] = (byModel[h.model || '?'] || 0) + 1;
          byStatus[h.status] = (byStatus[h.status] || 0) + 1;
        }
        console.log(`    模型: ${JSON.stringify(byModel)}`);
        console.log(`    状态: ${JSON.stringify(byStatus)}`);
        console.log(`    最近3条:`);
        for (const h of enhances.slice(0, 3)) {
          console.log(`      ${h.created_at?.slice(0,16)} | ${h.status} | ${h.model} | 积分:${h.credits_used}`);
        }
      }
      
      // Get their transactions
      const { data: txns } = await sb.from('credit_transactions').select('*').eq('user_id', a.user_id).order('created_at', { ascending: false });
      if (txns && txns.length > 0) {
        console.log(`  积分交易 (${txns.length} 条):`);
        for (const t of txns) {
          console.log(`    ${t.created_at?.slice(0,16)} | ${t.type} | ${t.amount} | ${t.description}`);
        }
      }
      console.log('');
    }
  }

  // Count unique real users (exclude anonymous and test)
  const { data: allEnhances } = await sb.from('enhancement_history').select('user_id, status, model, created_at');
  if (allEnhances) {
    const realUsers = {};
    const anonCount = { total: 0, completed: 0, failed: 0 };
    for (const h of allEnhances) {
      if (h.user_id === 'anonymous') {
        anonCount.total++;
        anonCount[h.status]++;
      } else {
        if (!realUsers[h.user_id]) realUsers[h.user_id] = { total: 0, completed: 0, failed: 0, models: {}, first: h.created_at, last: h.created_at };
        realUsers[h.user_id].total++;
        realUsers[h.user_id][h.status]++;
        realUsers[h.user_id].models[h.model || '?'] = (realUsers[h.user_id].models[h.model || '?'] || 0) + 1;
        if (h.created_at < realUsers[h.user_id].first) realUsers[h.user_id].first = h.created_at;
        if (h.created_at > realUsers[h.user_id].last) realUsers[h.user_id].last = h.created_at;
      }
    }
    
    console.log('\n=== 匿名用户增强统计 ===');
    console.log(`  总数: ${anonCount.total} | 完成: ${anonCount.completed} | 失败: ${anonCount.failed}`);
    
    console.log('\n=== 注册用户增强统计 (排除测试账号) ===');
    for (const [uid, stats] of Object.entries(realUsers)) {
      if (uid === '107243666572853043961') continue; // skip test
      const { data: user } = await sb.from('users').select('email, name').eq('id', uid).single();
      console.log(`  ${user?.email || uid.slice(0,16)}`);
      console.log(`    总增强: ${stats.total} | 完成: ${stats.completed} | 失败: ${stats.failed}`);
      console.log(`    模型: ${JSON.stringify(stats.models)}`);
      console.log(`    首次: ${stats.first?.slice(0,10)} | 最近: ${stats.last?.slice(0,10)}`);
    }
  }
}

run().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// 看所有增强记录，区分你的账号和外部用户
const myId = '107243666572853043961';
const { data: all } = await supabase.from('enhancement_history').select('*');

const mine = all.filter(r => r.user_id === myId);
const others = all.filter(r => r.user_id !== myId);

console.log('=== 你的测试: ' + mine.length + ' 条 ===');
console.log('完成:', mine.filter(r=>r.status==='completed').length, '| 失败:', mine.filter(r=>r.status==='failed').length);

console.log('\n=== 外部用户: ' + others.length + ' 条 ===');
if (others.length === 0) {
  console.log('没有任何外部用户使用记录');
} else {
  for (const r of others) {
    const uid = r.user_id || '(anonymous)';
    console.log(uid.substring(0,15), '|', r.model, '|', r.status, '|', r.created_at?.substring(0,16), '| credits:', r.credits_charged);
  }
}

// 看看 users 表里除了你之外的用户
const { data: users } = await supabase.from('users').select('*');
const otherUsers = users?.filter(u => u.id !== myId) || [];
console.log('\n=== 外部注册用户: ' + otherUsers.length + ' ===');
for (const u of otherUsers) {
  console.log(u.email, '|', u.id?.substring(0,15), '| 注册:', u.created_at?.substring(0,10));
  
  // 查他们的增强记录
  const { data: theirEnhances } = await supabase.from('enhancement_history').select('*').eq('user_id', u.id);
  console.log('  增强次数:', theirEnhances?.length || 0);
  for (const e of theirEnhances || []) {
    console.log('   ', e.model, '|', e.status, '|', e.created_at?.substring(0,16));
  }
}

// 免费增强不需要登录，看看 API 端访问日志
// 查一下 GA 里 /enhance/free 页面的真实用户
console.log('\n=== GA 数据 ===');
console.log('/enhance/free 页面 30 天 16 次浏览（已在上轮查询中获取）');

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: all } = await supabase.from('enhancement_history').select('*');
console.log('总记录:', all.length);

const statuses = {};
for (const r of all) {
  statuses[r.status] = (statuses[r.status] || 0) + 1;
}
console.log('状态分布:', JSON.stringify(statuses));

// 看非 completed 的记录
const notOk = all.filter(r => r.status !== 'completed');
console.log('\n=== 非 completed 记录 (' + notOk.length + ' 条) ===');
for (const r of notOk) {
  const uid = r.user_id || '(anonymous)';
  const short = uid.length > 15 ? uid.substring(0, 12) + '...' : uid;
  console.log(short, '|', r.model, '| status:', r.status, '|', r.created_at?.substring(0, 16), '|', (r.error || '-').substring(0, 100));
}

// 匿名用户 = user_id 为 null
const anon = all.filter(r => !r.user_id);
console.log('\n=== 匿名用户 (user_id=null): ' + anon.length + ' 条 ===');
for (const r of anon) {
  console.log(r.model, '|', r.status, '|', r.created_at?.substring(0, 16));
}

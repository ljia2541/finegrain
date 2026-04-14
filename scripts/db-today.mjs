import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const myId = '107243666572853043961';

// 今天的增强记录
const todayStart = '2026-04-14T00:00:00';
const { data: todayAll } = await supabase.from('enhancement_history')
  .select('*')
  .gte('created_at', todayStart);

console.log('=== 今日增强记录: ' + (todayAll?.length || 0) + ' 条 ===');
for (const r of todayAll || []) {
  const isMe = r.user_id === myId;
  console.log((isMe ? '你' : '外部') + ' | ' + (r.user_id || 'anon').substring(0,12) + ' | ' + r.model + ' | ' + r.status + ' | ' + r.created_at?.substring(11,16) + ' | credits:' + (r.credits_charged ?? 0));
}

// 全部外部用户记录（排除你的）
const { data: allExternal } = await supabase.from('enhancement_history')
  .select('*')
  .neq('user_id', myId);

console.log('\n=== 全部外部增强: ' + (allExternal?.length || 0) + ' 条 ===');
const externalUsers = {};
for (const r of allExternal || []) {
  const uid = r.user_id || 'anon';
  externalUsers[uid] = externalUsers[uid] || [];
  externalUsers[uid].push(r);
}
for (const [uid, recs] of Object.entries(externalUsers)) {
  console.log('\n用户: ' + uid.substring(0,15));
  console.log('总次数: ' + recs.length + ' | 完成: ' + recs.filter(r=>r.status==='completed').length);
  console.log('模型分布: ' + recs.map(r=>r.model).reduce((a,m)=>(a[m]=(a[m]||0)+1,a),{}));
  console.log('首次: ' + recs[0]?.created_at?.substring(0,10) + ' | 最近: ' + recs[recs.length-1]?.created_at?.substring(0,10));
  console.log('是否付费: ' + (recs.some(r=>r.credits_charged > 0) ? '是' : '全部免费'));
}

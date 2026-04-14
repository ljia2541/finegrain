import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: failed } = await supabase.from('enhancement_history').select('user_id, model, status, created_at, error').eq('status', 'failed');
console.log('=== 失败记录 (' + (failed?.length || 0) + ' 条) ===');
for (const r of failed || []) {
  const uid = r.user_id || '(anonymous)';
  const short = uid.length > 15 ? uid.substring(0, 12) + '...' : uid;
  console.log(short, '|', r.model, '|', r.created_at?.substring(0, 16), '|', (r.error || '-').substring(0, 100));
}

const { data: anon } = await supabase.from('enhancement_history').select('model, status, created_at').is('user_id', null);
console.log('\n=== 匿名用户记录 (' + (anon?.length || 0) + ' 条) ===');
for (const r of anon || []) {
  console.log(r.model, '|', r.status, '|', r.created_at?.substring(0, 16));
}

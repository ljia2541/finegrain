import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// 增强记录
const { data: all } = await supabase.from('enhancement_history').select('*');

const total = all.length;
const completed = all.filter(r => r.status === 'completed').length;
const failed = all.filter(r => r.status === 'failed').length;
const processing = all.filter(r => r.status === 'processing').length;
const pending = all.filter(r => r.status === 'pending').length;

console.log('=== 增强记录总览 ===');
console.log('总数:', total);
console.log('完成:', completed, '| 失败:', failed, '| 处理中:', processing, '| 待处理:', pending);

// 免费增强
const freeEnhances = all.filter(r => !r.credits_charged || r.credits_charged === 0);
const freeCompleted = freeEnhances.filter(r => r.status === 'completed').length;
console.log('\n=== 免费增强 ===');
console.log('次数:', freeEnhances.length, '(完成:', freeCompleted, ')');

// 付费增强
const paidEnhances = all.filter(r => r.credits_charged && r.credits_charged > 0);
const paidCompleted = paidEnhances.filter(r => r.status === 'completed').length;
console.log('\n=== 付费增强 ===');
console.log('次数:', paidEnhances.length, '(完成:', paidCompleted, ')');

// 按模型
const byModel = {};
for (const r of all) {
  const m = r.model || 'unknown';
  byModel[m] = byModel[m] || { total: 0, completed: 0, free: 0, paid: 0 };
  byModel[m].total++;
  if (r.status === 'completed') byModel[m].completed++;
  if (!r.credits_charged || r.credits_charged === 0) byModel[m].free++;
  else byModel[m].paid++;
}
console.log('\n=== 按模型 ===');
for (const [model, s] of Object.entries(byModel)) {
  console.log(model + ':', s.total, '(完成:', s.completed, '| 免费:', s.free, '| 付费:', s.paid, ')');
}

// 按用户
const byUser = {};
for (const r of all) {
  const uid = r.user_id || '(anonymous)';
  byUser[uid] = byUser[uid] || { total: 0, completed: 0, free: 0, paid: 0 };
  byUser[uid].total++;
  if (r.status === 'completed') byUser[uid].completed++;
  if (!r.credits_charged || r.credits_charged === 0) byUser[uid].free++;
  else byUser[uid].paid++;
}
console.log('\n=== 按用户 ===');
const sortedUsers = Object.entries(byUser).sort((a, b) => b[1].total - a[1].total);
for (const [uid, s] of sortedUsers) {
  const short = uid.length > 15 ? uid.substring(0, 12) + '...' : uid;
  console.log(short, ':', s.total, '次 (完成:', s.completed, '| 免费:', s.free, '| 付费:', s.paid, ')');
}

// 用户表
const { data: users } = await supabase.from('users').select('*');
console.log('\n=== 注册用户 ===');
console.log('总数:', users?.length || 0);
for (const u of users || []) {
  console.log(u.email || u.id?.substring(0, 12) + '...', '| Google:', u.google_name || '-', '| 注册:', u.created_at?.substring(0, 10));
}

// 订阅
const { data: subs } = await supabase.from('subscriptions').select('*');
console.log('\n=== 订阅 ===');
console.log('总数:', subs?.length || 0);
for (const s of subs || []) {
  console.log(s.user_id?.substring(0, 12) + '...', '| Plan:', s.plan_id, '| Status:', s.status, '| Start:', s.current_period_start?.substring(0, 10));
}

// 交易
const { data: txns } = await supabase.from('credit_transactions').select('*').order('created_at', { ascending: false }).limit(20);
console.log('\n=== 最近 20 条积分交易 ===');
for (const t of txns || []) {
  console.log(t.created_at?.substring(0, 10), '|', t.type, '|', t.amount, '积分 |', t.description || '-');
}

// 最近 7 天增强
const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
const recent = all.filter(r => r.created_at >= weekAgo);
console.log('\n=== 最近 7 天 ===');
console.log('增强次数:', recent.length, '(完成:', recent.filter(r => r.status === 'completed').length, '| 免费:', recent.filter(r => !r.credits_charged || r.credits_charged === 0).length, ')');

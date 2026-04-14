import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(readFileSync(join(__dirname, '..', '.ga-service-account.json'), 'utf-8'));
const client = new BetaAnalyticsDataClient({ credentials });
const propertyId = 'properties/532514788';

// 今日数据
const today = '2026-04-14';
const [todayR] = await client.runReport({
  property: propertyId,
  dateRanges: [{ startDate: today, endDate: today }],
  dimensions: [{ name: 'pagePath' }],
  metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
  orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
});

console.log('=== 今日 (' + today + ') 页面详情 ===');
let totalSess = 0, totalViews = 0, totalUsers = 0;
for (const row of todayR.rows || []) {
  const page = row.dimensionValues[0].value;
  const [sess, users, views, dur] = row.metricValues.map(v => v.value);
  console.log(page + ' | ' + sess + ' sessions | ' + users + ' users | ' + views + ' views | ' + parseFloat(dur).toFixed(0) + 's');
  totalSess += parseInt(sess);
  totalViews += parseInt(views);
  totalUsers += parseInt(users);
}
console.log('\n今日汇总: ' + totalSess + ' sessions | ' + totalUsers + ' users | ' + totalViews + ' views');

// 今日流量来源
const [srcR] = await client.runReport({
  property: propertyId,
  dateRanges: [{ startDate: today, endDate: today }],
  dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
  metrics: [{ name: 'sessions' }],
  orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
});
console.log('\n=== 今日流量来源 ===');
for (const row of srcR.rows || []) {
  console.log(row.dimensionValues[0].value + ' / ' + row.dimensionValues[1].value + ' | ' + row.metricValues[0].value + ' sessions');
}

// 今日国家
const [countryR] = await client.runReport({
  property: propertyId,
  dateRanges: [{ startDate: today, endDate: today }],
  dimensions: [{ name: 'country' }],
  metrics: [{ name: 'sessions' }],
  orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
});
console.log('\n=== 今日国家 ===');
for (const row of countryR.rows || []) {
  console.log(row.dimensionValues[0].value + ' | ' + row.metricValues[0].value + ' sessions');
}

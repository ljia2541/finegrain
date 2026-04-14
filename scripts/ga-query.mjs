import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(readFileSync(join(__dirname, '..', '.ga-service-account.json'), 'utf-8'));

const client = new BetaAnalyticsDataClient({ credentials });
const propertyId = 'properties/532514788';

async function main() {
  // Last 7 days overview
  const [response7d] = await client.runReport({
    property: propertyId,
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'newUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
    ],
    orderBys: [{ dimension: { dimensionName: 'date' }, desc: true }],
  });

  console.log('=== 最近 7 天 ===');
  console.log('日期\t\t会话\t用户\t新用户\t浏览量\t平均停留(秒)');
  for (const row of response7d.rows || []) {
    const date = row.dimensionValues[0].value;
    const [sess, users, newU, views, dur] = row.metricValues.map(v => v.value);
    const d = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    console.log(`${d}\t${sess}\t${users}\t${newU}\t${views}\t${parseFloat(dur).toFixed(0)}`);
  }

  // Totals for 7 days
  const [total7d] = await client.runReport({
    property: propertyId,
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'newUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
    ],
  });
  if (total7d.rows?.[0]) {
    const [sess, users, newU, views, dur] = total7d.rows[0].metricValues.map(v => v.value);
    console.log(`\n7日汇总: ${sess} 会话 / ${users} 用户 / ${newU} 新用户 / ${views} 浏览 / 平均${parseFloat(dur).toFixed(0)}秒`);
  }

  // Top pages (30 days)
  const [pages] = await client.runReport({
    property: propertyId,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  });

  console.log('\n=== 热门页面 (30天) ===');
  for (const row of pages.rows || []) {
    console.log(`${row.dimensionValues[0].value}\t${row.metricValues[0].value} views\t${row.metricValues[1].value} sessions`);
  }

  // Traffic sources (30 days)
  const [sources] = await client.runReport({
    property: propertyId,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'sessionSource' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });

  console.log('\n=== 流量来源 (30天) ===');
  for (const row of sources.rows || []) {
    console.log(`${row.dimensionValues[0].value}\t${row.metricValues[0].value} sessions`);
  }

  // Countries (30 days)
  const [countries] = await client.runReport({
    property: propertyId,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });

  console.log('\n=== 国家/地区 (30天) ===');
  for (const row of countries.rows || []) {
    console.log(`${row.dimensionValues[0].value}\t${row.metricValues[0].value} sessions`);
  }
}

main().catch(console.error);

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');
const KEY_FILE = path.join(__dirname, '.ga-service-account.json');

// Last 30 days
const START = '2026-04-12';
const END = '2026-05-12';
const DR = { startDate: START, endDate: END };

async function query(client, propertyId, spec) {
  try {
    const [resp] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [spec.dateRange || DR],
      dimensions: spec.dimensions || [],
      metrics: spec.metrics || [],
      dimensionFilter: spec.dimensionFilter,
      orderBys: spec.orderBys,
      limit: spec.limit || 100,
    });
    return resp.rows || [];
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

function fmt(rows, label) {
  console.log(`\n${label}`);
  if (typeof rows === 'string') { console.log(`  ${rows}`); return; }
  if (!rows.length) { console.log('  无数据'); return; }
  for (const row of rows) {
    const dims = row.dimensionValues.map(d => d.value).join(' | ');
    const vals = row.metricValues.map(m => m.value).join(' | ');
    console.log(`  ${dims}  →  ${vals}`);
  }
}

async function runSite(propertyId, name) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

  // 1. Daily traffic trend
  const daily = await query(client, propertyId, {
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' },
      { name: 'screenPageViews' }, { name: 'averageSessionDuration' },
    ],
    orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
    limit: 31,
  });
  fmt(daily, `=== ${name} 每日流量 (${START} ~ ${END}) ===\n  日期 | 会话 | 用户 | 新用户 | 浏览 | 平均时长(s)`);

  // 2. Totals
  const totals = await query(client, propertyId, {
    metrics: [
      { name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' },
      { name: 'screenPageViews' }, { name: 'averageSessionDuration' },
      { name: 'bounceRate' }, { name: 'eventCount' },
    ],
  });
  if (typeof totals !== 'string' && totals.length) {
    const m = totals[0].metricValues;
    console.log(`\n=== ${name} 30天汇总 ===`);
    console.log(`  会话: ${m[0].value} | 用户: ${m[1].value} | 新用户: ${m[2].value}`);
    console.log(`  浏览: ${m[3].value} | 平均时长: ${parseFloat(m[4].value).toFixed(1)}s | 跳出率: ${(parseFloat(m[5].value)*100).toFixed(1)}%`);
    console.log(`  事件总数: ${m[6].value}`);
  }

  // 3. Top pages
  const pages = await query(client, propertyId, {
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'averageSessionDuration' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 15,
  });
  fmt(pages, `\n=== ${name} 热门页面 ===\n  页面 | 浏览 | 用户 | 平均时长`);

  // 4. Traffic sources
  const sources = await query(client, propertyId, {
    dimensions: [{ name: 'sessionSource' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });
  fmt(sources, `\n=== ${name} 流量来源 ===\n  来源 | 会话 | 用户`);

  // 5. Countries
  const countries = await query(client, propertyId, {
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });
  fmt(countries, `\n=== ${name} 用户地区 ===\n  国家 | 会话 | 用户`);

  // 6. Device
  const devices = await query(client, propertyId, {
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });
  fmt(devices, `\n=== ${name} 设备分布 ===\n  设备 | 会话`);

  // 7. Key events / funnel
  const events = await query(client, propertyId, {
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 20,
  });
  fmt(events, `\n=== ${name} Top 20 事件 ===\n  事件 | 次数 | 用户`);

  // 8. Conversion funnel (enhance/purchase/signup specific)
  const conversionEvents = [
    'enhance_click', 'enhance_start', 'enhance_complete', 'enhance_error',
    'purchase', 'sign_up', 'login', 'begin_checkout',
  ];
  const funnel = await query(client, propertyId, {
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    dimensionFilter: {
      orGroup: {
        expressions: conversionEvents.map(e => ({
          filter: { fieldName: 'eventName', stringFilter: { value: e } }
        }))
      }
    },
  });
  fmt(funnel, `\n=== ${name} 转化漏斗 ===\n  事件 | 次数 | 用户`);

  // 9. Landing pages
  const landing = await query(client, propertyId, {
    dimensions: [{ name: 'landingPage' }],
    metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });
  fmt(landing, `\n=== ${name} 着陆页 ===\n  页面 | 会话 | 跳出率`);
}

(async () => {
  await runSite('532514788', 'FineGrain');
  console.log('\n' + '='.repeat(80) + '\n');
  await runSite('514327854', 'GoTaskMind');
})();

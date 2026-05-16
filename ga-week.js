const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');
const KEY_FILE = path.join(__dirname, '.ga-service-account.json');
const DR = { startDate: '2026-05-05', endDate: '2026-05-12' };

async function q(client, propertyId, spec) {
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

function p(rows, label) {
  console.log(`\n${label}`);
  if (typeof rows === 'string') { console.log(`  ${rows}`); return; }
  if (!rows.length) { console.log('  无数据'); return; }
  for (const row of rows) {
    const dims = row.dimensionValues.map(d => d.value).join(' | ');
    const vals = row.metricValues.map(m => {
      const v = parseFloat(m.value);
      if (m.value.includes('.') && v > 100) return v.toFixed(0);
      if (m.value.includes('.')) return v.toFixed(2);
      return m.value;
    }).join(' | ');
    console.log(`  ${dims}  →  ${vals}`);
  }
}

async function runSite(pid, name) {
  const c = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

  // 1. Daily
  p(await q(c, pid, {
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, { name: 'bounceRate' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
    limit: 8,
  }), `=== ${name} 每日流量 (5/5-5/12) ===\n  日期 | 会话 | 用户 | 新用户 | 浏览 | 时长(s) | 跳出率`);

  // 2. Hourly for today
  p(await q(c, pid, {
    dateRange: { startDate: 'today', endDate: 'today' },
    dimensions: [{ name: 'hour' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }],
    orderBys: [{ dimension: { dimensionName: 'hour' } }],
    limit: 24,
  }), `=== ${name} 今天按小时 ===\n  小时 | 会话 | 用户 | 浏览`);

  // 3. Pages
  p(await q(c, pid, {
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'averageSessionDuration' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 15,
  }), `=== ${name} 页面详情 ===\n  页面 | 浏览 | 用户 | 时长`);

  // 4. Source + medium
  p(await q(c, pid, {
    dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'newUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 15,
  }), `=== ${name} 流量来源详情 ===\n  来源 | 渠道 | 会话 | 用户 | 新用户`);

  // 5. Country
  p(await q(c, pid, {
    dimensions: [{ name: 'country' }, { name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  }), `=== ${name} 地区+设备 ===\n  国家 | 设备 | 会话 | 用户`);

  // 6. All events
  p(await q(c, pid, {
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 30,
  }), `=== ${name} 所有事件 (Top30) ===\n  事件 | 次数 | 用户`);

  // 7. Funnel events daily
  const funnelEvents = ['enhance_start', 'enhance_complete', 'enhance_error', 'purchase', 'sign_up', 'login', 'begin_checkout'];
  p(await q(c, pid, {
    dimensions: [{ name: 'date' }, { name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      orGroup: { expressions: funnelEvents.map(e => ({ filter: { fieldName: 'eventName', stringFilter: { value: e } } })) }
    },
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  }), `=== ${name} 转化漏斗(按天) ===\n  日期 | 事件 | 次数`);

  // 8. Landing page + exit
  p(await q(c, pid, {
    dimensions: [{ name: 'landingPage' }],
    metrics: [{ name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  }), `=== ${name} 着陆页 ===\n  页面 | 会话 | 跳出率 | 时长`);

  // 9. User flow: landing → enhance
  p(await q(c, pid, {
    dimensions: [{ name: 'landingPage' }, { name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'CONTAINS', value: 'enhance' } } }
        ]
      }
    },
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20,
  }), `=== ${name} 进入增强页的路径 ===\n  着陆页 | 增强页 | 浏览`);

  // 10. New vs returning
  p(await q(c, pid, {
    dimensions: [{ name: 'newVsReturning' }],
    metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  }), `=== ${name} 新老用户 ===\n  类型 | 会话 | 浏览`);
}

(async () => {
  await runSite('532514788', 'FineGrain');
  console.log('\n' + '='.repeat(80) + '\n');
  await runSite('514327854', 'GoTaskMind');
})();

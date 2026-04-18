const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const KEY_FILE = path.join(__dirname, '.ga-service-account.json');
const DR = { startDate: '2026-04-18', endDate: '2026-04-18' };

async function runQuery(propertyId, siteName) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '2026-04-18', endDate: '2026-04-18' },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
        { name: 'eventCount' },
      ],
    });

    console.log(`\n===== ${siteName} =====`);
    if (response.rows && response.rows.length > 0) {
      for (const row of response.rows) {
        const date = row.dimensionValues[0].value;
        const m = row.metricValues;
        console.log(`日期: ${date}`);
        console.log(`  会话: ${m[0].value} | 用户: ${m[1].value} | 新用户: ${m[2].value}`);
        console.log(`  页面浏览: ${m[3].value} | 平均时长: ${parseFloat(m[4].value).toFixed(1)}s | 跳出率: ${(parseFloat(m[5].value) * 100).toFixed(1)}%`);
        console.log(`  事件数: ${m[6].value}`);
      }
    } else {
      console.log('无数据');
    }
  } catch (e) {
    console.log(`${siteName} 基础查询失败: ${e.message}`);
  }
}

async function runEvents(propertyId, siteName) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [DR],
      dimensions: [{ name: 'date' }, { name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
    });

    console.log(`\n----- ${siteName} 事件明细 -----`);
    if (response.rows && response.rows.length > 0) {
      for (const row of response.rows) {
        console.log(`  ${row.dimensionValues[0].value} | ${row.dimensionValues[1].value}: ${row.metricValues[0].value}`);
      }
    } else {
      console.log('无事件数据');
    }
  } catch (e) {
    console.log(`${siteName} 事件查询失败: ${e.message}`);
  }
}

async function runTopPages(propertyId, siteName) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [DR],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });

    console.log(`\n----- ${siteName} 热门页面 -----`);
    if (response.rows && response.rows.length > 0) {
      for (const row of response.rows) {
        console.log(`  ${row.dimensionValues[0].value} → 浏览:${row.metricValues[0].value} 用户:${row.metricValues[1].value}`);
      }
    } else {
      console.log('无数据');
    }
  } catch (e) {
    console.log(`${siteName} 页面查询失败: ${e.message}`);
  }
}

async function runSource(propertyId, siteName) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [DR],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    });

    console.log(`\n----- ${siteName} 流量来源 -----`);
    if (response.rows && response.rows.length > 0) {
      for (const row of response.rows) {
        console.log(`  ${row.dimensionValues[0].value}: ${row.metricValues[0].value} 会话`);
      }
    } else {
      console.log('无数据');
    }
  } catch (e) {
    console.log(`${siteName} 来源查询失败: ${e.message}`);
  }
}

async function runCountry(propertyId, siteName) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [DR],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    });

    console.log(`\n----- ${siteName} 用户地区 -----`);
    if (response.rows && response.rows.length > 0) {
      for (const row of response.rows) {
        console.log(`  ${row.dimensionValues[0].value}: ${row.metricValues[0].value} 会话`);
      }
    } else {
      console.log('无数据');
    }
  } catch (e) {
    console.log(`${siteName} 地区查询失败: ${e.message}`);
  }
}

(async () => {
  await runQuery('532514788', 'FineGrain');
  await runTopPages('532514788', 'FineGrain');
  await runSource('532514788', 'FineGrain');
  await runCountry('532514788', 'FineGrain');
  await runEvents('532514788', 'FineGrain');

  await runQuery('514327854', 'GoTaskMind');
  await runTopPages('514327854', 'GoTaskMind');
  await runSource('514327854', 'GoTaskMind');
  await runCountry('514327854', 'GoTaskMind');
  await runEvents('514327854', 'GoTaskMind');
})();

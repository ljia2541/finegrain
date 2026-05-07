const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const KEY_FILE = path.join(__dirname, '.ga-service-account.json');
const DR = { startDate: 'today', endDate: 'today' };

async function runQuery(propertyId, siteName) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [DR],
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

async function runConversions(propertyId, siteName) {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
  try {
    // Check key conversion events
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [DR],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
      dimensionFilter: {
        orGroup: {
          expressions: [
            { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_click' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_complete' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_start' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'purchase' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'sign_up' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'login' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'page_view' } } },
            { filter: { fieldName: 'eventName', stringFilter: { matchType: 'CONTAINS', stringFilter: { value: 'plan' } } } },
            { filter: { fieldName: 'eventName', stringFilter: { matchType: 'CONTAINS', stringFilter: { value: 'pricing' } } } },
            { filter: { fieldName: 'eventName', stringFilter: { matchType: 'CONTAINS', stringFilter: { value: 'subscribe' } } } },
            { filter: { fieldName: 'eventName', stringFilter: { matchType: 'CONTAINS', stringFilter: { value: 'project' } } } },
            { filter: { fieldName: 'eventName', stringFilter: { matchType: 'CONTAINS', stringFilter: { value: 'task' } } } },
          ],
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    });

    console.log(`\n----- ${siteName} 关键转化事件 -----`);
    if (response.rows && response.rows.length > 0) {
      for (const row of response.rows) {
        console.log(`  ${row.dimensionValues[0].value}: ${row.metricValues[0].value}次 (用户:${row.metricValues[1].value})`);
      }
    } else {
      console.log('无转化事件');
    }
  } catch (e) {
    console.log(`${siteName} 转化查询失败: ${e.message}`);
  }
}

(async () => {
  await runQuery('532514788', 'FineGrain');
  await runTopPages('532514788', 'FineGrain');
  await runSource('532514788', 'FineGrain');
  await runCountry('532514788', 'FineGrain');
  await runConversions('532514788', 'FineGrain');

  await runQuery('514327854', 'GoTaskMind');
  await runTopPages('514327854', 'GoTaskMind');
  await runSource('514327854', 'GoTaskMind');
  await runCountry('514327854', 'GoTaskMind');
  await runConversions('514327854', 'GoTaskMind');
})();

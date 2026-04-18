const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');
const KEY_FILE = path.join(__dirname, '.ga-service-account.json');

async function run() {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

  const [resp] = await client.runReport({
    property: 'properties/532514788',
    dateRanges: [{ startDate: '2026-04-18', endDate: '2026-04-18' }],
    dimensions: [{ name: 'newVsReturning' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
  });

  console.log('=== FineGrain 新老用户 (4/18) ===');
  if (resp.rows) {
    for (const row of resp.rows) {
      console.log(`${row.dimensionValues[0].value}: ${row.metricValues[1].value} 用户, ${row.metricValues[0].value} 会话`);
    }
  }
}

run().catch(console.error);

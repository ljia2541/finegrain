const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const KEY_FILE = path.join(__dirname, '.ga-service-account.json');

async function run() {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

  // Get all enhance events by date after deploy (4/17 17:51 GMT+8 = 4/17 09:51 UTC)
  // Since GA4 uses date granularity, 4/17 includes both before and after deploy
  const [resp] = await client.runReport({
    property: 'properties/532514788',
    dateRanges: [{ startDate: '2026-04-17', endDate: '2026-04-18' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      orGroup: {
        expressions: [
          { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_complete' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_error' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_start' } } },
        ],
      },
    },
  });

  console.log('===== 4/17-18 enhance events =====');
  if (resp.rows) {
    for (const row of resp.rows) {
      console.log(`${row.dimensionValues[0].value}: ${row.metricValues[0].value}`);
    }
  }
}

run().catch(console.error);

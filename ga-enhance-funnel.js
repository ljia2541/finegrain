const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const KEY_FILE = path.join(__dirname, '.ga-service-account.json');

async function run() {
  const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

  // 4/23-24 enhance funnel by date
  const [resp] = await client.runReport({
    property: 'properties/532514788',
    dateRanges: [{ startDate: '2026-04-23', endDate: '2026-04-24' }],
    dimensions: [{ name: 'date' }, { name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      orGroup: {
        expressions: [
          { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_complete' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_error' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_start' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'enhance_view' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'purchase_view' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'purchase' } } },
        ],
      },
    },
  });

  console.log('===== 4/23-24 Enhance Funnel =====');
  if (resp.rows) {
    for (const row of resp.rows) {
      console.log(`${row.dimensionValues[0].value} | ${row.dimensionValues[1].value}: ${row.metricValues[0].value}`);
    }
  }
  
  // 4/23-24 purchase events
  const [p] = await client.runReport({
    property: 'properties/532514788',
    dateRanges: [{ startDate: '2026-04-23', endDate: '2026-04-24' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      orGroup: {
        expressions: [
          { filter: { fieldName: 'eventName', stringFilter: { value: 'purchase_view' } } },
          { filter: { fieldName: 'eventName', stringFilter: { value: 'purchase' } } },
        ],
      },
    },
  });
  console.log('\n===== 4/23-24 Purchase Events =====');
  if (p.rows) {
    for (const row of p.rows) {
      console.log(`${row.dimensionValues[0].value}: ${row.metricValues[0].value}`);
    }
  }
}

run().catch(console.error);

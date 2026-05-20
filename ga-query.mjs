import {BetaAnalyticsDataClient} from '@google-analytics/data';
import {readFileSync} from 'fs';

const creds = JSON.parse(readFileSync('.ga-service-account.json','utf8'));
const client = new BetaAnalyticsDataClient({credentials: creds});

async function query(propertyId, name) {
  const [resp] = await client.runReport({
    property: 'properties/' + propertyId,
    dateRanges: [{startDate: '2026-05-19', endDate: '2026-05-19'}],
    metrics: [{name: 'sessions'},{name: 'totalUsers'},{name: 'newUsers'},{name: 'screenPageViews'},{name: 'eventCount'}],
    dimensions: [{name: 'date'}]
  });
  console.log('\n=== ' + name + ' ===');
  if (resp.rows) {
    resp.rows.forEach(r => {
      console.log('Sessions:', r.metricValues[0].value, '| Users:', r.metricValues[1].value, '| New:', r.metricValues[2].value, '| PV:', r.metricValues[3].value, '| Events:', r.metricValues[4].value);
    });
  } else { console.log('No data'); }
}

await query('532514788', 'FineGrain');
await query('514327854', 'GoTaskMind');
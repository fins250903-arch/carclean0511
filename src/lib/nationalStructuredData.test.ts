import assert from 'node:assert/strict';
import test from 'node:test';
import { mentionsJapanesePlace } from './placeNames.ts';
import { buildNationalJsonLd } from './nationalStructuredData.ts';

test('national JSON-LD has no ratings and no Japanese place names', () => {
  const graph = buildNationalJsonLd();
  assert.deepEqual(
    graph.map((node) => node['@type']),
    ['Organization', 'LocalBusiness', 'WebSite'],
  );

  const serialized = JSON.stringify(graph);
  assert.equal(serialized.includes('AggregateRating'), false);
  assert.equal(serialized.includes('ratingValue'), false);
  assert.equal(serialized.includes('"Review"'), false);
  assert.equal(serialized.includes('AutoBodyShop'), false);
  assert.equal(serialized.includes('"Event"'), false);
  assert.equal(serialized.includes('/blog/'), false);
  assert.equal(mentionsJapanesePlace(serialized), false);

  const business = graph.find((node) => node['@type'] === 'LocalBusiness');
  const hours = business?.openingHoursSpecification as {
    opens: string;
    closes: string;
    dayOfWeek: string[];
  };
  assert.equal(hours.opens, '00:00');
  assert.equal(hours.closes, '23:59');
  assert.deepEqual(hours.dayOfWeek, [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);
  assert.equal(business?.url, 'https://carinteriorcleaning.jp/aio/');
  assert.equal(business?.telephone, '070-8428-0866');
  const area = business?.areaServed as { '@type': string; name: string };
  assert.equal(area['@type'], 'Country');
  assert.equal(area.name, 'Japan');
});

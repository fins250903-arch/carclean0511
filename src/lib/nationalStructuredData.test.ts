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
  assert.equal(serialized.includes('/blog/'), false);
  assert.equal(mentionsJapanesePlace(serialized), false);

  const business = graph.find((node) => node['@type'] === 'LocalBusiness');
  assert.equal(business?.telephone, '070-8428-0866');
  const area = business?.areaServed as { '@type': string; name: string };
  assert.equal(area['@type'], 'Country');
  assert.equal(area.name, 'Japan');
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { buildNationalJsonLd } from './nationalStructuredData.ts';

test('national JSON-LD is Organization, LocalBusiness, and WebSite, without ratings or prefectures', () => {
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
  assert.equal(serialized.includes('千葉'), false);
  assert.equal(serialized.includes('大阪'), false);
  assert.equal(serialized.includes('/regions/'), false);
  assert.equal(serialized.includes('/blog/'), false);

  const business = graph.find((node) => node['@type'] === 'LocalBusiness');
  assert.equal(business?.telephone, '070-8428-0866');
  const area = business?.areaServed as { '@type': string; name: string };
  assert.equal(area['@type'], 'Country');
  assert.equal(area.name, 'Japan');
});

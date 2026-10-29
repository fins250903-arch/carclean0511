import assert from 'node:assert/strict';
import test from 'node:test';
import { regions } from '../data/regions.ts';
import { buildNationalJsonLd } from './nationalStructuredData.ts';

test('national JSON-LD names the business and each prefecture LP, without ratings', () => {
  const graph = buildNationalJsonLd();
  const types = graph.map((node) => node['@type']);
  assert.deepEqual(types, ['Organization', 'LocalBusiness', 'WebSite', 'ItemList', 'WebPage']);

  const serialized = JSON.stringify(graph);
  assert.equal(serialized.includes('AggregateRating'), false);
  assert.equal(serialized.includes('ratingValue'), false);
  assert.equal(serialized.includes('"Review"'), false);
  assert.equal(serialized.includes('AutoBodyShop'), false);

  const list = graph.find((node) => node['@type'] === 'ItemList');
  const items = list?.itemListElement as { url: string; name: string }[];
  assert.equal(items.length, regions.length);
  assert.ok(items.some((item) => item.url === 'https://carinteriorcleaning.jp/regions/chiba/'));
  assert.ok(items.some((item) => item.url === 'https://carinteriorcleaning.jp/regions/aichi/'));
  assert.ok(items.some((item) => item.name === '千葉県の出張車内クリーニング'));

  const business = graph.find((node) => node['@type'] === 'LocalBusiness');
  assert.equal(business?.['@type'], 'LocalBusiness');
  assert.equal(business?.telephone, '070-8428-0866');
  const address = business?.address as { streetAddress: string; addressRegion: string };
  assert.equal(address.addressRegion, '岡山県');
  assert.equal(address.streetAddress, '当新田342');
});

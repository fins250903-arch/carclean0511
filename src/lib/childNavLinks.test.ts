import assert from 'node:assert/strict';
import test from 'node:test';
import { regions } from '../data/regions.ts';
import {
  areaLinksFor,
  childNavFor,
  concernLinksFor,
  nationalAreaIndex,
  parentRegionHref,
  withTrailingSlash,
} from './childNavLinks.ts';
import { loadRedirectSources } from './sitemapPolicy.ts';

const redirects = loadRedirectSources();

const EXPECTED = {
  osaka: {
    areas: ['osaka-city', 'kitasen', 'senshu'],
    concerns: [
      'ac-nioi',
      'kareisyu',
      'tabako-yani',
      'vomit-cleaning',
      'odor-removal',
      'oshikko',
      'pet-nioi',
      'pet-unko',
      'seat-senjo',
      'mold-odor',
      'touyu-kobosi',
    ],
  },
  hyogo: {
    areas: ['kobe', 'hanshin'],
    concerns: [
      'ac-nioi',
      'kareisyu',
      'tabako-yani',
      'vomit-cleaning',
      'kuruma-nioi-keshi',
      'omorashi',
      'pet-nioi',
      'pet-unko',
      'seat-washing',
      'shanai-nioi',
      'touyu-kobosi',
    ],
  },
  fukuoka: {
    areas: ['fukuoka-city', 'kitakyushu', 'chikugo'],
    concerns: [
      'ac-nioi',
      'kareisyu',
      'tabako-yani',
      'vomit-cleaning',
      'kuruma-nioi-keshi',
      'oshikko',
      'pet-nioi',
      'pet-unko',
      'seat-senjo',
      'shanai-nioi',
      'touyu-kobosi',
    ],
  },
  miyagi: {
    areas: [],
    concerns: [
      'ac-nioi',
      'kareisyu',
      'tabako-yani',
      'kyuto-cleaning',
      'kuruma-nioi-keshi',
      'oshikko',
      'pet-nioi',
      'pet-unko',
      'seat-senjo',
      'shanai-nioi',
      'touyu-kobosi',
    ],
  },
} as const;

const NOT_LINKED = [
  'ase',
  'chuko-kareisyu',
  'chuko-tabako',
  'car-ac-cleaning',
  'evaporator-senjo',
  'hoken-kyuto',
  'kodomo-kyuto',
  'kuruma-nioitori',
  'shanai-shoshu',
  'pet-ke',
  'pet-hair-odor',
  'seat-cleaning',
  'unko',
  'interior-cleaning',
  'shutchou-senmon',
  'specialist-cleaning',
  'dengen-fuyou',
  'bus-senmon',
  'ac-kusai',
  'spray-kouka-nai',
  'kitakawachi',
  'nakakawachi',
  'minamikawachi',
  'himeji',
  'higashi-harima',
  'chikuho',
];

test('focus prefectures link only to the pages that stay differentiated', () => {
  for (const [regionId, expected] of Object.entries(EXPECTED)) {
    const regionName = regions.find((region) => region.id === regionId)?.name ?? regionId;
    const nav = childNavFor(regionId, regionName);
    assert.deepEqual(nav.areas.map((link) => link.slug), [...expected.areas], regionId);
    assert.deepEqual(nav.concerns.map((link) => link.slug), [...expected.concerns], regionId);
    for (const link of [...nav.areas, ...nav.concerns]) {
      assert.equal(link.href.endsWith('/'), true, link.href);
      assert.equal(link.href.includes('-truck') || link.href.includes('-bus'), false, link.href);
      assert.equal(redirects.has(link.href), false, link.href);
    }
  }
});

test('no prefecture nav links to a redirect, a dropped page, or a slashless path', () => {
  for (const region of regions) {
    const nav = childNavFor(region.id, region.name);
    for (const link of [...nav.areas, ...nav.concerns]) {
      assert.equal(link.href.endsWith('/'), true, link.href);
      assert.equal(redirects.has(link.href), false, link.href);
      assert.equal(NOT_LINKED.includes(link.slug ?? ''), false, `${region.id} ${link.slug}`);
    }
  }
});

test('the national area index features four prefectures and skips Kumamoto', () => {
  const index = nationalAreaIndex();
  assert.deepEqual(index.featured.map((link) => link.href), [
    '/regions/osaka/',
    '/regions/hyogo/',
    '/regions/fukuoka/',
    '/regions/miyagi/',
  ]);
  assert.equal(index.featured[0].cities?.includes('大阪市'), true);
  assert.equal(index.featured[1].cities?.includes('神戸市'), true);
  assert.equal(index.others.some((link) => link.href.includes('kumamoto')), false);
  assert.equal(index.others.some((link) => link.name === '愛知県'), true);
  for (const link of [...index.featured, ...index.others]) {
    assert.equal(link.href.endsWith('/'), true, link.href);
  }
  assert.equal(index.featured.length + index.others.length, 23);
});

test('child pages can link back to the prefecture with a trailing slash', () => {
  assert.equal(parentRegionHref('osaka', 'car'), '/regions/osaka/');
  assert.equal(parentRegionHref('hyogo', 'truck'), '/regions/hyogo-truck/');
  assert.equal(parentRegionHref('fukuoka', 'bus'), '/regions/fukuoka-bus/');
  assert.equal(withTrailingSlash('/regions/osaka'), '/regions/osaka/');
  assert.equal(withTrailingSlash('/regions/osaka/'), '/regions/osaka/');
  assert.equal(areaLinksFor('tokyo').length > 0, true);
  assert.equal(concernLinksFor('aichi', '愛知県').some((link) => link.slug === 'tobacco-odor'), true);
  assert.equal(concernLinksFor('aichi', '愛知県').some((link) => link.slug === 'tabako-yani'), false);
});

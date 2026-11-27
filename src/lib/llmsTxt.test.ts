import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { filterIndexableRegions } from '../data/noindexRegions.ts';
import {
  CAR_PRICING,
  TRUCK_PRICING,
  yen,
} from '../data/pricingConstants.ts';
import { regions } from '../data/regions.ts';
import { generateRegionMetadata } from './seo.ts';
import { regionPath } from './niche.ts';
import { isIncludedInSitemap, loadRedirectSources } from './sitemapPolicy.ts';
import { canonicalUrl, LINE_URL, OPERATOR, STORE_NAME, TEL } from './site.ts';
import { buildLlmsTxt, listKeptCityPages } from './llmsTxt.ts';

const text = buildLlmsTxt();

test('llms.txt follows the llmstxt.org outline and stays short', () => {
  assert.match(text, new RegExp(`^# ${STORE_NAME}\\n\\n> `));
  assert.equal(text.endsWith('\n'), true);
  const lineCount = text.trimEnd().split('\n').length;
  assert.ok(lineCount < 180, `expected well under 200 lines, got ${lineCount}`);
  assert.equal(text.includes('## ページ'), true);
  assert.equal(text.includes('## 都道府県別のページ'), true);
  assert.equal(text.includes('## ブログ'), true);
});

test('owner-confirmed facts, address, and published prices are present', () => {
  assert.equal(text.includes('受付は365日24時間'), true);
  assert.equal(text.includes(`電話 ${TEL} とLINEは全国共通`), true);
  assert.equal(
    text.includes('外部電源持込可能（別途費用）、コンセントの無いところでも作業可能です'),
    true,
  );
  assert.equal(text.includes(`持込費用は${yen(5_000)}です`), true);
  assert.equal(text.includes(`1シート ${yen(CAR_PRICING.seatSingleBasic)}から`), true);
  assert.equal(text.includes(yen(CAR_PRICING.lightBasic)), true);
  assert.equal(text.includes(yen(CAR_PRICING.regularBasic)), true);
  assert.equal(text.includes(yen(CAR_PRICING.largeBasic)), true);
  assert.equal(text.includes(yen(TRUCK_PRICING.ton2Cab)), true);
  assert.equal(text.includes(yen(TRUCK_PRICING.ton10Total)), true);
  assert.equal(text.includes('2連席1区画 22,000円〜'), true);
  assert.equal(text.includes(`〒${OPERATOR.postalCode}　${OPERATOR.fullAddress}`), true);
  assert.equal(text.includes('本部は岡山、各地域へは現地の専門プロのスタッフが出張対応'), true);
  assert.equal(text.includes(OPERATOR.representative), true);
  assert.equal(text.includes(OPERATOR.paymentAcceptedLabel), true);
  assert.equal(text.includes('現金・クレジットカードでお支払いいただけます。'), true);
  assert.equal(/PayPay|paypay|各種決済/.test(text), false);
  assert.equal(text.includes(LINE_URL), true);
  assert.equal(text.includes('35,000円から'), false);
});

test('coating is not mentioned', () => {
  assert.equal(/コーティング|coating|コート/i.test(text), false);
  assert.equal(text.includes('/coating/'), false);
});

test('page links start with /aio/, then prefecture LPs, then /blog/', () => {
  const firstLink = text.match(/\]\(([^)]+)\)/)?.[1];
  assert.equal(firstLink, canonicalUrl('/aio'));

  const aioAt = text.indexOf(canonicalUrl('/aio'));
  const blogAt = text.indexOf(canonicalUrl('/blog'));
  assert.ok(aioAt !== -1 && aioAt < text.indexOf('/regions/'));
  assert.ok(blogAt > text.lastIndexOf('/regions/'));

  for (const region of filterIndexableRegions(regions)) {
    const car = canonicalUrl(regionPath(region.id, 'car'));
    const truck = canonicalUrl(regionPath(region.id, 'truck'));
    const bus = canonicalUrl(regionPath(region.id, 'bus'));
    const carAt = text.indexOf(car);
    const truckAt = text.indexOf(truck);
    const busAt = text.indexOf(bus);
    assert.ok(carAt !== -1 && carAt < truckAt && truckAt < busAt, region.id);
    assert.equal(text.slice(carAt, busAt).includes('###'), false, region.id);
  }

  assert.equal(text.includes('/regions/kumamoto'), false);
  assert.equal(text.includes('熊本'), false);
});

test('主な市区ページ lists kept self-canonical city pages only', () => {
  const expected = [
    ['大阪市', '/regions/osaka/osaka-city/', '大阪府'],
    ['北摂', '/regions/osaka/kitasen/', '大阪府'],
    ['泉州・堺', '/regions/osaka/senshu/', '大阪府'],
    ['神戸市', '/regions/hyogo/area/kobe/', '兵庫県'],
    ['阪神', '/regions/hyogo/area/hanshin/', '兵庫県'],
    ['福岡市', '/regions/fukuoka/area/fukuoka-city/', '福岡県'],
    ['北九州', '/regions/fukuoka/area/kitakyushu/', '福岡県'],
    ['筑後', '/regions/fukuoka/area/chikugo/', '福岡県'],
  ] as const;

  const pages = listKeptCityPages();
  assert.deepEqual(
    pages.map((page) => [page.name, page.path, page.regionName]),
    expected.map((row) => [...row]),
  );

  const sources = loadRedirectSources();
  const block = text.split('## 主な市区ページ\n\n')[1]?.split('\n## ブログ')[0] ?? '';
  const lines = block.trim().split('\n').filter((line) => line.length > 0);
  assert.equal(lines.length, expected.length);
  assert.equal(text.indexOf('## 主な市区ページ') > text.lastIndexOf('### '), true);
  assert.equal(text.indexOf('## 主な市区ページ') < text.indexOf('## ブログ'), true);
  assert.equal(text.split('## 主な市区ページ').length, 2);

  for (const page of pages) {
    const url = canonicalUrl(page.path);
    assert.equal(sources.has(page.path), false, page.path);
    assert.equal(isIncludedInSitemap(url, sources), true, page.path);
    assert.equal(
      generateRegionMetadata(`${page.name}（${page.regionName}）`, page.path, 'car').alternates
        ?.canonical,
      url,
      page.path,
    );
    assert.equal(
      lines.includes(`- [${page.name}の出張車内清掃](${url}): ${page.regionName}`),
      true,
      page.path,
    );
  }

  for (const dropped of [
    '/regions/osaka/kitakawachi/',
    '/regions/osaka/nakakawachi/',
    '/regions/osaka/minamikawachi/',
    '/regions/osaka/osaka-city-truck/',
    '/regions/osaka/senshu-bus/',
    '/regions/hyogo/area/himeji/',
    '/regions/hyogo/area/higashi-harima/',
    '/regions/hyogo/area/kobe-truck/',
    '/regions/hyogo/area/hanshin-bus/',
    '/regions/fukuoka/area/chikuho/',
    '/regions/fukuoka/area/fukuoka-city-bus/',
    '/regions/miyagi/area/sendai/',
    '/regions/kumamoto/',
  ]) {
    assert.equal(text.includes(dropped), false, dropped);
  }
});

test('bus price matches the visible pricing table', () => {
  const pricing = readFileSync(
    new URL('../components/sections/Pricing.astro', import.meta.url),
    'utf8',
  );
  const busBlock = pricing.split('2連席 1区画（基本）')[1]?.slice(0, 600) ?? '';
  const price = busBlock.match(/(\d{2},\d{3})/)?.[1];
  assert.equal(price, '22,000');
  assert.equal(text.includes(`2連席1区画 ${price}円〜`), true);
});

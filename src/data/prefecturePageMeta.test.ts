import assert from 'node:assert/strict';
import test from 'node:test';
import { CAR_PRICING, isTravelFeeExtra, yen } from './pricingConstants.ts';
import { regions } from './regions.ts';
import {
  PREFECTURE_PAGE_COPY,
  PREFECTURE_SEO_FACTS,
  getPrefecturePageCopy,
  prefectureCopyCoversRegions,
} from './prefecturePageMeta.ts';
import { TEL } from '../lib/site.ts';

const PRICE = `軽${yen(CAR_PRICING.lightBasic)}〜`;

test('one copy record per prefecture, in regions.ts order', () => {
  assert.equal(prefectureCopyCoversRegions(), true);
  assert.equal(PREFECTURE_PAGE_COPY.length, 24);
  assert.deepEqual(
    PREFECTURE_PAGE_COPY.map((copy) => copy.id),
    regions.map((region) => region.id),
  );
});

test('prefecture titles and descriptions are unique, short, and carry the same facts', () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const withoutName = new Set<string>();

  for (const copy of PREFECTURE_PAGE_COPY) {
    assert.equal(titles.has(copy.title), false, copy.title);
    assert.equal(descriptions.has(copy.description), false, copy.description);
    titles.add(copy.title);
    descriptions.add(copy.description);

    const stripped = copy.description.replaceAll(copy.name, '');
    assert.equal(withoutName.has(stripped), false, copy.name);
    withoutName.add(stripped);

    assert.ok(copy.description.length <= 120, `${copy.name} ${copy.description.length}: ${copy.description}`);
    assert.equal(copy.description.includes(PRICE), true, copy.name);
    assert.equal(copy.description.includes('発電機'), true, copy.name);
    assert.equal(copy.description.includes('コンセントが無い'), true, copy.name);
    assert.equal(copy.description.includes('マンション'), true, copy.name);
    assert.equal(copy.description.includes('青空駐車場'), true, copy.name);
    assert.equal(copy.description.includes(TEL), true, copy.name);
    assert.equal(copy.description.includes('本部は岡山'), true, copy.name);
    assert.equal(copy.description.includes('出張 車内 清掃'), false, copy.name);
    assert.equal(copy.title.includes('出張 車内 清掃'), false, copy.name);
    assert.equal(copy.description.includes('出張費無料'), false, copy.name);
    assert.equal(copy.path, `/regions/${copy.id}/`);
    assert.equal(getPrefecturePageCopy(copy.name)?.title, copy.title);
    const facts = PREFECTURE_SEO_FACTS.find((item) => item.name === copy.name);
    assert.ok(facts);
    for (const city of facts.cities) {
      assert.equal(copy.description.includes(city), true, `${copy.name} ${city}`);
    }
    assert.equal(copy.title.includes(facts.cities[0]), true, copy.title);
    assert.equal(copy.title.includes(facts.cities[1]), true, copy.title);

    for (const city of copy.description.match(/[一-龯ぁ-んー]+[市区]/g) ?? []) {
      assert.equal(copy.description.includes(city), true);
    }
  }
});

test('coverage limits stay in the Okinawa and Yamaguchi descriptions', () => {
  const okinawa = getPrefecturePageCopy('沖縄県');
  const yamaguchi = getPrefecturePageCopy('山口県');
  assert.match(okinawa?.description ?? '', /沖縄本島/);
  assert.match(okinawa?.description ?? '', /那覇市/);
  assert.match(yamaguchi?.description ?? '', /山口県西部/);
  assert.match(yamaguchi?.description ?? '', /離島は対象外/);
  assert.match(yamaguchi?.title ?? '', /下関市/);
});

test('subarea labels and unknown names are not given a prefecture description', () => {
  assert.equal(getPrefecturePageCopy('福岡市（福岡県）'), undefined);
  assert.equal(getPrefecturePageCopy('千葉市（千葉県）'), undefined);
  assert.equal(getPrefecturePageCopy(''), undefined);
});

test('travel-fee prefectures are not described as free travel', () => {
  for (const copy of PREFECTURE_PAGE_COPY) {
    if (!isTravelFeeExtra(copy.name)) continue;
    assert.equal(copy.description.includes('出張費無料'), false, copy.name);
    assert.equal(copy.description.includes(PRICE), true, copy.name);
  }
});

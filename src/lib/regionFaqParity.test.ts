import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAioContentFaqs } from '../data/aioKeywordContent.ts';
import { regions } from '../data/regions.ts';
import { buildNationalPageFaqs } from './nationalStructuredData.ts';
import { buildDisplayedFaqs, buildRegionPageFaqs, generateJsonLd } from './seo.ts';

const MISSING_ON_SCREEN = [
  '今日（または明日）すぐに来てほしいのですが、可能ですか？',
  '水道や電源は用意する必要がありますか？',
  '市販の消臭スプレーと何が違うのですか？',
];

const OTHER_REGION_ARRIVAL = ['首都圏', '関西主要部', '数時間以内', '翌日午前', '地方や繁忙時'];

const NATIONAL_QUESTIONS = [
  'マンションの駐車場でも来てくれますか？',
  '雨の日でも作業できますか？',
  '施工後すぐに車を使えますか？',
  '100℃スチーム洗浄は除菌に効果がありますか？',
  'ペットの尿や嘔吐の臭い、毛の掃除は可能ですか？',
  '車内で嘔吐した時、業者が来るまでに自分で何をすればいいですか？',
  '車にこぼした灯油の臭いは自分で消せますか？費用相場は？',
  '車内クリーニングの料金相場はいくらですか？保険は使えますか？',
  '車内嘔吐や灯油こぼしで車両保険は使えますか？等級は下がりますか？',
  '車内嘔吐の臭いは自分で完全に消せますか？',
  'マンション地下駐車場や政令指定都市でも当日出張できますか？',
  '友人・知人・お客様・親類など、第三者に車内を汚された場合も相談できますか？',
  '支払い方法は何が使えますか？',
  '私の地域まで来てもらえますか？',
  'カーシェア・レンタカーで嘔吐した場合、費用はいくら？保険は使えますか？',
  '灯油をこぼした直後、自分でやってはいけないことは？',
  '嘔吐から4日以上経っても、プロ洗浄で改善できますか？',
  '運転中に子供が車内で吐いた。手が離せないとき、最初に何をすればいい？',
  '自分の状況に合う車内清掃の選び方は？嘔吐・灯油・ペットで何が違う？',
  '近くの車内掃除業者を今すぐ呼びたい。マンション地下でも当日来てくれる？',
  '車のシートのシミの落とし方は？自分でやる限界とプロの境界は？',
  '渋滞中に子どもがおもらしした。運転中で手が離せないとき、最初に何をすればいい？',
  '車内クリーニングのおすすめは？自分でやる・ディーラー・出張専門のどれ？',
  'たばこのヤニ臭い車内は、自分で落とせますか？プロは何をする？',
  '水道や電源は用意する必要がありますか？',
  '市販の消臭スプレーと何が違うのですか？',
  '受付は何時でもできますか？',
  '電話番号とLINEは、どの地域からでも同じですか？',
];

function faqPairs(faqs: { q: string; a: string }[]) {
  return faqs.map((faq) => ({ q: faq.q, a: faq.a }));
}

function jsonLdFaqs(regionName: string, niche: 'car' | 'truck' | 'bus' = 'car') {
  const pageFaqs = buildRegionPageFaqs(regionName, niche);
  const graph = generateJsonLd(regionName, `/regions/test/`, undefined, niche, {
    faqItems: pageFaqs,
  });
  const faqPage = graph.find((node) => node['@type'] === 'FAQPage');
  const mainEntity = faqPage?.mainEntity as Array<{
    name: string;
    acceptedAnswer: { text: string };
  }>;
  return {
    pageFaqs,
    schema: mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })),
  };
}

test('prefecture car FAQ and FAQPage use one list, including the three previously hidden questions', () => {
  for (const region of regions) {
    const { pageFaqs, schema } = jsonLdFaqs(region.name, 'car');
    assert.deepEqual(schema, faqPairs(pageFaqs), region.name);
    assert.equal(new Set(pageFaqs.map((faq) => faq.q)).size, pageFaqs.length, region.name);

    for (const question of MISSING_ON_SCREEN) {
      assert.equal(pageFaqs.some((faq) => faq.q === question), true, `${region.name} ${question}`);
    }

    const joined = pageFaqs.map((faq) => `${faq.q}\n${faq.a}`).join('\n');
    for (const phrase of OTHER_REGION_ARRIVAL) {
      assert.equal(joined.includes(phrase), false, `${region.name} ${phrase}`);
    }

    for (const faq of pageFaqs) {
      if (!faq.q.includes('来て') && !faq.q.includes('到着')) continue;
      if (!joined.includes(faq.q)) continue;
      for (const other of regions) {
        if (other.name === region.name) continue;
        assert.equal(faq.a.includes(other.name), false, `${region.name} answer names ${other.name}`);
      }
    }
  }
});

test('arrival answers name the prefecture, keep 24h reception, and do not promise an arrival time', () => {
  for (const regionName of ['大阪府', '福岡県', '東京都', '山口県']) {
    const faqs = buildRegionPageFaqs(regionName, 'car');
    const today = faqs.find((faq) => faq.q === MISSING_ON_SCREEN[0]);
    const night = faqs.find((faq) => faq.q.startsWith('夜中に車で吐かれた'));
    const soon = faqs.find((faq) => faq.q.startsWith('今すぐ来てほしい'));
    for (const faq of [today, night, soon]) {
      assert.ok(faq, regionName);
      assert.equal(faq.a.includes(regionName), true, faq.q);
      assert.equal(faq.a.includes('受付は365日24時間'), true, faq.q);
      assert.equal(faq.a.includes('到着時刻をお約束するものではありません'), true, faq.q);
      assert.equal(faq.a.includes('予約状況や作業場所により異なります'), true, faq.q);
      assert.equal(faq.a.includes('お急ぎの場合はお電話で'), true, faq.q);
    }

    const power = faqs.find((faq) => faq.q === '水道や電源は用意する必要がありますか？');
    assert.equal(
      power?.a,
      '現場にコンセントがある場合はそちらを使えます。無い場合は外部電源の持込が可能です（別途費用）。コンセントの無いところでも作業可能です。',
    );
    const spray = faqs.find((faq) => faq.q === '市販の消臭スプレーと何が違うのですか？');
    assert.equal(
      spray?.a,
      '市販のスプレーは臭いの成分を別の香料で包み込む「マスキング」であり、汚れ自体はシート内に残ったままです。当店の洗浄は、洗剤で汚れを浮かし、温水で洗い流しながら同時に強力に吸い取る（リンサー抽出）ため、ニオイの「元」そのものを物理的に車外へ排除します。',
    );
  }
});

test('truck and bus prefecture pages do not gain the car-only extra FAQs', () => {
  for (const niche of ['truck', 'bus'] as const) {
    const { pageFaqs, schema } = jsonLdFaqs('福岡県', niche);
    assert.deepEqual(schema, faqPairs(pageFaqs));
    for (const question of MISSING_ON_SCREEN) {
      assert.equal(pageFaqs.some((faq) => faq.q === question), false, niche);
    }
  }
});

test('keyword schema built from extended extras matches the visible shorter list', () => {
  const regionName = '福岡県';
  const visible = buildDisplayedFaqs({
    regionName,
    extraFaqs: buildAioContentFaqs(regionName, { includeExtended: false }),
  });
  const graph = generateJsonLd(regionName, '/regions/fukuoka/kyuto-cleaning/', undefined, 'car', {
    extraFaqs: buildAioContentFaqs(regionName, { includeExtended: true }),
  });
  const faqPage = graph.find((node) => node['@type'] === 'FAQPage');
  const mainEntity = faqPage?.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>;
  assert.deepEqual(
    mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })),
    faqPairs(visible),
  );
});

test('keyword LP extended FAQs do not diverge from the shorter visible extras', () => {
  const regionName = '大阪府';
  const extended = buildDisplayedFaqs({
    regionName,
    extraFaqs: buildAioContentFaqs(regionName, { includeExtended: true }),
  });
  const visible = buildDisplayedFaqs({
    regionName,
    extraFaqs: buildAioContentFaqs(regionName, { includeExtended: false }),
  });
  assert.deepEqual(faqPairs(extended), faqPairs(visible));
});

test('nationwide /aio/ FAQ questions stay unchanged', () => {
  const faqs = buildNationalPageFaqs();
  assert.deepEqual(faqs.map((faq) => faq.q), NATIONAL_QUESTIONS);
  const joined = faqs.map((faq) => faq.a).join('\n');
  assert.equal(joined.includes('到着時刻をお約束するものではありません'), false);
  assert.equal(joined.includes('首都圏'), false);
  assert.equal(faqs.some((faq) => faq.q === MISSING_ON_SCREEN[0]), false);
});

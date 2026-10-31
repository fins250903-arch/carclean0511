import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAioContentFaqs } from '../data/aioKeywordContent.ts';
import { mentionsJapanesePlace } from './placeNames.ts';
import { buildNationalJsonLd, buildNationalPageFaqs } from './nationalStructuredData.ts';
import { generateJsonLd } from './seo.ts';

test('national JSON-LD has no ratings and no Japanese place names', () => {
  const graph = buildNationalJsonLd();
  assert.deepEqual(
    graph.map((node) => node['@type']),
    ['Organization', 'LocalBusiness', 'WebSite', 'FAQPage'],
  );

  const serialized = JSON.stringify(graph);
  assert.equal(serialized.includes('AggregateRating'), false);
  assert.equal(serialized.includes('ratingValue'), false);
  assert.equal(serialized.includes('"Review"'), false);
  assert.equal(serialized.includes('AutoBodyShop'), false);
  assert.equal(serialized.includes('/blog/'), false);
  assert.equal(mentionsJapanesePlace(serialized), false);

  const business = graph.find((node) => node['@type'] === 'LocalBusiness');
  assert.equal(business?.['@type'], 'LocalBusiness');
  assert.equal(business?.url, 'https://carinteriorcleaning.jp/aio/');
  assert.equal(business?.telephone, '070-8428-0866');
  const area = business?.areaServed as { '@type': string; name: string };
  assert.equal(area['@type'], 'Country');
  assert.equal(area.name, 'Japan');
});

test('national FAQPage matches the visible /aio/ FAQ and owner facts', () => {
  const faqs = buildNationalPageFaqs();
  const questions = faqs.map((faq) => faq.q);
  assert.equal(new Set(questions).size, questions.length);

  const graph = JSON.parse(JSON.stringify(buildNationalJsonLd())) as Array<Record<string, unknown>>;
  const faqPages = graph.filter((node) => node['@type'] === 'FAQPage');
  assert.equal(faqPages.length, 1);

  const mainEntity = faqPages[0].mainEntity as Array<{
    '@type': string;
    name: string;
    acceptedAnswer: { '@type': string; text: string };
  }>;
  assert.deepEqual(
    mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })),
    faqs.map((faq) => ({ q: faq.q, a: faq.a })),
  );
  assert.equal(mainEntity.every((item) => item['@type'] === 'Question'), true);
  assert.equal(mainEntity.every((item) => item.acceptedAnswer['@type'] === 'Answer'), true);

  const visible = faqs.map((faq) => `${faq.q}\n${faq.a}`).join('\n');
  assert.equal(visible.includes('受付は365日24時間'), true);
  assert.equal(visible.includes('電話番号 070-8428-0866 とLINEは全国共通'), true);
  assert.equal(visible.includes('どの地域からでも同じ窓口'), true);
  assert.equal(
    visible.includes('外部電源持込可能（別途費用）、コンセントの無いところでも作業可能です'),
    true,
  );
  assert.equal(visible.includes('5,000円'), true);
  assert.equal(mentionsJapanesePlace(visible), false);
});

test('region FAQPage does not pick up nationwide-only FAQ items', () => {
  const graph = generateJsonLd('大阪府', '/regions/osaka/', undefined, 'car', {
    extraFaqs: buildAioContentFaqs('大阪府'),
  });
  const faqPage = graph.find((node) => node['@type'] === 'FAQPage');
  const mainEntity = faqPage?.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>;
  const names = mainEntity.map((item) => item.name);
  assert.equal(names.includes('受付は何時でもできますか？'), false);
  assert.equal(names.includes('電話番号とLINEは、どの地域からでも同じですか？'), false);
  const power = mainEntity.find((item) => item.name.includes('水道や電源'));
  assert.equal(
    power?.acceptedAnswer.text,
    '現場にコンセントがある場合はそちらを使えます。無い場合は外部電源の持込が可能です（別途費用）。コンセントの無いところでも作業可能です。',
  );
  assert.equal(power?.acceptedAnswer.text.includes('外部電源持込可能（別途費用）、'), false);
});

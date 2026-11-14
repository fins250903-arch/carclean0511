import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAioContentFaqs } from '../data/aioKeywordContent.ts';
import { filterIndexableRegions } from '../data/noindexRegions.ts';
import { regions } from '../data/regions.ts';
import { mentionsJapanesePlace } from './placeNames.ts';
import { buildArticleJsonLd } from './blogSeo.ts';
import { buildNationalJsonLd, buildNationalPageFaqs } from './nationalStructuredData.ts';
import { ORGANIZATION_LOGO_URL } from './structuredDataConstants.ts';
import { generateJsonLd } from './seo.ts';

test('JSON-LD logo is the brand mark, and the representative photo stays on Person', () => {
  const national = buildNationalJsonLd();
  for (const type of ['Organization', 'LocalBusiness']) {
    const node = national.find((item) => item['@type'] === type);
    assert.equal(node?.logo, ORGANIZATION_LOGO_URL);
  }
  assert.equal(JSON.stringify(national).includes('representative_new'), false);

  const region = generateJsonLd('大阪府', '/regions/osaka/');
  const logos = region.flatMap((node) => (typeof node.logo === 'string' ? [node.logo] : []));
  assert.equal(logos.length >= 2, true);
  assert.equal(logos.every((logo) => logo === ORGANIZATION_LOGO_URL), true);

  const person = region.find((node) => node['@type'] === 'Person');
  assert.equal(person?.image, 'https://carinteriorcleaning.jp/images/representative_new.webp');

  const business = region.find((node) => node['@type'] === 'LocalBusiness' && node.image);
  assert.equal(String(business?.image).includes('representative_new'), false);

  const article = buildArticleJsonLd({
    title: '施工事例',
    description: 'シート洗浄の事例です。',
    url: 'https://carinteriorcleaning.jp/blog/example/',
  });
  const publisher = article.publisher as { logo?: string };
  assert.equal(publisher.logo, ORGANIZATION_LOGO_URL);
});

test('national JSON-LD areaServed lists indexable prefectures and other fields omit place names', () => {
  const graph = buildNationalJsonLd();
  assert.deepEqual(
    graph.map((node) => node['@type']),
    ['Organization', 'LocalBusiness', 'WebSite', 'FAQPage'],
  );

  const business = graph.find((node) => node['@type'] === 'LocalBusiness');
  assert.equal(business?.['@type'], 'LocalBusiness');
  assert.equal(business?.url, 'https://carinteriorcleaning.jp/aio/');
  assert.equal(business?.telephone, '070-8428-0866');

  const served = filterIndexableRegions(regions).map((region) => region.name);
  const area = business?.areaServed as { '@type': string; name: string }[];
  assert.deepEqual(
    area,
    served.map((name) => ({ '@type': 'AdministrativeArea', name })),
  );
  assert.equal(area.some((item) => item.name.includes('熊本')), false);
  assert.equal(area.length, served.length);

  const withoutArea = JSON.parse(JSON.stringify(graph)) as Array<Record<string, unknown>>;
  const businessCopy = withoutArea.find((node) => node['@type'] === 'LocalBusiness');
  delete businessCopy?.areaServed;
  const serialized = JSON.stringify(withoutArea);
  assert.equal(serialized.includes('AggregateRating'), false);
  assert.equal(serialized.includes('ratingValue'), false);
  assert.equal(serialized.includes('"Review"'), false);
  assert.equal(serialized.includes('AutoBodyShop'), false);
  assert.equal(serialized.includes('/blog/'), false);
  assert.equal(serialized.includes('"Country"'), false);
  assert.equal(mentionsJapanesePlace(serialized), false);
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
  const hq = mainEntity.find((item) => item.name === '私の地域まで来てもらえますか？');
  assert.equal(
    hq?.acceptedAnswer.text,
    'はい。現地の専門プロのスタッフがご指定の駐車場へ出張対応します。出張費は原則無料です。',
  );
  assert.equal(hq?.acceptedAnswer.text.includes('岡山'), false);
  const org = graph.find((node) => node['@type'] === 'Organization' && node.address);
  const address = org?.address as { addressRegion?: string; addressLocality?: string };
  assert.equal(address.addressRegion, '岡山県');
  assert.equal(address.addressLocality, '岡山市南区');

  const bus = generateJsonLd('大阪府', '/regions/osaka-bus/', undefined, 'bus');
  const busFaq = bus.find((node) => node['@type'] === 'FAQPage');
  const busQuestions = busFaq?.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>;
  const busHq = busQuestions.find((item) => item.name.includes('バスでも来て'));
  assert.equal(busHq?.name, 'どの地域のバスでも来てもらえますか？');
  assert.equal(
    busHq?.acceptedAnswer.text,
    'はい。現地の専門プロのスタッフが、掲載エリア内のバス車庫へ出張対応します。',
  );
  assert.equal(JSON.stringify(busFaq).includes('遠方'), false);

  const power = mainEntity.find((item) => item.name.includes('水道や電源'));
  assert.equal(
    power?.acceptedAnswer.text,
    '現場にコンセントがある場合はそちらを使えます。無い場合は外部電源の持込が可能です（別途費用）。コンセントの無いところでも作業可能です。',
  );
  assert.equal(power?.acceptedAnswer.text.includes('外部電源持込可能（別途費用）、'), false);
});

import { buildAioContentFaqs } from '@/data/aioKeywordContent';
import { CAR_PRICING } from '@/data/pricingConstants';
import { dedupeFaqItems, type FAQItem } from '@/data/seoData';
import { buildDisplayedFaqs, buildFaqPageJsonLd } from '@/lib/seo';
import { ORGANIZATION_SAME_AS } from '@/lib/structuredDataConstants';
import { OPERATOR, SITE_URL, STORE_NAME, TEL, canonicalUrl } from '@/lib/site';

/** Shown in place of any prefecture or city name. */
const NATIONAL_LABEL = '地域密着';

/**
 * Owner-confirmed power sentence for /aio/.
 * The comma is intentional. Region pages keep the period form in powerPolicy.
 * The bring-in fee stays 5,000円.
 */
const NATIONAL_POWER_WORDING =
  '外部電源持込可能（別途費用）、コンセントの無いところでも作業可能です';

const NATIONAL_POWER_ANSWER =
  `${NATIONAL_POWER_WORDING}。持込費用は5,000円です。現場にコンセントがある場合は、そちらも使えます。`;

const NATIONAL_HOURS_FAQ: FAQItem = {
  q: '受付は何時でもできますか？',
  a: '受付は365日24時間です。夜中や朝早くでも、お電話かLINEでご相談ください。伺える時間は空き次第ですので、まずはお電話ください。',
};

const NATIONAL_CONTACT_FAQ: FAQItem = {
  q: '電話番号とLINEは、どの地域からでも同じですか？',
  a: `電話番号 ${TEL} とLINEは全国共通です。どの地域からでも同じ窓口でご案内します。`,
};

function applyNationalConfirmedFacts(faqs: FAQItem[]): FAQItem[] {
  const adjusted = faqs.map((faq) => {
    if (faq.q.includes('水道や電源')) {
      return { ...faq, a: NATIONAL_POWER_ANSWER };
    }
    return faq;
  });

  const text = adjusted.map((faq) => `${faq.q}\n${faq.a}`).join('\n');
  const extras: FAQItem[] = [];
  if (!text.includes('受付は365日24時間')) extras.push(NATIONAL_HOURS_FAQ);
  if (!text.includes(TEL) || !text.includes('全国共通') || !text.includes('同じ窓口')) {
    extras.push(NATIONAL_CONTACT_FAQ);
  }
  if (!text.includes(NATIONAL_POWER_WORDING)) {
    extras.push({
      q: 'コンセントが無い場所でも作業できますか？',
      a: NATIONAL_POWER_ANSWER,
    });
  }
  return dedupeFaqItems([...adjusted, ...extras]);
}

/** FAQ items rendered on /aio/. FAQPage JSON-LD must use this same list. */
export function buildNationalPageFaqs(): FAQItem[] {
  return applyNationalConfirmedFacts(buildDisplayedFaqs({
    niche: 'car',
    regionName: NATIONAL_LABEL,
    extraFaqs: buildAioContentFaqs(NATIONAL_LABEL),
    omitPlaceNames: true,
  }));
}

/** AI-search landing page. `/` stays the Osaka LP entry. */
const HOME_URL = canonicalUrl('/aio');

/**
 * Homepage JSON-LD. No self-served ratings and no prefecture or city names.
 * Regional LPs keep their own structured data.
 */
export function buildNationalJsonLd(): Record<string, unknown>[] {
  const sameAs = ORGANIZATION_SAME_AS.filter((url) => !url.includes('/blog/'));

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: STORE_NAME,
    url: HOME_URL,
    telephone: OPERATOR.telephone,
    sameAs,
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: STORE_NAME,
    url: HOME_URL,
    telephone: OPERATOR.telephone,
    image: `${SITE_URL}/images/fv-passenger-hero.png`,
    description:
      '地域密着の出張車内クリーニングです。嘔吐、臭い、シミ、ペットの毛、食べこぼしを、ご指定の駐車場で洗浄・消臭します。',
    priceRange: `¥${CAR_PRICING.seatSingleBasic.toLocaleString('ja-JP')}〜`,
    paymentAccepted: [...OPERATOR.paymentAccepted],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Japan',
    },
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    sameAs,
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: HOME_URL,
    name: STORE_NAME,
    inLanguage: 'ja-JP',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  return [organization, localBusiness, website, buildFaqPageJsonLd(buildNationalPageFaqs())];
}

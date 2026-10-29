import { CAR_PRICING } from '@/data/pricingConstants';
import { ORGANIZATION_SAME_AS } from '@/lib/structuredDataConstants';
import { OPERATOR, SITE_URL, STORE_NAME, canonicalUrl } from '@/lib/site';

const HOME_URL = canonicalUrl('/');

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

  return [organization, localBusiness, website];
}

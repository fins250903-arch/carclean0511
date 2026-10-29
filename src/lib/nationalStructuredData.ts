import { CAR_PRICING } from '@/data/pricingConstants';
import { AUTHOR, ORGANIZATION_SAME_AS } from '@/lib/structuredDataConstants';
import { OPERATOR, SITE_URL, STORE_NAME, canonicalUrl } from '@/lib/site';

const HOME_URL = canonicalUrl('/');

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    postalCode: OPERATOR.postalCode,
    addressRegion: OPERATOR.addressRegion,
    addressLocality: OPERATOR.addressLocality,
    streetAddress: OPERATOR.streetAddress,
    addressCountry: OPERATOR.addressCountry,
  };
}

/**
 * Homepage JSON-LD. Regional LPs keep their own pages.
 * Organization, LocalBusiness, and WebSite only. No self-served ratings.
 */
export function buildNationalJsonLd(): Record<string, unknown>[] {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: STORE_NAME,
    url: HOME_URL,
    telephone: OPERATOR.telephone,
    address: postalAddress(),
    logo: `${SITE_URL}/images/representative_new.webp`,
    founder: { '@id': AUTHOR.id },
    sameAs: ORGANIZATION_SAME_AS.filter((url) => !url.includes('/blog/')),
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
      '車のシートと床をその場で洗う車内クリーニングです。嘔吐、臭い、シミ、ペットの毛、食べこぼしに対応します。',
    priceRange: `¥${CAR_PRICING.seatSingleBasic.toLocaleString('ja-JP')}〜`,
    paymentAccepted: [...OPERATOR.paymentAccepted],
    address: postalAddress(),
    areaServed: {
      '@type': 'Country',
      name: 'Japan',
    },
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    sameAs: ORGANIZATION_SAME_AS.filter((url) => !url.includes('/blog/')),
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

import { listNationalServiceAreas } from '@/data/nationalServiceAreas';
import {
  CAR_PRICING,
  TRUCK_PRICING,
} from '@/data/pricingConstants';
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
 * National top JSON-LD. Regional LPs keep their own LocalBusiness nodes.
 * No AggregateRating or Review: those would be self-serving.
 */
export function buildNationalJsonLd(): Record<string, unknown>[] {
  const areas = listNationalServiceAreas();

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
    employee: { '@id': AUTHOR.id },
    sameAs: [...ORGANIZATION_SAME_AS],
    knowsAbout: [...AUTHOR.knowsAbout],
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

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: STORE_NAME,
    url: HOME_URL,
    telephone: OPERATOR.telephone,
    image: `${SITE_URL}/images/fv-passenger-hero.png`,
    description:
      '車内清掃「特急便」は、ご指定の駐車場へ出張してシート洗浄と消臭を行う専門店です。本部は岡山県岡山市にあり、対応県ごとのページで料金とエリアを案内しています。',
    priceRange: `¥${CAR_PRICING.seatSingleBasic.toLocaleString('ja-JP')}〜`,
    paymentAccepted: [...OPERATOR.paymentAccepted],
    address: postalAddress(),
    areaServed: areas.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area.name,
    })),
    founder: { '@id': AUTHOR.id },
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    sameAs: [...ORGANIZATION_SAME_AS],
  };

  const areaList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${HOME_URL}#service-areas`,
    name: '対応している都道府県',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: areas.length,
    itemListElement: areas.map((area, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${area.name}の出張車内クリーニング`,
      url: area.url,
    })),
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${HOME_URL}#webpage`,
    url: HOME_URL,
    name: `${STORE_NAME}｜全国の出張車内クリーニング`,
    description:
      '対応している都道府県のページへ案内する全国トップです。各県の料金と対応エリアは、その県のページが正式な案内です。',
    inLanguage: 'ja-JP',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#localbusiness` },
    mainEntity: { '@id': `${HOME_URL}#service-areas` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#national-lead'],
    },
  };

  return [organization, localBusiness, website, areaList, webPage];
}

export const NATIONAL_PRICE_ROWS = [
  {
    label: '座席1脚（1シート）',
    value: `${CAR_PRICING.seatSingleBasic.toLocaleString('ja-JP')}円〜`,
  },
  {
    label: '軽自動車・基本洗浄',
    value: `${CAR_PRICING.lightBasic.toLocaleString('ja-JP')}円〜`,
  },
  {
    label: '軽自動車・消臭セット',
    value: `${CAR_PRICING.lightDeodorize.toLocaleString('ja-JP')}円〜`,
  },
  {
    label: '普通車・基本洗浄',
    value: `${CAR_PRICING.regularBasic.toLocaleString('ja-JP')}円〜`,
  },
  {
    label: '普通車・消臭セット',
    value: `${CAR_PRICING.regularDeodorize.toLocaleString('ja-JP')}円〜`,
  },
  {
    label: '大型車・ミニバン・基本洗浄',
    value: `${CAR_PRICING.largeBasic.toLocaleString('ja-JP')}円〜`,
  },
  {
    label: 'トラック 2tキャビン',
    value: `${TRUCK_PRICING.ton2Cab.toLocaleString('ja-JP')}円〜`,
  },
] as const;

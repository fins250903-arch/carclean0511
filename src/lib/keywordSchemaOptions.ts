import type { AdKeywordPageDef } from '@/data/adKeywordPages';
import type { Metadata } from '@/lib/seo';
import { buildMobileInteriorCleaningDefinition } from '@/lib/structuredDataConstants';

type AdKeywordSchemaInput = {
  kwSlug: string;
  kw: AdKeywordPageDef;
  regionName: string;
  displayName: string;
  metadata: Metadata;
};

/** キーワードLPごとの JSON-LD オプション（出張 車内 清掃 LP など） */
export function buildAdKeywordJsonLdOptions({
  kwSlug,
  kw,
  regionName,
  displayName,
  metadata,
}: AdKeywordSchemaInput) {
  const isShutchou = kwSlug === 'shutchou-senmon';
  const serviceDefinition = isShutchou
    ? buildMobileInteriorCleaningDefinition(regionName)
    : kw.seoDescription(regionName);

  return {
    adKeywordSchema: {
      webPageName: metadata.title!,
      webPageDescription: metadata.description!,
      heroImagePath: kw.fvImage,
    },
    serviceName: isShutchou
      ? `${displayName}の出張 車内 清掃`
      : `${displayName}の${kw.seoTitle}`,
    serviceType: isShutchou ? '出張 車内 清掃' : kw.seoTitle,
    serviceAlternateNames: isShutchou
      ? [
          '出張車内清掃',
          '出張 車内 クリーニング',
          '車内クリーニング 出張',
          '車内清掃 出張',
        ]
      : [kw.seoTitle, '車内クリーニング', '車内清掃'],
    serviceDescription: serviceDefinition,
  };
}

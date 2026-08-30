/**
 * Keyword LP slugs that should emit `noindex, follow`.
 *
 * IMPORTANT: Do NOT put Google Ads Final URL slugs here.
 * Pages with `noindex` are often flagged in Google Ads as
 * 「機能していないリンク先」(destination not working), even when HTTP 200.
 *
 * Previously listed (removed for Ads compatibility):
 * interior-cleaning, specialist-cleaning, mobile-cleaning,
 * seat-washing, seat-senjo, seat-cleaning, shutchou-senmon, dengen-fuyou
 *
 * Organic duplicate-content control for those Ads LPs should rely on
 * canonical / content differentiation, not noindex on the Ads destination.
 */
export const NOINDEX_KEYWORD_SLUGS = [] as const;

export type NoindexKeywordSlug = (typeof NOINDEX_KEYWORD_SLUGS)[number];

const NOINDEX_SLUG_SET = new Set<string>(NOINDEX_KEYWORD_SLUGS);

export function isNoindexKeywordSlug(slug: string): boolean {
  return NOINDEX_SLUG_SET.has(slug);
}

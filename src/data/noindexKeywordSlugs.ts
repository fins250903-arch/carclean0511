/**
 * 普通車向け・一般車内清掃の広告サブLP（重複コンテンツ対策）
 * 対象スラッグのみ noindex, follow を付与する。
 * @see 地域メインLP・専門トラブルLP・トラック/バスは対象外
 */
export const NOINDEX_KEYWORD_SLUGS = [
  'interior-cleaning',
  'specialist-cleaning',
  'mobile-cleaning',
  'seat-washing',
  'seat-senjo',
  'seat-cleaning',
  'shutchou-senmon',
  'dengen-fuyou',
] as const;

export type NoindexKeywordSlug = (typeof NOINDEX_KEYWORD_SLUGS)[number];

const NOINDEX_SLUG_SET = new Set<string>(NOINDEX_KEYWORD_SLUGS);

export function isNoindexKeywordSlug(slug: string): boolean {
  return NOINDEX_SLUG_SET.has(slug);
}

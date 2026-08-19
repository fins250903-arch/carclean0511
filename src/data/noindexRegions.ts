/**
 * Region LPs temporarily excluded from Google Search.
 *
 * Pages matching these region IDs emit `noindex, follow` and are omitted
 * from the sitemap. Google must still be allowed to crawl them (do not
 * Disallow in robots.txt) so it can see noindex and drop the URLs.
 *
 * To restore indexing, remove the region id from this list.
 *
 * Note: Google Ads may flag noindexed Final URLs as
 * 「機能していないリンク先」. This list is for organic Search only.
 */
export const NOINDEX_REGION_IDS = ['kumamoto'] as const;

export type NoindexRegionId = (typeof NOINDEX_REGION_IDS)[number];

const NOINDEX_REGION_SET = new Set<string>(NOINDEX_REGION_IDS);

const NICHE_SUFFIX = /(?:-truck|-bus)$/;

export function baseRegionId(regionIdOrParam: string): string {
  return regionIdOrParam.replace(NICHE_SUFFIX, '');
}

export function isNoindexRegionId(regionIdOrParam: string): boolean {
  return NOINDEX_REGION_SET.has(baseRegionId(regionIdOrParam));
}

/** Match `/regions/{id}/`, `/regions/{id}-truck/`, `/regions/{id}-bus/`, and nested LPs. */
const NOINDEX_REGION_PATH = new RegExp(
  `^/regions/(?:${NOINDEX_REGION_IDS.join('|')})(?:-truck|-bus)?(?:/|$)`,
);

export function isNoindexRegionPathname(pathnameOrUrl: string): boolean {
  if (NOINDEX_REGION_IDS.length === 0) return false;
  const pathname = pathnameOrUrl.includes('://')
    ? new URL(pathnameOrUrl).pathname
    : pathnameOrUrl;
  return NOINDEX_REGION_PATH.test(pathname);
}

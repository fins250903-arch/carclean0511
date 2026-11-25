import { AD_KEYWORD_PAGES, getAdKeywordPage, resolveAdField } from '../data/adKeywordPages.ts';
import { loadRedirectSources } from './sitemapPolicy.ts';

/**
 * Concern links previously printed on every keyword LP, including slugs that
 * exist only in some prefectures. Missing slugs fall back to another live
 * page for the same concern, then the link is omitted.
 */
export const MUTUAL_CONCERN_SLUGS = [
  'vomit-cleaning',
  'gero-cleaning',
  'omorashi',
  'pet-hair-odor',
  'unko',
  'seat-washing',
  'tobacco-odor',
  'chuko-tabako',
  'touyu-kobosi',
  'pet-nioi',
  'pet-ke',
  'pet-waste',
] as const;

/**
 * Same-concern substitutes, preferred first.
 * Osaka: gero-cleaning → vomit-cleaning, pet-hair-odor → pet-ke,
 * pet-waste → pet-unko, seat-washing → seat-senjo, tobacco-odor → tabako-yani.
 */
export const CONCERN_SUBSTITUTES: Record<string, readonly string[]> = {
  'vomit-cleaning': ['gero-cleaning', 'kyuto-cleaning'],
  'gero-cleaning': ['vomit-cleaning', 'kyuto-cleaning'],
  omorashi: ['oshikko'],
  'pet-hair-odor': ['pet-ke'],
  'pet-ke': ['pet-hair-odor'],
  unko: ['pet-unko', 'pet-waste'],
  'pet-waste': ['pet-unko', 'unko'],
  'seat-washing': ['seat-senjo'],
  'tobacco-odor': ['tabako-yani'],
  'chuko-tabako': ['tabako-yani', 'tobacco-odor'],
  'touyu-kobosi': [],
  'pet-nioi': ['pet-ke', 'pet-hair-odor'],
};

export type KeywordMutualLink = {
  slug: string;
  name: string;
  href: string;
};

export function keywordPageIsGenerated(regionId: string, slug: string): boolean {
  const page = getAdKeywordPage(slug);
  if (!page) return false;
  if (page.targetRegionIds && !page.targetRegionIds.includes(regionId)) return false;
  return true;
}

export function keywordPageIsLinkable(
  regionId: string,
  slug: string,
  redirectSources: Set<string>,
): boolean {
  if (!keywordPageIsGenerated(regionId, slug)) return false;
  return !redirectSources.has(`/regions/${regionId}/${slug}/`);
}

export function resolveConcernSlug(
  regionId: string,
  slug: string,
  redirectSources: Set<string>,
): string | undefined {
  if (keywordPageIsLinkable(regionId, slug, redirectSources)) return slug;
  for (const candidate of CONCERN_SUBSTITUTES[slug] ?? []) {
    if (keywordPageIsLinkable(regionId, candidate, redirectSources)) return candidate;
  }
  return undefined;
}

function displayName(slug: string, regionName: string): string {
  const page = getAdKeywordPage(slug);
  if (!page) return slug;
  return resolveAdField(page.seoTitle, regionName)
    .replace(/｜車内清掃 特急便/g, '')
    .replace(/｜.+/g, '');
}

export function listKeywordMutualLinks(
  regionId: string,
  regionName: string,
  redirectSources: Set<string> = loadRedirectSources(),
): KeywordMutualLink[] {
  const links: KeywordMutualLink[] = [];
  const seen = new Set<string>();

  for (const slug of MUTUAL_CONCERN_SLUGS) {
    if (!AD_KEYWORD_PAGES.some((page) => page.slug === slug)) continue;
    const resolved = resolveConcernSlug(regionId, slug, redirectSources);
    if (!resolved) continue;
    const href = `/regions/${regionId}/${resolved}/`;
    if (seen.has(href)) continue;
    seen.add(href);
    links.push({ slug: resolved, name: displayName(resolved, regionName), href });
  }

  return links;
}

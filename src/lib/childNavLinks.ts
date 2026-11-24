import { getAdKeywordPage, resolveAdField } from '../data/adKeywordPages.ts';
import { osakaSubRegions } from '../data/regionCustomization.ts';
import { findRegionSubarea, getRegionSubareas } from '../data/regionSubareas.ts';
import { PREFECTURE_SEO_FACTS } from '../data/prefecturePageMeta.ts';
import { regions } from '../data/regions.ts';
import { filterIndexableRegions } from '../data/noindexRegions.ts';
import type { ServiceNiche } from './niche.ts';
import { regionPath } from './niche.ts';
import { loadRedirectSources } from './sitemapPolicy.ts';

export type NavLink = {
  href: string;
  label: string;
  slug?: string;
};

/** One live page per concern. First slug that exists and is not a 301 wins. */
const CONCERN_CHOICES: readonly { label: string; slugs: readonly string[] }[] = [
  { label: 'エアコンのにおい', slugs: ['ac-nioi'] },
  { label: '汗・加齢臭', slugs: ['kareisyu'] },
  { label: 'タバコ', slugs: ['tabako-yani', 'tobacco-odor'] },
  { label: '嘔吐', slugs: ['vomit-cleaning', 'kyuto-cleaning'] },
  { label: '車内のにおい', slugs: ['odor-removal', 'kuruma-nioi-keshi'] },
  { label: '尿', slugs: ['oshikko', 'omorashi'] },
  { label: 'ペットのにおい', slugs: ['pet-nioi'] },
  { label: 'うんち', slugs: ['pet-unko', 'pet-waste'] },
  { label: 'シート', slugs: ['seat-senjo', 'seat-washing'] },
  { label: 'カビ臭', slugs: ['mold-odor', 'shanai-nioi'] },
  { label: '灯油', slugs: ['touyu-kobosi'] },
];

/**
 * Area pages to keep as their own pages. Other area pages under these
 * prefectures are scheduled to redirect, so they are not linked.
 */
const FOCUS_AREA_IDS: Record<string, readonly string[]> = {
  osaka: ['osaka-city', 'kitasen', 'senshu'],
  hyogo: ['kobe', 'hanshin'],
  fukuoka: ['fukuoka-city', 'kitakyushu', 'chikugo'],
  miyagi: [],
};

export const FEATURED_REGION_IDS = ['osaka', 'hyogo', 'fukuoka', 'miyagi'] as const;

export function withTrailingSlash(path: string): string {
  if (!path || path === '/') return path;
  const hash = path.indexOf('#');
  const query = path.indexOf('?');
  const cut = [hash, query].filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? path.length;
  const pathname = path.slice(0, cut);
  const rest = path.slice(cut);
  if (pathname.endsWith('/')) return path;
  return `${pathname}/${rest}`;
}

export function parentRegionHref(baseId: string, niche: ServiceNiche = 'car'): string {
  return withTrailingSlash(regionPath(baseId, niche));
}

function keywordIsLive(regionId: string, slug: string, redirectSources: Set<string>): boolean {
  const page = getAdKeywordPage(slug);
  if (!page) return false;
  if (page.targetRegionIds && !page.targetRegionIds.includes(regionId)) return false;
  return !redirectSources.has(`/regions/${regionId}/${slug}/`);
}

function areaRecord(regionId: string, subareaId: string) {
  if (regionId === 'osaka') return osakaSubRegions.find((sub) => sub.id === subareaId);
  return findRegionSubarea(regionId, subareaId);
}

function areaHref(regionId: string, subareaId: string): string {
  if (regionId === 'osaka') return `/regions/osaka/${subareaId}/`;
  return `/regions/${regionId}/area/${subareaId}/`;
}

export function areaLinksFor(regionId: string): NavLink[] {
  const ids =
    regionId in FOCUS_AREA_IDS
      ? FOCUS_AREA_IDS[regionId]
      : getRegionSubareas(regionId).map((sub) => sub.id);

  const links: NavLink[] = [];
  for (const id of ids) {
    const sub = areaRecord(regionId, id);
    if (!sub) continue;
    links.push({
      href: areaHref(regionId, id),
      label: sub.displayName,
      slug: id,
    });
  }
  return links;
}

export function concernLinksFor(
  regionId: string,
  regionName: string,
  redirectSources: Set<string> = loadRedirectSources(),
): NavLink[] {
  const links: NavLink[] = [];
  for (const choice of CONCERN_CHOICES) {
    const slug = choice.slugs.find((candidate) => keywordIsLive(regionId, candidate, redirectSources));
    if (!slug) continue;
    const page = getAdKeywordPage(slug);
    const label = page
      ? resolveAdField(page.seoTitle, regionName).replace(/｜.+$/g, '')
      : choice.label;
    links.push({
      href: `/regions/${regionId}/${slug}/`,
      label,
      slug,
    });
  }
  return links;
}

export function childNavFor(regionId: string, regionName: string) {
  return {
    areas: areaLinksFor(regionId),
    concerns: concernLinksFor(regionId, regionName),
  };
}

export type NationalAreaLink = {
  href: string;
  name: string;
  cities?: string;
};

export function nationalAreaIndex(): { featured: NationalAreaLink[]; others: NationalAreaLink[] } {
  const featured = FEATURED_REGION_IDS.map((id) => {
    const region = regions.find((item) => item.id === id);
    const facts = PREFECTURE_SEO_FACTS.find((item) => item.id === id);
    return {
      href: `/regions/${id}/`,
      name: region?.name ?? id,
      cities: facts?.cities.join('・'),
    };
  });
  const featuredSet = new Set<string>(FEATURED_REGION_IDS);
  const others = filterIndexableRegions(regions)
    .filter((region) => !featuredSet.has(region.id))
    .map((region) => ({ href: `/regions/${region.id}/`, name: region.name }));
  return { featured, others };
}

import { getAdKeywordPage } from '@/data/adKeywordPages';
import { LPO_SLUG_REDIRECTS } from '@/data/lpAdPages';

/** Prefectures whose near-duplicate child pages are consolidated. */
export const FOCUS_REGION_IDS = ['osaka', 'hyogo', 'fukuoka', 'miyagi'] as const;

export type FocusRegionId = (typeof FOCUS_REGION_IDS)[number];
export type ServiceNiche = 'car' | 'truck' | 'bus';

type ConcernKey =
  | 'ac'
  | 'body'
  | 'tobacco'
  | 'vomit'
  | 'odor'
  | 'urine'
  | 'pet'
  | 'poop'
  | 'seat'
  | 'mold'
  | 'kerosene';

/**
 * Area ids that already exist in regionCustomization / regionSubareas.
 * Car pages in KEPT_AREA_IDS stay. Every other car area here 301s to the
 * prefecture page. Truck and bus variants of every id 301 to the niche page.
 */
const AREA_IDS: Record<FocusRegionId, readonly string[]> = {
  osaka: ['osaka-city', 'kitasen', 'senshu', 'kitakawachi', 'nakakawachi', 'minamikawachi'],
  hyogo: ['kobe', 'hanshin', 'himeji', 'higashi-harima'],
  fukuoka: ['fukuoka-city', 'kitakyushu', 'chikugo', 'chikuho'],
  miyagi: [],
};

const KEPT_AREA_IDS: Record<FocusRegionId, readonly string[]> = {
  osaka: ['osaka-city', 'kitasen', 'senshu'],
  hyogo: ['kobe', 'hanshin'],
  fukuoka: ['fukuoka-city', 'kitakyushu', 'chikugo'],
  miyagi: [],
};

/** Alias slug -> concern whose representative is the canonical URL. */
const ALIAS_TO_CONCERN: Record<string, ConcernKey> = {
  ase: 'body',
  'chuko-kareisyu': 'body',
  'chuko-tabako': 'tobacco',
  'car-ac-cleaning': 'ac',
  'evaporator-senjo': 'ac',
  'hoken-kyuto': 'vomit',
  'kodomo-kyuto': 'vomit',
  'kuruma-nioitori': 'odor',
  'shanai-shoshu': 'odor',
  omorashi: 'urine',
  'pet-ke': 'pet',
  'pet-hair-odor': 'pet',
  'seat-cleaning': 'seat',
  unko: 'poop',
};

const PARENT_CANONICAL_SLUGS = [
  'interior-cleaning',
  'shutchou-senmon',
  'specialist-cleaning',
  'dengen-fuyou',
] as const;

export type ConsolidationRedirect = { from: string; to: string };

function isFocus(regionId: string): regionId is FocusRegionId {
  return (FOCUS_REGION_IDS as readonly string[]).includes(regionId);
}

export function concernRepresentative(regionId: string, concern: ConcernKey): string {
  switch (concern) {
    case 'ac':
      return 'ac-nioi';
    case 'body':
      return 'kareisyu';
    case 'tobacco':
      return 'tabako-yani';
    case 'vomit':
      return regionId === 'miyagi' ? 'kyuto-cleaning' : 'vomit-cleaning';
    case 'odor':
      return regionId === 'osaka' ? 'odor-removal' : 'kuruma-nioi-keshi';
    case 'urine':
      return regionId === 'hyogo' ? 'omorashi' : 'oshikko';
    case 'pet':
      return 'pet-nioi';
    case 'poop':
      return 'pet-unko';
    case 'seat':
      return regionId === 'hyogo' ? 'seat-washing' : 'seat-senjo';
    case 'mold':
      return regionId === 'osaka' ? 'mold-odor' : 'shanai-nioi';
    case 'kerosene':
      return 'touyu-kobosi';
    default: {
      const never: never = concern;
      return never;
    }
  }
}

export function isKeptArea(regionId: string, subareaId: string): boolean {
  if (!isFocus(regionId)) return false;
  return KEPT_AREA_IDS[regionId].includes(subareaId);
}

export function isKeptConcernSlug(regionId: string, slug: string): boolean {
  if (!isFocus(regionId)) return false;
  const keys: ConcernKey[] = [
    'ac',
    'body',
    'tobacco',
    'vomit',
    'odor',
    'urine',
    'pet',
    'poop',
    'seat',
    'mold',
    'kerosene',
  ];
  return keys.some((key) => concernRepresentative(regionId, key) === slug);
}

/** True when this build still emits the keyword HTML (not an existing 301). */
export function keywordPageIsLive(regionId: string, slug: string): boolean {
  const page = getAdKeywordPage(slug);
  if (!page) return false;
  if (page.targetRegionIds && !page.targetRegionIds.includes(regionId)) return false;
  const source = `/regions/${regionId}/${slug}/`;
  if (LPO_SLUG_REDIRECTS.some((rule) => rule.source === source)) return false;
  return true;
}

/**
 * New 301 target for a keyword page. Existing redirects (including Hyogo
 * oshikko -> pet-hair-odor) are intentionally not returned.
 */
export function keywordRedirectTarget(regionId: string, slug: string): string | null {
  if (!isFocus(regionId)) return null;
  if (!keywordPageIsLive(regionId, slug)) return null;
  if (slug === 'ac-kusai') return `/regions/${regionId}/ac-nioi/`;
  if (slug === 'spray-kouka-nai') {
    return `/regions/${regionId}/${concernRepresentative(regionId, 'odor')}/`;
  }
  return null;
}

export function areaPagePath(regionId: string, subareaId: string, niche: ServiceNiche): string {
  const suffix = niche === 'car' ? '' : niche === 'truck' ? '-truck' : '-bus';
  if (regionId === 'osaka') return `/regions/osaka/${subareaId}${suffix}/`;
  return `/regions/${regionId}/area/${subareaId}${suffix}/`;
}

/** New 301 target for an area page. null means the page stays. */
export function areaRedirectTarget(
  regionId: string,
  subareaId: string,
  niche: ServiceNiche,
): string | null {
  if (!isFocus(regionId)) return null;
  if (!AREA_IDS[regionId].includes(subareaId)) return null;
  if (niche === 'car' && KEPT_AREA_IDS[regionId].includes(subareaId)) return null;
  if (niche === 'truck') return `/regions/${regionId}-truck/`;
  if (niche === 'bus') return `/regions/${regionId}-bus/`;
  return `/regions/${regionId}/`;
}

export function consolidationRedirects(): ConsolidationRedirect[] {
  const rules: ConsolidationRedirect[] = [];
  for (const regionId of FOCUS_REGION_IDS) {
    for (const slug of ['ac-kusai', 'spray-kouka-nai']) {
      const to = keywordRedirectTarget(regionId, slug);
      if (to) rules.push({ from: `/regions/${regionId}/${slug}/`, to });
    }
    for (const subareaId of AREA_IDS[regionId]) {
      for (const niche of ['car', 'truck', 'bus'] as const) {
        const to = areaRedirectTarget(regionId, subareaId, niche);
        if (!to) continue;
        rules.push({ from: areaPagePath(regionId, subareaId, niche), to });
      }
    }
  }
  return rules;
}

/**
 * Canonical path for a page that stays live (Google Ads final URL).
 * null when the page is the representative, already 301s, or is not generated.
 */
export function keywordCanonicalPath(regionId: string, slug: string): string | null {
  if (!isFocus(regionId)) return null;
  if (keywordRedirectTarget(regionId, slug)) return null;
  if (!keywordPageIsLive(regionId, slug)) return null;

  if (slug === 'bus-senmon') return `/regions/${regionId}-bus/`;
  if ((PARENT_CANONICAL_SLUGS as readonly string[]).includes(slug)) {
    return `/regions/${regionId}/`;
  }

  const concern = ALIAS_TO_CONCERN[slug];
  if (!concern) return null;
  const representative = concernRepresentative(regionId, concern);
  if (representative === slug) return null;
  if (!keywordPageIsLive(regionId, representative)) return null;
  return `/regions/${regionId}/${representative}/`;
}

export function canonicalAliasPaths(): { from: string; to: string }[] {
  const aliases = [
    ...Object.keys(ALIAS_TO_CONCERN),
    ...PARENT_CANONICAL_SLUGS,
    'bus-senmon',
  ];
  const rows: { from: string; to: string }[] = [];
  for (const regionId of FOCUS_REGION_IDS) {
    for (const slug of aliases) {
      const to = keywordCanonicalPath(regionId, slug);
      if (!to) continue;
      rows.push({ from: `/regions/${regionId}/${slug}/`, to });
    }
  }
  return rows;
}

/** Sitemap filter: drop alias pages that stay live with a different canonical. */
export function isCanonicalAliasUrl(pageUrl: string): boolean {
  let pathname = pageUrl;
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      return false;
    }
  }
  const match = pathname.match(/^\/regions\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return false;
  return keywordCanonicalPath(match[1], match[2]) !== null;
}

/**
 * Planned alias pages that this repo does not generate for that prefecture.
 * Callers list these instead of inventing a URL.
 */
export function skippedCanonicalPages(): { regionId: string; slug: string }[] {
  const aliases = [...Object.keys(ALIAS_TO_CONCERN), ...PARENT_CANONICAL_SLUGS, 'bus-senmon'];
  const skipped: { regionId: string; slug: string }[] = [];
  for (const regionId of FOCUS_REGION_IDS) {
    for (const slug of aliases) {
      if (keywordCanonicalPath(regionId, slug)) continue;
      if (keywordRedirectTarget(regionId, slug)) continue;
      if (isKeptConcernSlug(regionId, slug)) continue;
      const page = getAdKeywordPage(slug);
      if (!page) {
        skipped.push({ regionId, slug });
        continue;
      }
      if (page.targetRegionIds && !page.targetRegionIds.includes(regionId)) {
        skipped.push({ regionId, slug });
      }
    }
  }
  return skipped;
}

import { regions } from '@/data/regions';
import { regionAreaData } from '@/data/regionAreaData';

/**
 * Resolve the region (prefecture LP) a blog post belongs to.
 *
 * Legacy CMS posts carry explicit `categories`, but posts created through the
 * current Decap workflow often only have `areaName` / a bracketed title, so the
 * region has to be inferred from those strings as well.
 */

const REGION_ID_BY_NAME = new Map(regions.map((r) => [r.name, r.id]));

/** Region ids sorted so that longer prefecture names match first */
const PREFECTURE_NAMES = [...REGION_ID_BY_NAME.keys()].sort(
  (a, b) => b.length - a.length,
);

/** Place names written without a 県/府/都/市 suffix in titles */
const PREFECTURE_ALIASES: Record<string, string> = {
  沖縄本島: 'okinawa',
  名古屋: 'aichi',
  北九州: 'fukuoka',
  博多: 'fukuoka',
  横浜: 'kanagawa',
  神戸: 'hyogo',
  姫路: 'hyogo',
  仙台: 'miyagi',
  那覇: 'okinawa',
  宇都宮: 'tochigi',
};

/** Bare ward names are ambiguous across prefectures, so require 3+ characters */
const MIN_CITY_NAME_LENGTH = 3;

const AMBIGUOUS = Symbol('ambiguous');

function buildCityIndex(): Map<string, string> {
  const index = new Map<string, string | typeof AMBIGUOUS>();

  const add = (name: string, regionId: string) => {
    const cleaned = name.trim();
    if (cleaned.length < MIN_CITY_NAME_LENGTH) return;
    const current = index.get(cleaned);
    if (current === undefined) {
      index.set(cleaned, regionId);
      return;
    }
    if (current !== regionId) index.set(cleaned, AMBIGUOUS);
  };

  for (const [prefecture, config] of Object.entries(regionAreaData)) {
    const regionId = REGION_ID_BY_NAME.get(prefecture);
    if (!regionId) continue;

    for (const group of config.areas) {
      for (const entry of group.cities) {
        // e.g. 「名古屋市（千種区・東区・…）」 → 名古屋市 + 名古屋市千種区 + …
        const [base, wardPart] = entry.split('（');
        const city = base.trim();
        add(city, regionId);
        if (!wardPart) continue;
        for (const ward of wardPart.replace('）', '').split('・')) {
          add(`${city}${ward.trim()}`, regionId);
        }
      }
    }
  }

  const resolved = new Map<string, string>();
  for (const [name, regionId] of index) {
    if (regionId !== AMBIGUOUS) resolved.set(name, regionId);
  }
  return resolved;
}

const CITY_INDEX = buildCityIndex();

/** Longest-first so 「大阪市中央区」 wins over 「中央区」 */
const CITY_NAMES = [...CITY_INDEX.keys()].sort((a, b) => b.length - a.length);

/** Legacy CMS category slugs → canonical region id (regions.ts) */
const REGION_CATEGORY_ALIASES: Record<string, string> = {
  oosaka: 'osaka',
  toukyou: 'tokyo',
  kyouto: 'kyoto',
  hyougo: 'hyogo',
  siga: 'shiga',
  sizuoka: 'shizuoka',
};

const REGION_ID_SET = new Set(regions.map((r) => r.id));

/** Non-region taxonomy tags (jisseki, tokublo, seisou, …) resolve to null */
export function normalizeRegionCategory(category: string): string | null {
  const key = category.trim().toLowerCase();
  const resolved = REGION_CATEGORY_ALIASES[key] ?? key;
  return REGION_ID_SET.has(resolved) ? resolved : null;
}

/** Strip whitespace so 「埼玉県　川越市」 matches 「埼玉県」 */
function normalizeLocationText(...values: (string | undefined)[]): string {
  return values
    .filter(Boolean)
    .join(' ')
    .replace(/[\s\u3000]+/g, '');
}

function resolveFromText(text: string): string | null {
  for (const prefecture of PREFECTURE_NAMES) {
    if (text.includes(prefecture)) return REGION_ID_BY_NAME.get(prefecture)!;
  }
  for (const [alias, regionId] of Object.entries(PREFECTURE_ALIASES)) {
    if (text.includes(alias)) return regionId;
  }
  for (const city of CITY_NAMES) {
    if (text.includes(city)) return CITY_INDEX.get(city)!;
  }
  return null;
}

export type RegionResolvablePost = {
  data: {
    title: string;
    areaName?: string;
    categories?: string[];
  };
};

/**
 * Region ids for a post: explicit categories first, then the area / title text.
 * A post can belong to several regions when categories say so.
 */
export function resolvePostRegionIds(post: RegionResolvablePost): string[] {
  const ids = new Set<string>();

  for (const category of post.data.categories ?? []) {
    const regionId = normalizeRegionCategory(category);
    if (regionId) ids.add(regionId);
  }
  if (ids.size > 0) return [...ids];

  const inferred = resolveFromText(
    normalizeLocationText(post.data.areaName, post.data.title),
  );
  return inferred ? [inferred] : [];
}

export function getRegionNameById(regionId: string): string | undefined {
  return regions.find((r) => r.id === regionId)?.name;
}

export function getRegionIdByName(regionName: string): string | undefined {
  return REGION_ID_BY_NAME.get(regionName);
}

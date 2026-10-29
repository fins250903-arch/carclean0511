import { regions } from '@/data/regions';
import { canonicalUrl } from '@/lib/site';

export type NationalServiceArea = {
  id: string;
  name: string;
  /** Absolute URL of the prefecture's main LP. That page stays canonical. */
  url: string;
  path: string;
};

export type NationalServiceAreaGroup = {
  label: string;
  areas: NationalServiceArea[];
};

/**
 * Display order for the national top. Every id must exist in `regions`.
 * Ids added to `regions` later and missing here still appear under その他.
 */
const SERVICE_AREA_GROUPS: { label: string; ids: string[] }[] = [
  {
    label: '関東',
    ids: ['tokyo', 'kanagawa', 'chiba', 'saitama', 'ibaraki', 'tochigi', 'gunma'],
  },
  { label: '中部', ids: ['aichi', 'shizuoka', 'gifu', 'mie'] },
  {
    label: '関西',
    ids: ['osaka', 'hyogo', 'kyoto', 'nara', 'shiga', 'wakayama'],
  },
  { label: '中国・北陸', ids: ['yamaguchi', 'fukui'] },
  { label: '九州・沖縄', ids: ['fukuoka', 'saga', 'kumamoto', 'okinawa'] },
  { label: '東北', ids: ['miyagi'] },
];

/** Prefectures that have a main LP at `/regions/{id}/`. */
export function listNationalServiceAreaGroups(): NationalServiceAreaGroup[] {
  const byId = new Map(regions.map((region) => [region.id, region]));
  const used = new Set<string>();

  const groups: NationalServiceAreaGroup[] = SERVICE_AREA_GROUPS.map((group) => {
    const areas: NationalServiceArea[] = [];
    for (const id of group.ids) {
      const region = byId.get(id);
      if (!region) continue;
      used.add(id);
      const path = `/regions/${region.id}/`;
      areas.push({
        id: region.id,
        name: region.name,
        path,
        url: canonicalUrl(path),
      });
    }
    return { label: group.label, areas };
  }).filter((group) => group.areas.length > 0);

  const rest: NationalServiceArea[] = regions
    .filter((region) => !used.has(region.id))
    .map((region) => {
      const path = `/regions/${region.id}/`;
      return {
        id: region.id,
        name: region.name,
        path,
        url: canonicalUrl(path),
      };
    });

  if (rest.length > 0) groups.push({ label: 'その他', areas: rest });
  return groups;
}

export function listNationalServiceAreas(): NationalServiceArea[] {
  return listNationalServiceAreaGroups().flatMap((group) => group.areas);
}

/**
 * FV background assignment for keyword / Osaka subarea / other-region area LPs.
 * Main regional car LPs keep `FV_PASSENGER_HERO` via Hero niche default (do not override).
 */
import { KW_IMAGES } from '@/lib/assets513';

/** Shared car FV pool — never use FV_PASSENGER_HERO here */
export const SUBAREA_CAR_FV_POOL = [
  KW_IMAGES.rinserWork,
  KW_IMAGES.steam,
  KW_IMAGES.sienta3After,
  KW_IMAGES.seatStainDark,
  KW_IMAGES.vomitStain,
  KW_IMAGES.minivanInterior,
  KW_IMAGES.petMess,
  KW_IMAGES.sienta3Before,
  KW_IMAGES.rinser,
  KW_IMAGES.vomitDetail,
] as const;

export const SUBAREA_TRUCK_FV_POOL = [
  '/images/truck-fv.png',
  '/images/truck-cabin-dirty.png',
  '/images/cases/truck_10t_cabin.png',
] as const;

export const SUBAREA_BUS_FV_POOL = [
  KW_IMAGES.busFv,
  '/images/cases/dumpcar_cleaning.png',
] as const;

function pickFromPool(pool: readonly string[], key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length]!;
}

/** Osaka subarea car FV — distinct from regional passenger hero and from each other */
export const OSAKA_SUBAREA_CAR_FV: Record<string, string> = {
  'osaka-city': KW_IMAGES.rinserWork,
  kitasen: KW_IMAGES.steam,
  kitakawachi: KW_IMAGES.sienta3After,
  nakakawachi: KW_IMAGES.seatStainDark,
  minamikawachi: KW_IMAGES.minivanInterior,
  senshu: KW_IMAGES.petMess,
};

/** Osaka subarea truck FV — vary vs regional truck-fv.png */
export const OSAKA_SUBAREA_TRUCK_FV: Record<string, string> = {
  'osaka-city': '/images/truck-fv.png',
  kitasen: '/images/truck-cabin-dirty.png',
  kitakawachi: '/images/cases/truck_10t_cabin.png',
  nakakawachi: '/images/truck-fv.png',
  minamikawachi: '/images/truck-cabin-dirty.png',
  senshu: '/images/cases/truck_10t_cabin.png',
};

/** Osaka subarea bus FV */
export const OSAKA_SUBAREA_BUS_FV: Record<string, string> = {
  'osaka-city': KW_IMAGES.busFv,
  kitasen: '/images/cases/dumpcar_cleaning.png',
  kitakawachi: KW_IMAGES.busFv,
  nakakawachi: '/images/cases/dumpcar_cleaning.png',
  minamikawachi: KW_IMAGES.busFv,
  senshu: '/images/cases/dumpcar_cleaning.png',
};

export function getOsakaSubareaFvImage(
  subareaId: string,
  niche: 'car' | 'truck' | 'bus',
): string | undefined {
  if (niche === 'truck') return OSAKA_SUBAREA_TRUCK_FV[subareaId];
  if (niche === 'bus') return OSAKA_SUBAREA_BUS_FV[subareaId];
  return OSAKA_SUBAREA_CAR_FV[subareaId];
}

/** Any region subarea (Osaka or /area/ routes) */
export function getRegionSubareaFvImage(
  regionId: string,
  subareaId: string,
  niche: 'car' | 'truck' | 'bus',
): string {
  if (regionId === 'osaka') {
    return getOsakaSubareaFvImage(subareaId, niche) ?? pickFromPool(SUBAREA_CAR_FV_POOL, `${regionId}/${subareaId}`);
  }
  const key = `${regionId}/${subareaId}/${niche}`;
  if (niche === 'truck') return pickFromPool(SUBAREA_TRUCK_FV_POOL, key);
  if (niche === 'bus') return pickFromPool(SUBAREA_BUS_FV_POOL, key);
  return pickFromPool(SUBAREA_CAR_FV_POOL, key);
}

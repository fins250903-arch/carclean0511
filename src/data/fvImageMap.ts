/**
 * FV background assignment for keyword / Osaka subarea / vehicle LPs.
 * Main regional car LPs keep `FV_PASSENGER_HERO` via Hero niche default (do not override).
 */
import { KW_IMAGES } from '@/lib/assets513';

/** Osaka subarea car FV — distinct from regional passenger hero and from each other */
export const OSAKA_SUBAREA_CAR_FV: Record<string, string> = {
  'osaka-city': KW_IMAGES.rinserWork,
  kitasen: KW_IMAGES.steam,
  kitakawachi: KW_IMAGES.sienta3After,
  nakakawachi: KW_IMAGES.seatStainDark,
  minamikawachi: KW_IMAGES.vomitStain,
  senshu: KW_IMAGES.minivanInterior,
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

/** Osaka subarea bus FV — keep bus hero but rotate with dump/cabin for visual variety where appropriate */
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

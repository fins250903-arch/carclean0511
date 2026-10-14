import type { ServiceNiche } from './niche';

/** Phase 2 rollout: car LPs in these prefectures only. */
export const CHAT_CTA_PHASE2_REGION_IDS = ['osaka', 'fukuoka', 'miyagi'] as const;

export type ChatCtaPhase2RegionId = (typeof CHAT_CTA_PHASE2_REGION_IDS)[number];

export function showChatCta(regionId: string | undefined, niche: ServiceNiche = 'car'): boolean {
  if (niche !== 'car' || !regionId) return false;
  return (CHAT_CTA_PHASE2_REGION_IDS as readonly string[]).includes(regionId);
}

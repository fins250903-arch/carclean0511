/** 出張車内クリーニング LP の車種ニッチ（デッドニング等は対象外） */
export type ServiceNiche = 'car' | 'truck' | 'bus';

export function nicheFlags(niche: ServiceNiche = 'car') {
  return {
    niche,
    isCar: niche === 'car',
    isTruck: niche === 'truck',
    isBus: niche === 'bus',
  };
}

export function regionSlugFromParam(param: string): { baseId: string; niche: ServiceNiche } {
  if (param.endsWith('-truck')) {
    return { baseId: param.replace(/-truck$/, ''), niche: 'truck' };
  }
  if (param.endsWith('-bus')) {
    return { baseId: param.replace(/-bus$/, ''), niche: 'bus' };
  }
  return { baseId: param, niche: 'car' };
}

export function regionPath(baseId: string, niche: ServiceNiche): string {
  if (niche === 'truck') return `/regions/${baseId}-truck`;
  if (niche === 'bus') return `/regions/${baseId}-bus`;
  return `/regions/${baseId}`;
}

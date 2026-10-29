/**
 * Every region uses the same power rule:
 * external power can be brought for an extra fee, and work is possible
 * where there is no outlet. A site outlet may still be used when one exists.
 * Do not say power is always included, or that the customer's outlet is never used.
 *
 * needsPowerBringIn stays exported because Pricing and other callers depend on it.
 * It is true for every region.
 */

const OUTLET_BORROW_REGION_NAMES = new Set(['群馬県', '群馬']);

const OUTLET_BORROW_REGION_IDS = new Set(['gunma']);

export const OUTLET_BORROW_SHORT =
  '20ｍ以内での家庭用１００Vコンセントをお借りします';

export const OUTLET_BORROW_WITH_WATER =
  '20ｍ以内での家庭用１００Vコンセントと水道をお借りします';

/** Owner's wording. Same meaning on every region LP and in FAQPage JSON-LD. */
export const EXTERNAL_POWER_SENTENCE =
  '外部電源持込可能（別途費用）。コンセントの無いところでも作業可能です。';

export const GENERATOR_NO_OUTLET_SENTENCE = EXTERNAL_POWER_SENTENCE;

export const POWER_BRING_IN_PARKING_SENTENCE = EXTERNAL_POWER_SENTENCE;

const GENERATOR_CLAIM_PATTERN =
  /自社車両に高性能発電機を搭載しておりますので、現場での(?:電源確保は不要です|20ｍ以内での家庭用１００Vコンセントをお借りします)[。.]?/g;

function matchesRegion(
  names: Set<string>,
  ids: Set<string>,
  regionNameOrId?: string,
  regionId?: string,
): boolean {
  if (regionId && ids.has(regionId)) return true;
  if (!regionNameOrId) return false;
  if (ids.has(regionNameOrId)) return true;
  return names.has(regionNameOrId);
}

export function needsOutletBorrow(
  regionNameOrId?: string,
  regionId?: string,
): boolean {
  return matchesRegion(
    OUTLET_BORROW_REGION_NAMES,
    OUTLET_BORROW_REGION_IDS,
    regionNameOrId,
    regionId,
  );
}

export function needsPowerBringIn(
  _regionNameOrId?: string,
  _regionId?: string,
): boolean {
  return true;
}

/** Short bullet / highlight line */
export function powerHighlightLine(_regionName?: string, _regionId?: string): string {
  return EXTERNAL_POWER_SENTENCE;
}

/** FAQ / answer-first body fragment */
export function powerCapabilitySentence(_regionName?: string, _regionId?: string): string {
  return EXTERNAL_POWER_SENTENCE;
}

export function powerFaqAnswer(_regionName?: string, _regionId?: string): string {
  return '現場にコンセントがある場合はそちらを使えます。無い場合は外部電源の持込が可能です（別途費用）。コンセントの無いところでも作業可能です。';
}

export function powerFlowDesc(_regionName?: string, _regionId?: string): string {
  return `予定の日時にご自宅や職場へ伺います。${EXTERNAL_POWER_SENTENCE}`;
}

export function powerReasonTitle(_regionName?: string, _regionId?: string): string {
  return '外部電源持込可能（別途費用）';
}

export function powerReasonDesc(_regionName?: string, _regionId?: string): string {
  return 'コンセントが無い場所でも作業できます。外部電源の持込は別途費用です。';
}

export function powerSupplyName(_regionName?: string, _regionId?: string): string {
  return '出張用専用車両（外部電源持込可能・別途費用）';
}

/** Area-coverage reassurance when the region has no custom paragraph. */
export function powerAreaReassurance(_regionName?: string, _regionId?: string): string {
  return `お電話一本で、ご自宅やご指定の場所までプロの機材を積んで伺います。${EXTERNAL_POWER_SENTENCE}`;
}

/**
 * Power condition for the current region only.
 * Region pages must not explain Fukuoka, Okinawa, and Gunma in the same answer.
 */
export function localPowerConditionSentence(_regionName?: string, _regionId?: string): string {
  return EXTERNAL_POWER_SENTENCE;
}

export function sameDayUndergroundParkingAnswer(regionName?: string, regionId?: string): string {
  return `掲載エリア内ならスケジュール次第で最短即日対応が可能です。${localPowerConditionSentence(regionName, regionId)}左右ドアが開くスペースがあれば作業可能。お急ぎの方は電話で空き状況をご確認ください。`;
}

export function mansionUndergroundParkingAnswer(regionName?: string, regionId?: string): string {
  return `はい。駐車スペースがあり、左右のドアが開けられれば施工可能です。${localPowerConditionSentence(regionName, regionId)}詳しくはお電話でご確認ください。`;
}

const CROSS_REGION_POWER_CLAUSES: RegExp[] = [
  /多くのエリアでは発電機・水タンク完備で電源・水道不要です。福岡県・沖縄県は、コンセントが無いマンション駐車場や青空駐車場でも発電機の電源持込（5,000円）で対応します。群馬県では20ｍ以内での家庭用１００Vコンセントをお借りします。/g,
  /多くの地域は発電機・水タンク完備です。福岡県・沖縄県はコンセントが無いマンション駐車場や青空駐車場でも電源持込（5,000円）で対応します。群馬県などは家庭用100Vコンセントの借用です。/g,
  /福岡県・沖縄県は、?コンセントが無いマンション駐車場や青空駐車場でも、?発電機の電源持込（5,000円）で対応します。/g,
  /群馬県では20ｍ以内での家庭用１００Vコンセントをお借りします。/g,
  /群馬県などは家庭用100Vコンセントの借用です。/g,
];

/** Drop other-prefecture power policy from an answer and keep this region's rule. */
export function replaceCrossRegionPowerCopy(
  answer: string,
  regionName?: string,
  regionId?: string,
): string {
  const local = localPowerConditionSentence(regionName, regionId);
  let next = answer;
  for (const pattern of CROSS_REGION_POWER_CLAUSES) {
    next = next.replace(pattern, local);
  }
  const doubled = `${local}${local}`;
  while (next.includes(doubled)) next = next.replace(doubled, local);
  return next;
}

function normalizeGeneratorClaim(answer: string): string {
  return answer.replace(GENERATOR_CLAIM_PATTERN, GENERATOR_NO_OUTLET_SENTENCE);
}

function applyBringInParkingCopy(answer: string): string {
  const softened = answer.replace(
    /電源・水道の確保は不要です[。.]?/g,
    `${EXTERNAL_POWER_SENTENCE}`,
  );
  if (softened.includes('電源持込')) return softened;
  return `${softened}${POWER_BRING_IN_PARKING_SENTENCE}`;
}

type FaqLike = { q: string; a: string };

/**
 * Region-specific FAQ answer used by both the visible FAQ and FAQPage JSON-LD.
 * Generator claims are normalized before any shorter power-phrase replacement.
 */
export function rewriteFaqForRegion<T extends FaqLike>(faq: T, regionName?: string): T {
  const a = normalizeGeneratorClaim(faq.a);

  if (needsPowerBringIn(regionName)) {
    if (faq.q.includes('電源') || faq.q.includes('水道や電源')) {
      return { ...faq, a: powerFaqAnswer(regionName) };
    }
    if (faq.q.includes('マンション') || faq.q.includes('駐車場')) {
      return { ...faq, a: replaceCrossRegionPowerCopy(applyBringInParkingCopy(a), regionName) };
    }
    return { ...faq, a: replaceCrossRegionPowerCopy(a, regionName) };
  }

  if (!needsOutletBorrow(regionName)) {
    return { ...faq, a: replaceCrossRegionPowerCopy(a, regionName) };
  }

  const powerRelated =
    faq.q.includes('電源') ||
    faq.q.includes('マンション') ||
    a.includes('発電機') ||
    a.includes('電源・水道') ||
    a.includes('電源不要');
  if (!powerRelated) return { ...faq, a };
  if (faq.q.includes('電源') || faq.q.includes('水道や電源')) {
    return { ...faq, a: powerFaqAnswer(regionName) };
  }

  // Shorter patterns run only after the full generator sentence is normalized,
  // so they cannot leave 「発電機を搭載…コンセントをお借りします」.
  const rewritten = a
    .replace(/電源・水道の確保は不要です[。.]?/g, `${OUTLET_BORROW_SHORT}。`)
    .replace(/電源確保は不要です[。.]?/g, `${OUTLET_BORROW_SHORT}。`)
    .replace(/当店の出張車両は発電機・水タンクを積載しているため、/g, '')
    .replace(/発電機・水タンク完備のため、/g, '')
    .replace(/電源不要の自社車両で、/g, '');
  return { ...faq, a: replaceCrossRegionPowerCopy(rewritten, regionName) };
}

/**
 * Regional power / outlet policy for LP copy.
 *
 * Gunma: borrow a household 100V outlet within 20m.
 * Fukuoka & Okinawa: the vehicle carries a generator, so apartments and
 * open-air parking are covered by 電源持込 (5,000 yen on the price table).
 * Other regions: generator and water tank on the vehicle; no customer outlet.
 *
 * The apartment-parking FAQ must keep the generator meaning
 * ("コンセントが無くても対応"). A shorter "電源確保は不要です" replacement
 * used to run before the full sentence and splice an outlet-borrow clause
 * onto the generator claim. Normalize that sentence first.
 */

const OUTLET_BORROW_REGION_NAMES = new Set(['群馬県', '群馬']);

const OUTLET_BORROW_REGION_IDS = new Set(['gunma']);

const POWER_BRING_IN_REGION_NAMES = new Set([
  '沖縄県',
  '沖縄',
  '沖縄本島',
  '福岡県',
  '福岡',
]);

const POWER_BRING_IN_REGION_IDS = new Set(['okinawa', 'fukuoka']);

export const OUTLET_BORROW_SHORT =
  '20ｍ以内での家庭用１００Vコンセントをお借りします';

export const OUTLET_BORROW_WITH_WATER =
  '20ｍ以内での家庭用１００Vコンセントと水道をお借りします';

/** Canonical apartment-parking claim. Same meaning on every region LP and in FAQPage JSON-LD. */
export const GENERATOR_NO_OUTLET_SENTENCE =
  '自社車両に高性能発電機を搭載しておりますので、コンセントが無くても対応します。';

export const POWER_BRING_IN_PARKING_SENTENCE =
  'マンションの駐車場や青空駐車場でも、発電機の電源持込（5,000円）で対応します。';

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
  regionNameOrId?: string,
  regionId?: string,
): boolean {
  return matchesRegion(
    POWER_BRING_IN_REGION_NAMES,
    POWER_BRING_IN_REGION_IDS,
    regionNameOrId,
    regionId,
  );
}

/** Short bullet / highlight line */
export function powerHighlightLine(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) {
    return 'マンション・青空駐車場も電源持込で対応';
  }
  return needsOutletBorrow(regionName, regionId)
    ? OUTLET_BORROW_SHORT
    : '電源・水道不要（発電機・水タンク完備）';
}

/** FAQ / answer-first body fragment */
export function powerCapabilitySentence(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) {
    return `${POWER_BRING_IN_PARKING_SENTENCE}水道は現場でお借りする場合があります。`;
  }
  return needsOutletBorrow(regionName, regionId)
    ? `${OUTLET_BORROW_SHORT}（20mの延長コードを持参します）。水道も現場でお借りする場合があります。`
    : '電源・水道は不要です（発電機・水タンク完備）。';
}

export function powerFaqAnswer(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) {
    return `コンセントが無くても対応できます。${GENERATOR_NO_OUTLET_SENTENCE}${POWER_BRING_IN_PARKING_SENTENCE}水道は現場でお借りする場合があります。左右のドアが開けられるスペースがあれば作業可能です。`;
  }
  if (needsOutletBorrow(regionName, regionId)) {
    return `このエリアでは発電機での施工ではなく、${OUTLET_BORROW_SHORT}。作業場所からコンセントまでおおむね20m以内をご用意ください。水道もお借りする場合があります。左右のドアが開けられるスペースがあれば作業可能です。`;
  }
  return 'いいえ、必要ありません。当店の出張車両には専用の発電機と水タンクを積載しているため、マンションの駐車場や月極駐車場、会社など、車が停められる場所であればどこでも作業可能です。';
}

export function powerFlowDesc(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) {
    return `予定の日時にご自宅や職場へ伺います。${POWER_BRING_IN_PARKING_SENTENCE}`;
  }
  return needsOutletBorrow(regionName, regionId)
    ? `予定の日時にご自宅や職場へ伺います。${OUTLET_BORROW_SHORT}。`
    : '予定の日時にご自宅や職場へ伺います。電源不要の自社車両で、場所を選ばず施工を開始します。';
}

export function powerReasonTitle(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) return '電源持込で場所を選ばない';
  return needsOutletBorrow(regionName, regionId)
    ? '家庭用100Vコンセントをお借りします'
    : '場所を選ばず電源不要';
}

export function powerReasonDesc(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) {
    return `${GENERATOR_NO_OUTLET_SENTENCE}${POWER_BRING_IN_PARKING_SENTENCE}`;
  }
  return needsOutletBorrow(regionName, regionId)
    ? `${OUTLET_BORROW_WITH_WATER}（20mコード持参）。`
    : '発電機を持参しますので、ドアが開けられるスペースがあればどこでも作業可能です。';
}

export function powerSupplyName(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) {
    return '出張用専用車両（発電機の電源持込に対応）';
  }
  return needsOutletBorrow(regionName, regionId)
    ? `出張用専用車両（${OUTLET_BORROW_SHORT}）`
    : '出張用専用車両（電源・水道不要）';
}

/** Area-coverage reassurance when the region has no custom paragraph. */
export function powerAreaReassurance(regionName?: string, regionId?: string): string {
  if (needsPowerBringIn(regionName, regionId)) {
    return `お電話一本で、ご自宅やご指定の場所までプロの機材を積んで伺います。${POWER_BRING_IN_PARKING_SENTENCE}駐車場があれば作業可能です。`;
  }
  if (needsOutletBorrow(regionName, regionId)) {
    return `お電話一本で、ご自宅やご指定の場所までプロの機材を積んで伺います。${OUTLET_BORROW_SHORT}。駐車場があれば作業可能です。`;
  }
  return 'お電話一本で、ご自宅やご指定の場所までプロの機材を積んで伺います。電源不要、水道不要（タンク持参）ですので、駐車場があればどこでも作業可能です。';
}

function normalizeGeneratorClaim(answer: string): string {
  return answer.replace(GENERATOR_CLAIM_PATTERN, GENERATOR_NO_OUTLET_SENTENCE);
}

function applyBringInParkingCopy(answer: string): string {
  const softened = answer.replace(
    /電源・水道の確保は不要です[。.]?/g,
    'コンセントが無い場合は発電機の電源持込（5,000円）で対応します。',
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
      return { ...faq, a: applyBringInParkingCopy(a) };
    }
    return { ...faq, a };
  }

  if (!needsOutletBorrow(regionName)) return { ...faq, a };

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
  return { ...faq, a: rewritten };
}

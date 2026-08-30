/**
 * Regional power / outlet policy for LP copy.
 * Okinawa & Gunma: borrow household 100V within 20m (no 「電源不要」 claims).
 * Fukuoka already used a borrow-power message; keep aligned with the same wording.
 */

const OUTLET_BORROW_REGION_NAMES = new Set([
  '沖縄県',
  '沖縄',
  '沖縄本島',
  '群馬県',
  '群馬',
  '福岡県',
  '福岡',
]);

const OUTLET_BORROW_REGION_IDS = new Set(['okinawa', 'gunma', 'fukuoka']);

export const OUTLET_BORROW_SHORT =
  '20ｍ以内での家庭用１００Vコンセントをお借りします';

export const OUTLET_BORROW_WITH_WATER =
  '20ｍ以内での家庭用１００Vコンセントと水道をお借りします';

export function needsOutletBorrow(
  regionNameOrId?: string,
  regionId?: string,
): boolean {
  if (regionId && OUTLET_BORROW_REGION_IDS.has(regionId)) return true;
  if (!regionNameOrId) return false;
  if (OUTLET_BORROW_REGION_IDS.has(regionNameOrId)) return true;
  return OUTLET_BORROW_REGION_NAMES.has(regionNameOrId);
}

/** Short bullet / highlight line */
export function powerHighlightLine(regionName?: string, regionId?: string): string {
  return needsOutletBorrow(regionName, regionId)
    ? OUTLET_BORROW_SHORT
    : '電源・水道不要（発電機・水タンク完備）';
}

/** FAQ / answer-first body fragment */
export function powerCapabilitySentence(regionName?: string, regionId?: string): string {
  return needsOutletBorrow(regionName, regionId)
    ? `${OUTLET_BORROW_SHORT}（20mの延長コードを持参します）。水道も現場でお借りする場合があります。`
    : '電源・水道は不要です（発電機・水タンク完備）。';
}

export function powerFaqAnswer(regionName?: string, regionId?: string): string {
  if (needsOutletBorrow(regionName, regionId)) {
    return `このエリアでは発電機での施工ではなく、${OUTLET_BORROW_SHORT}。作業場所からコンセントまでおおむね20m以内をご用意ください。水道もお借りする場合があります。左右のドアが開けられるスペースがあれば作業可能です。`;
  }
  return 'いいえ、必要ありません。当店の出張車両には専用の発電機と水タンクを積載しているため、マンションの駐車場や月極駐車場、会社など、車が停められる場所であればどこでも作業可能です。';
}

export function powerFlowDesc(regionName?: string, regionId?: string): string {
  return needsOutletBorrow(regionName, regionId)
    ? `予定の日時にご自宅や職場へ伺います。${OUTLET_BORROW_SHORT}。`
    : '予定の日時にご自宅や職場へ伺います。電源不要の自社車両で、場所を選ばず施工を開始します。';
}

export function powerReasonTitle(regionName?: string, regionId?: string): string {
  return needsOutletBorrow(regionName, regionId)
    ? '家庭用100Vコンセントをお借りします'
    : '場所を選ばず電源不要';
}

export function powerReasonDesc(regionName?: string, regionId?: string): string {
  return needsOutletBorrow(regionName, regionId)
    ? `${OUTLET_BORROW_WITH_WATER}（20mコード持参）。`
    : '発電機を持参しますので、ドアが開けられるスペースがあればどこでも作業可能です。';
}

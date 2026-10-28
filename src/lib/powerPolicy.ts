/**
 * Every service area, including Fukuoka, Okinawa, and Gunma, brings a
 * generator and a water tank. Customers do not lend a household outlet.
 */

/** No region borrows an outlet. The argument is ignored. */
export function needsOutletBorrow(
  _regionNameOrId?: string,
  _regionId?: string,
): boolean {
  return false;
}

/** Short bullet / highlight line */
export function powerHighlightLine(_regionName?: string, _regionId?: string): string {
  return '電源・水道不要（発電機・水タンク完備）';
}

/** FAQ / answer-first body fragment */
export function powerCapabilitySentence(_regionName?: string, _regionId?: string): string {
  return '電源・水道は不要です（発電機・水タンク完備）。';
}

export function powerFaqAnswer(_regionName?: string, _regionId?: string): string {
  return 'いいえ、必要ありません。当店の出張車両には専用の発電機と水タンクを積載しているため、マンションの駐車場や月極駐車場、会社など、車が停められる場所であればどこでも作業可能です。';
}

export function powerFlowDesc(_regionName?: string, _regionId?: string): string {
  return '予定の日時にご自宅や職場へ伺います。電源不要の自社車両で、場所を選ばず施工を開始します。';
}

export function powerReasonTitle(_regionName?: string, _regionId?: string): string {
  return '場所を選ばず電源不要';
}

export function powerReasonDesc(_regionName?: string, _regionId?: string): string {
  return '発電機を持参しますので、ドアが開けられるスペースがあればどこでも作業可能です。';
}

/**
 * External power can be brought to the job for an extra fee.
 * A site outlet may still be used when one is available.
 * Do not say power is always included, or that the customer's outlet is never used.
 * Water supply is not stated here.
 */

/** Kept for older call sites. No region has a special outlet-only rule. */
export function needsOutletBorrow(
  _regionNameOrId?: string,
  _regionId?: string,
): boolean {
  return false;
}

/** Owner's base phrase. */
export const EXTERNAL_POWER_PHRASE =
  '外部電源持込可能（別途費用）、コンセントの無いところでも作業可能です';

/** Same fact as a sentence. */
export const EXTERNAL_POWER_SENTENCE =
  '外部電源持込可能（別途費用）。コンセントの無いところでも作業可能です。';

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

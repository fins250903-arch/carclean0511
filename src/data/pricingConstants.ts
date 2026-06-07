/** Single source for pricing displayed across LP, FAQ, and AIO comparison tables. */
export const CAR_PRICING = {
  lightBasic: 22_000,
  lightDeodorize: 25_000,
  regularBasic: 28_000,
  regularDeodorize: 32_000,
  largeBasic: 36_000,
  largeDeodorize: 41_000,
  seatSingleBasic: 18_000,
  seatSingleDeodorize: 25_000,
  rearSeatBasic: 22_000,
  rearSeatDeodorize: 29_000,
  kerosenePerSeat: 30_000,
} as const;

export function yen(amount: number): string {
  return `${amount.toLocaleString('ja-JP')}円`;
}

/** AIO comparison table — basic wash tier (tax included). */
export function carComparisonPriceSummary(): string {
  return `軽自動車 ${yen(CAR_PRICING.lightBasic)}〜（基本洗浄）／消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜／普通車 ${yen(CAR_PRICING.regularBasic)}〜／座席1脚 ${yen(CAR_PRICING.seatSingleBasic)}〜`;
}

/** FAQ / snippet — clarifies basic vs deodorize set. */
export function carPricingFaqSnippet(): string {
  return `当店は軽自動車基本洗浄${yen(CAR_PRICING.lightBasic)}〜、嘔吐・灯油などの消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（普通車${yen(CAR_PRICING.regularBasic)}〜／消臭セット${yen(CAR_PRICING.regularDeodorize)}〜）。出張費は対応エリア無料です。`;
}

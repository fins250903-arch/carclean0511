/** Single source for pricing displayed across LP, FAQ, and AIO comparison tables. */
export const CAR_PRICING = {
  lightBasic: 24_000,
  lightDeodorize: 26_000,
  regularBasic: 29_000,
  regularDeodorize: 32_000,
  largeBasic: 38_000,
  largeDeodorize: 42_000,
  seatSingleBasic: 18_000,
  seatSingleDeodorize: 25_000,
  rearSeatBasic: 22_000,
  rearSeatDeodorize: 29_000,
  kerosenePerSeat: 30_000,
} as const;

export const TRUCK_PRICING = {
  /** 2t — 車内洗浄のみ（寝台ベッドなし） */
  ton2Cab: 29_000,
  /** 4t */
  ton4Cab: 37_000,
  ton4Bed: 8_000,
  ton4Total: 45_000,
  /** 10t */
  ton10Cab: 39_000,
  ton10Bed: 8_000,
  ton10Total: 47_000,
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

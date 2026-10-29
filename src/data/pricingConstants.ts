/** Single source for pricing displayed across LP, FAQ, and AIO comparison tables. */
export const CAR_PRICING = {
  lightBasic: 24_000,
  lightDeodorize: 26_000,
  regularBasic: 29_000,
  regularDeodorize: 32_000,
  largeBasic: 38_000,
  largeDeodorize: 42_000,
  seatSingleBasic: 18_000,
  seatSingleDeodorize: 23_000,
  rearSeatBasic: 22_000,
  rearSeatDeodorize: 27_000,
  kerosenePerSeat: 30_000,
  /** Optional add-on: simple A/C evaporator mist wash */
  acInternalWash: 10_000,
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

/**
 * Google Ads CTR用の共通価格フック（車LP専用・トラック/バスは使わない）。
 * RSA・FV・QuickFactsで同一文言に揃える。
 */
export function carFvPriceHookMain(): string {
  return `1シート ${yen(CAR_PRICING.seatSingleBasic)}から`;
}

/** Prefectures where the published price does not include travel. */
export const TRAVEL_FEE_EXTRA_REGIONS = [
  '熊本県',
  '福井県',
  '和歌山県',
  '滋賀県',
  '岐阜県',
  '静岡県',
  '佐賀県',
] as const;

export const TRAVEL_FEE_EXTRA_NOTE = '地域により出張費が加算されます。詳細は、お問合せ下さい';

export function isTravelFeeExtra(regionName?: string | null): boolean {
  if (!regionName) return false;
  return TRAVEL_FEE_EXTRA_REGIONS.some((name) => regionName.includes(name));
}

export function travelFeeAreaLabel(displayName: string, regionName?: string): string {
  if (isTravelFeeExtra(regionName ?? displayName)) {
    return `${displayName}は地域により出張費が加算されます`;
  }
  return `${displayName}へ出張費無料`;
}

/** Swap published “travel is free” sentences on the seven extra-fee prefectures. */
export function rewriteTravelFeeText(text: string, regionName?: string): string {
  if (!isTravelFeeExtra(regionName)) return text;
  const note = `${TRAVEL_FEE_EXTRA_NOTE}。`;
  return text
    .replaceAll('出張費は原則無料です。', note)
    .replaceAll('出張費は対応エリア無料です。', note)
    .replaceAll('対応エリアは出張費無料でご案内します。', note);
}

export function carFvPriceHookSub(displayName?: string, regionName?: string): string {
  if (isTravelFeeExtra(regionName ?? displayName)) {
    return `軽自動車 ${yen(CAR_PRICING.lightBasic)}〜｜税込`;
  }
  const area = displayName ? `${displayName}へ出張費エリア無料` : '税込・出張費エリア無料';
  return `軽自動車 ${yen(CAR_PRICING.lightBasic)}〜｜${area}`;
}

/** AIO comparison table — basic wash tier (tax included). Lead with seat hook for Ads/AIO alignment. */
export function carComparisonPriceSummary(): string {
  return `座席1脚（1シート）${yen(CAR_PRICING.seatSingleBasic)}〜／軽自動車 ${yen(CAR_PRICING.lightBasic)}〜（基本洗浄）／消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜／普通車 ${yen(CAR_PRICING.regularBasic)}〜`;
}

/** FAQ / snippet — clarifies basic vs deodorize set. */
export function carPricingFaqSnippet(): string {
  return `当店は座席1脚（1シート）${yen(CAR_PRICING.seatSingleBasic)}〜、軽自動車基本洗浄${yen(CAR_PRICING.lightBasic)}〜、嘔吐・灯油などの消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（普通車${yen(CAR_PRICING.regularBasic)}〜／消臭セット${yen(CAR_PRICING.regularDeodorize)}〜）。出張費は対応エリア無料です。`;
}

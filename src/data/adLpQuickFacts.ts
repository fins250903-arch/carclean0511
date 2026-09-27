import { CAR_PRICING, yen } from '@/data/pricingConstants';

export type AdLpQuickFactSet = {
  intentLabel: string;
  priceLabel: string;
  durationLabel: string;
  areaLabel: (displayName: string) => string;
};

const areaDefault = (displayName: string) => `${displayName}へ出張費無料`;

/** Near-fold facts for Ads Landing page experience (price / time / area). */
export const AD_LP_QUICK_FACTS: Record<string, AdLpQuickFactSet> = {
  'kuruma-nioitori': {
    intentLabel: '車の匂い取り',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'kuruma-nioi-keshi': {
    intentLabel: '車の匂い消し・消臭',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'shanai-shoshu': {
    intentLabel: '車内消臭・脱臭',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'ac-nioi': {
    intentLabel: 'エアコン臭い対策',
    priceLabel: `エアコン内部洗浄 ${yen(CAR_PRICING.acInternalWash)}〜（車内洗浄とセット可）`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  'ac-kusai': {
    intentLabel: 'エアコン臭い対策',
    priceLabel: `エアコン内部洗浄 ${yen(CAR_PRICING.acInternalWash)}〜（車内洗浄とセット可）`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  'car-ac-cleaning': {
    intentLabel: '車エアコンクリーニング',
    priceLabel: `エアコン内部洗浄 ${yen(CAR_PRICING.acInternalWash)}〜／消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1〜3時間',
    areaLabel: areaDefault,
  },
  'evaporator-senjo': {
    intentLabel: 'エバポレーター洗浄',
    priceLabel: `エアコン内部洗浄 ${yen(CAR_PRICING.acInternalWash)}〜（シート洗浄セット可）`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  'seat-cleaning': {
    intentLabel: '車シートクリーニング',
    priceLabel: `座席1脚 ${yen(CAR_PRICING.seatSingleBasic)}〜`,
    durationLabel: '約1〜2時間（範囲による）',
    areaLabel: areaDefault,
  },
  'seat-senjo': {
    intentLabel: '車シート洗浄',
    priceLabel: `座席1脚 ${yen(CAR_PRICING.seatSingleBasic)}〜`,
    durationLabel: '約1〜2時間（範囲による）',
    areaLabel: areaDefault,
  },
  kareisyu: {
    intentLabel: '加齢臭・車内消臭',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜3時間',
    areaLabel: areaDefault,
  },
  'chuko-kareisyu': {
    intentLabel: '中古車加齢臭対策',
    priceLabel: `消臭セット ${yen(CAR_PRICING.regularDeodorize)}〜`,
    durationLabel: '約2〜3.5時間',
    areaLabel: areaDefault,
  },
  'shanai-nioi': {
    intentLabel: '車内 カビ臭い',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  omorashi: {
    intentLabel: 'おもらし・尿染み',
    priceLabel: `座席1脚消臭セット ${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  ase: {
    intentLabel: '汗臭・汗ジミ洗浄',
    priceLabel: `座席1脚 ${yen(CAR_PRICING.seatSingleBasic)}〜`,
    durationLabel: '約1〜2時間',
    areaLabel: areaDefault,
  },
  'kyuto-cleaning': {
    intentLabel: '車 ゲロ 掃除',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },
  'interior-cleaning': {
    intentLabel: '車内クリーニング',
    priceLabel: `基本洗浄 ${yen(CAR_PRICING.lightBasic)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  oshikko: {
    intentLabel: '猫 おしっこ 車 消臭',
    priceLabel: `座席1脚消臭セット ${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'touyu-kobosi': {
    intentLabel: '車 灯油 こぼした',
    priceLabel: `${yen(CAR_PRICING.kerosenePerSeat)}〜/席`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },
  'pet-ke': {
    intentLabel: 'ペット毛・清掃',
    priceLabel: `基本洗浄 ${yen(CAR_PRICING.lightBasic)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'tabako-yani': {
    intentLabel: '車 天井 ヤニ',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },
  'dengen-fuyou': {
    intentLabel: 'マンション 駐車場 車内清掃',
    priceLabel: `基本洗浄 ${yen(CAR_PRICING.lightBasic)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
};

const QUICK_FACT_ALIASES: Record<string, string> = {
  'vomit-cleaning': 'kyuto-cleaning',
  'gero-cleaning': 'kyuto-cleaning',
  'odor-removal': 'kuruma-nioi-keshi',
  'seat-washing': 'seat-senjo',
  'ac-mold': 'evaporator-senjo',
  'mobile-cleaning': 'interior-cleaning',
  'specialist-cleaning': 'interior-cleaning',
  unko: 'oshikko',
  'pet-unko': 'oshikko',
  'pet-waste': 'oshikko',
  'pet-hair-odor': 'pet-ke',
  'tobacco-odor': 'tabako-yani',
  'mold-odor': 'shanai-shoshu',
};

const AD_LP_QUICK_FACTS_OWN: Record<string, AdLpQuickFactSet> = {
  'kodomo-kyuto': {
    intentLabel: '子供 車で吐いた',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },
  'hoken-kyuto': {
    intentLabel: 'レンタカー ルームクリーニング',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },
  'shutchou-senmon': {
    intentLabel: '車内 丸洗い 出張',
    priceLabel: `基本洗浄 ${yen(CAR_PRICING.lightBasic)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'chuko-tabako': {
    intentLabel: '中古車 納車 臭い',
    priceLabel: `消臭セット ${yen(CAR_PRICING.regularDeodorize)}〜`,
    durationLabel: '約2〜3.5時間',
    areaLabel: areaDefault,
  },
  'bus-senmon': {
    intentLabel: 'マイクロバス 車内清掃',
    priceLabel: 'バス座席洗浄 応相談',
    durationLabel: '台数・範囲により変動',
    areaLabel: areaDefault,
  },
};

export function getAdLpQuickFacts(slug: string): AdLpQuickFactSet | undefined {
  if (AD_LP_QUICK_FACTS_OWN[slug]) return AD_LP_QUICK_FACTS_OWN[slug];
  const resolved = QUICK_FACT_ALIASES[slug] ?? slug;
  return AD_LP_QUICK_FACTS[resolved] ?? AD_LP_QUICK_FACTS[slug];
}

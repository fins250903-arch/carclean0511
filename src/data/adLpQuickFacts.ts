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
    priceLabel: `エアコン内部洗浄（簡易）${yen(CAR_PRICING.acInternalWash)}〜（車内消臭セット可）`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  'ac-kusai': {
    intentLabel: 'エアコン臭い対策',
    priceLabel: `エアコン内部洗浄（簡易）${yen(CAR_PRICING.acInternalWash)}〜（車内消臭セット可）`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  'car-ac-cleaning': {
    intentLabel: '車エアコンクリーニング',
    priceLabel: `エアコン内部洗浄（簡易）${yen(CAR_PRICING.acInternalWash)}〜／消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1〜3時間',
    areaLabel: areaDefault,
  },
  'evaporator-senjo': {
    intentLabel: 'エバポレーター洗浄',
    priceLabel: `エアコン内部洗浄（簡易）${yen(CAR_PRICING.acInternalWash)}〜（シート洗浄セット可）`,
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
    intentLabel: '中古車加齢臭・生活臭',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜／普通車基本 ${yen(CAR_PRICING.regularBasic)}〜`,
    durationLabel: '約2〜3時間',
    areaLabel: areaDefault,
  },
  'pet-nioi': {
    intentLabel: 'ペット臭・車内消臭',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜3時間',
    areaLabel: areaDefault,
  },
  oshikko: {
    intentLabel: 'おしっこ汚れ・消臭',
    priceLabel: `座席1脚消臭 ${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  omorashi: {
    intentLabel: 'おもらし・尿染み洗浄',
    priceLabel: `座席1脚消臭 ${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  'touyu-kobosi': {
    intentLabel: '灯油こぼし緊急洗浄',
    priceLabel: `灯油洗浄 ${yen(CAR_PRICING.kerosenePerSeat)}〜／席`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },

  'shanai-nioi': {
    intentLabel: '車内の臭い対策',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    intentLabel: '中古車加齢臭対策',
    priceLabel: `消臭セット ${yen(CAR_PRICING.regularDeodorize)}〜`,
    durationLabel: '約2〜3.5時間',
    areaLabel: areaDefault,
  },
  'shanai-nioi': {
    intentLabel: '車内の臭い対策',
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
    intentLabel: '嘔吐クリーニング',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },
  'interior-cleaning': {
    intentLabel: '車内クリーニング（基本洗浄）',
    priceLabel: `基本洗浄 ${yen(CAR_PRICING.lightBasic)}〜（消臭セットは別メニュー）`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'specialist-cleaning': {
    intentLabel: '車内クリーニング専門店',
    priceLabel: `基本洗浄 ${yen(CAR_PRICING.lightBasic)}〜／消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'chuko-tabako': {
    intentLabel: '中古車タバコ臭・ヤニ洗浄',
    priceLabel: `普通車消臭セット ${yen(CAR_PRICING.regularDeodorize)}〜`,
    durationLabel: '約2.5〜4時間',
    areaLabel: areaDefault,
  },
  'tabako-yani': {
    intentLabel: 'タバコヤニ・喫煙臭洗浄',
    priceLabel: `普通車消臭セット ${yen(CAR_PRICING.regularDeodorize)}〜`,
    durationLabel: '約2.5〜4時間',
    areaLabel: areaDefault,
  },
  unko: {
    intentLabel: 'うんち汚れ・除菌洗浄',
    priceLabel: `座席1脚消臭 ${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
    durationLabel: '約1〜2.5時間',
    areaLabel: areaDefault,
  },
  'pet-unko': {
    intentLabel: 'ペット粗相・除菌消臭',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約1.5〜3時間',
    areaLabel: areaDefault,
  },
  'kodomo-kyuto': {
    intentLabel: '子どもの嘔吐クリーニング',
    priceLabel: `消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜`,
    durationLabel: '約2〜4時間',
    areaLabel: areaDefault,
  },
};

/** Aliases so LPAdPages / RSA landing slugs inherit the same ATF facts. */
const QUICK_FACTS_ALIASES: Record<string, string> = {
  'gero-cleaning': 'kyuto-cleaning',
  'vomit-cleaning': 'kyuto-cleaning',
  'hoken-kyuto': 'kyuto-cleaning',
  'tobacco-odor': 'tabako-yani',
  'pet-waste': 'pet-unko',
  'odor-removal': 'kuruma-nioi-keshi',
  'mobile-cleaning': 'specialist-cleaning',
  'seat-washing': 'seat-senjo',
  'mold-odor': 'shanai-nioi',
  'ac-mold': 'evaporator-senjo',
  'pet-hair-odor': 'oshikko',
};

export function getAdLpQuickFacts(slug: string): AdLpQuickFactSet | undefined {
  const key = QUICK_FACTS_ALIASES[slug] ?? slug;
  return AD_LP_QUICK_FACTS[key];
}

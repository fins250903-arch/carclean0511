import { CAR_PRICING, yen } from '@/data/pricingConstants';

export type ProcessStep = {
  title: string;
  body: string;
};

export type PriceTier = {
  label: string;
  price: string;
  note: string;
};

export type AdLpProcessGuide = {
  heading: string;
  intro: string;
  steps: ProcessStep[];
  tiers: PriceTier[];
  caveat: string;
};

const AC_STEPS: ProcessStep[] = [
  {
    title: '症状の切り分け',
    body: 'エアコンON時だけ臭い／OFFでも臭うかを確認。ON時のみならエバポレーター内部が本命です。',
  },
  {
    title: '簡易内部洗浄',
    body: '吹き出し口から専用洗浄剤を噴霧し、吸引で汚れ・菌を回収します（出張対応）。',
  },
  {
    title: '試運転で確認',
    body: '冷房・送風を回し、酸っぱい・カビ臭の改善度をその場で確認します。',
  },
  {
    title: '必要なら車内セット',
    body: 'シート・天井の生活臭が残る場合のみ、消臭セットやシート洗浄を追加提案します。',
  },
];

const ODOR_STEPS: ProcessStep[] = [
  {
    title: '臭いの原因特定',
    body: '生活臭・タバコ・ペット・エアコン・加齢臭など、吸着箇所を切り分けます。',
  },
  {
    title: '温水リンサー抽出',
    body: '香料で隠すのではなく、シート内部の汚れと臭い分子を洗い流します。',
  },
  {
    title: '乾燥・仕上げ',
    body: '吸引・換気で乾燥を進め、再発しやすい湿気も抑えます。',
  },
  {
    title: '限界の事前説明',
    body: '長年の喫煙・猫尿などは完全無臭を保証できない場合があり、事前にお伝えします。',
  },
];

const SEAT_STEPS: ProcessStep[] = [
  {
    title: '素材確認',
    body: '布・合皮などシート素材を確認し、洗浄剤と工程を選びます。',
  },
  {
    title: '泡洗い＋リンサー',
    body: '表面だけでなくウレタン寄りの汚れまで泡洗いし、温水で抽出します。',
  },
  {
    title: '乾燥',
    body: '吸引と換気で乾燥。当日〜翌日の利用目安もご案内します。',
  },
  {
    title: '席数で見積もり',
    body: '1脚のみ／前列／全席など、必要な範囲だけ依頼できます。',
  },
];

const LIGHT_STEPS: ProcessStep[] = [
  {
    title: '基本洗浄メニュー',
    body: '黄ばみ・飲みこぼし・生活汚れが中心の通常車内クリーニングです。',
  },
  {
    title: '消臭セットとの違い',
    body: '嘔吐・灯油・ペット粗相など緊急・特殊臭は消臭セット（別メニュー）です。',
  },
  {
    title: '出張施工',
    body: '電源・水道不要。ご自宅や職場の駐車場でそのまま施工できます。',
  },
  {
    title: '料金の目安提示',
    body: '車種サイズ別の基本料金を先にお伝えし、追加が必要な場合のみ説明します。',
  },
];

export const AD_LP_PROCESS_GUIDES: Record<string, AdLpProcessGuide> = {
  'ac-nioi': {
    heading: 'エアコン臭い対策の工程',
    intro: 'ON時の酸っぱい・カビ臭は、フィルター交換だけでは残りやすいケースがあります。出張の簡易内部洗浄の流れです。',
    steps: AC_STEPS,
    tiers: [
      {
        label: 'エアコン内部洗浄',
        price: `${yen(CAR_PRICING.acInternalWash)}〜`,
        note: '簡易内部洗浄・試運転確認',
      },
      {
        label: '＋消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: 'シート・天井の生活臭が併発するとき',
      },
      {
        label: '所要時間',
        price: '約1〜2.5時間',
        note: '範囲・車種により前後',
      },
    ],
    caveat: 'フル分解洗浄は工場預かりが必要な場合があります。臭いの程度に応じて可否を説明します。',
  },
  'ac-kusai': {
    heading: 'エアコン臭い対策の工程',
    intro: 'クサイ・酸っぱいエアコン臭への出張内部洗浄の流れです。',
    steps: AC_STEPS,
    tiers: [
      {
        label: 'エアコン内部洗浄',
        price: `${yen(CAR_PRICING.acInternalWash)}〜`,
        note: '簡易内部洗浄・試運転確認',
      },
      {
        label: '＋消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '車内臭が併発するとき',
      },
      {
        label: '所要時間',
        price: '約1〜2.5時間',
        note: '範囲・車種により前後',
      },
    ],
    caveat: 'フル分解洗浄は工場預かりが必要な場合があります。',
  },
  'car-ac-cleaning': {
    heading: '車エアコンクリーニングの工程',
    intro: 'フィルター清掃に加え、エバポレーター内部洗浄まで行う出張メニューです。',
    steps: AC_STEPS,
    tiers: [
      {
        label: 'エアコン内部洗浄',
        price: `${yen(CAR_PRICING.acInternalWash)}〜`,
        note: '含む：簡易内部洗浄／含まない：フル分解・部品交換',
      },
      {
        label: '消臭セット併用',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: 'シート臭い併発時のみ提案',
      },
      {
        label: '所要時間',
        price: '約1〜3時間',
        note: 'セット施工時は長め',
      },
    ],
    caveat: '無理なオプション追加はせず、症状に必要な範囲だけご提案します。',
  },
  'evaporator-senjo': {
    heading: 'エバポレーター洗浄の工程',
    intro: 'エバポレーター＝エアコン内部の蒸発器。ON時のカビ臭の本命箇所です。',
    steps: AC_STEPS,
    tiers: [
      {
        label: 'エバポ簡易洗浄',
        price: `${yen(CAR_PRICING.acInternalWash)}〜`,
        note: '出張で内部を洗浄・吸引',
      },
      {
        label: 'シート洗浄セット',
        price: `座席1脚 ${yen(CAR_PRICING.seatSingleBasic)}〜`,
        note: '車内全体の空気も整えたいとき',
      },
      {
        label: '所要時間',
        price: '約1〜2.5時間',
        note: 'セット時は+1時間程度',
      },
    ],
    caveat: '分解フル洗浄との違いは見積時に説明します。簡易で改善しない場合は次の選択肢も提示します。',
  },
  'kuruma-nioitori': {
    heading: '車の匂い取りの2ステップ',
    intro: '消臭スプレーやオゾンだけでは戻る臭いも、汚れを洗い出すと改善しやすいです。',
    steps: ODOR_STEPS,
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '原因洗い出し＋抽出洗浄',
      },
      {
        label: '座席1脚から',
        price: `${yen(CAR_PRICING.seatSingleBasic)}〜`,
        note: '部分臭だけなら最小範囲で',
      },
      {
        label: '所要時間',
        price: '約1.5〜3時間',
        note: '臭いの種類により前後',
      },
    ],
    caveat: '完全無臭を保証できないケース（長年のタバコ・猫尿など）は、事前に限界をお伝えします。',
  },
  'kuruma-nioi-keshi': {
    heading: '車の匂い消し（消臭洗浄）の流れ',
    intro: '香料で隠すのではなく、臭いの吸着先である汚れを洗い流します。',
    steps: ODOR_STEPS,
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '生活臭・複合臭向け',
      },
      {
        label: '座席1脚から',
        price: `${yen(CAR_PRICING.seatSingleBasic)}〜`,
        note: 'シート臭いだけの部分依頼可',
      },
      {
        label: '所要時間',
        price: '約1.5〜3時間',
        note: '範囲により前後',
      },
    ],
    caveat: '「匂い消し」と「車内全体の丸洗い」は範囲が違います。見積で必要な範囲を明確にします。',
  },
  'shanai-shoshu': {
    heading: '車内消臭・脱臭洗浄の流れ',
    intro: 'マスキングではなく脱臭洗浄。原因箇所を特定してから洗い出します。',
    steps: ODOR_STEPS,
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: 'シート・天井・フロア中心',
      },
      {
        label: '部分消臭',
        price: `座席1脚 ${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: 'シート臭いだけでも可',
      },
      {
        label: '所要時間',
        price: '約1.5〜3時間',
        note: '複合臭は長め',
      },
    ],
    caveat: '原因がエアコン内部の場合は、エアコン洗浄メニューをご案内します。',
  },
  'seat-senjo': {
    heading: '車シート洗浄の工程',
    intro: '黄ばみ・シミ・汗ジミを、素材別に泡洗いとリンサーで内部まで洗浄します。',
    steps: SEAT_STEPS,
    tiers: [
      {
        label: '座席1脚（基本）',
        price: `${yen(CAR_PRICING.seatSingleBasic)}〜`,
        note: '黄ばみ・シミ中心',
      },
      {
        label: '座席1脚（消臭）',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '臭いが強い席',
      },
      {
        label: '所要時間',
        price: '約1〜2時間',
        note: '全席は範囲により延長',
      },
    ],
    caveat: '革シートは状態により工程・可否が異なります。事前に素材をご確認ください。',
  },
  'seat-cleaning': {
    heading: '車シートクリーニングの工程',
    intro: '座席まるごとの洗浄・乾燥で、皮脂汚れと臭いの元をまとめてケアします。',
    steps: SEAT_STEPS,
    tiers: [
      {
        label: '座席1脚（基本）',
        price: `${yen(CAR_PRICING.seatSingleBasic)}〜`,
        note: '部分依頼OK',
      },
      {
        label: '座席1脚（消臭）',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '臭い併発時',
      },
      {
        label: '所要時間',
        price: '約1〜2時間',
        note: '全席は別途見積',
      },
    ],
    caveat: '布・合皮で洗い方が異なります。革は状態確認のうえご案内します。',
  },
  'interior-cleaning': {
    heading: '通常の車内クリーニング（基本洗浄）',
    intro: '緊急の嘔吐・灯油とは別メニュー。黄ばみ・生活汚れ向けの出張基本洗浄です。',
    steps: LIGHT_STEPS,
    tiers: [
      {
        label: '基本洗浄',
        price: `軽自動車 ${yen(CAR_PRICING.lightBasic)}〜`,
        note: '黄ばみ・生活汚れ・丸洗い',
      },
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '嘔吐・灯油・ペット等の特殊臭',
      },
      {
        label: '所要時間',
        price: '約1.5〜3時間',
        note: '範囲により前後',
      },
    ],
    caveat: '嘔吐・灯油・ペット粗相は専用メニューへご案内します（通常清掃とは工程が異なります）。',
  },
  kareisyu: {
    heading: '加齢臭・車内体臭の洗浄の流れ',
    intro: '気づきにくい皮脂臭は、天井・シートの広範囲洗浄が近道です。',
    steps: ODOR_STEPS,
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '天井・シート中心',
      },
      {
        label: '所要時間',
        price: '約2〜3時間',
        note: '広範囲ほど長め',
      },
      {
        label: '部分依頼',
        price: `座席1脚 ${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '気になる席からでも可',
      },
    ],
    caveat: '完全無臭を保証するものではありません。改善見込みは現地確認でお伝えします。',
  },
  'chuko-kareisyu': {
    heading: '中古車加齢臭・生活臭の洗浄の流れ',
    intro: '前オーナー臭は複数箇所の蓄積であることが多く、丸洗いが効果的です。',
    steps: ODOR_STEPS,
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '納車前・納車直後どちらも可',
      },
      {
        label: '基本洗浄',
        price: `普通車 ${yen(CAR_PRICING.regularBasic)}〜`,
        note: '見た目の黄ばみも同時ケア',
      },
      {
        label: '所要時間',
        price: '約2〜3時間',
        note: '臭いの強さで前後',
      },
    ],
    caveat: 'オゾンだけでは戻りやすい中古車臭は、洗浄による原因除去をご提案します。',
  },
  'pet-nioi': {
    heading: 'ペット臭対策の流れ',
    intro: '毛・皮脂・尿の複合臭は、吸引だけでは足りず洗浄と酵素分解が必要です。',
    steps: [
      {
        title: '毛・汚染箇所の特定',
        body: 'シート溝・トランク・天井まで、臭いの出所を確認します。',
      },
      {
        title: '酵素分解＋リンサー',
        body: '尿・皮脂由来の臭い分子を分解し、温水で洗い出します。',
      },
      {
        title: '毛の除去',
        body: '織り目に絡んだ毛を手作業と吸引で取り除きます。',
      },
      {
        title: '乾燥・仕上げ',
        body: '再発しやすい湿気を抑え、同乗しやすい状態へ戻します。',
      },
    ],
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: 'ペット臭の標準メニュー',
      },
      {
        label: '座席1脚から',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '後部座席だけでも可',
      },
      {
        label: '所要時間',
        price: '約2〜3時間',
        note: '毛の量で前後',
      },
    ],
    caveat: '長年の尿染みは完全無臭が難しい場合があります。限界は事前に説明します。',
  },
};

export function getAdLpProcessGuide(slug: string): AdLpProcessGuide | undefined {
  return AD_LP_PROCESS_GUIDES[slug];
}

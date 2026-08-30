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
  oshikko: {
    heading: 'おしっこ汚れ・消臭の工程',
    intro: '尿はアルカリ性で繊維奥に浸透しやすいため、中和とリンサー抽出が基本です。',
    steps: [
      {
        title: '汚染範囲の特定',
        body: 'シート表面だけでなく、ウレタン・隙間・フロアまで尿染みの広がりを確認します。',
      },
      {
        title: '尿アルカリの中和',
        body: '市販消臭スプレーは使わず、尿成分に合わせた中和・酵素工程で臭いの元を分解します。',
      },
      {
        title: '温水リンサー抽出',
        body: '染み込んだ尿を温水で洗い出し、吸引で回収します。',
      },
      {
        title: '乾燥・換気',
        body: '湿気が残ると臭いが戻りやすいため、吸引と換気で仕上げます。',
      },
    ],
    tiers: [
      {
        label: '座席1脚（消臭）',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: 'おしっこ染みの標準',
      },
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '複数席・エアコン循環臭があるとき',
      },
      {
        label: '所要時間',
        price: '約1〜2.5時間',
        note: '乾いた後の固着は長め',
      },
    ],
    caveat: '猫尿や長期間放置の尿染みは完全無臭を保証できない場合があります。見込みは事前にお伝えします。',
  },
  omorashi: {
    heading: 'おもらし・尿染み洗浄の工程',
    intro: '乾いてからの尿染みは固定化しやすく、早めの中和洗浄がシミと臭いの両方に有効です。',
    steps: [
      {
        title: '染み位置の確認',
        body: '見た目の黄ばみだけでなく、臭いの強い席・隙間を特定します。',
      },
      {
        title: '中和＋泡洗い',
        body: '尿アルカリを中和しながら、素材に合わせた洗浄剤で汚れを浮かします。',
      },
      {
        title: 'リンサー抽出',
        body: 'シート内部まで温水で洗い流し、臭い分子を吸引回収します。',
      },
      {
        title: '乾燥仕上げ',
        body: '当日〜翌日の利用目安もご案内します。',
      },
    ],
    tiers: [
      {
        label: '座席1脚（消臭）',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: 'おもらし1席から対応',
      },
      {
        label: '座席1脚（基本）',
        price: `${yen(CAR_PRICING.seatSingleBasic)}〜`,
        note: '臭いが軽い染み中心のとき',
      },
      {
        label: '所要時間',
        price: '約1〜2.5時間',
        note: '範囲により前後',
      },
    ],
    caveat: 'レンタカー返却前など急ぎの場合も、空き状況に応じて優先案内します。',
  },
  'touyu-kobosi': {
    heading: '灯油こぼし緊急洗浄の工程',
    intro: '灯油は揮発と浸透が早く、火気厳禁のうえ染み出しを抑える手順が重要です。',
    steps: [
      {
        title: '安全確認',
        body: '火気厳禁・換気・エンジン停止を確認してから作業します。',
      },
      {
        title: '吸油・汚染範囲の特定',
        body: 'マット上か、フロア下吸音材まで達しているかを見極めます。',
      },
      {
        title: '中和・リンサー抽出',
        body: '油分を広げない手順で洗浄・吸引し、臭いの元を減らします。',
      },
      {
        title: '乾燥・フォロー',
        body: '大量こぼしは経過確認が必要な場合があり、限界も事前に説明します。',
      },
    ],
    tiers: [
      {
        label: '灯油洗浄',
        price: `${yen(CAR_PRICING.kerosenePerSeat)}〜／席`,
        note: '浸透度で変動',
      },
      {
        label: '所要時間',
        price: '約2〜4時間',
        note: '100cc超は長め',
      },
      {
        label: '保険相談',
        price: '見積時に案内',
        note: '500cc超は交換可否も見極め',
      },
    ],
    caveat: '500cc超は洗浄だけでは限界の場合があります。部品交換や保険活用も選択肢として提示します。',
  },
  'kyuto-cleaning': {
    heading: '車内嘔吐クリーニングの工程',
    intro: '酸性の吐瀉物はこすらず除去し、アルカリ中和＋温水リンサーでシート奥まで抽出します。',
    steps: [
      {
        title: '固形物の安全除去',
        body: 'こすらずすくい取り、汚染範囲を広げない初動を徹底します。',
      },
      {
        title: 'アルカリ中和',
        body: '嘔吐物の酸性を特殊アルカリ電解水で中和し、臭いの定着を抑えます。',
      },
      {
        title: '温水リンサー抽出',
        body: '約40℃温水でウレタン層まで洗い出し、吸引で回収します。',
      },
      {
        title: '乾燥・利用目安の案内',
        body: '当日〜翌日の乗車目安と、保険申請用の記録も必要に応じてご案内します。',
      },
    ],
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '嘔吐・ゲロ臭の標準',
      },
      {
        label: '座席1脚から',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '1席のみのとき',
      },
      {
        label: '所要時間',
        price: '約2〜4時間',
        note: '乾いた後の固着は長め',
      },
    ],
    caveat: '4日以上放置や広範囲汚染は完全無臭が難しい場合があります。見込みは現地で説明します。',
  },
  'shanai-nioi': {
    heading: '車内の臭い取り・消臭の流れ',
    intro: '原因（生活臭・タバコ・ペット・エアコン等）を切り分け、香料ではなく洗浄で除去します。',
    steps: ODOR_STEPS,
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '原因洗浄の標準',
      },
      {
        label: 'エアコン内部洗浄',
        price: `${yen(CAR_PRICING.acInternalWash)}〜`,
        note: 'ON時だけ臭う場合に追加',
      },
      {
        label: '所要時間',
        price: '約1.5〜3時間',
        note: '複合臭は長め',
      },
    ],
    caveat: '長年の喫煙・猫尿などは完全無臭を保証できない場合があります。',
  },
  'chuko-tabako': {
    heading: '中古車タバコ臭・ヤニ洗浄の流れ',
    intro: '天井・シート・エアコンに吸着したタールは、丸ごと洗浄とオゾン仕上げが有効です。',
    steps: [
      {
        title: '喫煙歴・臭いの程度確認',
        body: '天井のヤニ黄ばみ、シート、吹き出し口の臭いを確認し、改善見込みを先にお伝えします。',
      },
      {
        title: '天井・シートの温水洗浄',
        body: 'ヤニとニコチンが染みた繊維をリンサー抽出し、臭いの吸着源を減らします。',
      },
      {
        title: '必要ならエアコン内部も',
        body: 'ON時にヤニ臭が強い場合は、エバポレーター寄りの内部洗浄を追加します。',
      },
      {
        title: 'オゾン仕上げと限界説明',
        body: '仕上げ脱臭後も、長年喫煙車は完全無臭化が70〜80%程度の場合があります。',
      },
    ],
    tiers: [
      {
        label: '普通車消臭セット',
        price: `${yen(CAR_PRICING.regularDeodorize)}〜`,
        note: '中古車タバコ臭の標準',
      },
      {
        label: 'エアコン内部洗浄',
        price: `${yen(CAR_PRICING.acInternalWash)}〜`,
        note: 'オプション',
      },
      {
        label: '所要時間',
        price: '約2.5〜4時間',
        note: '天井洗浄込み',
      },
    ],
    caveat: '天井裏までヤニが回った車は完全無臭を保証できません。納車前でも対応可能です。',
  },
  'tabako-yani': {
    heading: 'タバコヤニ・喫煙臭洗浄の流れ',
    intro: 'ヤニは天井からフロアまで広域吸着しやすいため、部分拭きでは戻りやすいです。',
    steps: [
      {
        title: 'ヤニ付着箇所の特定',
        body: '天井・ピラー・シート・フロアの黄ばみと臭いを確認します。',
      },
      {
        title: '温水リンサー洗浄',
        body: 'タール・ニコチンを洗い流し、香料マスキングに頼りません。',
      },
      {
        title: 'オゾン脱臭',
        body: '洗浄後の残留臭を仕上げで低減します。',
      },
      {
        title: '再発しやすい条件の説明',
        body: 'エアコン内部や天井裏の限界も事前に共有します。',
      },
    ],
    tiers: [
      {
        label: '普通車消臭セット',
        price: `${yen(CAR_PRICING.regularDeodorize)}〜`,
        note: 'ヤニ・喫煙臭',
      },
      {
        label: '軽自動車消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '車格による',
      },
      {
        label: '所要時間',
        price: '約2.5〜4時間',
        note: '広範囲ほど長め',
      },
    ],
    caveat: '完全無臭化の目安は70〜80%。限界まで清潔な状態へ引き上げます。',
  },
  unko: {
    heading: 'うんち汚れ・除菌洗浄の工程',
    intro: '衛生リスクがあるため、固形物除去後は除菌とリンサー抽出をセットで行います。',
    steps: [
      {
        title: '固形物・汚染範囲の除去',
        body: 'こすらず取り除き、シート溝・フロアまで広がりを確認します。',
      },
      {
        title: '酵素分解＋除菌',
        body: '臭いと菌の温床になりやすい残渣を酵素と除菌工程で処理します。',
      },
      {
        title: '温水リンサー抽出',
        body: '繊維奥まで洗い流し、吸引回収します。',
      },
      {
        title: '乾燥仕上げ',
        body: '湿気が残ると臭いが戻りやすいため、換気・乾燥まで行います。',
      },
    ],
    tiers: [
      {
        label: '座席1脚（消臭）',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '1席の粗相',
      },
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '複数席・強い臭い',
      },
      {
        label: '所要時間',
        price: '約1〜2.5時間',
        note: '下痢便は長め',
      },
    ],
    caveat: '長時間放置で染みが固定化したケースは、見た目の完全復元が難しい場合があります。',
  },
  'pet-unko': {
    heading: 'ペット粗相（うんち・尿）の洗浄工程',
    intro: '毛・尿・便の複合汚染は、吸引だけでは足りず洗浄と酵素分解が必要です。',
    steps: [
      {
        title: '汚染箇所の特定',
        body: 'シート・トランク・マット下まで臭いの出所を確認します。',
      },
      {
        title: '酵素分解＋除菌',
        body: 'ペット由来の臭い分子を分解し、衛生面もケアします。',
      },
      {
        title: 'リンサー抽出と毛の除去',
        body: '洗い流しと同時に、織り目の毛も手作業で取り除きます。',
      },
      {
        title: '乾燥・仕上げ',
        body: '同乗しやすい状態へ戻し、再発しやすい湿気も抑えます。',
      },
    ],
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: 'ペット粗相の標準',
      },
      {
        label: '座席1脚から',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '後部座席のみ可',
      },
      {
        label: '所要時間',
        price: '約1.5〜3時間',
        note: '毛の量で前後',
      },
    ],
    caveat: '長年の尿染みは完全無臭が難しい場合があります。限界は事前に説明します。',
  },
  'specialist-cleaning': {
    heading: '車内クリーニング専門店の施工の流れ',
    intro: '基本洗浄と消臭セットを分けてご案内。必要な工程だけを出張で行います。',
    steps: LIGHT_STEPS,
    tiers: [
      {
        label: '基本洗浄',
        price: `軽自動車 ${yen(CAR_PRICING.lightBasic)}〜`,
        note: '黄ばみ・生活汚れ',
      },
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '嘔吐・特殊臭',
      },
      {
        label: '所要時間',
        price: '約1.5〜3時間',
        note: '範囲により前後',
      },
    ],
    caveat: 'シートベルト単体の臭いなど部分案件も、必要な範囲だけ見積もりします。',
  },
  'kodomo-kyuto': {
    heading: '子どもの車内嘔吐対応の工程',
    intro: '翌日の送迎に間に合わせるため、中和とリンサー抽出を優先して復旧します。',
    steps: [
      {
        title: '固形物をこすらず除去',
        body: 'チャイルドシート周りも含め、汚染を広げない初動を徹底します。',
      },
      {
        title: '中和＋温水抽出',
        body: '酸性の吐瀉物を中和し、シート奥まで洗い出します。',
      },
      {
        title: '乾燥と利用目安',
        body: '当日〜翌日の乗車可否をその場でご案内します。',
      },
      {
        title: '再発防止のアドバイス',
        body: '市販スプレーを使わない理由と、換気のコツもお伝えします。',
      },
    ],
    tiers: [
      {
        label: '消臭セット',
        price: `${yen(CAR_PRICING.lightDeodorize)}〜`,
        note: '子どもの嘔吐の標準',
      },
      {
        label: '座席1脚から',
        price: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
        note: '1席のみ',
      },
      {
        label: '所要時間',
        price: '約2〜4時間',
        note: '急ぎ案件も空き次第',
      },
    ],
    caveat: 'チャイルドシート本体の洗濯可否は製品により異なります。可能な範囲でご案内します。',
  },
};

const PROCESS_GUIDE_ALIASES: Record<string, string> = {
  'gero-cleaning': 'kyuto-cleaning',
  'vomit-cleaning': 'kyuto-cleaning',
  'tobacco-odor': 'tabako-yani',
  'pet-waste': 'pet-unko',
  'odor-removal': 'kuruma-nioi-keshi',
  'mobile-cleaning': 'specialist-cleaning',
  'seat-washing': 'seat-senjo',
  'mold-odor': 'shanai-nioi',
};

export function getAdLpProcessGuide(slug: string): AdLpProcessGuide | undefined {
  const key = PROCESS_GUIDE_ALIASES[slug] ?? slug;
  return AD_LP_PROCESS_GUIDES[key];
}

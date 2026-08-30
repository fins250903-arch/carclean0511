import { CAR_PRICING, yen } from '@/data/pricingConstants';

export type IntentGuideRow = {
  label: string;
  detail: string;
  hint?: string;
};

export type IntentGuideBlock = {
  title: string;
  lead: string;
  columns: [string, string, string?];
  rows: IntentGuideRow[];
  note?: string;
};

/** Competitor-gap tables shown on Ads keyword LPs (after QuickFacts). */
export const AD_LP_INTENT_GUIDES: Record<string, IntentGuideBlock> = {
  'ac-nioi': {
    title: 'エアコン臭い｜工法の違いと比較',
    lead: 'フィルター交換で直る臭いと、エバポレーター洗浄が必要な臭いを切り分けます。',
    columns: ['メニュー', '向いている症状', '目安'],
    rows: [
      {
        label: 'フィルター交換のみ',
        detail: 'ホコリ臭・吸入口のゴミが主因。ON時の酸っぱいカビ臭には不十分なことが多い',
        hint: '部品代中心',
      },
      {
        label: 'エアコン内部洗浄（簡易）',
        detail: 'エアコンON時だけ酸っぱい・カビ臭が出る。エバポレーター内部の菌が疑われる場合',
        hint: `${yen(CAR_PRICING.acInternalWash)}〜`,
      },
      {
        label: '内部洗浄＋車内消臭セット',
        detail: 'エアコン臭に加え、シート・天井の生活臭も混ざっている場合',
        hint: `${yen(CAR_PRICING.lightDeodorize)}〜＋AC`,
      },
    ],
    note: '分解フル洗浄が必要なケースは車種・臭いの強さで判断し、事前にご説明します。',
  },
  'car-ac-cleaning': {
    title: '車エアコンクリーニング｜何が含まれるか',
    lead: '「クリーニング」と一口に言っても、フィルター清掃と内部洗浄では効果が異なります。',
    columns: ['工程', '内容', '目安'],
    rows: [
      {
        label: '内部洗浄（簡易）',
        detail: '吹き出し口からの専用洗浄・吸引。ON時カビ臭の主対策',
        hint: `${yen(CAR_PRICING.acInternalWash)}〜／約1〜2時間`,
      },
      {
        label: '車内消臭セット併用',
        detail: 'シート・天井の臭いが循環している場合に推奨',
        hint: `${yen(CAR_PRICING.lightDeodorize)}〜`,
      },
      {
        label: '含まないもの',
        detail: 'エアコン本体の部品交換・冷媒ガス補充・フル分解工場預かり（必要な場合は別案内）',
        hint: '見積で明示',
      },
    ],
  },
  'evaporator-senjo': {
    title: 'エバポレーター洗浄｜フィルターとの違い',
    lead: '蒸発器（エバポレーター）内部のカビが、ON時だけ臭う典型原因です。',
    columns: ['項目', '説明', '判断'],
    rows: [
      {
        label: 'フィルター交換',
        detail: '吸入側のゴミ対策。内部カビ臭の根本にはならないことが多い',
        hint: '応急・予防',
      },
      {
        label: 'エバポ簡易洗浄',
        detail: '出張で専用洗浄剤＋吸引。ダッシュボード内の臭い源へアプローチ',
        hint: `${yen(CAR_PRICING.acInternalWash)}〜`,
      },
      {
        label: 'DIYスプレー',
        detail: '表面の一時改善に留まりやすく、再発しやすい',
        hint: '非推奨（根本）',
      },
    ],
  },
  'kuruma-nioitori': {
    title: '車の匂い取り｜原因別の施工範囲',
    lead: '臭いの出方で「どこを洗うか」が変わります。香料マスキングではなく原因除去が基本です。',
    columns: ['臭いの出方', '疑わしい原因', '施工の中心'],
    rows: [
      { label: 'エアコンON時だけ', detail: 'エバポレーター内部のカビ・雑菌', hint: 'AC内部洗浄' },
      { label: 'シートに座ると臭う', detail: '汗・皮脂・飲食・尿などの染み込み', hint: 'シートリンサー' },
      { label: '天井・全体にこもる', detail: 'タバコヤニ・生活臭・前オーナー臭', hint: '天井〜フロア丸洗い' },
      { label: '荷室・足元が強い', detail: '湿気カビ・荷物臭・ペット', hint: 'フロア・荷室重点' },
    ],
    note: '完全無臭を約束できないケース（長年喫煙・猫尿の深部浸透など）は事前に限界をお伝えします。',
  },
  'kuruma-nioi-keshi': {
    title: '車の消臭｜メニュー階層',
    lead: '「消臭」でも、軽い生活臭と染み込み臭ではメニューが異なります。',
    columns: ['階層', '内容', '目安'],
    rows: [
      {
        label: '基本洗浄',
        detail: '見える汚れ・軽い生活臭向け（黄ばみ・ホコリ中心）',
        hint: `${yen(CAR_PRICING.lightBasic)}〜`,
      },
      {
        label: '消臭セット',
        detail: '染み込み臭・再発しやすい臭い向け（リンサー抽出中心）',
        hint: `${yen(CAR_PRICING.lightDeodorize)}〜`,
      },
      {
        label: '部分（座席1脚〜）',
        detail: 'ピンポイントの尿・飲みこぼし・座席の臭い',
        hint: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
      },
    ],
  },
  'shanai-shoshu': {
    title: '車内消臭・脱臭｜再発しない選び方',
    lead: 'スプレー・オゾンだけでは戻る臭いと、洗浄が必要な臭いを分けます。',
    columns: ['手段', 'できること', '限界'],
    rows: [
      { label: '消臭スプレー', detail: '一時的なマスキング', hint: '原因汚れは残る' },
      { label: 'オゾンのみ', detail: '空間臭の補助', hint: 'シート内部汚れは残る' },
      {
        label: '温水リンサー消臭',
        detail: '臭いの元（汚れ）を洗い流して吸引',
        hint: `${yen(CAR_PRICING.lightDeodorize)}〜`,
      },
    ],
  },
  'shanai-nioi': {
    title: '車内の臭い｜7秒診断',
    lead: '「なんとなく臭い」を、出方から原因候補へ落とします。',
    columns: ['チェック', '疑わしい原因', '次の一手'],
    rows: [
      { label: 'エアコンONで強くなる', detail: 'エアコン内部カビ', hint: 'AC内部洗浄を検討' },
      { label: '座面・背もたれが臭い', detail: '汗・尿・飲食の染み', hint: 'シート洗浄' },
      { label: '天井がベタつく／刺激臭', detail: 'タバコヤニ', hint: '天井〜フロア丸洗い' },
      { label: '中古車購入直後から', detail: '前オーナー生活臭・加齢臭', hint: '消臭セット丸洗い' },
    ],
  },
  kareisyu: {
    title: '加齢臭・体臭｜付着しやすい場所',
    lead: '脂っぽい古い臭いは、運転席まわりと天井・エアコン循環に残りやすいです。',
    columns: ['場所', 'なぜ残りやすいか', '洗浄のポイント'],
    rows: [
      { label: '運転席・ヘッドレスト', detail: '皮脂・頭皮脂が直接触れる', hint: '座席重点リンサー' },
      { label: 'シートベルト・ドア周り', detail: '手が触れる・擦れる', hint: '拭き＋部分洗浄' },
      { label: '天井・サンバイザー', detail: '揮発成分が上昇・吸着', hint: '天井洗浄を検討' },
      { label: 'エアコン循環', detail: '車内臭が再拡散する', hint: '必要ならAC内部も' },
    ],
  },
  'chuko-kareisyu': {
    title: '中古車加齢臭｜購入後チェックリスト',
    lead: '販売店の簡易清掃では落ちない「前オーナー臭」を洗い出します。',
    columns: ['チェック', 'よくある状態', '推奨'],
    rows: [
      { label: '納車直後から脂っぽい臭い', detail: '皮脂・加齢臭の蓄積', hint: '消臭セット丸洗い' },
      { label: '芳香剤を外すと戻る', detail: 'マスキングされていただけ', hint: '原因洗浄が必要' },
      { label: 'エアコンONで強まる', detail: '内装臭＋ダクト循環', hint: '車内＋AC検討' },
      { label: 'シート裏面・荷室も臭い', detail: '生活臭が広域', hint: 'フロア・荷室まで' },
    ],
  },
  'seat-senjo': {
    title: 'シート洗浄｜軽度〜全体の階層',
    lead: '「軽くきれいにしたい」と「染み込み・臭いまで取りたい」でメニューが分かれます。',
    columns: ['階層', '向いている状態', '目安'],
    rows: [
      {
        label: '座席1脚（基本）',
        detail: '見える汚れ・黄ばみ中心。臭いが弱い',
        hint: `${yen(CAR_PRICING.seatSingleBasic)}〜`,
      },
      {
        label: '座席1脚（消臭セット）',
        detail: '尿・飲みこぼし・汗臭など染み込み臭',
        hint: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
      },
      {
        label: '車内全体',
        detail: '複数席・天井・生活臭が広い',
        hint: `${yen(CAR_PRICING.lightBasic)}〜／消臭${yen(CAR_PRICING.lightDeodorize)}〜`,
      },
    ],
    note: '布シート／合皮／本革で使える薬剤と注意点が異なります。素材は現地で確認します。',
  },
  'seat-cleaning': {
    title: 'シートクリーニング｜素材別の注意',
    lead: '同じ「シート清掃」でも、素材で工程が変わります。',
    columns: ['素材', 'できること', '注意'],
    rows: [
      { label: '布シート', detail: '温水リンサーで内部まで抽出', hint: '乾燥時間を確保' },
      { label: '合皮', detail: '表面〜縫い目の汚れ落とし', hint: '強い擦りは避ける' },
      { label: '本革', detail: '専用ケア中心（状態による）', hint: '事前診断必須' },
    ],
  },
  oshikko: {
    title: 'おしっこ汚れ｜料金が変わる条件',
    lead: '見た目が乾いていても、ウレタン内部の尿成分が残っていると臭いが戻ります。',
    columns: ['条件', '追加になりやすい理由', '目安'],
    rows: [
      {
        label: '座席1脚のみ',
        detail: '汚染が座面中心',
        hint: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
      },
      {
        label: 'フロア・足元まで到達',
        detail: 'マット下・吸音材側へ浸透',
        hint: '範囲見積',
      },
      {
        label: '消臭剤を多用済み',
        detail: '反応臭・除去工程が増える場合あり',
        hint: '写真診断推奨',
      },
      {
        label: '猫尿・長期間放置',
        detail: '深部浸透で完全無臭が難しい場合あり',
        hint: '限界を事前説明',
      },
    ],
  },
  omorashi: {
    title: 'おもらし｜今すぐの応急とNG',
    lead: 'シミと臭いの固定化を防ぐために、初動が重要です。',
    columns: ['やること', 'やらないこと', 'プロへ'],
    rows: [
      { label: 'タオルで押さえて吸水', detail: 'こすって広げない', hint: '当日〜翌日連絡が理想' },
      { label: '換気（外気導入）', detail: '塩素系・香料スプレー多用', hint: '反応臭に注意' },
      { label: '写真を撮って相談', detail: '完全乾燥して放置', hint: '座席1脚〜対応可' },
    ],
  },
  'interior-cleaning': {
    title: '通常の車内クリーニング｜基本と消臭の違い',
    lead: '緊急の嘔吐案件とはメニューが異なります。目的に合う階層を選べます。',
    columns: ['メニュー', '向いている目的', '目安'],
    rows: [
      {
        label: '基本洗浄',
        detail: '黄ばみ・ホコリ・軽い生活汚れをきれいにしたい',
        hint: `${yen(CAR_PRICING.lightBasic)}〜`,
      },
      {
        label: '消臭セット',
        detail: '臭いまでしっかり取りたい（染み込み臭）',
        hint: `${yen(CAR_PRICING.lightDeodorize)}〜`,
      },
      {
        label: '座席部分',
        detail: '気になる席だけ先に整えたい',
        hint: `${yen(CAR_PRICING.seatSingleBasic)}〜`,
      },
    ],
  },
};

const GUIDE_ALIASES: Record<string, string> = {
  'ac-kusai': 'ac-nioi',
  'ac-mold': 'evaporator-senjo',
  'odor-removal': 'kuruma-nioi-keshi',
  'seat-washing': 'seat-senjo',
  'mold-odor': 'shanai-nioi',
  unko: 'oshikko',
  'pet-unko': 'oshikko',
  'pet-waste': 'oshikko',
};

export function getAdLpIntentGuide(slug: string): IntentGuideBlock | undefined {
  const resolved = GUIDE_ALIASES[slug] ?? slug;
  return AD_LP_INTENT_GUIDES[resolved];
}

/** Themes where vomit/emergency education should stay muted on Ads KW LPs. */
export const NON_EMERGENCY_TROUBLE_TYPES = new Set([
  'odor',
  'ac',
  'seat',
  'aging-odor',
  'tobacco',
  'light',
]);

export function isNonEmergencyTroubleType(troubleType?: string): boolean {
  return !!troubleType && NON_EMERGENCY_TROUBLE_TYPES.has(troubleType);
}

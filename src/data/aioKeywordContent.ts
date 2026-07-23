import type { FAQItem } from '@/data/seoData';
import { CAR_PRICING, yen } from '@/data/pricingConstants';

export type EmergencyChecklistRow = {
  do: string;
  dont: string;
};

export type NicheCaseStudyBlock = {
  title: string;
  body: string;
};

export type SmellCauseRow = {
  cause: string;
  signal: string;
  firstAid: string;
  proNeeded: string;
};

export type KeroseneSeverityRow = {
  level: string;
  volume: string;
  penetration: string;
  action: string;
  costHint: string;
};

export type AioKeywordContent = {
  answerFirst: (regionName: string, displayName: string) => string;
  emergencyChecklist?: EmergencyChecklistRow[];
  nicheCaseStudy?: (regionName: string) => NicheCaseStudyBlock;
  extraFaqs?: FAQItem[];
  customDefinition?: (regionName: string) => string;
  troubleType?: string;
  smellCauseTable?: SmellCauseRow[];
  keroseneSeverityMatrix?: KeroseneSeverityRow[];
};

const EMERGENCY_VOMIT_CHECKLIST: EmergencyChecklistRow[] = [
  { do: '手袋を着用し、固形物を「すくい取る」（擦らない）', dont: 'ゴシゴシ擦る（繊維の奥に浸透）' },
  { do: '全ドア・窓を開け、外気導入で換気（内気循環NG）', dont: '市販の消臭スプレー・除菌剤（反応で悪臭化）' },
  { do: '乾いたタオルで水分を押し取り、乾燥を優先', dont: '大量の水をかける（汚れが拡散）' },
  { do: '4日以内にプロへ連絡（ウレタン浸透前が理想）', dont: '1週間放置（カビ・二次腐敗臭）' },
];

const EMERGENCY_KEROSENE_CHECKLIST: EmergencyChecklistRow[] = [
  { do: '火気厳禁・エンジン停止・全窓開放で換気', dont: 'ライター・タバコ・スパーク（引火リスク）' },
  { do: '新聞紙やタオルで「叩き当てて」吸い取る', dont: 'ゴシゴシ擦る（油分が広がる）' },
  { do: '薄めた中性洗剤で叩き拭き→別布で洗剤回収', dont: '大量の水をかける（フロア下へ浸透）' },
  { do: '臭いが残る・100cc超なら即プロへ相談', dont: '消臭スプレーだけで完了と判断（マスキングのみ）' },
];

const EMERGENCY_PET_CHECKLIST: EmergencyChecklistRow[] = [
  { do: '固形物を除去し、タオルで尿・便の水分を吸い取る', dont: '市販消臭スプレー（アンモニア反応で悪化）' },
  { do: '換気し、汚染箇所を特定（シート・フロア・隙間）', dont: '見えない範囲を放置（臭い固定化）' },
  { do: '当日〜翌日にプロへ連絡（酵素分解が必要）', dont: '重曹だけで完了と判断（内部層まで届かない）' },
];

const SMELL_CAUSE_TABLE: SmellCauseRow[] = [
  { cause: '嘔吐・ゲロ', signal: '酸っぱい腐敗臭・吐瀉物の残り香', firstAid: '固形物除去・全窓換気・タオルで水分吸い取り', proNeeded: '4日以内のリンサー洗浄（消臭セット）' },
  { cause: 'ペット尿・便', signal: 'アンモニア臭・獣臭', firstAid: 'タオルで吸い取り・換気（スプレー禁止）', proNeeded: '酵素分解＋温水リンサー（座席1脚〜）' },
  { cause: 'タバコ・ヤニ', signal: '刺激臭・天井のベタつき', firstAid: '換気のみ（拭き取りは専門推奨）', proNeeded: '天井〜フロア丸ごと洗浄＋オゾン脱臭' },
  { cause: '灯油こぼし', signal: '石油っぽい臭い・目・喉の痛み', firstAid: '火気厳禁・新聞紙で叩き吸い取り', proNeeded: '100cc超は専門洗浄（3万円〜/席）' },
  { cause: 'カビ・湿気', signal: 'かびくさい・ジメジメした臭い', firstAid: '除湿・換気・シート表面の乾燥', proNeeded: 'リンサー除菌洗浄（沖縄・梅雨時期に多発）' },
  { cause: '加齢臭・皮脂', signal: '脂っこい・古い布のような臭い', firstAid: '表面拭き・換気', proNeeded: 'シート丸洗い・温水抽出（黄ばみ同時除去）' },
  { cause: 'エアコン内部', signal: 'エアコンON時だけ酸っぱい・カビ臭', firstAid: 'フィルター清掃・外気導入', proNeeded: 'エバポレーター洗浄（原因は内部のカビ）' },
];

const KEROSENE_SEVERITY_MATRIX: KeroseneSeverityRow[] = [
  { level: '軽微', volume: '〜30cc', penetration: '表面・マット上のみ', action: '新聞紙吸い取り＋中性洗剤。臭い消失なら様子見可', costHint: '自助中心（専門は3万円〜/席）' },
  { level: '中等', volume: '30〜100cc', penetration: 'マット・シート表面まで', action: '専門洗浄を推奨。放置で吸音材へ浸透', costHint: `${yen(CAR_PRICING.kerosenePerSeat)}〜/席` },
  { level: '重症', volume: '100〜500cc', penetration: 'シート内部・フロア下吸音材', action: '専門洗浄必須。2日放置で臭い固定化リスク大', costHint: '3〜9万円（車種・範囲による）' },
  { level: '最重症', volume: '500cc超', penetration: '部品交換レベルまで到達の可能性', action: '専門洗浄＋保険相談。洗浄か交換かを見極め', costHint: '洗浄＋部品費（保険適用の可能性あり）' },
];

/** 地域ごとの事例用サンプル市区町村（大阪固定を回避） */
const REGION_SAMPLE_CITIES: Record<string, string> = {
  愛知県: '名古屋市',
  沖縄県: '那覇市',
  福岡県: '福津市',
  兵庫県: '神戸市',
  茨城県: 'つくば市',
  千葉県: '船橋市',
  埼玉県: '三郷市',
  神奈川県: '横浜市',
  滋賀県: '草津市',
  熊本県: '熊本市',
  宮城県: '仙台市',
  三重県: '四日市市',
  岐阜県: '岐阜市',
  栃木県: '壬生町',
  京都府: '京都市',
  東京都: '世田谷区',
  大阪府: '吹田市',
  群馬県: '前橋市',
  静岡県: '静岡市',
  奈良県: '奈良市',
  和歌山県: '和歌山市',
  佐賀県: '佐賀市',
  山口県: '下関市',
  福井県: '福井市',
};

function sampleCity(regionName: string): string {
  return REGION_SAMPLE_CITIES[regionName] ?? `${regionName.replace(/[都道府県]/g, '')}市内`;
}

function regionalCaseStudy(
  build: (city: string, regionName: string) => NicheCaseStudyBlock,
): (regionName: string) => NicheCaseStudyBlock {
  return (regionName) => build(sampleCity(regionName), regionName);
}

export const AIO_KEYWORD_CONTENT: Record<string, AioKeywordContent> = {
  'kyuto-cleaning': {
    troubleType: 'vomit',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内嘔吐の臭いを根本除去するには、嘔吐から4日以内に出張リンサー洗浄を依頼するのが最も確実です。市販の消臭スプレーは使わず、固形物をこすらず取り除いたうえで、40℃温水と特殊アルカリ電解水でシート内部（ウレタン層）まで抽出洗浄します。車内清掃「特急便」は${regionName}全域へ最短即日出張、電源・水道不要（発電機・水タンク完備）で対応。軽自動車基本${yen(CAR_PRICING.lightBasic)}〜、嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。保険適用のご相談も承ります。`,
    emergencyChecklist: EMERGENCY_VOMIT_CHECKLIST,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車内嘔吐の即日復旧事例`,
      body: `${city}でのドライブ中、お子様が突然嘔吐。営業車として翌日の使用が必要なケースで、約40℃温水リンサーと100℃スチームによりシート奥の吐瀉物を抽出。作業後は無臭状態に復元し、翌日の仕事に間に合うスピードで完了しました。`,
    })),
    customDefinition: (regionName) =>
      `${regionName}の車内嘔吐クリーニングとは、ご指定の駐車場へプロが出張し、酸性の嘔吐物をアルカリ電解水で中和したうえで温水リンサー抽出し、シート奥のウレタン層まで除菌・消臭する緊急専門サービスです。`,
    extraFaqs: [
      {
        q: '嘔吐した直後、自分でやってはいけないことは？',
        a: '①ゴシゴシ擦る ②市販消臭スプレー・除菌剤 ③大量の水をかける ④1週間放置。正しい初動は「固形物をすくい取る→全窓換気→タオルで水分吸い取り→4日以内にプロへ連絡」です。',
      },
    ],
  },
  unko: {
    troubleType: 'pet-waste',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のうんち汚れは、除菌とリンサー抽出をセットで行うのが安全です。大腸菌等の衛生リスクがあるため、固形物除去後はプロの温水洗浄・酵素分解が必要です。車内清掃「特急便」は${regionName}内へ最短即日出張。座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜（消臭セット）。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
  },
  'touyu-kobosi': {
    troubleType: 'kerosene',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内灯油こぼしは、火気厳禁で換気し、新聞紙で吸い取る（擦らない）のが第一応急処置です。灯油はシート内部・フロア下吸音材まで浸透すると完全消臭が困難なため、100cc以上の大量こぼしは専門洗浄が必要です。当店は${regionName}内へ最短即日出張。灯油専用洗浄${yen(CAR_PRICING.kerosenePerSeat)}〜／席。500cc超で部品交換が必要な場合も見極めのうえ保険活用をご提案します。`,
    emergencyChecklist: EMERGENCY_KEROSENE_CHECKLIST,
    keroseneSeverityMatrix: KEROSENE_SEVERITY_MATRIX,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜灯油500cc超の施工事例`,
      body: `ポリタンク転倒で500cc以上の灯油がフロアマット下の吸音材まで到達。2日放置後の依頼でしたが、3時間のリンサー抽出・中和洗浄で「乗れる状態」まで改善。完全無臭化には換気後の経過確認が必要な場合があり、当店は1週間後のフォロー連絡を標準実施。500cc超は洗浄か部品交換かを見極め、保険適用もご提案します。`,
    })),
    customDefinition: (regionName) =>
      `${regionName}の車内灯油こぼし洗浄とは、火気リスクを考慮した安全手順のうえ、炭化水素油分をリンサー抽出と中和洗浄でシート奥・フロア下まで除去する出張専門サービスです。`,
  },
  'pet-ke': {
    troubleType: 'pet-hair',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のペット毛・粗相は、掃除機だけでは繊維の織り目に残る毛と臭いの元を除去できません。特殊ブラシ・ピンセットによる手作業と温水リンサー洗浄の組み合わせが必要です。車内清掃「特急便」は${regionName}全域へ最短即日出張。ペット毛追加${yen(5_000)}〜、消臭洗浄セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
  },
  oshikko: {
    troubleType: 'pet-waste',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のおしっこ汚れは、尿アルカリを中和するプロのリンサー洗浄が必要です。市販消臭剤は表面のマスキングに留まり、ウレタン内部の臭いは残ります。${regionName}内へ最短即日出張、座席1脚消臭セット${yen(CAR_PRICING.seatSingleDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
  },
  omorashi: {
    troubleType: 'pet-waste',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のおもらし・尿染みは、早めの洗浄がシミ固定化を防ぎます。アルカリ性の尿汚れは水拭きだけでは中和できず、リンサー抽出が必要です。${regionName}内へ最短即日出張対応。座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
  },
  'pet-unko': {
    troubleType: 'pet-waste',
    answerFirst: (regionName) =>
      `【結論】${regionName}でペットの粗相（うんち・尿）は、除菌と消臭をセットにした出張リンサー洗浄が安全です。${regionName}内へ最短即日対応。消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
  },
  'shanai-nioi': {
    troubleType: 'odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内の臭いが消えない場合、原因は嘔吐・ペット・タバコ・灯油・カビ・加齢臭・エアコン内部のいずれかにあり、消臭スプレーではウレタン層の「臭いの元」を除去できません。臭いの種類を特定し、40℃温水リンサーで原因を物理抽出する出張洗浄が必要です。車内清掃「特急便」は${regionName}内へ365日24時間受付・最短即日出張。消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（所要約1.5〜3時間）。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    customDefinition: (regionName) =>
      `${regionName}の車内臭い取り（消臭）とは、臭いの原因（嘔吐・尿・タバコ・灯油・カビ等）を特定し、温水リンサー抽出でシート内部の汚れそのものを除去する出張専門サービスです。香料でごまかすマスキングではなく、原因除去が目的です。`,
    extraFaqs: [
      {
        q: '消臭スプレーを使っても臭いが戻るのはなぜ？',
        a: '市販スプレーは臭い分子を香料で覆い隠す「マスキング」です。シート内部（ウレタン層）に残った嘔吐物・尿・ヤニ・灯油はそのまま残るため、温度や湿度で再発します。根本解決には温水リンサーによる物理抽出が必要です。',
      },
      {
        q: '原因が分からなくても相談できますか？',
        a: 'はい。ON時だけ臭うか、常に臭うかなど症状から切り分け、エアコン洗浄か車内消臭かをご提案します。',
      },
    ],
  },
  'kuruma-nioitori': {
    troubleType: 'odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車の臭い取りを根本から行うには、原因特定→温水リンサー抽出の2ステップが必要です。カーディテーリングの香料消臭やオゾンだけでは再発しやすく、シート内部の汚れ除去が鍵です。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（所要の目安1.5〜3時間）。完全無臭を保証できないケース（長年のタバコ・猫尿など）は事前に限界をお伝えします。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車の匂い取り事例`,
      body: `${city}で「芳香剤を足しても数日で戻る生活臭」とのご相談。原因をシート内部の皮脂汚れと特定し、リンサー抽出で改善。完全無臭の保証はせず、改善見込みを事前説明したうえで施工した事例です。`,
    })),
    customDefinition: (regionName) =>
      `${regionName}の車の匂い取りとは、臭いの原因（生活臭・タバコ・ペット・エアコン等）を切り分けたうえで、温水リンサーとスチームで臭い分子の吸着先である汚れを洗い流す出張消臭洗浄です。`,
    extraFaqs: [
      {
        q: 'オゾンや消臭剤だけではダメですか？',
        a: '一時的な改善には有効な場合がありますが、シートウレタンや天井に吸着した汚れが残ると再発しやすいです。当店は原因除去の洗浄を主、必要に応じてオゾンを補助として使います。',
      },
      {
        q: '匂い取りの料金と時間の目安は？',
        a: `軽自動車の消臭セット${yen(CAR_PRICING.lightDeodorize)}〜が目安です。範囲により約1.5〜3時間。対応エリアは出張費無料でご案内します。`,
      },
    ],
  },
  'kuruma-nioi-keshi': {
    troubleType: 'odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車の臭い消し（消臭）を「完全」に近づけるには、消臭剤ではなくシート内部の汚れをリンサーで洗い流す必要があります。嘔吐・ペット・タバコ・灯油など原因別に洗浄メニューを使い分けます。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    customDefinition: (regionName) =>
      `${regionName}の車の匂い消しとは、香料マスキングではなく、臭いの原因汚れを温水抽出で除去する出張専門の消臭洗浄です。`,
    extraFaqs: [
      {
        q: '完全に無臭になりますか？',
        a: '多くのケースで大幅改善しますが、長年の喫煙・猫尿・灯油の深部浸透などは限界があります。施工前に改善見込みを正直にお伝えし、無理な約束はしません。',
      },
      {
        q: '匂い消しと車内クリーニングの違いは？',
        a: '匂い消しは臭いの原因除去が主目的、車内クリーニング（基本洗浄）は黄ばみ・生活汚れの見た目改善が主目的です。臭いが強い場合は消臭セットをご案内します。',
      },
    ],
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車の匂い消し事例`,
      body: `${city}で「消臭スプレーでは消えない車の匂い」とのご相談。生活臭とシート臭の複合と特定し、消臭セットで洗い出し。限界説明のうえで施工し、日常利用しやすい状態へ改善した事例です。`,
    })),
  },
  'shanai-shoshu': {
    troubleType: 'odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}の車内消臭で再発を防ぐには、消臭スプレーではなく温水リンサーによる原因除去が必要です。ウレタン層に染み込んだ嘔吐・尿・ヤニは香料では消えません。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    customDefinition: (regionName) =>
      `${regionName}の車内消臭・脱臭とは、シート・天井・フロアの汚れを洗い流し、臭い分子の発生源を減らす出張洗浄サービスです。`,
    extraFaqs: [
      {
        q: 'シート臭いだけでも依頼できますか？',
        a: '可能です。座席1脚からの部分施工もご案内します。ただし臭いがエアコン循環している場合は車内全体の洗浄をご提案することがあります。',
      },
    ],
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車内消臭・脱臭事例`,
      body: `${city}で「車内がなんとなく臭く、原因が分からない」とのご相談。シート臭い中心と判断し部分〜セット洗浄で改善。エアコンON時だけ臭う場合は内部洗浄も案内した事例です。`,
    })),
  },
  'tabako-yani': {
    troubleType: 'tobacco',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のタバコヤニ・臭いは、天井・シート・フロアを丸ごと温水洗浄し、オゾン脱臭を併用するのが最も効果的です。市販消臭剤はマスキングに留まり、天井裏のヤニは残ります。当店は${regionName}内へ出張対応。完全無臭化の成功率は70〜80%ですが、限界まで清潔な状態へ引き上げます。普通車消臭セット${yen(CAR_PRICING.regularDeodorize)}〜。`,
    customDefinition: (regionName) =>
      `${regionName}の車内タバコヤニ除去とは、天井からフロアまで温水リンサー洗浄とオゾン脱臭で、繊維に蓄積したタール・ニコチンを物理的に除去する出張専門サービスです。`,
    extraFaqs: [
      {
        q: '中古車のタバコ臭は100%消せますか？',
        a: '長年喫煙された車は天井裏・エアコン内部までヤニが浸透しており、完全無臭化は困難な場合があります。当店は施工前に臭いの程度を確認し、洗浄で改善可能な範囲を正直にお伝えします。成功率の目安は70〜80%です。',
      },
    ],
  },
  'chuko-tabako': {
    troubleType: 'tobacco',
    answerFirst: (regionName) =>
      `【結論】${regionName}で中古車のタバコ臭を落とすには、オゾン・消臭剤だけでなく天井・シートの温水リンサー洗浄が必要です。喫煙歴が長い車は天井裏のヤニが原因のため、丸ごと洗浄が効果的です。${regionName}内へ最短即日出張。`,
    customDefinition: (regionName) =>
      `${regionName}の中古車タバコ臭消しとは、蓄積したタール・ニコチンを温水抽出で除去し、オゾン脱臭で仕上げる出張専門サービスです。`,
  },
  'chuko-kareisyu': {
    troubleType: 'aging-odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で中古車の加齢臭（オールドカー臭）を改善するには、シート・天井・フロアに蓄積した皮脂・汗・菌を温水リンサーで洗い流す必要があります。消臭剤やオゾンだけでは戻りやすいケースが多く、洗浄による原因除去が有効です。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜／普通車基本${yen(CAR_PRICING.regularBasic)}〜（所要約2〜3時間）。完全無臭を保証できない場合は事前に限界をお伝えします。`,
    customDefinition: (regionName) =>
      `${regionName}の中古車加齢臭対策とは、前オーナーの皮脂・生活臭が吸着した天井・シート・荷室を温水リンサーで洗い、納車前・納車直後でも快適な車内へ整える出張サービスです。`,
    extraFaqs: [
      {
        q: '中古車の加齢臭はオゾンだけで取れますか？',
        a: '一時的に薄まることはありますが、皮脂汚れが残ると数日で戻ることが多いです。洗浄で臭いの吸着先を除去する方が再発しにくいです。',
      },
      {
        q: '料金と所要時間の目安は？',
        a: `消臭セット${yen(CAR_PRICING.lightDeodorize)}〜、普通車の基本洗浄${yen(CAR_PRICING.regularBasic)}〜が目安です。所要は約2〜3時間。納車前・納車直後どちらも対応できます。`,
      },
      {
        q: '完全に無臭になりますか？',
        a: '大幅な改善を目指しますが、長年の蓄積臭は完全無臭を保証できない場合があります。現地確認のうえで見込みをお伝えします。',
      },
    ],
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜中古車加齢臭の改善事例`,
      body: `${city}で納車直後の中古車「なんとなく生活臭・加齢臭がする」とのご相談。オゾンだけでは戻っていたため、天井・シートのリンサー洗浄を実施。家族同乗がしやすくなった事例です。`,
    })),
  },
  kareisyu: {
    troubleType: 'aging-odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内の加齢臭は、シート・天井の皮脂汚れと菌が原因です。換気や消臭剤では根本解決しにくく、温水リンサーによる丸洗いが効果的です。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（所要約2〜3時間）。完全無臭を保証できないケースは事前に説明します。`,
    customDefinition: (regionName) =>
      `${regionName}の車内加齢臭対策とは、気づきにくい皮脂・体臭成分が吸着した天井・シートを広範囲に洗浄し、エアコン循環で広がる臭いを抑える出張サービスです。`,
    extraFaqs: [
      {
        q: '自分では気づきにくい加齢臭でも依頼できますか？',
        a: 'はい。同乗者や家族からの指摘で気づくケースが多いです。臭いの強さに応じて範囲をご提案します。',
      },
      {
        q: '料金目安は？',
        a: `消臭セット${yen(CAR_PRICING.lightDeodorize)}〜、気になる席だけの場合は座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜も可能です。`,
      },
    ],
  },
  'spray-kouka-nai': {
    troubleType: 'odor',
    answerFirst: (regionName) =>
      `【結論】消臭スプレーが効かない理由は、臭いの原因がシート内部（ウレタン層）に残っているためです。スプレーは表面のマスキングに過ぎず、嘔吐・尿・タバコ・灯油の臭いは再発します。${regionName}では温水リンサー抽出による原因除去が必要です。車内清掃「特急便」は最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    extraFaqs: [
      {
        q: '消臭スプレーを何本使っても臭いが消えない場合は？',
        a: 'スプレーの成分が汚れと化学反応し、かえって悪臭化することもあります。嘔吐・尿・灯油の場合はスプレー使用を中止し、固形物除去・換気のうえ4日以内にプロのリンサー洗浄をご検討ください。',
      },
    ],
  },
  'seat-senjo': {
    troubleType: 'seat',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車シート洗浄（黄ばみ・シミ抜き）を効果的に行うには、素材に合わせた泡洗いと温水リンサー抽出が必要です。市販クリーナーではウレタン内部の汚れまで届きません。${regionName}内へ出張対応、座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜、消臭セット${yen(CAR_PRICING.seatSingleDeodorize)}〜。電源・水道不要。所要約1〜2時間。`,
    customDefinition: (regionName) =>
      `${regionName}の車シート洗浄とは、出張専門スタッフがシート素材（布・合皮）に合わせた洗浄剤と温水リンサーで、黄ばみ・飲みこぼし・汗ジミを内部まで洗い流すサービスです。`,
    extraFaqs: [
      {
        q: '1脚だけ頼めますか？',
        a: `はい。座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜から対応します。臭いが強い席は消臭メニュー${yen(CAR_PRICING.seatSingleDeodorize)}〜をご案内します。`,
      },
      {
        q: '布シートと革シートの違いは？',
        a: '布は泡洗い＋リンサー抽出が中心です。革・合皮は状態確認のうえ工程を調整し、無理な強い洗浄は避けます。',
      },
      {
        q: '落ちにくい汚れはありますか？',
        a: '長年固着した染料染み・漂白跡などは完全除去が難しい場合があります。見積時に見込みをお伝えします。',
      },
    ],
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜シート黄ばみ洗浄事例`,
      body: `${city}の軽自動車で運転席の汗・皮脂黄ばみが気になるとのご依頼。1脚の泡洗い＋リンサーで見た目と臭いを改善し、当日中に利用再開できた事例です。`,
    })),
  },
  'seat-cleaning': {
    troubleType: 'seat',
    answerFirst: (regionName) =>
      `【結論】${regionName}の車シートクリーニングは、座席まるごとの温水洗浄・乾燥が基本です。皮脂・飲食汚れが臭いの原因になるため、表面拭きでは不十分なケースが多いです。${regionName}内へ最短即日出張、座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜／消臭${yen(CAR_PRICING.seatSingleDeodorize)}〜（所要約1〜2時間）。`,
    customDefinition: (regionName) =>
      `${regionName}の車シートクリーニングとは、座席の皮脂・飲食汚れ・臭いの元を温水リンサーで洗い、乾燥まで行う出張サービスです。1脚からの部分依頼も可能です。`,
    extraFaqs: [
      {
        q: 'シートクリーニングの料金目安は？',
        a: `座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜が基本です。臭いが強い場合は${yen(CAR_PRICING.seatSingleDeodorize)}〜。全席は車種に応じて見積します。`,
      },
      {
        q: '布と革、どちらも対応できますか？',
        a: '布・合皮を中心に対応します。本革は状態により工程・可否が異なるため、事前にご相談ください。',
      },
      {
        q: '所要時間は？',
        a: '1脚中心なら約1〜2時間、複数席や消臭セット併用はそれ以上になることがあります。',
      },
    ],
  },
  'ac-nioi': {
    troubleType: 'ac',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車のエアコン臭い（酸っぱい・カビ臭）の原因は、ダッシュボード内エバポレーター（蒸発器）のカビ・雑菌が大半です。フィルター清掃だけでは不十分な場合が多く、エアコン内部洗浄（簡易${yen(CAR_PRICING.acInternalWash)}〜）と必要に応じた車内洗浄のセットが効果的です。${regionName}内へ出張対応、所要の目安1〜2.5時間。`,
    customDefinition: (regionName) =>
      `${regionName}の車エアコン臭い対策とは、エバポレーター内部のカビ・雑菌を専用洗浄剤と吸引で除去し、エアコンON時の酸っぱい臭いを根本改善する出張サービスです。フィルター交換だけでは残る臭いへの専門対応です。`,
    extraFaqs: [
      {
        q: 'フィルター交換とエアコンクリーニングの違いは？',
        a: 'フィルター交換は吸入側のゴミ対策が中心です。ON時だけ出る酸っぱい・カビ臭はエバポレーター内部の菌が原因のことが多く、内部洗浄が必要です。',
      },
      {
        q: 'エアコン内部洗浄（簡易）10,000円には何が含まれますか？',
        a: '吹き出し口からの専用洗浄剤噴霧・吸引による簡易内部洗浄が中心です。車種・臭気の強さにより追加工程や車内洗浄セットをご提案する場合があります。無理なアップセルはしません。',
      },
      {
        q: 'シートの臭いもある場合は？',
        a: `エアコン内部とシート・天井の生活臭が混ざるケースがあります。その場合は消臭セット（軽自動車${yen(CAR_PRICING.lightDeodorize)}〜）との併用をご案内します。`,
      },
    ],
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜エアコンON時の酸っぱい臭い改善事例`,
      body: `${city}の普通車で「エアコンを入れると酸っぱい臭いがする」とのご相談。フィルター交換済みでも再発していたため、エバポレーター簡易内部洗浄と車内の湿度・汚れケアを実施。施工後はON時の刺激臭が大幅に軽減し、日常利用に戻れた事例です。`,
    })),
  },
  'ac-kusai': {
    troubleType: 'ac',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車のエアコンが臭い（クサイ）場合、原因はエバポレーター内部のカビであることが多いです。消臭スプレーやフィルター交換だけでは再発しやすいです。エアコン内部洗浄${yen(CAR_PRICING.acInternalWash)}〜で${regionName}内へ出張対応（所要約1〜2.5時間）。`,
    customDefinition: (regionName) =>
      `${regionName}のエアコン臭い・クサイ対策とは、ON時に出る酸っぱい臭の原因となる内部カビを出張で洗浄・吸引し、必要に応じて車内洗浄とセットで整えるサービスです。`,
    extraFaqs: [
      {
        q: 'フィルター交換だけでクサイ臭は消えますか？',
        a: '吸入側のゴミ対策には有効ですが、ON時だけ出る酸っぱい臭は内部カビが原因のことが多く、内部洗浄が必要です。',
      },
      {
        q: '料金目安は？',
        a: `エアコン内部洗浄（簡易）${yen(CAR_PRICING.acInternalWash)}〜。シート臭も強い場合は消臭セット${yen(CAR_PRICING.lightDeodorize)}〜との併用をご案内します。`,
      },
    ],
  },
  'evaporator-senjo': {
    troubleType: 'ac',
    answerFirst: (regionName) =>
      `【結論】${regionName}でエバポレーター（蒸発器）洗浄は、車のエアコン臭い・カビ臭の根本対策です。ダッシュボード内の部品を専用洗浄剤で洗浄し、吸引で汚れを除去します。簡易内部洗浄${yen(CAR_PRICING.acInternalWash)}〜。${regionName}内へ出張対応（所要約1〜2.5時間）。シート洗浄とセットで車内全体の空気品質を改善できます。`,
    customDefinition: (regionName) =>
      `${regionName}のエバポレーター洗浄とは、車両ダッシュボード内の蒸発器に付着したカビ・雑菌を専門洗浄剤で分解・除去し、エアコンから出る臭いを根本改善する出張サービスです。`,
    extraFaqs: [
      {
        q: 'エバポレーターとは何ですか？',
        a: 'エアコン内部の蒸発器です。ここにカビが付くと、ON時だけ酸っぱい・カビ臭が出やすくなります。',
      },
      {
        q: '分解洗浄と簡易洗浄の違いは？',
        a: '当店のエアコン内部洗浄（簡易）は、出張で吹き出し口から洗浄・吸引する工程です。フル分解は工場預かりが必要な場合があり、臭いの程度・車種に応じて可否をご説明します。',
      },
      {
        q: 'シート洗浄とセットにした方がいいですか？',
        a: `エアコン臭だけなら内部洗浄中心で足りることがあります。シート・天井の生活臭が併発している場合は座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜や消臭セットをご提案します。`,
      },
    ],
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜エバポレーター洗浄事例`,
      body: `${city}の普通車で「エアコンON時だけカビ臭」とのご相談。簡易内部洗浄後、試運転で刺激臭が大幅に軽減。シート臭も軽度だったため追加は最小限にした事例です。`,
    })),
  },
  'car-ac-cleaning': {
    troubleType: 'ac',
    answerFirst: (regionName) =>
      `【結論】${regionName}の車エアコンクリーニングは、フィルター清掃に加えエバポレーター内部洗浄が効果的です。エアコンON時だけ臭う場合は内部カビが原因です。内部洗浄${yen(CAR_PRICING.acInternalWash)}〜、車内消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。${regionName}内へ出張対応。`,
    customDefinition: (regionName) =>
      `${regionName}の車エアコンクリーニングとは、エアコン臭いの原因となる内部カビ・雑菌への洗浄と、必要に応じた車内全体の消臭洗浄を組み合わせる出張サービスです。`,
    extraFaqs: [
      {
        q: 'カーエアコンクリーニングの料金目安は？',
        a: `エアコン内部洗浄（簡易）${yen(CAR_PRICING.acInternalWash)}〜が基本です。シートや天井の臭いも強い場合は消臭セット（軽自動車${yen(CAR_PRICING.lightDeodorize)}〜）とのセットをご提案します。`,
      },
      {
        q: 'どれくらい時間がかかりますか？',
        a: 'エアコン内部洗浄中心なら約1〜2時間、車内洗浄セットなら約2〜3時間が目安です。当日の空き状況はお電話・LINEでご確認ください。',
      },
    ],
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車エアコンクリーニング事例`,
      body: `${city}で「ディーラーのフィルター交換だけでは改善しなかった」エアコン臭いのご依頼。内部洗浄と車内の生活臭ケアをセット施工し、ON時のカビ臭を大きく改善しました。`,
    })),
  },
  'pet-nioi': {
    troubleType: 'pet-odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のペット臭は、尿・毛・皮脂がシート内部に蓄積していることが原因です。消臭剤では再発し、温水リンサーと酵素分解が必要です。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（所要約2〜3時間）。後部座席1脚からでも対応できます。`,
    customDefinition: (regionName) =>
      `${regionName}のペット臭対策とは、犬・猫同乗で付いた獣臭・尿臭・皮脂臭を、毛の除去と酵素分解・温水リンサー洗浄でまとめてケアする出張サービスです。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
    extraFaqs: [
      {
        q: 'ペット臭の料金目安は？',
        a: `消臭セット${yen(CAR_PRICING.lightDeodorize)}〜が標準です。後部座席だけなら座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜からご相談ください。`,
      },
      {
        q: '毛取りもセットですか？',
        a: 'はい。臭いの元になる毛・皮脂汚れも吸引と手作業で取り除いたうえで洗浄します。',
      },
    ],
  },
  ase: {
    troubleType: 'seat',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内の汗臭い・汗ジミは、シートに染み込んだ皮脂と菌が原因です。換気だけでは消えず、温水リンサーによるシート洗浄が効果的です。${regionName}内へ出張対応。`,
  },
  'hoken-kyuto': {
    troubleType: 'vomit',
    answerFirst: (regionName) =>
      `【結論】${regionName}で嘔吐汚損の車両保険適用は「偶然の事故による車内汚損」として認められる場合があります。車両保険（免責3〜10万円・等級ダウンあり）または個人賠償（他人の車を汚した場合）が該当します。当店は${regionName}内へ最短即日出張し、見積時に保険利用時の実質自己負担額を併記。施工報告書・写真付き見積で申請をサポートします。`,
    emergencyChecklist: EMERGENCY_VOMIT_CHECKLIST,
    extraFaqs: [
      {
        q: '嘔吐の車内清掃で保険を使うと等級は下がりますか？',
        a: '車両保険（一般型）を使う場合、等級ダウンと免責金額（3〜10万円）が発生します。一方、友人の車を汚した場合の個人賠償責任保険は等級に影響しないことが多いです。当店は見積時に「保険利用時の実質負担額」と「自己負担払い」を比較してご提案します。',
      },
      {
        q: 'カーシェアで嘔吐した場合、保険は使えますか？',
        a: 'カーシェア・レンタカーは規約上、クリーニング実費＋休業補償（NOC）が自己負担となるケースが一般的です。個人賠償が使える場合もありますが、まずは当店へご相談ください。領収書・施工報告書を発行します。',
      },
    ],
  },
  'kodomo-kyuto': {
    troubleType: 'vomit',
    answerFirst: (regionName) =>
      `【結論】${regionName}で子どもの車内嘔吐は、4日以内の出張リンサー洗浄が最も確実です。市販消臭スプレーは使わず、固形物をこすらず取り除き、40℃温水でシート内部まで洗浄します。${regionName}内へ最短即日出張、嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_VOMIT_CHECKLIST,
  },
  'dengen-fuyou': {
    answerFirst: (regionName) =>
      `【結論】車内清掃「特急便」の${regionName}出張施工は、電源・水道の用意が不要です。出張車両に発電機と水タンクを完備しており、マンション地下駐車場・月極駐車場・会社の車庫など、車が停められる場所であれば施工可能です。`,
    extraFaqs: [
      {
        q: 'マンションの地下駐車場でも施工できますか？',
        a: 'はい、可能です。電源・水道がない場所でも、出張車両の発電機と水タンクで作業します。排水は汚水回収タンクで持ち帰るため、駐車場を汚す心配もありません。',
      },
    ],
  },
  'shutchou-senmon': {
    answerFirst: (regionName) =>
      `【結論】${regionName}の出張車内清掃専門店として、車内清掃「特急便」は365日24時間受付・最短即日対応です。嘔吐・灯油・ペット・タバコ臭など特殊案件に特化し、電源・水道不要でご指定の駐車場へ訪問。施工歴3年以上・年間300台超の専門員が対応します。`,
    customDefinition: (regionName) =>
      `${regionName}の出張車内清掃専門サービスとは、プロの温水リンサー・特殊アルカリ電解水を用い、ご指定場所へ訪問してシート内部まで洗浄・消臭するサービスです。ディーラー持ち込み不要・即日復旧が可能です。`,
  },
  'interior-cleaning': {
    troubleType: 'light',
    answerFirst: (regionName) =>
      `【結論】${regionName}の通常の車内クリーニング（基本洗浄）は、シートの黄ばみ・生活汚れ・飲みこぼし向けの出張リンサー洗浄です。嘔吐・灯油・ペット粗相などの緊急・特殊臭は消臭セット（別メニュー）になります。電源・水道不要で駐車場があれば施工可能。軽自動車基本${yen(CAR_PRICING.lightBasic)}〜、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。所要約1.5〜3時間。`,
    customDefinition: (regionName) =>
      `${regionName}の車内クリーニング（基本洗浄）とは、緊急案件ではない黄ばみ・生活汚れを中心に、出張専門スタッフがシート・フロアを温水リンサーで洗浄するサービスです。`,
    extraFaqs: [
      {
        q: '基本洗浄と消臭セットの違いは？',
        a: `基本洗浄（軽自動車${yen(CAR_PRICING.lightBasic)}〜）は黄ばみ・生活汚れ向けです。嘔吐・灯油・ペット粗相など臭いが強い特殊案件は消臭セット（${yen(CAR_PRICING.lightDeodorize)}〜）をご案内します。`,
      },
      {
        q: '緊急の嘔吐でもこのページから頼めますか？',
        a: 'はい、ご相談いただけます。内容に応じて嘔吐クリーニングなど専用メニューへご案内し、工程と料金を明確にします。',
      },
      {
        q: '所要時間は？',
        a: '基本洗浄は約1.5〜3時間が目安です。範囲や車種により前後します。',
      },
    ],
  },
  'specialist-cleaning': {
    troubleType: 'light',
    answerFirst: (regionName) =>
      `【結論】${regionName}の車内クリーニング専門店として、車内清掃「特急便」は年間300台超の施工実績。シート洗浄から消臭まで出張で対応し、電源・水道不要・最短即日です。通常の基本洗浄は軽自動車${yen(CAR_PRICING.lightBasic)}〜。${regionName}内へ365日24時間受付。`,
    customDefinition: (regionName) =>
      `${regionName}の車内クリーニング専門店サービスとは、プロ機材と経験豊富な専門員が出張し、シート内部まで洗浄・消臭する専門サービスです。`,
  },
};

const AIO_SLUG_ALIASES: Record<string, string> = {
  'vomit-cleaning': 'kyuto-cleaning',
  'gero-cleaning': 'kyuto-cleaning',
  'mobile-cleaning': 'shutchou-senmon',
  'seat-washing': 'seat-senjo',
  'odor-removal': 'kuruma-nioi-keshi',
  'ac-mold': 'evaporator-senjo',
  'tobacco-odor': 'tabako-yani',
  'pet-waste': 'pet-unko',
  'mold-odor': 'shanai-nioi',
  'pet-hair-odor': 'oshikko',
};

export function getAioKeywordContent(slug: string): AioKeywordContent | undefined {
  const key = AIO_SLUG_ALIASES[slug] ?? slug;
  return AIO_KEYWORD_CONTENT[key];
}

/** AIOContent / JSON-LD 共通FAQ（表示とスキーマの一致用） */
export function buildAioContentFaqs(
  regionName: string,
  options: { includeExtended?: boolean; extraFaqs?: FAQItem[] } = {},
): FAQItem[] {
  const { includeExtended = true, extraFaqs = [] } = options;
  const core: FAQItem[] = [
    {
      q: '今日（または明日）すぐに来てほしいのですが、可能ですか？',
      a: `はい、${regionName}内であればスケジュール次第で最短即日・または翌日の出張が可能です。嘔吐などの緊急トラブルは時間が勝負ですので、まずはお電話にて空き状況をご確認ください。`,
    },
    {
      q: '水道や電源は用意する必要がありますか？',
      a: 'いいえ、必要ありません。当店の出張車両には専用の発電機と水タンクを積載しているため、マンションの駐車場や月極駐車場、会社など、車が停められる場所であればどこでも作業可能です。',
    },
    {
      q: '市販の消臭スプレーと何が違うのですか？',
      a: '市販のスプレーは臭いの成分を別の香料で包み込む「マスキング」であり、汚れ自体はシート内に残ったままです。当店の洗浄は、洗剤で汚れを浮かし、温水で洗い流しながら同時に強力に吸い取る（リンサー抽出）ため、ニオイの「元」そのものを物理的に車外へ排除します。',
    },
  ];
  return [...core, ...(includeExtended ? AIO_EXTENDED_FAQS : []), ...extraFaqs];
}

export const REGIONAL_EMERGENCY_CHECKLIST: EmergencyChecklistRow[] = [
  { do: '手袋を着用し、固形物を「すくい取る」（擦らない）', dont: 'ゴシゴシ擦る（繊維の奥に浸透）' },
  { do: '全ドア・窓を開け、外気導入で換気（内気循環NG）', dont: '市販の消臭スプレー・除菌剤（反応で悪臭化）' },
  { do: '灯油は火気厳禁・新聞紙で「叩き当てて」吸い取る', dont: 'ライター・タバコ・大量の水（引火・浸透リスク）' },
  { do: '乾いたタオルで水分を押し取り、乾燥を優先', dont: '1週間放置（カビ・二次腐敗臭・臭い固定化）' },
  { do: '4日以内にプロへ連絡（ウレタン浸透前が理想）', dont: '消臭スプレーだけで完了と判断（マスキングのみ）' },
];

export function buildRegionalAnswerFirst(regionName: string): string {
  return `【結論】${regionName}で車内嘔吐・ニオイ・シート汚れを今すぐ解決するなら、市販消臭スプレーを使わず、4日以内に出張リンサー洗浄を依頼してください。`;
}

export function buildRegionalAnswerTargetPoints(regionName: string): string[] {
  return [
    `最短即日対応・365日24時間受付。軽自動車基本${yen(CAR_PRICING.lightBasic)}〜、嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    `施工歴3年以上・年間300台超の専門員が${regionName}の指定駐車場へ直接訪問。電源・水道は不要（発電機・水タンク完備）。`,
    '車両保険・個人賠償の代理申請に対応し、見積時に実質自己負担額も併記します。',
  ];
}

import { REGIONAL_FV_MAIN_TITLES } from './fvAdGroupCopy';

export function getRegionalHeroMainTitle(regionName: string): string | undefined {
  return REGIONAL_FV_MAIN_TITLES[regionName];
}

export function buildRegionalNioiAnswerFirst(regionName: string): string {
  return `表面の軽い臭いは換気と重曹で一時改善できますが、嘔吐・ペット・タバコ・灯油のニオイはシート内部（ウレタン層）に原因が残るため、消臭スプレーだけでは再発します。臭いが翌日以降も残る場合は、温水リンサー抽出洗浄のプロ依頼が必要です。車内清掃「特急便」は${regionName}内へ365日24時間受付・最短即日出張。施工歴3年以上の専門員が40℃温水とアルカリ電解水で原因を物理抽出し、電源・水道は不要（発電機・水タンク完備）です。嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`;
}

export const AIO_EXTENDED_FAQS: FAQItem[] = [
  {
    q: 'カーシェア・レンタカーで嘔吐した場合、費用はいくら？保険は使えますか？',
    a: 'タイムズカーシェア等では「クリーニング実費＋休業補償2万円（NOC）」が最低ラインとなるケースが一般的です。個人賠償責任保険が使える場合もありますが、カーシェア規約では自己負担となることが多いです。当店は領収書・施工報告書を発行し、保険会社への申請資料作成もサポートします。まずはお電話で状況をお伝えください。',
  },
  {
    q: '灯油をこぼした直後、自分でやってはいけないことは？',
    a: '①火気厳禁（ライター・タバコ・エンジン始動）②消臭スプレー・アルコールの使用（マスキングで悪化）③ゴシゴシ擦る（油分拡散）④大量の水をかける（フロア下へ浸透）。正しい初動は「全窓開放→新聞紙で叩き当てて吸い取り→薄めた中性洗剤で叩き拭き」です。100cc超・臭いが残る場合は即プロへご相談ください。',
  },
  {
    q: '嘔吐から4日以上経っても、プロ洗浄で改善できますか？',
    a: '4日超過でも改善可能なケースは多いですが、ウレタン層への浸透度合いで作業時間・費用が増え、完全無臭化が難しくなる場合があります。当店は施工前に染み込み度を確認し、シート脱着が必要か事前にお伝えします。「もう手遅れかも…」と諦める前に、写真付きで無料相談をご利用ください。',
  },
];

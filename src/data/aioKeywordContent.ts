import type { FAQItem } from '@/data/seoData';
import { CAR_PRICING, yen } from '@/data/pricingConstants';
import {
  needsOutletBorrow,
  powerCapabilitySentence,
  powerFaqAnswer,
  OUTLET_BORROW_SHORT,
} from '@/lib/powerPolicy';

function powerPhrase(regionName: string): string {
  return needsOutletBorrow(regionName)
    ? OUTLET_BORROW_SHORT
    : '電源・水道不要（発電機・水タンク完備）';
}

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

/** GEO: situation → next action → recommended menu */
export type SituationDiagnosisRow = {
  situation: string;
  now: string;
  menu: string;
  priceHint: string;
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
  situationDiagnosis?: SituationDiagnosisRow[];
  checklistHeading?: string;
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

/** Odor / AC intent — avoid vomit-first framing on Ads KW LPs */
export const ODOR_SITUATION_DIAGNOSIS: SituationDiagnosisRow[] = [
  {
    situation: 'エアコンON時だけ臭う',
    now: 'フィルター確認・外気導入。スプレー多用は避ける',
    menu: 'エアコン内部洗浄（簡易）',
    priceHint: `${yen(CAR_PRICING.acInternalWash)}〜`,
  },
  {
    situation: 'シートに座ると臭う／染みる',
    now: '換気。市販消臭剤の重ね噴きは控える',
    menu: '座席1脚〜のリンサー洗浄（消臭セット）',
    priceHint: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
  },
  {
    situation: '天井・車内全体にこもる',
    now: '芳香剤を外して臭いの本体を確認',
    menu: '車内消臭セット（天井〜フロア）',
    priceHint: `${yen(CAR_PRICING.lightDeodorize)}〜`,
  },
  {
    situation: '中古車購入直後から生活臭',
    now: '販売店清掃との差を写真で共有',
    menu: '消臭セット丸洗い（加齢臭・前オーナー臭）',
    priceHint: `${yen(CAR_PRICING.regularDeodorize)}〜`,
  },
  {
    situation: '軽い黄ばみ・ホコリ中心',
    now: '目的が「きれいに見せる」なら基本洗浄から',
    menu: '基本洗浄（通常の車内クリーニング）',
    priceHint: `${yen(CAR_PRICING.lightBasic)}〜`,
  },
];

const EMERGENCY_URINE_CHECKLIST: EmergencyChecklistRow[] = [
  { do: '乾いたタオルで押さえて水分を吸い取る（こすらない）', dont: 'ゴシゴシ擦る（シミと臭いが広がる）' },
  { do: '全窓開放・外気導入で換気', dont: '塩素系・香料スプレーの多用（反応臭・除去困難化）' },
  { do: '汚染範囲の写真を撮って相談（座席／フロア）', dont: '完全乾燥するまで放置（臭い固定化）' },
  { do: '当日〜翌日にプロへ連絡（座席1脚から対応可）', dont: '重曹だけで完了と判断（内部層まで届かない）' },
];

/** GEO: 「自分の状況に合う最適な提案」 */
export const REGIONAL_SITUATION_DIAGNOSIS: SituationDiagnosisRow[] = [
  {
    situation: '嘔吐から24時間以内',
    now: 'こすらず除去・換気・消臭スプレー禁止',
    menu: '嘔吐消臭セット（温水リンサー抽出）',
    priceHint: `${yen(CAR_PRICING.lightDeodorize)}〜`,
  },
  {
    situation: '嘔吐から4日超過',
    now: '写真で無料診断（手遅れ判断はしない）',
    menu: 'リンサー＋染み込み度診断（脱着可否）',
    priceHint: '見積（範囲で変動）',
  },
  {
    situation: '灯油〜30cc・表面のみ',
    now: '火気厳禁・新聞紙で吸い取り',
    menu: '自助→残臭があれば専門洗浄',
    priceHint: '専門は3万円〜/席',
  },
  {
    situation: '灯油100cc超',
    now: '火気厳禁・即連絡（フロア下浸透前）',
    menu: '灯油専用洗浄',
    priceHint: `${yen(CAR_PRICING.kerosenePerSeat)}〜/席`,
  },
  {
    situation: '手が離せない／運転中の急な汚れ',
    now: '安全停車→換気→電話またはLINE写真',
    menu: '最短即日出張枠の空き確認',
    priceHint: '空き状況を電話で案内',
  },
  {
    situation: '夜中・休日に吐かれた／今すぐ来てほしい',
    now: '消臭スプレー禁止・換気・365日24時間受付へ電話',
    menu: '当日深夜〜翌朝の即日枠を案内',
    priceHint: '空き状況を電話で案内',
  },
  {
    situation: '近くの業者を今すぐ呼びたい（地下駐車場）',
    now: 'エリアと希望時間を伝えて空き枠を確認',
    menu: '出張洗浄（エリアにより電源条件が異なります）',
    priceHint: `基本${yen(CAR_PRICING.lightBasic)}〜`,
  },
];

/** Vomit-focused diagnosis (exclude kerosene-only rows on vomit LPs) */
export const VOMIT_SITUATION_DIAGNOSIS: SituationDiagnosisRow[] =
  REGIONAL_SITUATION_DIAGNOSIS.filter(
    (r) => !r.situation.includes('灯油'),
  );

/** GEO: pet waste / hair — situation → menu */
export const PET_SITUATION_DIAGNOSIS: SituationDiagnosisRow[] = [
  {
    situation: 'ペットが助手席で粗相（尿・便）した直後',
    now: '固形物除去→タオルで吸い取り→香料スプレー禁止',
    menu: '酵素分解＋座席リンサー（消臭セット）',
    priceHint: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
  },
  {
    situation: '乾いて見えないがアンモニア臭が残る',
    now: '汚染箇所の写真を撮って相談（見た目判断は不可）',
    menu: '座席1脚〜の酵素＋リンサー',
    priceHint: `${yen(CAR_PRICING.seatSingleDeodorize)}〜`,
  },
  {
    situation: '毛だらけで掃除機では取れない',
    now: '無理にブラシで擦らない（織り目に押し込む）',
    menu: '特殊ブラシ・ピンセット手作業＋リンサー',
    priceHint: `毛追加${yen(5_000)}〜／消臭${yen(CAR_PRICING.lightDeodorize)}〜`,
  },
  {
    situation: '運転中・手が離せないときの粗相',
    now: '安全停車→換気→タオル押さえる→電話/LINE',
    menu: '最短即日出張枠の空き確認',
    priceHint: '空き状況を電話で案内',
  },
  {
    situation: 'チャイルドシート／カートも一緒に洗いたい',
    now: '取り外し可否を写真で共有',
    menu: '座席＋チャイルドシート洗浄（要見積）',
    priceHint: '見積（素材で変動）',
  },
];

/** GEO: tobacco — DIY boundary + menu */
export const TOBACCO_SITUATION_DIAGNOSIS: SituationDiagnosisRow[] = [
  {
    situation: '中古車納車直後からタバコ臭い',
    now: '芳香剤を外して本体臭を確認。販売店清掃との差を写真共有',
    menu: '天井〜フロア丸洗い＋オゾン脱臭',
    priceHint: `${yen(CAR_PRICING.regularDeodorize)}〜`,
  },
  {
    situation: '天井がベタつく／ヤニが目立つ',
    now: '市販クリーナーで強く擦らない（ムラ・傷み）',
    menu: '天井重点の温水リンサー＋ヤニ分解',
    priceHint: `${yen(CAR_PRICING.regularDeodorize)}〜`,
  },
  {
    situation: '消臭剤・オゾン後に数日で戻る',
    now: 'マスキング終了。内部ヤニ除去が必要',
    menu: '丸ごと洗浄（完全無臭化は70〜80%目安）',
    priceHint: `${yen(CAR_PRICING.regularDeodorize)}〜`,
  },
  {
    situation: '軽い喫煙・短期間のみ',
    now: '換気＋シート表面の状態確認',
    menu: '座席〜天井の範囲見積（部分可）',
    priceHint: '見積（範囲で変動）',
  },
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
    checklistHeading: '車内で吐いた直後、自分で何をすればいい？',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内嘔吐の臭いを根本除去するには、嘔吐から4日以内に出張リンサー洗浄を依頼するのが最も確実です。市販の消臭スプレーは使わず、固形物をこすらず取り除いたうえで、40℃温水と特殊アルカリ電解水でシート内部（ウレタン層）まで抽出洗浄します。車内清掃「特急便」は${regionName}全域へ最短即日出張、${powerPhrase(regionName)}で対応。運転中・手が離せない方も電話で空き状況をご案内。軽自動車基本${yen(CAR_PRICING.lightBasic)}〜、嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。保険適用のご相談も承ります。`,
    emergencyChecklist: EMERGENCY_VOMIT_CHECKLIST,
    situationDiagnosis: VOMIT_SITUATION_DIAGNOSIS,
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
    checklistHeading: '車内でうんち・粗相した直後、自分で何をすればいい？',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のうんち汚れは、除菌とリンサー抽出をセットで行うのが安全です。大腸菌等の衛生リスクがあるため、固形物除去後はプロの温水洗浄・酵素分解が必要です。車内清掃「特急便」は${regionName}内へ最短即日出張。座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（所要約1〜2.5時間）。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車内うんち汚れの除菌洗浄事例`,
      body: `${city}でペットの粗相後、市販シートクリーナーでは臭いが残ったケース。酵素分解と温水リンサーでシート溝まで除菌洗浄し、同日中に乗れる状態へ復旧。衛生面の不安を先に説明したうえで施工した事例です。`,
    })),
    extraFaqs: [
      {
        q: 'うんち汚れは自分で拭いただけでも大丈夫？',
        a: '表面の固形物除去は有効ですが、繊維奥の残渣や菌は残りやすく臭いが再発します。除菌とリンサー抽出のセットを推奨します。',
      },
      {
        q: '料金と所要時間の目安は？',
        a: `座席1脚（消臭）${yen(CAR_PRICING.seatSingleDeodorize)}〜、複数席や強い臭いは消臭セット${yen(CAR_PRICING.lightDeodorize)}〜が目安です。所要は約1〜2.5時間です。`,
      `【結論】${regionName}で車内のうんち汚れは、除菌とリンサー抽出をセットで行うのが安全です。大腸菌等の衛生リスクがあるため、固形物除去後はプロの温水洗浄・酵素分解が必要です。香料スプレーは使わず、タオルで水分を吸い取ってから電話相談を。車内清掃「特急便」は${regionName}内へ365日24時間受付・最短即日出張。座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜（消臭セット）。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
    situationDiagnosis: PET_SITUATION_DIAGNOSIS,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車内うんち・粗相の除菌洗浄事例`,
      body: `${city}でペットの粗相後、「自分で拭いたが酸っぱい臭いとシミが残った」とのご依頼。固形物除去後の汚染座席へ酵素分解と温水リンサーを実施し、衛生面と臭いを同日中に改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: 'うんち汚れは自分で消毒すれば十分？',
        a: '表面の固形物除去と換気までは自助で構いません。ただし繊維・ウレタン内部の菌と臭いまでは家庭用消毒では届きにくく、香料スプレーは悪化しやすいです。プロの酵素＋リンサーが安全です。',
      },
      {
        q: '部分洗浄だけ頼めますか？',
        a: `はい。座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜から対応します。フロアや隙間まで飛散している場合は写真見積で範囲を確定します。`,
      },
    ],
  },
  'touyu-kobosi': {
    troubleType: 'kerosene',
    checklistHeading: '車に灯油をこぼしたときの消し方｜今すぐやること',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内灯油こぼしは、火気厳禁で換気し、新聞紙で吸い取る（擦らない）のが第一応急処置です。灯油はシート内部・フロア下吸音材まで浸透すると完全消臭が困難なため、100cc以上の大量こぼしは専門洗浄が必要です。当店は${regionName}内へ最短即日出張。灯油専用洗浄${yen(CAR_PRICING.kerosenePerSeat)}〜／席。500cc超で部品交換が必要な場合も見極めのうえ保険活用をご提案します。`,
    emergencyChecklist: EMERGENCY_KEROSENE_CHECKLIST,
    keroseneSeverityMatrix: KEROSENE_SEVERITY_MATRIX,
    situationDiagnosis: REGIONAL_SITUATION_DIAGNOSIS.filter((r) =>
      r.situation.includes('灯油') || r.situation.includes('手が離せない') || r.situation.includes('近くの'),
    ),
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜灯油500cc超の施工事例`,
      body: `ポリタンク転倒で500cc以上の灯油がフロアマット下の吸音材まで到達。2日放置後の依頼でしたが、3時間のリンサー抽出・中和洗浄で「乗れる状態」まで改善。完全無臭化には換気後の経過確認が必要な場合があり、当店は1週間後のフォロー連絡を標準実施。500cc超は洗浄か部品交換かを見極め、保険適用もご提案します。`,
    })),
    customDefinition: (regionName) =>
      `${regionName}の車内灯油こぼし洗浄とは、火気リスクを考慮した安全手順のうえ、炭化水素油分をリンサー抽出と中和洗浄でシート奥・フロア下まで除去する出張専門サービスです。`,
  },
  'pet-ke': {
    troubleType: 'pet-hair',
    checklistHeading: 'ペットが車で粗相・毛だらけのとき、自分で何をすればいい？',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のペット毛・粗相は、掃除機だけでは繊維の織り目に残る毛と臭いの元を除去できません。特殊ブラシ・ピンセットによる手作業と温水リンサー洗浄の組み合わせが必要です。車内清掃「特急便」は${regionName}全域へ最短即日出張。ペット毛追加${yen(5_000)}〜、消臭洗浄セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
    situationDiagnosis: PET_SITUATION_DIAGNOSIS,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜ペット毛の手作業除去＋リンサー事例`,
      body: `${city}のミニバンで「週1のドライブ後に助手席が毛だらけ」とのご依頼。特殊ブラシとピンセットで織り目の毛を手作業除去し、リンサーで皮脂臭も同時ケアした事例です。`,
    })),
    extraFaqs: [
      {
        q: 'ペットの毛は掃除機で十分取れますか？',
        a: '表面の浮き毛は取れますが、織り目に刺さった毛は残ります。無理にブラシで擦ると奥へ押し込むため、専用ツールでの手作業が必要です。',
      },
      {
        q: '毛取りと消臭はセットが必要？',
        a: `毛だけの場合は毛取り追加${yen(5_000)}〜が目安です。尿・皮脂臭がある場合は消臭セット${yen(CAR_PRICING.lightDeodorize)}〜との併用をご案内します。`,
      },
    ],
  },
  oshikko: {
    troubleType: 'pet-waste',
    checklistHeading: '車内のおしっこ汚れ、自分で何をすればいい？',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のおしっこ汚れは、尿アルカリを中和するプロのリンサー洗浄が必要です。市販消臭剤は表面のマスキングに留まり、ウレタン内部の臭いは残ります。${regionName}内へ最短即日出張、座席1脚消臭セット${yen(CAR_PRICING.seatSingleDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_URINE_CHECKLIST,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車内おしっこ臭いの改善事例`,
      body: `${city}の普通車で「おしっこ後に消臭スプレーを使ったが数日で戻った」とのご依頼。汚染座席のリンサー抽出を実施し、エアコンON時に回っていた尿臭も軽減した事例です。`,
    })),
    extraFaqs: [
      {
        q: '乾いて見えなくても依頼すべきですか？',
        a: 'はい。尿成分はウレタン内部に残りやすく、見た目が乾いても臭いが再発します。座席1脚からの部分施工も可能です。',
      },
      {
        q: '子ども尿と犬・猫尿で違いは？',
        a: 'いずれも中和＋抽出が基本です。猫尿は染み込みが深く限界がある場合があるため、改善見込みを事前に説明します。',
      },
    ],
  },
  omorashi: {
    troubleType: 'pet-waste',
    checklistHeading: '渋滞中・運転中のおもらし｜車内の尿染み、自分で何をすればいい？',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内のおもらし・尿染みは、早めの洗浄がシミ固定化を防ぎます。アルカリ性の尿汚れは水拭きだけでは中和できず、リンサー抽出が必要です。運転中・手が離せないときは安全停車→タオルで吸い取り→香料スプレー禁止→電話相談が初動です。${regionName}内へ最短即日出張対応。座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜。子ども・高齢者のおもらしも、座席1脚から対応します。`,
    emergencyChecklist: EMERGENCY_URINE_CHECKLIST,
    situationDiagnosis: PET_SITUATION_DIAGNOSIS.filter(
      (r) =>
        r.situation.includes('乾いて') ||
        r.situation.includes('運転中') ||
        r.situation.includes('チャイルド') ||
        r.situation.includes('粗相'),
    ),
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車内おもらしのシミ・臭い改善事例`,
      body: `${city}でお子様のおもらし後、「乾いてから黄色っぽいシミとアンモニア臭が残った」とのご相談。座席のリンサー抽出と乾燥を実施し、見た目のシミと臭いを大幅に改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: 'おもらしとペットおしっこで工程は違いますか？',
        a: '基本は尿アルカリの中和とリンサー抽出です。ペット尿（特に猫）は染み込みが深く、完全無臭化が難しい場合があるため、事前に改善見込みをお伝えします。',
      },
      {
        q: '料金はいつ上がりますか？',
        a: `座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜が目安です。フロア到達・複数席・消臭剤多用後・長期間放置は範囲見積になります。`,
      },
      {
        q: '尿染みが乾いたあとのシミはどうやって取る？',
        a: '乾いたシミは表面拭きでは落ちにくく、ウレタン内部の色素・臭いが残ります。温水リンサーでの抽出が基本で、放置期間が長いほど工程が増えます。写真で無料診断できます。',
      },
    ],
  },
  'pet-unko': {
    troubleType: 'pet-waste',
    checklistHeading: 'ペットが車で粗相したときの消し方｜今すぐやること',
    answerFirst: (regionName) =>
      `【結論】${regionName}でペットの粗相（うんち・尿）は、除菌と消臭をセットにした出張リンサー洗浄が安全です。自分で拭いたあとに臭いが戻るのは内部層に原因が残っているためです。${regionName}内へ365日24時間受付・最短即日対応。消臭セット${yen(CAR_PRICING.lightDeodorize)}〜／座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
    situationDiagnosis: PET_SITUATION_DIAGNOSIS,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜ペット粗相の酵素分解洗浄事例`,
      body: `${city}で犬の粗相後、「ファブリーズで隠したが翌日アンモニア臭が戻った」とのご相談。酵素分解と温水リンサーで臭いの元を抽出し、再発を抑えた事例です。`,
    })),
    extraFaqs: [
      {
        q: 'ペットが助手席で粗相した。部分洗浄だけ頼める？',
        a: `はい。座席1脚${yen(CAR_PRICING.seatSingleDeodorize)}〜から対応します。隙間・フロアまで浸透している場合は写真で範囲を確認し、必要最小限のメニューをご提案します。`,
      },
      {
        q: 'ファブリーズでペット臭は消えますか？',
        a: '消えません。香料マスキングのため内部の尿成分は残り、湿度で再発します。使用後でも酵素＋リンサーで対応可能です（薬剤残留がある場合は工程が増えることがあります）。',
      },
    ],
  },
  'shanai-nioi': {
    troubleType: 'odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内の臭いが消えない場合、原因は嘔吐・ペット・タバコ・灯油・カビ・加齢臭・エアコン内部のいずれかにあり、消臭スプレーではウレタン層の「臭いの元」を除去できません。臭いの種類を特定し、40℃温水リンサーで原因を物理抽出する出張洗浄が必要です。車内清掃「特急便」は${regionName}内へ365日24時間受付・最短即日出張。消臭セット${yen(CAR_PRICING.lightDeodorize)}〜（所要約1.5〜3時間）。`,
      `【結論】${regionName}で車内の臭いが消えない場合、原因はエアコン内部・シート染み込み・タバコ・加齢臭・湿気カビなどに分かれ、消臭スプレーではウレタン層の「臭いの元」を除去できません。自分でできるのは換気・芳香剤の撤去・軽い表面拭きまで。臭いが翌日以降も残る／エアコンON時だけ臭う／嘔吐・尿・灯油のあと、はプロ境界です。40℃温水リンサーで原因を物理抽出する出張洗浄が必要です。${regionName}内へ最短即日出張。消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の車内臭い取り（消臭）とは、臭いの原因（エアコン・尿・タバコ・加齢臭・カビ等）を特定し、温水リンサー抽出でシート内部の汚れそのものを除去する出張専門サービスです。香料でごまかすマスキングではなく、原因除去が目的です。`,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車内の複合臭改善事例`,
      body: `${city}で「なんとなく車内が臭く、芳香剤を外すと戻る」とのご相談。シートと天井の生活臭を中心に消臭セットを施工し、こもった臭いを改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: '消臭スプレーを使っても臭いが戻るのはなぜ？',
        a: '市販スプレーは臭い分子を香料で覆い隠す「マスキング」です。シート内部（ウレタン層）に残った汚れ・ヤニ・皮脂はそのまま残るため、温度や湿度で再発します。根本解決には温水リンサーによる物理抽出が必要です。',
      },
      {
        q: '完全に無臭になりますか？',
        a: '多くのケースで大幅改善しますが、長年の喫煙や猫尿の深部浸透などは限界があります。施工前に改善見込みを正直にお伝えします。',
      },
      {
        q: '車内のにおいの取り方で、自分でやる順番は？',
        a: '①芳香剤・消臭剤を外す ②全窓換気（内気循環OFF） ③原因が嘔吐・尿・灯油ならスプレー禁止でタオル吸い取り ④翌日も残る／ON時だけ臭うならプロへ。重曹は軽い生活臭の応急までに留め、染み込み臭には使っても限界です。',
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
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の車の匂い取りとは、臭いの原因（生活臭・タバコ・ペット・エアコン等）を切り分けたうえで、温水リンサーとスチームで臭い分子の吸着先である汚れを洗い流す出張消臭洗浄です。`,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車の匂い取り事例`,
      body: `${city}で「消臭剤とオゾンでは数日で戻る」とのご相談。シート内部の生活臭をリンサー抽出し、再発しやすい臭いを改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: 'オゾンや消臭剤だけではダメですか？',
        a: '一時的な改善には有効な場合がありますが、シートウレタンや天井に吸着した汚れが残ると再発しやすいです。当店は原因除去の洗浄を主、必要に応じてオゾンを補助として使います。',
      },
      {
        q: '匂い取りの料金と時間の目安は？',
        a: `軽自動車の消臭セット${yen(CAR_PRICING.lightDeodorize)}〜が目安です。範囲により約1.5〜3時間。対応エリアは出張費無料でご案内します。`,
      },
      {
        q: '施工に含まれないものは？',
        a: 'エアコン本体の部品交換、冷媒ガス補充、シートの張替えは含みません。必要な場合は事前に分けてご案内します。',
      },
    ],
  },
  'kuruma-nioi-keshi': {
    troubleType: 'odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車の臭い消し（消臭）を「完全」に近づけるには、消臭剤ではなくシート内部の汚れをリンサーで洗い流す必要があります。生活臭・ペット・タバコ・湿気カビなど原因別に洗浄メニューを使い分けます。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
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
      `【結論】${regionName}の車内消臭で再発を防ぐには、消臭スプレーではなく温水リンサーによる原因除去が必要です。ウレタン層に染み込んだ尿・ヤニ・皮脂は香料では消えません。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    smellCauseTable: SMELL_CAUSE_TABLE,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
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
      `【結論】${regionName}で車内のタバコヤニ・臭いは、天井・シート・フロアを丸ごと温水洗浄し、オゾン脱臭を併用するのが最も効果的です。市販消臭剤はマスキングに留まり、天井裏のヤニは残ります。当店は${regionName}内へ最短即日出張対応。完全無臭化の成功率は70〜80%（限界は事前説明）ですが、限界まで清潔な状態へ引き上げます。普通車消臭セット${yen(CAR_PRICING.regularDeodorize)}〜。`,
    situationDiagnosis: TOBACCO_SITUATION_DIAGNOSIS,
    smellCauseTable: SMELL_CAUSE_TABLE.filter((r) =>
      ['タバコ・ヤニ', '加齢臭・皮脂', 'エアコン内部', 'カビ・湿気'].includes(r.cause),
    ),
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜タバコヤニ・天井ベタつき改善事例`,
      body: `${city}の中古普通車で「天井がベタつき、消臭剤を外すとタバコ臭が戻る」とのご依頼。天井〜シートの温水リンサーとオゾン仕上げで、ヤニのべたつきと臭いを大幅改善した事例です（完全無臭化は限界がある旨を事前説明）。`,
    })),
    customDefinition: (regionName) =>
      `${regionName}の車内タバコヤニ除去とは、天井からフロアまで温水リンサー洗浄とオゾン脱臭で、繊維に蓄積したタール・ニコチンを物理的に除去する出張専門サービスです。`,
    extraFaqs: [
      {
        q: '中古車のタバコ臭は100%消せますか？',
        a: '長年喫煙された車は天井裏・エアコン内部までヤニが浸透しており、完全無臭化は困難な場合があります。当店は施工前に臭いの程度を確認し、洗浄で改善可能な範囲を正直にお伝えします。成功率の目安は70〜80%です。',
      },
      {
        q: 'ディーラー清掃と専門洗浄の違いは？',
        a: '販売店の簡易清掃は表面中心が多く、天井裏のヤニまでは取りきれないことがあります。専門の温水抽出はヤニの吸着先である汚れを洗い流すため、再発しにくい仕上がりを目指します。',
      },
    ],
  },
  'chuko-tabako': {
    troubleType: 'tobacco',
    answerFirst: (regionName) =>
      `【結論】${regionName}で中古車のタバコ臭（煙草・ヤニ臭）を落とすには、オゾン・消臭剤だけでなく天井・シートの温水リンサー洗浄が必要です。喫煙歴が長い車は天井裏のヤニが原因のため、丸ごと洗浄が効果的です。${regionName}内へ最短即日出張。普通車消臭セット${yen(CAR_PRICING.regularDeodorize)}〜（所要約2.5〜4時間）。完全無臭化の目安は70〜80%で、限界は事前に説明します。`,
    customDefinition: (regionName) =>
      `${regionName}の中古車タバコ臭消しとは、蓄積したタール・ニコチンを温水抽出で除去し、オゾン脱臭で仕上げる出張専門サービスです。`,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜中古車タバコ臭の丸ごと洗浄事例`,
      body: `${city}で納車直後の中古車から強い喫煙臭。天井のヤニ黄ばみとシートをリンサー洗浄し、オゾンで仕上げ。完全無臭は約束せず、大幅改善の見込みを先に共有したうえで施工した事例です。`,
    })),
    extraFaqs: [
      {
        q: '中古車のタバコ臭はオゾンだけで取れますか？',
        a: '一時的に薄まることはありますが、天井・シートのヤニが残ると戻りやすいです。温水洗浄で吸着源を除去する方が再発しにくいです。',
      },
      {
        q: '料金と所要時間の目安は？',
        a: `普通車の消臭セット${yen(CAR_PRICING.regularDeodorize)}〜が目安です。天井洗浄込みで約2.5〜4時間かかることが多いです。`,
      `【結論】${regionName}で中古車のタバコ臭を落とすには、オゾン・消臭剤だけでなく天井・シートの温水リンサー洗浄が必要です。喫煙歴が長い車は天井裏のヤニが原因のため、丸ごと洗浄が効果的です。${regionName}内へ最短即日出張。普通車消臭セット${yen(CAR_PRICING.regularDeodorize)}〜。完全無臭化の目安は70〜80%で、限界は事前に説明します。`,
    situationDiagnosis: TOBACCO_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の中古車タバコ臭消しとは、蓄積したタール・ニコチンを温水抽出で除去し、オゾン脱臭で仕上げる出張専門サービスです。`,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜中古車タバコ臭のリセット事例`,
      body: `${city}で納車直後の中古車「芳香剤を外すとタバコ臭」とのご相談。天井・シート中心の丸洗いとオゾンで、前オーナー臭を実用レベルまで改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: 'オゾンだけ・消臭剤だけではダメですか？',
        a: '一時的な改善には有効な場合がありますが、天井・シートに残るヤニ汚れが臭いの発生源のため再発しやすいです。当店は洗浄を主、オゾンを仕上げ補助として使います。',
      },
      {
        q: '納車前に販売店で清掃済みでも依頼できますか？',
        a: 'はい。簡易清掃後でも内部ヤニが残るケースは多いです。臭いの戻り方を伺い、必要な範囲だけをご提案します。',
      },
    ],
  },
  'chuko-kareisyu': {
    troubleType: 'aging-odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で中古車の加齢臭（オールドカー臭）を改善するには、シート・天井・フロアに蓄積した皮脂・汗・菌を温水リンサーで洗い流す必要があります。消臭剤は一時的な対処に留まります。${regionName}内へ最短即日出張、普通車消臭セット${yen(CAR_PRICING.regularDeodorize)}〜。`,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の中古車加齢臭対策とは、前オーナーの皮脂・生活臭が残る内装を温水リンサーで洗い、芳香剤に頼らない清潔な車内へ整える出張サービスです。`,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜中古車の加齢臭・生活臭改善事例`,
      body: `${city}で納車直後の中古車「芳香剤を外すと古い脂っぽい臭いがする」とのご相談。シート・天井中心の消臭セットを施工し、前オーナー臭を改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: '販売店で清掃済みでも臭います。まだ洗えますか？',
        a: 'はい。販売店の簡易清掃ではウレタン内部まで洗えていないことが多いです。臭いの戻り方を伺い、必要な範囲をご提案します。',
      },
      {
        q: '施工後に臭いが戻ることはありますか？',
        a: '乾燥不足や再汚染、エアコン循環側の残臭で戻ることがあります。必要ならAC内部洗浄の併用もご案内します。',
      },
    ],
  },
  kareisyu: {
    troubleType: 'aging-odor',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内の加齢臭は、シート・天井の皮脂汚れと菌が原因です。換気や消臭剤では根本解決しにくく、温水リンサーによる丸洗いが効果的です。${regionName}内へ最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の車内加齢臭対策とは、運転席まわり・天井などに吸着した皮脂由来の臭いを温水抽出で減らし、車内の空気質を整える出張洗浄です。`,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜車の加齢臭対策事例`,
      body: `${city}で「家族に車が臭いと言われた」とのご相談。運転席と天井を中心に洗浄し、脂っぽい古い臭いを改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: '加齢臭はどこに付きやすいですか？',
        a: '運転席・ヘッドレスト・シートベルト周辺・天井・エアコン循環が典型です。臭いの強い場所から重点洗浄します。',
      },
      {
        q: '完全に無臭になりますか？',
        a: '大幅改善を目指しますが、長年蓄積した臭いの完全無臭化は難しい場合があります。改善見込みは事前にお伝えします。',
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
      `【結論】${regionName}で車のシートのシミの落とし方として最も効果的なのは、素材に合わせた泡洗いと温水リンサー抽出です。市販クリーナーではウレタン内部の汚れまで届きません。${regionName}内へ出張対応、座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜、消臭セット${yen(CAR_PRICING.seatSingleDeodorize)}〜。${powerPhrase(regionName)}。`,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の車シート洗浄とは、出張専門スタッフがシート素材（布・合皮）に合わせた洗浄剤と温水リンサーで、黄ばみ・飲みこぼし・汗ジミを内部まで洗い流すサービスです。`,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜シート黄ばみ・シミ洗浄事例`,
      body: `${city}で運転席の黄ばみと飲みこぼし跡のご依頼。布シートへ泡洗い＋リンサー抽出し、見た目のシミを改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: '布シートと革シートで違いますか？',
        a: '布は温水リンサー抽出が中心、合皮・本革は素材に合わせた薬剤と工程になります。現地で素材確認のうえ施工します。',
      },
      {
        q: '軽い清掃と消臭セットの違いは？',
        a: `見える汚れ中心なら座席1脚基本${yen(CAR_PRICING.seatSingleBasic)}〜、臭い・染み込みまでなら消臭セット${yen(CAR_PRICING.seatSingleDeodorize)}〜が目安です。`,
      },
    ],
  },
  'seat-cleaning': {
    troubleType: 'seat',
    answerFirst: (regionName) =>
      `【結論】${regionName}の車シートクリーニングは、座席まるごとの温水洗浄・乾燥が基本です。皮脂・飲食汚れが臭いの原因になるため、表面拭きでは不十分なケースが多いです。${regionName}内へ最短即日出張、座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜。`,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の車シートクリーニングとは、座席の汚れ・黄ばみを出張洗浄で整え、必要に応じて消臭まで行うサービスです。`,
    extraFaqs: [
      {
        q: '1席だけ頼めますか？',
        a: `はい。座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜から対応します。臭いが強い場合は消臭セット${yen(CAR_PRICING.seatSingleDeodorize)}〜をご案内します。`,
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
      `【結論】${regionName}で車のエアコンが臭い場合、原因はエバポレーター内部のカビです。消臭スプレーやフィルター交換だけでは再発します。エアコンON時だけ臭うなら内部洗浄、シートに座ると臭うなら車内洗浄が先です。エアコン内部洗浄${yen(CAR_PRICING.acInternalWash)}〜で${regionName}内へ最短即日出張対応します。`,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS.filter((r) =>
      r.situation.includes('エアコン') || r.situation.includes('シート') || r.situation.includes('天井'),
    ),
    customDefinition: (regionName) =>
      `${regionName}の車エアコン臭い対策とは、エバポレーター内部のカビ・雑菌を専用洗浄で除去し、ON時の酸っぱい・カビ臭を根本改善する出張サービスです。`,
    extraFaqs: [
      {
        q: 'フィルター交換でエアコン臭は消えますか？',
        a: '吸入側のゴミ対策には有効ですが、ON時だけの酸っぱい・カビ臭はエバポレーター内部が原因のことが多く、内部洗浄が必要です。',
      },
      {
        q: 'シート臭いとエアコン臭いの見分け方は？',
        a: 'エアコンOFFでもシートに鼻を近づけると臭うならシート側、ON時だけならエアコン内部側です。両方混ざるケースも多く、写真と症状で最適メニューを提案します。',
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
      `【結論】${regionName}で車内のペット臭は、尿・毛・皮脂がシート内部に蓄積していることが原因です。消臭剤では再発し、温水リンサーと酵素分解が必要です。${regionName}内へ365日24時間受付・最短即日出張、消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。自分の状況に合うメニューは状況診断表で確認できます。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
    situationDiagnosis: PET_SITUATION_DIAGNOSIS,
    smellCauseTable: SMELL_CAUSE_TABLE.filter((r) =>
      ['ペット尿・便', '加齢臭・皮脂', 'カビ・湿気'].includes(r.cause),
    ),
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜ペット臭の根本消臭事例`,
      body: `${city}で「ペット同乗後に車内が獣臭く、消臭剤で隠しても戻る」とのご依頼。尿染み箇所の酵素分解と車内リンサーで臭いの元を抽出し、日常利用に戻れた事例です。`,
    })),
    extraFaqs: [
      {
        q: 'ペット臭は芳香剤でごまかせますか？',
        a: 'ごまかせません。芳香剤は上書きに過ぎず、湿度でアンモニア臭が再発します。原因の尿・皮脂を酵素とリンサーで除去するのが先です。',
      },
      {
        q: '犬と猫で難易度は違いますか？',
        a: '猫尿は染み込みが深く、完全無臭化が難しい場合があります。犬尿・粗相は改善しやすい傾向です。見込みは施工前に正直にお伝えします。',
      },
    ],
  },
  ase: {
    troubleType: 'seat',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内の汗臭い・汗ジミは、シートに染み込んだ皮脂と菌が原因です。換気だけでは消えず、温水リンサーによるシート洗浄が効果的です。${regionName}内へ最短即日出張対応。座席1脚${yen(CAR_PRICING.seatSingleBasic)}〜／消臭セット${yen(CAR_PRICING.seatSingleDeodorize)}〜。`,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS.filter((r) =>
      r.situation.includes('シート') || r.situation.includes('黄ばみ') || r.situation.includes('天井'),
    ),
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜汗ジミ・皮脂臭のシート洗浄事例`,
      body: `${city}の通勤車で運転席の汗ジミと皮脂臭のご相談。布シートへ泡洗い＋リンサー抽出し、座面の黄ばみと臭いを改善した事例です。`,
    })),
    extraFaqs: [
      {
        q: '汗臭いシートは自分で拭けば消えますか？',
        a: '表面の皮脂は軽く改善することがありますが、ウレタン内部の菌までは届きません。翌日以降も臭いが残るならリンサー洗浄が境界です。',
      },
    ],
  },
  'hoken-kyuto': {
    troubleType: 'vomit',
    checklistHeading: '車内で吐いた直後、自分で何をすればいい？（保険利用前の初動）',
    answerFirst: (regionName) =>
      `【結論】${regionName}で嘔吐汚損の車両保険適用は「偶然の事故による車内汚損」として認められる場合があります。車両保険（免責3〜10万円・等級ダウンあり）または個人賠償（他人の車を汚した場合）が該当します。当店は${regionName}内へ最短即日出張し、見積時に保険利用時の実質自己負担額を併記。施工報告書・写真付き見積で申請をサポートします。運転中の緊急時も電話で空き状況をご案内します。`,
    emergencyChecklist: EMERGENCY_VOMIT_CHECKLIST,
    situationDiagnosis: VOMIT_SITUATION_DIAGNOSIS,
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
    checklistHeading: '運転中に子供が吐いたとき、自分で何をすればいい？',
    answerFirst: (regionName) =>
      `【結論】${regionName}で子どもの車内嘔吐は、4日以内の出張リンサー洗浄が最も確実です。市販消臭スプレーは使わず、固形物をこすらず取り除き、40℃温水でシート内部まで洗浄します。運転中・手が離せない緊急時も365日24時間受付。安全停車→換気→電話で空き確認が最短ルートです。${regionName}内へ最短即日出張、嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    emergencyChecklist: EMERGENCY_VOMIT_CHECKLIST,
    situationDiagnosis: VOMIT_SITUATION_DIAGNOSIS,
    nicheCaseStudy: regionalCaseStudy((city, regionName) => ({
      title: `${regionName}・${city}｜子どもの車内嘔吐・即日復旧事例`,
      body: `${city}への移動中にお子様が嘔吐。翌朝の送迎が必要なケースで、当日枠の出張リンサーによりチャイルドシート周辺と座席を無臭化し、翌朝の利用に間に合わせた事例です。`,
    })),
    extraFaqs: [
      {
        q: 'チャイルドシートも一緒に洗ってくれる？',
        a: '取り外し可能なものは一緒に洗浄できる場合があります。固定式・素材により可否が分かれるため、写真で事前確認します。',
      },
      {
        q: '夜中や休日でも子どもの嘔吐に来てくれる？',
        a: '365日24時間受付です。空き枠があれば最短即日（深夜〜翌朝含む）をご案内します。まずはお電話で希望時間をお伝えください。',
      },
    ],
  },
  'dengen-fuyou': {
    answerFirst: (regionName) =>
      needsOutletBorrow(regionName)
        ? `【結論】${regionName}の出張施工では、${OUTLET_BORROW_SHORT}。作業場所からコンセントまでおおむね20m以内をご用意ください。水道もお借りする場合があります。`
        : `【結論】車内清掃「特急便」の${regionName}出張施工は、電源・水道の用意が不要です。出張車両に発電機と水タンクを完備しており、マンション地下駐車場・月極駐車場・会社の車庫など、車が停められる場所であれば施工可能です。`,
    extraFaqs: [
      {
        q: 'マンションの地下駐車場でも施工できますか？',
        a: 'はい。駐車スペースがあり、左右のドアが開けられれば施工可能です。電源・水道の条件はエリアにより異なります（多くの地域は発電機・水タンク完備、沖縄・群馬などは家庭用100Vコンセントの借用）。詳しくはお電話でご確認ください。',
      },
    ],
  },
  'shutchou-senmon': {
    answerFirst: (regionName) =>
      `【結論】${regionName}の出張車内清掃専門店として、車内清掃「特急便」は365日24時間受付・最短即日対応です。嘔吐・灯油・ペット・タバコ臭など特殊案件に特化し、${powerPhrase(regionName)}でご指定の駐車場へ訪問。施工歴3年以上・年間300台超の専門員が対応します。`,
    customDefinition: (regionName) =>
      `${regionName}の出張車内清掃専門サービスとは、プロの温水リンサー・特殊アルカリ電解水を用い、ご指定場所へ訪問してシート内部まで洗浄・消臭するサービスです。ディーラー持ち込み不要・即日復旧が可能です。`,
  },
  'interior-cleaning': {
    troubleType: 'light',
    answerFirst: (regionName) =>
      `【結論】${regionName}で通常の車内クリーニングをプロに依頼するなら、出張リンサー洗浄が最も手軽です。シートの黄ばみ・生活汚れ・軽い生活臭を丸ごと洗浄し、${powerPhrase(regionName)}で駐車場があれば施工可能です。臭いが強い場合は消臭セットへアップできます。車内清掃「特急便」は${regionName}内へ最短即日出張。軽自動車基本${yen(CAR_PRICING.lightBasic)}〜／消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`,
    situationDiagnosis: ODOR_SITUATION_DIAGNOSIS,
    customDefinition: (regionName) =>
      `${regionName}の車内クリーニングとは、出張専門スタッフがシート・フロアを温水リンサーで洗浄し、車内を清潔で快適な状態に戻すサービスです。緊急の特殊汚損だけでなく、日常のきれいを整える基本洗浄にも対応します。`,
    extraFaqs: [
      {
        q: '基本洗浄と消臭セットの違いは？',
        a: `基本洗浄は黄ばみ・ホコリ・軽い汚れ向け（軽自動車${yen(CAR_PRICING.lightBasic)}〜）。染み込み臭や再発しやすい臭いまで取るなら消臭セット（${yen(CAR_PRICING.lightDeodorize)}〜）です。`,
      },
    ],
  },
  'specialist-cleaning': {
    troubleType: 'light',
    answerFirst: (regionName) =>
      `【結論】${regionName}の車内クリーニング専門店として、車内清掃「特急便」は年間300台超の施工実績。シート洗浄から消臭まで出張で対応し、${powerPhrase(regionName)}・最短即日です。${regionName}内へ365日24時間受付。`,
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
  'pet-hair-odor': 'pet-ke',
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
      a: powerFaqAnswer(regionName),
    },
    {
      q: '市販の消臭スプレーと何が違うのですか？',
      a: '市販のスプレーは臭いの成分を別の香料で包み込む「マスキング」であり、汚れ自体はシート内に残ったままです。当店の洗浄は、洗剤で汚れを浮かし、温水で洗い流しながら同時に強力に吸い取る（リンサー抽出）ため、ニオイの「元」そのものを物理的に車外へ排除します。',
    },
  ];
  const extended = includeExtended
    ? AIO_EXTENDED_FAQS.map((faq) => {
        if (!needsOutletBorrow(regionName)) return faq;
        if (faq.q.includes('マンション地下') || faq.a.includes('電源不要') || faq.a.includes('電源・水道不要')) {
          return {
            ...faq,
            a: faq.a
              .replace(
                /多くのエリアでは発電機・水タンク完備で電源・水道不要ですが、沖縄県・群馬県では20ｍ以内での家庭用１００Vコンセントをお借りします。/,
                `${OUTLET_BORROW_SHORT}。水道もお借りする場合があります。`,
              )
              .replace(/電源・水道不要/g, OUTLET_BORROW_SHORT)
              .replace(/電源不要/g, OUTLET_BORROW_SHORT),
          };
        }
        return faq;
      })
    : [];
  const resolvedExtra = extraFaqs.map((faq) => {
    if (!needsOutletBorrow(regionName)) return faq;
    if (!(faq.a.includes('電源不要') || faq.a.includes('電源・水道不要') || faq.a.includes('発電機'))) return faq;
    return {
      ...faq,
      a: needsOutletBorrow(regionName)
        ? `${OUTLET_BORROW_SHORT}。作業場所からコンセントまでおおむね20m以内をご用意ください。水道もお借りする場合があります。`
        : faq.a,
    };
  });
  return [...core, ...extended, ...resolvedExtra];
}

export const REGIONAL_EMERGENCY_CHECKLIST: EmergencyChecklistRow[] = [
  { do: '手袋を着用し、固形物を「すくい取る」（擦らない）', dont: 'ゴシゴシ擦る（繊維の奥に浸透）' },
  { do: '全ドア・窓を開け、外気導入で換気（内気循環NG）', dont: '市販の消臭スプレー・除菌剤（反応で悪臭化）' },
  { do: '灯油は火気厳禁・新聞紙で「叩き当てて」吸い取る', dont: 'ライター・タバコ・大量の水（引火・浸透リスク）' },
  { do: '乾いたタオルで水分を押し取り、乾燥を優先', dont: '1週間放置（カビ・二次腐敗臭・臭い固定化）' },
  { do: '4日以内にプロへ連絡（ウレタン浸透前が理想）', dont: '消臭スプレーだけで完了と判断（マスキングのみ）' },
];

export const REGIONAL_CHECKLIST_HEADING =
  '車内で吐いた・灯油をこぼした直後、自分で何をすればいい？｜車のシートのシミの落とし方の初動';

/** Voice / emergency search line shown under Hero (AnswerTarget) */
export function buildVoiceEmergencyLine(regionName: string): string {
  return `運転中・手が離せない緊急事態でも、365日24時間受付。電話1本で${regionName}へ最短即日の出張車内清掃をご案内します。嘔吐・おもらし・灯油こぼしなど「今日中に何とかしたい」方はお電話ください。`;
}

export function buildRegionalAnswerFirst(regionName: string, powerRegionName?: string): string {
  const powerRegion = powerRegionName ?? regionName;
  const powerBit = needsOutletBorrow(powerRegion)
    ? `${OUTLET_BORROW_SHORT}。`
    : '電源・水道不要（発電機・水タンク完備）。';
  return `【結論】${regionName}の車内嘔吐・ニオイ・シート汚れは、市販スプレーではなく4日以内の出張リンサー洗浄が確実です。1シート ${yen(CAR_PRICING.seatSingleBasic)}から／軽 ${yen(CAR_PRICING.lightBasic)}〜／嘔吐消臭セット ${yen(CAR_PRICING.lightDeodorize)}〜（税込・${regionName}出張費無料）。お急ぎの方は電話で空き状況をご確認ください。${powerBit}`;
}

export function buildRegionalAnswerTargetPoints(regionName: string, powerRegionName?: string): string[] {
  const powerRegion = powerRegionName ?? regionName;
  return [
    `最短即日・365日24時間受付。1シート ${yen(CAR_PRICING.seatSingleBasic)}から。お急ぎの方は電話でご相談ください。`,
    `施工歴3年以上の専門員が${regionName}の指定駐車場へ訪問。${powerCapabilitySentence(powerRegion)}`,
    '保険の代理申請対応。見積時に実質自己負担額も併記します。',
  ];
}

import { REGIONAL_FV_MAIN_TITLES } from './fvAdGroupCopy';

export function getRegionalHeroMainTitle(regionName: string): string | undefined {
  return REGIONAL_FV_MAIN_TITLES[regionName];
}

export function buildRegionalNioiAnswerFirst(regionName: string, powerRegionName?: string): string {
  const powerRegion = powerRegionName ?? regionName;
  return `表面の軽い臭いは換気と重曹で一時改善できますが、嘔吐・ペット・タバコ・灯油のニオイはシート内部（ウレタン層）に原因が残るため、消臭スプレーだけでは再発します。臭いが翌日以降も残る場合は、温水リンサー抽出洗浄のプロ依頼が必要です。車内清掃「特急便」は${regionName}内へ365日24時間受付・最短即日出張。施工歴3年以上の専門員が40℃温水とアルカリ電解水で原因を物理抽出します。${powerCapabilitySentence(powerRegion)}嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。自分の状況に合うメニューは、下の状況診断表でも確認できます。`;
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
  {
    q: '運転中に子供が車内で吐いた。手が離せないとき、最初に何をすればいい？',
    a: 'まず安全な場所に停車し、全窓を開けて換気してください。固形物はこすらず取り除き、市販の消臭スプレーは使わないでください（悪臭が悪化し除去費用が上がります）。水分はタオルで押し取り、乾燥を優先。胃酸は約4日でウレタン内部に定着するため、停車後すぐに365日24時間受付へ電話し、最短即日の空き枠をご確認いただくのが最も確実です。',
  },
  {
    q: '自分の状況に合う車内清掃の選び方は？嘔吐・灯油・ペットで何が違う？',
    a: '臭いの原因でメニューが変わります。嘔吐は酸性汚れのため4日以内の温水リンサー抽出、灯油は量別（〜30ccは自助／100cc超は専門洗浄／500cc超は部品交換・保険判断）、ペット尿は酵素分解＋リンサーが必要です。消臭スプレーはいずれもマスキングに過ぎません。写真3枚をLINEで送ると、洗浄のみか保険・交換相談かをその場で最適提案できます。',
  },
  {
    q: '近くの車内掃除業者を今すぐ呼びたい。マンション地下でも当日来てくれる？',
    a: '掲載エリア内ならスケジュール次第で最短即日対応が可能です。多くのエリアでは発電機・水タンク完備で電源・水道不要ですが、沖縄県・群馬県では20ｍ以内での家庭用１００Vコンセントをお借りします。左右ドアが開くスペースがあれば作業可能。お急ぎの方は電話で空き状況をご確認ください。',
  },
  {
    q: '夜中に車で吐かれた。今から来てくれる？最短どれくらいで到着する？',
    a: '365日24時間受付のため、夜間でも空き枠があれば最短即日（当日深夜〜翌朝）の出張をご案内できます。到着目安はエリアと稼働状況により、首都圏・関西主要部はおおむね数時間以内の枠が出やすい一方、混雑時は翌日午前になることもあります。嘔吐は4日ルールがあるため、まず電話で「今すぐ／今夜／明朝」の希望を伝えて空きを確定するのが最短ルートです。',
  },
  {
    q: '車のシートのシミの落とし方は？自分でやる限界とプロの境界は？',
    a: '表面の軽い飲みこぼしなら、乾いた布で叩き吸い→ぬるま湯で軽く叩き拭きまでが自助の安全圏です。ゴシゴシ擦る・強い洗剤・塩素系は繊維を傷めシミを広げます。嘔吐・尿・灯油・ペット粗相、または一晩置いて酸っぱい／アンモニア臭が残る場合はウレタン内部まで浸透しているため、温水リンサー抽出のプロ境界です。座席1脚から出張対応でき、写真3枚で境界判断の無料相談が可能です。',
  },
  {
    q: '渋滞中に子どもがおもらしした。運転中で手が離せないとき、最初に何をすればいい？',
    a: 'まず安全な場所に停車（路肩・SA・パーキング）し、チャイルドシートや衣類の汚染範囲を確認してください。乾いたタオルで押さえて水分を吸い取り、こすらない・ファブリーズ等の香料スプレーは使わないのが鉄則です。換気してから走行を再開し、到着後できるだけ早く写真をLINEで送るか電話で相談してください。乾いて見えなくなっても尿は内部に残るため、当日〜翌日の座席1脚洗浄が再発防止になります。',
  },
];

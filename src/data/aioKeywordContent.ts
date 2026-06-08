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

export type AioKeywordContent = {
  answerFirst: (regionName: string, displayName: string) => string;
  emergencyChecklist?: EmergencyChecklistRow[];
  nicheCaseStudy?: (regionName: string) => NicheCaseStudyBlock;
  extraFaqs?: FAQItem[];
  /** Override default definition in AIOContent when set */
  customDefinition?: (regionName: string) => string;
  /** Filter localCaseStudies by trouble tag */
  troubleType?: string;
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

export const AIO_KEYWORD_CONTENT: Record<string, AioKeywordContent> = {
  'kyuto-cleaning': {
    troubleType: 'vomit',
    answerFirst: (regionName) =>
      `【結論】${regionName}で車内嘔吐の臭いを根本除去するには、嘔吐から4日以内に出張リンサー洗浄を依頼するのが最も確実です。市販の消臭スプレーは使わず、固形物をこすらず取り除いたうえで、40℃温水と特殊アルカリ電解水でシート内部（ウレタン層）まで抽出洗浄します。車内清掃「特急便」は${regionName}全域へ最短即日出張、電源・水道不要（発電機・水タンク完備）で対応。軽自動車基本${yen(CAR_PRICING.lightBasic)}〜、嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。保険適用のご相談も承ります。`,
    emergencyChecklist: EMERGENCY_VOMIT_CHECKLIST,
    nicheCaseStudy: (regionName) => ({
      title: `${regionName}・箕面市｜シエンタ嘔吐汚れの即日復旧事例`,
      body: '箕面大滝方面のカーブ道でお子様が突然嘔吐。営業車として翌日の使用が必要なケースで、約40℃温水リンサーと100℃スチームによりシート奥の吐瀉物を抽出。作業後は無臭状態に復元し、翌日の仕事に間に合うスピードで完了しました。',
    }),
    customDefinition: (regionName) =>
      `${regionName}の車内嘔吐クリーニングとは、ご指定の駐車場へプロが出張し、酸性の嘔吐物をアルカリ電解水で中和したうえで温水リンサー抽出し、シート奥のウレタン層まで除菌・消臭する緊急専門サービスです。`,
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
    nicheCaseStudy: (regionName) => ({
      title: `${regionName}・吹田市｜トヨタ・ヤリス灯油500cc超の施工事例`,
      body: 'ポリタンク転倒で500cc以上の灯油がフロアマット下の吸音材まで到達。2日放置後の依頼でしたが、3時間のリンサー抽出・中和洗浄で「乗れる状態」まで改善。完全無臭化には換気後の経過確認が必要な場合があり、当店は1週間後のフォロー連絡を標準実施。500cc超は洗浄か部品交換かを見極め、保険適用もご提案します。',
    }),
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
      `【結論】${regionName}で車内のおもらし・尿染みは、早めの洗浄がシミ固定化を防ぎます。アルカリ性の尿汚れは水拭きだけでは中和できず、リンサー抽出が必要です。${regionName}内へ最短即日出張対応。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
  },
  'pet-unko': {
    troubleType: 'pet-waste',
    answerFirst: (regionName) =>
      `【結論】${regionName}でペットの粗相（うんち・尿）は、除菌と消臭をセットにした出張リンサー洗浄が安全です。${regionName}内へ最短即日対応。`,
    emergencyChecklist: EMERGENCY_PET_CHECKLIST,
  },
};

export function getAioKeywordContent(slug: string): AioKeywordContent | undefined {
  return AIO_KEYWORD_CONTENT[slug];
}

/** 地区トップLP向け：嘔吐・灯油・ペットの統合緊急チェックリスト */
export const REGIONAL_EMERGENCY_CHECKLIST: EmergencyChecklistRow[] = [
  { do: '手袋を着用し、固形物を「すくい取る」（擦らない）', dont: 'ゴシゴシ擦る（繊維の奥に浸透）' },
  { do: '全ドア・窓を開け、外気導入で換気（内気循環NG）', dont: '市販の消臭スプレー・除菌剤（反応で悪臭化）' },
  { do: '灯油は火気厳禁・新聞紙で「叩き当てて」吸い取る', dont: 'ライター・タバコ・大量の水（引火・浸透リスク）' },
  { do: '乾いたタオルで水分を押し取り、乾燥を優先', dont: '1週間放置（カビ・二次腐敗臭・臭い固定化）' },
  { do: '4日以内にプロへ連絡（ウレタン浸透前が理想）', dont: '消臭スプレーだけで完了と判断（マスキングのみ）' },
];

/** 地区トップLP向け Answer-First（AIO引用用・Hero直下配置） */
export function buildRegionalAnswerFirst(regionName: string): string {
  return `【結論】${regionName}で車内嘔吐・ニオイ・シート汚れを「今すぐ」解決するなら、市販消臭スプレーを使わず、4日以内に出張リンサー洗浄を依頼してください。車内清掃「特急便」は365日24時間受付・最短即日対応。施工歴3年以上・年間300台超の専門員が直接ご指定の駐車場へ訪問します。電源・水道は不要（発電機・水タンク完備）。軽自動車基本${yen(CAR_PRICING.lightBasic)}〜、嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜、灯油専用洗浄${yen(CAR_PRICING.kerosenePerSeat)}〜/席。車両保険・個人賠償の代理申請に対応し、見積時に実質自己負担額も併記します。`;
}

/** 地区トップLP向けクエリ整合H1（AIO・SEO向け） */
const REGIONAL_HERO_MAIN_TITLES: Record<string, string> = {
  愛知県: '愛知県の車 嘔吐 クリーニング｜最短即日出張・保険代理申請対応',
  大阪府: '大阪府の嘔吐車内清掃 出張｜年間300台の専門員が直接訪問',
  東京都: '東京都の車内嘔吐・ニオイ消臭｜365日24時間・電源不要で即日対応',
  埼玉県: '埼玉県の車シート洗浄・嘔吐清掃｜出張専門・保険相談無料',
};

export function getRegionalHeroMainTitle(regionName: string): string | undefined {
  return REGIONAL_HERO_MAIN_TITLES[regionName];
}

/** 地区トップLP向けニオイ Answer Target（情報型＋商用クエリの橋渡し） */
export function buildRegionalNioiAnswerFirst(regionName: string): string {
  return `表面の軽い臭いは換気と重曹で一時改善できますが、嘔吐・ペット・タバコ・灯油のニオイはシート内部（ウレタン層）に原因が残るため、消臭スプレーだけでは再発します。臭いが翌日以降も残る場合は、温水リンサー抽出洗浄のプロ依頼が必要です。車内清掃「特急便」は${regionName}内へ365日24時間受付・最短即日出張。施工歴3年以上の専門員が40℃温水とアルカリ電解水で原因を物理抽出し、電源・水道は不要（発電機・水タンク完備）です。嘔吐消臭セット${yen(CAR_PRICING.lightDeodorize)}〜。`;
}

/** AIOContent内FAQ（保険・カーシェア・放置日数） */
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

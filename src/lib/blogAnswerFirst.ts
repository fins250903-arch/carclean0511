/**
 * Answer-First summaries for the 施工ブログ.
 *
 * Search engines and AI answer engines need the conclusion (area / trouble /
 * method / duration / price) at the top of the page. Editors can write it by
 * hand in `summary.answer_first`, and anything they leave blank is derived from
 * facts that already appear in the article body — no values are invented.
 */

export type BlogSummaryInput = {
  answer_first?: string;
  trouble?: string;
  method?: string;
  work_time?: string;
  price?: string;
  car_model?: string;
};

export type AnswerFirstSource = {
  title: string;
  areaName?: string;
  body?: string;
  summary?: BlogSummaryInput;
  /** Region name used when the article has no city / area label of its own */
  fallbackArea?: string;
};

export type BlogQuickFact = {
  label: string;
  value: string;
};

export type BlogAnswerFirst = {
  /** Lead paragraph rendered as `.answer-lead` (speakable / AIO snippet) */
  text: string;
  /** `case` = one job with measured facts, `guide` = how-to article without an area */
  kind: 'case' | 'guide';
  area?: string;
  trouble?: string;
  method?: string;
  workTime?: string;
  price?: string;
  carModel?: string;
  quickFacts: BlogQuickFact[];
};

/**
 * How-to / insurance / DIY titles must stay `guide`. Using a CMS category as
 * fallbackArea would otherwise turn them into fake "施工事例" with catalog prices.
 */
export const GUIDE_TITLE_PATTERN =
  /やってはいけない|対処法|消臭術|プロ級|3つの理由|３つの理由|3選|３選|スーパー保証|100均|自分で|個人賠償|賠償責任|賠償保険|保険で|申請手続き/;

/** Pet only when an animal is actually in the job, not the bare word 粗相 */
const PET_TROUBLE =
  /ペット|愛犬|愛猫|獣臭|(?:愛)?(?:犬|猫).{0,16}(?:粗相|おしっこ|尿|ウンチ|うんち|糞|毛)/;

const TROUBLE_RULES: [RegExp, string][] = [
  [/嘔吐|ゲロ|吐い|吐瀉|車酔い/, '嘔吐（ゲロ）汚れとニオイ'],
  [/下痢|うんち漏|ウンチ漏/, '下痢による汚れとニオイ'],
  [PET_TROUBLE, 'ペットの粗相・獣臭'],
  [/おもらし|お漏らし|失禁|おしっこ|オシッコ|粗相/, 'おもらし・尿の染み込み'],
  [/(?<![おも])尿(?!素)/, 'おもらし・尿の染み込み'],
  [/灯油/, '灯油こぼし'],
  [/芳香剤|香水|ニオイ移り|匂い移り|香り移り/, '芳香剤・香水のニオイ移り'],
  [/再美化|キャビン洗浄|運転手交代|ドライバー交代/, '車内全体の汚れとニオイ'],
  [/タバコ|たばこ|ヤニ|喫煙/, 'タバコ・ヤニのニオイ'],
  [/水没|浸水|豪雨/, '浸水・水没後の洗浄'],
  [/牛乳|ミルク|ジュース|コーヒー|カフェラテ|ラテ|ワイン|お茶|飲み物|ドリンク|飲みこぼ/, '飲み物・食べこぼしのシミ'],
  [/魚|鮮魚|生ゴミ|腐敗|生臭|魚の汁/, '腐敗臭'],
  [/カビ/, 'カビ臭'],
  [/ケチャップ|ソース|お菓子|食べこぼ|食べ物|弁当/, '食べこぼしのシミ'],
  [/加齢臭|体臭|皮脂|生活臭/, '加齢臭・体臭'],
  [/泥|砂|土汚れ/, '泥・砂汚れ'],
  [/エアコン|エバポレーター/, 'エアコンの吹き出し臭'],
  [/全体清掃|全体洗浄|車内清掃|クリーニング|清掃|洗浄|黒ずみ|くすみ/, '車内全体の汚れとニオイ'],
];

const METHOD_RULES: [RegExp, string][] = [
  [/リンサー|リンサ(?!ー)|抽出機|吸い上げ|吸い上げる機材|洗浄機/, '業務用リンサーの温水抽出洗浄'],
  [/スチーム/, '高温スチーム除菌'],
  [/オゾン|おぞん/, 'オゾン消臭'],
  [/手作業|ブラッシング|手洗い|手動で洗浄/, '手作業ブラッシング洗浄'],
  [/バキューム|吸引/, '業務用バキューム吸引'],
];

/** Longest first so ステップワゴン wins over ワゴン, ヴェルファイア over ァイア */
const CAR_MODELS = [
  'ヴェルファイア',
  'ベルファイア',
  'アルファード',
  'エスクァイア',
  'エスクワイヤ',
  'エスクヮイア',
  'ステップワゴン',
  'ステップWGN',
  'ムーヴキャンバス',
  'ランドクルーザー',
  'ハイラックス',
  'ハイエース',
  'エルグランド',
  'メルセデス',
  'Cクラス',
  'インプレッサ',
  'フォレスター',
  'スペーシア',
  'スペイシア',
  'ハスラー',
  'シエンタ',
  'エスティマ',
  'ハリアー',
  'プリウス',
  'ヴォクシー',
  'セレナ',
  'フリード',
  'オデッセイ',
  'ヴェゼル',
  'シビック',
  'アクセラ',
  'アテンザ',
  'デミオ',
  'CX-30',
  'CX-8',
  'CX-5',
  'CX-3',
  'N-BOX',
  'NBOX',
  'N-WGN',
  'NWGN',
  'バモス',
  'タント',
  'タフト',
  'デイズ',
  'ノート',
  'マーチ',
  'リーフ',
  'キックス',
  'サクラ',
  'フィット',
  'アクア',
  'ヤリス',
  'ライズ',
  'ルーミー',
  'パッソ',
  'スイフト',
  'ジムニー',
  'プレオ',
  'トール',
  'ノア',
  'レクサス',
  'クラウン',
  'カローラ',
  'ハイゼット',
  'キャンバス',
  'ワゴンR',
  'ライフ',
  'ルークス',
  'Roox',
  'ソリオ',
  'MAZDA2',
  'ミラージュ',
  'タンク',
  'ヴィッツ',
  'Vitz',
  'ベゼル',
].sort((a, b) => b.length - a.length);

const PLACE_ALIASES: [RegExp, string][] = [
  [/横浜市?/, '神奈川県横浜市'],
  [/名古屋市?/, '愛知県名古屋市'],
  [/那覇市?/, '沖縄県那覇市'],
  [/博多区/, '福岡県福岡市博多区'],
  [/北九州市?/, '福岡県北九州市'],
  [/神戸市?/, '兵庫県神戸市'],
  [/姫路市?/, '兵庫県姫路市'],
  [/仙台市?/, '宮城県仙台市'],
  [/宇都宮市?/, '栃木県宇都宮市'],
  [/蒲郡市?/, '愛知県蒲郡市'],
  [/豊橋市?/, '愛知県豊橋市'],
  [/豊田市/, '愛知県豊田市'],
  [/豊川市/, '愛知県豊川市'],
  [/大府市/, '愛知県大府市'],
  [/あま市/, '愛知県あま市'],
  [/宇治市/, '京都府宇治市'],
  [/世田谷区/, '東京都世田谷区'],
  [/練馬区/, '東京都練馬区'],
  [/大田区/, '東京都大田区'],
  [/鎌倉市/, '神奈川県鎌倉市'],
  [/草津市/, '滋賀県草津市'],
  [/川越市/, '埼玉県川越市'],
  [/さいたま市/, '埼玉県さいたま市'],
  [/船橋市/, '千葉県船橋市'],
  [/和光市/, '埼玉県和光市'],
  [/宝塚市/, '兵庫県宝塚市'],
  [/東灘区/, '兵庫県神戸市東灘区'],
  [/多賀城市/, '宮城県多賀城市'],
  [/神埼市/, '佐賀県神埼市'],
  [/田川市/, '福岡県田川市'],
  [/うるま市/, '沖縄県うるま市'],
  [/宜野湾市?/, '沖縄県宜野湾市'],
  [/久留米市/, '福岡県久留米市'],
  [/堺市/, '大阪府堺市'],
  [/吹田市/, '大阪府吹田市'],
  [/足利市/, '栃木県足利市'],
  [/伊勢崎市/, '群馬県伊勢崎市'],
  [/所沢市/, '埼玉県所沢市'],
  [/水戸市/, '茨城県水戸市'],
  [/柏市/, '千葉県柏市'],
  [/西宮市/, '兵庫県西宮市'],
];

/** Region / area suffixes that add nothing to a location label */
const AREA_SUFFIX = /[・､,、](?:東海|関東|北関東|関西|近畿|九州|東北|中国|四国|北陸|中部|沖縄)(?:エリア|地区|地方)?$/;

function collapseSpaces(value: string): string {
  return value.replace(/[\s\u3000]+/g, ' ').trim();
}

/** Editors mix full-width digits (「３6,000円」), so normalize before parsing numbers */
export function toHalfWidthDigits(value: string): string {
  return value.replace(/[０-９]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0),
  );
}

/** 「愛知県あま市・東海エリア」→「愛知県あま市」 */
export function normalizeAreaLabel(areaName: string | undefined): string | undefined {
  if (!areaName) return undefined;
  const cleaned = collapseSpaces(areaName).replace(AREA_SUFFIX, '').trim();
  const withoutSpaces = cleaned.replace(/\s+/g, '');
  return withoutSpaces || undefined;
}

/** 「【愛知県あま市】…」or「愛知県【豊田市】…」→ city label */
export function extractAreaFromTitle(title: string): string | undefined {
  const match = title.match(/[【[［]\s*([^】\]］]+?)\s*[】\]］]/);
  if (!match || match.index === undefined) return undefined;
  const inner = match[1].replace(/[\s\u3000]+/g, '');
  if (!inner) return undefined;
  const prefix = title.slice(0, match.index);
  const pref = prefix.match(/(北海道|東京都|京都府|大阪府|[^\s【[［]{2,8}[都道府県])\s*$/);
  if (pref && !inner.includes(pref[1].replace(/\s+/g, ''))) {
    return `${pref[1].replace(/\s+/g, '')}${inner}`;
  }
  return inner;
}

/** City / prefecture written without brackets, e.g. 「横浜のヴェルファイア」 */
export function extractPlaceFromTitle(title: string): string | undefined {
  const compact = title.replace(/[\s\u3000]+/g, '');
  for (const [pattern, label] of PLACE_ALIASES) {
    if (pattern.test(compact)) return label;
  }
  const pref = compact.match(/北海道|東京都|京都府|大阪府|.+?[都道府県]/);
  return pref?.[0];
}

/** Article subject without the leading area bracket */
export function extractTitleSubject(title: string): string {
  return collapseSpaces(title.replace(/^\s*[【[［][^】\]］]*[】\]］]/, ''));
}

export function extractCarModel(title: string, body = ''): string | undefined {
  const haystack = `${title}\n${body.slice(0, 400)}`;
  const compact = haystack.replace(/[\s\u3000]+/g, '');
  for (const model of CAR_MODELS) {
    if (compact.includes(model.replace(/[\s-]/g, '')) || haystack.includes(model)) {
      return model === 'Fit' ? 'フィット' : model;
    }
  }
  const truckTitle = toHalfWidthDigits(title).replace(/[ｔＴ]/g, 't');
  const truck =
    truckTitle.match(/([0-9]+)\s*t\s*トラック/i) ||
    truckTitle.match(/トラック\s*([0-9]+)\s*t/i);
  if (truck) return `${truck[1]}tトラック`;
  if (/大型トラック/.test(title)) return '大型トラック';
  if (/\bFit\b/i.test(title)) return 'フィット';
  return undefined;
}

function matchFirst(rules: [RegExp, string][], ...texts: string[]): string | undefined {
  for (const text of texts) {
    if (!text) continue;
    for (const [pattern, label] of rules) {
      if (pattern.test(text)) return label;
    }
  }
  return undefined;
}

function matchAll(rules: [RegExp, string][], text: string, limit: number): string[] {
  const found: string[] = [];
  for (const [pattern, label] of rules) {
    if (found.length >= limit) break;
    if (pattern.test(text)) found.push(label);
  }
  return found;
}

const PRICE_CONTEXT =
  /費用|料金|支払|お支払|合計|総額|金額|代金|お代|作業データ|作業時間|作業[0-9]|請求|税込|かかった|全部で|(?:^|[^ぁ-んァ-ン])計\s*[0-9]/;
const PRICE_SKIP =
  /相場|目安|前後|万円超|以上|カタログ|年間保険料|免責|買い替え|取り替え|十数万/;
const PRICE_KEEP = /今回|かかった|なりました|でした|作業データ|総額|合計|請求|全部で|税込/;
/** 「2万5000円」「39,000円」「3万円」「55千円」 */
const PRICE_PATTERN =
  /([0-9]+)\s*万\s*([0-9][0-9,]*)?\s*円|([0-9][0-9,]*)\s*千円|([0-9][0-9,]*)\s*円/g;

function shouldSkipPriceLine(line: string): boolean {
  if (PRICE_KEEP.test(line)) return false;
  return PRICE_SKIP.test(line);
}

/** Total price stated in the body, e.g. 「全部で39,000円でした」 */
export function extractPrice(body: string | undefined): string | undefined {
  if (!body) return undefined;
  let best = 0;
  const rawLines = body.split(/\r?\n/);
  for (let i = 0; i < rawLines.length; i += 1) {
    let line = toHalfWidthDigits(rawLines[i] ?? '');
    const next = toHalfWidthDigits(rawLines[i + 1] ?? '');
    if (/作業データ|費用|料金|金額/.test(line) && /^\s*[0-9,.]+円/.test(next)) {
      line = `${line} ${next}`;
    }
    if (shouldSkipPriceLine(line)) continue;
    if (!PRICE_CONTEXT.test(line) && !/\d\s*千円/.test(line)) continue;
    for (const match of line.matchAll(PRICE_PATTERN)) {
      const [, man, manRest, sen, plain] = match;
      const yen = man
        ? Number(man) * 10000 + Number((manRest ?? '0').replace(/,/g, ''))
        : sen
          ? Number(sen.replace(/,/g, '')) * 1000
          : Number((plain ?? '0').replace(/,/g, ''));
      if (!Number.isFinite(yen)) continue;
      if (yen >= 3000 && yen <= 300000 && yen > best) best = yen;
    }
  }
  if (best === 0) return undefined;
  return `${best.toLocaleString('ja-JP')}円`;
}

const WORK_TIME_CONTEXT =
  /作業時間|作業データ|所要|時間ほど|時間程|時間半|かかりました|かかった時間|終了|完了|作業[0-9]/;
const WORK_TIME_SKIP = /乾燥|着座|座らな|換気しながら|数日|4日|四日/;
const WORK_TIME_PATTERN = /([0-9]+(?:\.[0-9])?)\s*時間(半)?(?:\s*([0-9]+)\s*分)?/;

/** Work duration stated in the body, e.g. 「作業時間は約3時間ほど」 */
export function extractWorkTime(body: string | undefined): string | undefined {
  if (!body) return undefined;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = toHalfWidthDigits(rawLine);
    if (WORK_TIME_SKIP.test(line) && !/作業時間|作業データ/.test(line)) continue;
    if (!WORK_TIME_CONTEXT.test(line)) continue;
    const match = line.match(WORK_TIME_PATTERN);
    if (!match) continue;
    const hours = Number(match[1]);
    if (!Number.isFinite(hours) || hours <= 0 || hours > 24) continue;
    if (match[3]) return `約${match[1]}時間${match[3]}分`;
    return `約${match[1]}時間${match[2] ? '半' : ''}`;
  }
  return undefined;
}

export function isGuideArticle(title: string): boolean {
  return GUIDE_TITLE_PATTERN.test(title);
}

export function buildBlogAnswerFirst(source: AnswerFirstSource): BlogAnswerFirst {
  const summary = source.summary ?? {};
  const body = source.body ?? '';
  const title = source.title ?? '';

  const ownArea =
    normalizeAreaLabel(source.areaName) ??
    extractAreaFromTitle(title) ??
    extractPlaceFromTitle(title);
  const guide = isGuideArticle(title);
  /** Prefecture-only CMS categories must not convert a how-to into a measured case */
  const kind: 'case' | 'guide' = !guide && ownArea ? 'case' : 'guide';
  const area = ownArea ?? (kind === 'case' ? source.fallbackArea : undefined);

  const trouble = summary.trouble?.trim() || matchFirst(TROUBLE_RULES, title, body);
  const method =
    summary.method?.trim() || matchAll(METHOD_RULES, body, 3).join('＋') || undefined;
  const workTime =
    summary.work_time?.trim() || (kind === 'case' ? extractWorkTime(body) : undefined);
  const price = summary.price?.trim() || (kind === 'case' ? extractPrice(body) : undefined);
  const carModel = summary.car_model?.trim() || extractCarModel(title, body);

  const quickFacts: BlogQuickFact[] = [];
  if (area) quickFacts.push({ label: '施工エリア', value: area });
  if (carModel) quickFacts.push({ label: '車種', value: carModel });
  if (trouble) quickFacts.push({ label: 'お悩み', value: trouble });
  if (kind === 'case' && method) quickFacts.push({ label: '施工内容', value: method });
  if (workTime) quickFacts.push({ label: '作業時間', value: workTime });
  if (price) quickFacts.push({ label: '費用', value: price });

  const text =
    summary.answer_first?.trim() ||
    buildAnswerFirstText({ kind, area, trouble, method, workTime, price, carModel });

  return { text, kind, area, trouble, method, workTime, price, carModel, quickFacts };
}

function buildAnswerFirstText(facts: {
  kind: 'case' | 'guide';
  area?: string;
  trouble?: string;
  method?: string;
  workTime?: string;
  price?: string;
  carModel?: string;
}): string {
  if (facts.kind === 'guide') {
    const topic = facts.trouble ?? '車内の汚れとニオイ';
    return [
      `${topic}の対処法を、出張車内クリーニングの現場目線でまとめた解説記事です。`,
      'ご自身で対処できる範囲と、専門業者に任せた方がよい判断ラインを説明します。',
      '判断に迷うときは、写真を送っていただければ当日中に目安をご案内します。',
    ].join('');
  }

  const subject = facts.carModel ? `${facts.carModel}の` : '';
  const sentences: string[] = [
    `${facts.area}で対応した${subject}出張車内クリーニングの施工事例です。`,
  ];

  if (facts.trouble) {
    sentences.push(`ご相談内容は${facts.trouble}。`);
  }
  if (facts.method) {
    sentences.push(`${facts.method}で現地対応しました。`);
  }

  const measured: string[] = [];
  if (facts.workTime) measured.push(`作業時間は${facts.workTime}`);
  if (facts.price) measured.push(`費用は${facts.price}`);
  if (measured.length > 0) {
    sentences.push(`${measured.join('、')}でした。`);
  }

  sentences.push('同じ症状でお困りの方は、写真を送っていただければ当日中に目安をご案内します。');

  return sentences.join('');
}

/** Meta description / card excerpt: single line, length-capped */
export function toExcerpt(text: string, maxLength = 120): string {
  const flat = collapseSpaces(text.replace(/\\$/gm, ''));
  if (flat.length <= maxLength) return flat;
  return `${flat.slice(0, maxLength - 1)}…`;
}

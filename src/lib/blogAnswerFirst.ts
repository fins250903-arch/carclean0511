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

const TROUBLE_RULES: [RegExp, string][] = [
  [/嘔吐|ゲロ|吐い|吐瀉|車酔い/, '嘔吐（ゲロ）汚れとニオイ'],
  [/下痢/, '下痢による汚れとニオイ'],
  [/おもらし|お漏らし|失禁|尿|おしっこ|オシッコ/, 'おもらし・尿の染み込み'],
  [/粗相|ペット|愛犬|愛猫|犬|猫|獣臭/, 'ペットの粗相・獣臭'],
  [/灯油/, '灯油こぼし'],
  [/芳香剤|香水|ニオイ移り|匂い移り|香り移り/, '芳香剤・香水のニオイ移り'],
  [/タバコ|たばこ|ヤニ|喫煙/, 'タバコ・ヤニのニオイ'],
  [/水没|浸水|豪雨/, '浸水・水没後の洗浄'],
  [/カビ/, 'カビ臭'],
  [/牛乳|ミルク|ジュース|コーヒー|飲み物|ドリンク|ワイン|お茶|こぼし/, '飲み物・食べこぼしのシミ'],
  [/ケチャップ|ソース|お菓子|食べこぼ|食べ物|弁当/, '食べこぼしのシミ'],
  [/魚|生ゴミ|腐敗/, '腐敗臭'],
  [/加齢臭|体臭|汗|皮脂|生活臭/, '加齢臭・体臭'],
  [/泥|砂/, '泥・砂汚れ'],
  [/エアコン|エバポレーター/, 'エアコンの吹き出し臭'],
  [/全体清掃|全体洗浄|車内清掃|クリーニング|清掃|洗浄|黒ずみ|くすみ/, '車内全体の汚れとニオイ'],
];

const METHOD_RULES: [RegExp, string][] = [
  [/リンサー/, '業務用リンサーの温水抽出洗浄'],
  [/スチーム/, '高温スチーム除菌'],
  [/オゾン/, 'オゾン消臭'],
  [/手作業|ブラッシング|手洗い/, '手作業ブラッシング洗浄'],
  [/バキューム|吸引/, '業務用バキューム吸引'],
];

/** Region / area suffixes that add nothing to a location label */
const AREA_SUFFIX = /[・､,、](?:東海|関東|北関東|関西|近畿|九州|東北|中国|四国|北陸|中部|沖縄)(?:エリア|地区|地方)?$/;

function collapseSpaces(value: string): string {
  return value.replace(/[\s\u3000]+/g, ' ').trim();
}

/** Editors mix full-width digits (「３6,000円」), so normalize before parsing numbers */
function toHalfWidthDigits(value: string): string {
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

/** 「【愛知県あま市】エスティマ…」→「愛知県あま市」 */
export function extractAreaFromTitle(title: string): string | undefined {
  const match = title.match(/^\s*[【[［]\s*([^】\]］]+?)\s*[】\]］]/);
  if (!match) return undefined;
  return match[1].replace(/[\s\u3000]+/g, '') || undefined;
}

/** Article subject without the leading area bracket */
export function extractTitleSubject(title: string): string {
  return collapseSpaces(title.replace(/^\s*[【[［][^】\]］]*[】\]］]/, ''));
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

const PRICE_CONTEXT = /費用|料金|支払|お支払|合計|総額|金額|代金|お代|作業データ|作業時間|作業[0-9]/;
/** 「2万5000円」「39,000円」「3万円」 */
const PRICE_PATTERN = /(?:([0-9]+)\s*万\s*([0-9][0-9,]*)?|([0-9][0-9,]*))\s*円/g;

/** Total price stated in the body, e.g. 「全部で39,000円でした」 */
export function extractPrice(body: string | undefined): string | undefined {
  if (!body) return undefined;
  let best = 0;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = toHalfWidthDigits(rawLine);
    if (!PRICE_CONTEXT.test(line)) continue;
    for (const match of line.matchAll(PRICE_PATTERN)) {
      const [, man, manRest, plain] = match;
      const yen = man
        ? Number(man) * 10000 + Number((manRest ?? '0').replace(/,/g, ''))
        : Number((plain ?? '0').replace(/,/g, ''));
      if (!Number.isFinite(yen)) continue;
      // 「プラス5000円」のような部分費用ではなく、文中の最大額＝総額を採用
      if (yen >= 3000 && yen <= 3000000 && yen > best) best = yen;
    }
  }
  if (best === 0) return undefined;
  return `${best.toLocaleString('ja-JP')}円`;
}

const WORK_TIME_CONTEXT = /作業時間|作業データ|所要|時間ほど|時間程|時間半|かかりました|終了|完了|作業[0-9]/;
const WORK_TIME_PATTERN = /([0-9]+(?:\.[0-9])?)\s*時間(半)?/;

/** Work duration stated in the body, e.g. 「作業時間は約3時間ほど」 */
export function extractWorkTime(body: string | undefined): string | undefined {
  if (!body) return undefined;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = toHalfWidthDigits(rawLine);
    if (!WORK_TIME_CONTEXT.test(line)) continue;
    const match = line.match(WORK_TIME_PATTERN);
    if (!match) continue;
    const hours = Number(match[1]);
    if (!Number.isFinite(hours) || hours <= 0 || hours > 24) continue;
    return `約${match[1]}時間${match[2] ? '半' : ''}`;
  }
  return undefined;
}

export function buildBlogAnswerFirst(source: AnswerFirstSource): BlogAnswerFirst {
  const summary = source.summary ?? {};
  const body = source.body ?? '';
  const title = source.title ?? '';

  const ownArea = normalizeAreaLabel(source.areaName) ?? extractAreaFromTitle(title);
  const area = ownArea ?? source.fallbackArea;
  /** No area at all means a how-to article, not a single job with measured facts */
  const kind: 'case' | 'guide' = area ? 'case' : 'guide';

  const trouble = summary.trouble?.trim() || matchFirst(TROUBLE_RULES, title, body);
  const method =
    summary.method?.trim() || matchAll(METHOD_RULES, body, 3).join('＋') || undefined;
  const workTime =
    summary.work_time?.trim() || (kind === 'case' ? extractWorkTime(body) : undefined);
  const price =
    summary.price?.trim() || (kind === 'case' ? extractPrice(body) : undefined);
  const carModel = summary.car_model?.trim() || undefined;

  const quickFacts: BlogQuickFact[] = [];
  if (area) quickFacts.push({ label: '施工エリア', value: area });
  if (carModel) quickFacts.push({ label: '車種', value: carModel });
  if (trouble) quickFacts.push({ label: 'お悩み', value: trouble });
  if (kind === 'case' && method) quickFacts.push({ label: '施工内容', value: method });
  if (workTime) quickFacts.push({ label: '作業時間', value: workTime });
  if (price) quickFacts.push({ label: '費用（税込）', value: price });

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
  if (facts.price) measured.push(`費用は${facts.price}（税込）`);
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

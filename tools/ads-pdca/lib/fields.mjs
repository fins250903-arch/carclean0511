/**
 * Allowlisted column mapping. Unknown headers (name, phone, email, address)
 * are dropped so internal reports cannot echo customer PII.
 */

export function normHeader(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s　_./・:：%％()（）[\]「」\-]/g, '');
}

const ALIASES = [
  ['campaign', ['キャンペーン名', 'キャンペーン', 'campaign']],
  ['adGroup', ['広告グループ名', '広告グループ', 'adgroup']],
  ['keyword', ['検索広告キーワード', '検索キーワード', '検索語句', '検索ネットワーク', 'キーワード', 'keyword']],
  ['impressions', ['表示回数', 'インプレッション', 'impressions', 'imp']],
  ['clicks', ['クリック数', 'クリック', 'clicks']],
  ['ctr', ['クリック率', 'clickthroughrate', 'ctr']],
  ['cost', ['消化金額', '広告費', '費用', 'コスト', 'cost']],
  ['conversions', ['コンバージョン数', 'コンバージョン', 'conversions', 'cv']],
  ['cvr', ['コンバージョン率', '問い合わせ率', 'convrate', 'cvr']],
  ['cpa', ['コンバージョン単価', '獲得単価', '費用コンバージョン', 'costconv', 'cpa']],
  [
    'impressionShare',
    [
      '検索広告のインプレッションシェア',
      'インプレッションシェア',
      '表示シェア',
      '検索インプレッションシェア',
      '広告率',
      'searchimpressionshare',
    ],
  ],
  ['date', ['受注日', '問い合わせ日', '問合せ日', '受付日', '日付', 'date']],
  ['status', ['区分', 'ステータス', '状況', '進捗', '結果', 'status']],
  ['closedFlag', ['成約フラグ', '受注フラグ', '成約', '受注', '契約']],
  ['closedCount', ['成約数', '受注数', '契約数']],
  ['inquiryCount', ['問い合わせ数', '問合せ数', 'リード数']],
  ['revenue', ['受注金額', '成約金額', '売上金額', '売上', '金額']],
  ['source', ['流入経路', '媒体', '流入', '経路', 'チャネル', 'source', 'medium']],
  ['region', ['都道府県', '地域', 'エリア', 'region']],
];

const HEADER_TO_FIELD = new Map();
for (const [field, aliases] of ALIASES) {
  for (const alias of aliases) {
    HEADER_TO_FIELD.set(normHeader(alias), field);
  }
}

const RATE_FIELDS = new Set(['ctr', 'cvr', 'impressionShare']);
const NUMBER_FIELDS = new Set([
  'impressions',
  'clicks',
  'cost',
  'conversions',
  'cpa',
  'closedCount',
  'inquiryCount',
  'revenue',
]);

export function parseNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value == null) return null;
  let text = String(value).trim();
  if (!text || text === '-' || text === '—' || text === '--') return null;
  text = text.replace(/[¥￥,\s円]/g, '').replace(/%/g, '');
  if (!text) return null;
  if (text.includes('+')) {
    const parts = text.split('+').map((part) => Number(part));
    if (parts.length > 1 && parts.every((part) => Number.isFinite(part))) {
      return parts.reduce((total, part) => total + part, 0);
    }
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Percent strings and values above 1 are ratios. 0.052 and "5.2%" both become 0.052. */
export function parseRate(value) {
  if (value == null || String(value).trim() === '') return null;
  const raw = String(value).trim();
  const parsed = parseNumber(raw);
  if (parsed == null) return null;
  if (raw.includes('%') || parsed > 1) return parsed / 100;
  return parsed;
}

export function parseFlag(value) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  if (/^(1|true|yes|y|はい|有|あり|○|◯|〇|済|成約|受注|契約)$/i.test(text)) return true;
  if (/^(0|false|no|n|いいえ|無|なし|未|失注|見積|見積もり|×|不成約|未成約)$/i.test(text)) return false;
  return null;
}

function cleanText(value) {
  const text = String(value ?? '').trim();
  return text || null;
}

export function mapFields(raw) {
  const picked = {};
  for (const [header, value] of Object.entries(raw ?? {})) {
    const field = HEADER_TO_FIELD.get(normHeader(header));
    if (!field || picked[field] !== undefined) continue;
    picked[field] = value;
  }

  const mapped = {
    campaign: cleanText(picked.campaign),
    adGroup: cleanText(picked.adGroup),
    keyword: cleanText(picked.keyword),
    date: cleanText(picked.date),
    status: cleanText(picked.status),
    source: cleanText(picked.source),
    region: cleanText(picked.region),
    closedFlag: parseFlag(picked.closedFlag),
  };

  for (const field of NUMBER_FIELDS) {
    mapped[field] = parseNumber(picked[field]);
  }
  for (const field of RATE_FIELDS) {
    mapped[field] = parseRate(picked[field]);
  }
  if (mapped.closedFlag == null && mapped.revenue != null && mapped.revenue > 0) {
    mapped.closedFlag = true;
  }
  return mapped;
}

export function isTotalLabel(value) {
  return /^(合計|総計|total|grandtotal)$/i.test(String(value ?? '').replace(/\s+/g, ''));
}

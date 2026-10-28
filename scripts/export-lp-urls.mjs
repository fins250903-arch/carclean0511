/**
 * 全LPのURL一覧を CSV 出力（Googleスプレッドシート取込用）
 * Usage: node scripts/export-lp-urls.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SITE = 'https://carinteriorcleaning.jp';

function parseRegions(ts) {
  const re = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'\s*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(ts))) out.push({ id: m[1], name: m[2] });
  return out;
}

function parseKeywordPages(ts) {
  const re =
    /slug:\s*'([^']+)'[\s\S]*?seoTitle:\s*'((?:\\'|[^'])*)'/g;
  const out = [];
  let m;
  while ((m = re.exec(ts))) {
    out.push({
      slug: m[1],
      seoTitle: m[2].replace(/\\'/g, "'"),
    });
  }
  return out;
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function row(cols) {
  return cols.map(csvEscape).join(',');
}

const regionsTs = fs.readFileSync(path.join(root, 'src/data/regions.ts'), 'utf8');
const kwTs = fs.readFileSync(path.join(root, 'src/data/adKeywordPages.ts'), 'utf8');
const regions = parseRegions(regionsTs);
const keywords = parseKeywordPages(kwTs);

const rows = [];
let no = 0;

const header = [
  '番号',
  'LP種別',
  '地域ID',
  '地域名',
  'キーワードslug',
  '訴求・キーワード名',
  'URL',
  'パス',
  '備考',
];

rows.push(row(header));

// ルート（リダイレクト）
no += 1;
rows.push(
  row([
    no,
    'リダイレクト',
    '—',
    '—',
    '—',
    '—',
    `${SITE}/`,
    '/',
    '301 → /regions/osaka/',
  ]),
);

// 地域メイン（乗用車）
for (const r of regions) {
  no += 1;
  const p = `/regions/${r.id}/`;
  rows.push(
    row([
      no,
      '地域メインLP',
      r.id,
      r.name,
      '',
      `${r.name} 車内クリーニング`,
      `${SITE}${p}`,
      p,
      '乗用車',
    ]),
  );
}

// 地域トラック
for (const r of regions) {
  no += 1;
  const p = `/regions/${r.id}-truck/`;
  rows.push(
    row([
      no,
      '地域トラックLP',
      r.id,
      r.name,
      '',
      `${r.name} トラックキャビン清掃`,
      `${SITE}${p}`,
      p,
      'トラック',
    ]),
  );
}

// キーワードLP（全地域 × 全キーワード）
for (const r of regions) {
  for (const kw of keywords) {
    no += 1;
    const p = `/regions/${r.id}/${kw.slug}/`;
    rows.push(
      row([
        no,
        'キーワードLP',
        r.id,
        r.name,
        kw.slug,
        kw.seoTitle,
        `${SITE}${p}`,
        p,
        'Google広告用',
      ]),
    );
  }
}

// コーティングLP
no += 1;
rows.push(
  row([
    no,
    'コーティングLP',
    'fukuoka',
    '福岡県',
    '',
    'ガラスコーティング＋車内クリーニング',
    `${SITE}/coating/fukuoka/`,
    '/coating/fukuoka/',
    '福岡限定セット',
  ]),
);

const csvBody = rows.join('\r\n');
const bom = '\uFEFF';
const outDir = path.join(root, 'docs');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'lp-url-list.csv');
fs.writeFileSync(outPath, bom + csvBody, 'utf8');

const counts = {
  redirect: 1,
  regionalMain: regions.length,
  regionalTruck: regions.length,
  keyword: regions.length * keywords.length,
  coating: 1,
  total: no,
};
console.log(JSON.stringify({ outPath, counts, regions: regions.length, keywords: keywords.length }, null, 2));

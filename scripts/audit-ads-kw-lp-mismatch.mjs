#!/usr/bin/env node
/**
 * Audit Google Ads Editor RSA export (TSV/CSV) for keyword/AG ↔ LP mismatches.
 *
 * Usage:
 *   node scripts/audit-ads-kw-lp-mismatch.mjs <path-to-ads-editor-export.tsv>
 *
 * Expects tab-separated Ads Editor export with columns:
 *   Campaign, Ad Group, Final URL, Path 1, Path 2, Headline *, Description *
 *
 * Writes:
 *   docs/google-ads/audit/kw-lp-mismatch-report.md
 *   docs/google-ads/audit/kw-lp-mismatch-hard.csv
 *   docs/google-ads/audit/kw-lp-mismatch-path2.csv
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'docs/google-ads/audit');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/audit-ads-kw-lp-mismatch.mjs <ads-editor-export.tsv>');
  process.exit(1);
}

/** @type {Record<string, string[]>} */
const AG_EXPECTED = {
  '車内 灯油 こぼし': ['touyu-kobosi'],
  車ペット毛: ['pet-ke', 'pet-hair-odor'],
  'ペットうんち・車内除菌洗浄': ['pet-unko', 'pet-waste'],
  車内の臭い: ['shanai-nioi', 'mold-odor'],
  '車　 汗': ['ase'],
  中古車タバコ臭: ['chuko-tabako'],
  中古車加齢臭: ['chuko-kareisyu'],
  '車 嘔吐 クリーニング': ['kyuto-cleaning', 'vomit-cleaning', 'gero-cleaning'],
  '車内 消臭・脱臭洗浄': ['shanai-shoshu'],
  '車 匂い 消し・消臭洗浄': ['kuruma-nioi-keshi', 'odor-removal'],
  '車　 おもらし': ['omorashi'],
  '車　 エアコン臭い': ['ac-nioi', 'ac-kusai'],
  '車　加齢臭': ['kareisyu'],
  '車　 ペット臭': ['pet-nioi'],
  '車 エアコンクリーニング': ['car-ac-cleaning'],
  '出張 車内クリーニング 専門店': [
    'shutchou-senmon',
    'specialist-cleaning',
    'mobile-cleaning',
  ],
  '車シート 洗浄': ['seat-senjo', 'seat-washing'],
  '車シート クリーニング': ['seat-cleaning'],
  '車　 おしっこ': ['oshikko', 'pet-hair-odor'],
  '車　 うんこ': ['unko'],
  車の匂い取り: ['kuruma-nioitori'],
  '車　 タバコの匂い汚れ・タバコのヤニ': ['tabako-yani', 'tobacco-odor'],
  AG_緊急_嘔吐: ['kyuto-cleaning', 'vomit-cleaning', 'gero-cleaning'],
  AG_緊急_子供嘔吐: ['kodomo-kyuto'],
  緊急_子供嘔吐: ['kodomo-kyuto'],
  AG_緊急_灯油: ['touyu-kobosi'],
  AG_緊急_ペット: [
    'oshikko',
    'omorashi',
    'unko',
    'pet-unko',
    'pet-waste',
    'pet-nioi',
    'pet-ke',
    'pet-hair-odor',
  ],
  緊急_ペット: [
    'oshikko',
    'omorashi',
    'unko',
    'pet-unko',
    'pet-waste',
    'pet-nioi',
    'pet-ke',
    'pet-hair-odor',
  ],
  AG_消臭_口語: [
    'kuruma-nioi-keshi',
    'odor-removal',
    'kuruma-nioitori',
    'shanai-nioi',
    'shanai-shoshu',
  ],
  消臭_口語: [
    'kuruma-nioi-keshi',
    'odor-removal',
    'kuruma-nioitori',
    'shanai-nioi',
    'shanai-shoshu',
  ],
  AG_消臭_中古車: ['chuko-tabako', 'chuko-kareisyu'],
  消臭_中古車: ['chuko-tabako', 'chuko-kareisyu'],
  AG_消臭_湿気カビ: ['shanai-nioi', 'mold-odor'],
  AG_エアコン_エバポレーター: ['evaporator-senjo', 'ac-mold'],
  AG_エアコン_エバポ: ['evaporator-senjo', 'ac-mold'],
  AG_条件_出張: [
    'shutchou-senmon',
    'mobile-cleaning',
    'specialist-cleaning',
    'interior-cleaning',
  ],
  AG_条件_電源不要: ['dengen-fuyou'],
  AG_保険_B2B: ['hoken-kyuto'],
  AG_バス_トラック: ['bus-senmon'],
};

const SLUG_THEME = {
  'touyu-kobosi': '灯油',
  'pet-ke': 'ペット毛',
  'pet-hair-odor': 'ペット毛/おしっこ',
  'pet-unko': 'ペットうんち',
  'pet-waste': 'ペットうんち',
  'shanai-nioi': '車内臭い',
  'mold-odor': 'カビ臭',
  ase: '汗',
  'chuko-tabako': '中古車タバコ',
  'chuko-kareisyu': '中古車加齢臭',
  'kyuto-cleaning': '嘔吐',
  'vomit-cleaning': '嘔吐',
  'gero-cleaning': 'ゲロ',
  'shanai-shoshu': '消臭脱臭',
  'kuruma-nioi-keshi': '匂い消し',
  'odor-removal': '匂い消し',
  omorashi: 'おもらし',
  'ac-nioi': 'エアコン臭い',
  'ac-kusai': 'エアコン臭い',
  kareisyu: '加齢臭',
  'pet-nioi': 'ペット臭',
  'car-ac-cleaning': 'エアコンクリーニング',
  'shutchou-senmon': '出張専門',
  'specialist-cleaning': '専門店',
  'mobile-cleaning': '出張専門',
  'seat-senjo': 'シート洗浄',
  'seat-washing': 'シート洗浄',
  'seat-cleaning': 'シートクリーニング',
  oshikko: 'おしっこ',
  unko: 'うんこ',
  'kuruma-nioitori': '匂い取り',
  'tabako-yani': 'タバコヤニ',
  'tobacco-odor': 'タバコ',
  'kodomo-kyuto': '子供嘔吐',
  'evaporator-senjo': 'エバポ',
  'ac-mold': 'エアコンカビ',
  'dengen-fuyou': '電源不要',
  'hoken-kyuto': '保険嘔吐',
  'bus-senmon': 'バス専門',
  'interior-cleaning': '通常清掃',
  'spray-kouka-nai': 'スプレー効かない',
};

const PATH2_THEME = [
  {
    words: ['嘔吐', 'ゲロ'],
    ok: [
      'kyuto-cleaning',
      'vomit-cleaning',
      'gero-cleaning',
      'kodomo-kyuto',
      'hoken-kyuto',
      'bus-senmon',
      'interior-cleaning',
    ],
  },
  {
    words: ['ペットうんち', 'うんち'],
    ok: ['pet-unko', 'pet-waste', 'unko'],
  },
  {
    words: ['タバコ'],
    ok: ['tabako-yani', 'tobacco-odor', 'chuko-tabako'],
  },
  {
    words: ['消臭脱臭'],
    ok: ['shanai-shoshu', 'kuruma-nioi-keshi', 'odor-removal', 'shanai-nioi'],
  },
  {
    words: ['エアコン'],
    ok: [
      'car-ac-cleaning',
      'ac-nioi',
      'ac-kusai',
      'evaporator-senjo',
      'ac-mold',
    ],
  },
];

const CAMPAIGN_REGION = {
  大阪府: 'osaka',
  沖縄県: 'okinawa',
  宮城県: 'miyagi',
  愛知県: 'aichi',
  千葉県: 'chiba',
  兵庫県: 'hyogo',
  福岡県: 'fukuoka',
  群馬県: 'gunma',
  栃木県: 'tochigi',
};

const CITY_TO_PREF = {
  大阪: 'osaka',
  沖縄: 'okinawa',
  宮城: 'miyagi',
  仙台: 'miyagi',
  愛知: 'aichi',
  名古屋: 'aichi',
  千葉: 'chiba',
  兵庫: 'hyogo',
  神戸: 'hyogo',
  福岡: 'fukuoka',
  群馬: 'gunma',
  栃木: 'tochigi',
};

function parseTsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.length > 0);
  const headers = lines[0].split('\t');
  return lines.slice(1).map((line, idx) => {
    const cols = line.split('\t');
    /** @type {Record<string, string>} */
    const row = { __line: String(idx + 2) };
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? '';
    });
    return row;
  });
}

function parseUrl(url) {
  if (!url) return { region: null, slug: null };
  try {
    const u = new URL(url.trim());
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'regions' && parts.length >= 3) {
      return { region: parts[1], slug: parts[2] };
    }
    if (parts[0] === 'regions' && parts.length >= 2) {
      return { region: parts[1], slug: null };
    }
  } catch {
    /* ignore */
  }
  return { region: null, slug: null };
}

function lookupExpected(ag) {
  if (AG_EXPECTED[ag]) return AG_EXPECTED[ag];
  let best = null;
  for (const [k, v] of Object.entries(AG_EXPECTED)) {
    if (ag === k || ag.startsWith(`${k} `) || ag.startsWith(`${k}_`)) {
      if (!best || k.length > best.k.length) best = { k, v };
    }
  }
  if (best) return best.v;
  for (const [k, v] of Object.entries(AG_EXPECTED)) {
    if (k.startsWith('AG_') && ag === k.slice(3)) return v;
  }
  if (ag.startsWith('int') && /(通常|515|２|2)/.test(ag)) {
    return ['interior-cleaning'];
  }
  if (ag.includes('トラック')) return ['__truck__'];
  return null;
}

function uniq(items, keys) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keys.map((k) => item[k]).join('\0');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows, columns) {
  const header = columns.join(',');
  const body = rows
    .map((r) => columns.map((c) => csvEscape(r[c])).join(','))
    .join('\n');
  return `${header}\n${body}\n`;
}

function themeOf(slugs) {
  return [...new Set(slugs.map((s) => SLUG_THEME[s] || s))].join('/');
}

const raw = fs.readFileSync(inputPath, 'utf8');
const rows = parseTsv(raw);

const hard = [];
const path2Issues = [];
const locIssues = [];
const descContam = [];

for (const r of rows) {
  const campaign = r.Campaign || '';
  const ag = r['Ad Group'] || '';
  const url = (r['Final URL'] || '').trim();
  if (!url || url.includes('abura.site') || url.includes('deadning')) continue;

  const { slug } = parseUrl(url);
  if (!slug) continue;

  const expected = lookupExpected(ag);
  if (expected && expected[0] !== '__truck__' && !expected.includes(slug)) {
    hard.push({
      line: r.__line,
      campaign,
      ad_group: ag,
      expected_slugs: expected.join('|'),
      expected_theme: themeOf(expected),
      actual_slug: slug,
      actual_theme: SLUG_THEME[slug] || slug,
      final_url: url,
      headline2: r['Headline 2'] || '',
      path2: r['Path 2'] || '',
      status: r.Status || '',
      suggested_url: url.replace(`/${slug}/`, `/${expected[0]}/`),
      severity: 'CRITICAL',
      issue: 'AGテーマとFinal URLが不一致',
    });
  }

  const path2 = (r['Path 2'] || '').trim();
  if (path2) {
    for (const rule of PATH2_THEME) {
      if (rule.words.some((w) => path2.includes(w))) {
        if (!rule.ok.includes(slug)) {
          path2Issues.push({
            line: r.__line,
            campaign,
            ad_group: ag,
            path2,
            actual_slug: slug,
            actual_theme: SLUG_THEME[slug] || slug,
            final_url: url,
            headline2: r['Headline 2'] || '',
            severity: 'HIGH',
            issue: '表示パス(Path2)のテーマとLPが不一致（CTR低下要因）',
          });
        }
        break;
      }
    }
  }

  let campReg = null;
  for (const [pref, rid] of Object.entries(CAMPAIGN_REGION)) {
    if (campaign.includes(pref)) {
      campReg = rid;
      break;
    }
  }
  const blob = [
    ...Array.from({ length: 15 }, (_, i) => r[`Headline ${i + 1}`] || ''),
    r['Path 1'] || '',
    ...Array.from({ length: 4 }, (_, i) => r[`Description ${i + 1}`] || ''),
  ].join(' ');
  const locPins = [...blob.matchAll(/LOCATION\(City\):([^}]+)/g)].map((m) =>
    m[1].trim(),
  );
  if (campReg && locPins.length) {
    for (const pin of locPins) {
      const pinReg = CITY_TO_PREF[pin];
      if (pinReg && pinReg !== campReg) {
        locIssues.push({
          line: r.__line,
          campaign,
          ad_group: ag,
          location_pin: pin,
          campaign_region: campReg,
          final_url: url,
          headline2: r['Headline 2'] || '',
          severity: 'MEDIUM',
          issue: 'キャンペーン地域とLOCATIONピンが不一致',
        });
      }
    }
  }

  const descs = Array.from({ length: 4 }, (_, i) => r[`Description ${i + 1}`] || '').join(
    ' ',
  );
  if (descs.includes('ペット毛')) {
    const petAgs = ['ペット毛', 'pet-ke', '通常', 'int', '専門', '出張'];
    const okSlugs = new Set([
      'pet-ke',
      'pet-hair-odor',
      'interior-cleaning',
      'shutchou-senmon',
      'specialist-cleaning',
      'mobile-cleaning',
    ]);
    if (!petAgs.some((x) => ag.includes(x)) && !okSlugs.has(slug)) {
      descContam.push({
        line: r.__line,
        campaign,
        ad_group: ag,
        actual_slug: slug,
        actual_theme: SLUG_THEME[slug] || slug,
        snippet: descs.slice(0, 100),
        severity: 'MEDIUM',
        issue: '説明文が他テーマ（ペット毛）のコピペのまま',
      });
    }
  }
}

const hardU = uniq(hard, ['campaign', 'ad_group', 'actual_slug', 'final_url']);
const path2U = uniq(path2Issues, ['campaign', 'ad_group', 'path2', 'actual_slug']);
const locU = uniq(locIssues, ['campaign', 'ad_group', 'location_pin']);
const descU = uniq(descContam, ['campaign', 'ad_group', 'actual_slug']);

const path2VomitWrongRows = path2Issues.filter((p) => p.path2.includes('嘔吐')).length;

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'kw-lp-mismatch-hard.csv'),
  toCsv(hardU, [
    'severity',
    'campaign',
    'ad_group',
    'expected_theme',
    'expected_slugs',
    'actual_theme',
    'actual_slug',
    'final_url',
    'suggested_url',
    'headline2',
    'path2',
    'status',
    'line',
  ]),
  'utf8',
);

fs.writeFileSync(
  path.join(outDir, 'kw-lp-mismatch-path2.csv'),
  toCsv(path2U, [
    'severity',
    'campaign',
    'ad_group',
    'path2',
    'actual_theme',
    'actual_slug',
    'final_url',
    'headline2',
    'line',
  ]),
  'utf8',
);

const criticalByType = {};
for (const h of hardU) {
  const key = `${h.expected_theme} → ${h.actual_theme}`;
  criticalByType[key] = (criticalByType[key] || 0) + 1;
}

const path2Counter = {};
for (const p of path2U) {
  const key = `Path2「${p.path2}」→ LP「${p.actual_theme}」`;
  path2Counter[key] = (path2Counter[key] || 0) + 1;
}

const md = `# Google Ads キーワード／広告グループ ↔ LP ミスマッチ監査

**対象:** Ads Editor RSAエクスポート（\`${path.basename(inputPath)}\`）  
**件数:** 広告行 ${rows.length} / 監査日: ${new Date().toISOString().slice(0, 10)}  
**再実行:** \`node scripts/audit-ads-kw-lp-mismatch.mjs <export.tsv>\`

---

## 結論（CTR低下の候補）

1. **CRITICAL: Final URLの取り違え**が ${hardU.length} 件（広告グループ単位・ユニーク）
   - 典型: **「灯油」AG → \`pet-ke\`（ペット毛）LP** — 検索意図とLPが完全不一致
   - 典型: **「嘔吐」AG → \`shutchou-senmon\` / \`kuruma-nioi-keshi\`** — 嘔吐検索者に別テーマLP
2. **HIGH: 表示パス Path 2 のテーマ不一致**が ${path2U.length} 件
   - 特に Path 2「**嘔吐ニオイ清掃**」が嘔吐以外のLP（タバコ・汗・シート等）に大量流用
   - 広告プレビュー上の関連性が崩れ、**CTR低下の直接要因**になりやすい
3. **MEDIUM: 説明文のコピペ汚染**（他テーマ「ペット毛」文言）が ${descU.length} 件
4. **MEDIUM: LOCATIONピンとキャンペーン地域の不一致**が ${locU.length} 件

> 注: 本CSVは**キーワード行ではなくRSA広告行**です。1KW1LP運用でも、Ads側は「1テーマ1AG・複数KW→同一テーマLP」構成（\`docs/google-ads/campaign-structure.md\`）のため、**Ad Group名 ≒ キーワードテーマ**として検証しています。

---

## 1. CRITICAL — Ad Group テーマ ≠ Final URL

| # | キャンペーン | 広告グループ | 期待テーマ | 実際のLP | 修正先URL例 |
|---|-------------|-------------|-----------|---------|------------|
${hardU
  .map(
    (h, i) =>
      `| ${i + 1} | ${h.campaign} | ${h.ad_group} | ${h.expected_theme} (\`${h.expected_slugs}\`) | ${h.actual_theme} (\`${h.actual_slug}\`) | ${h.suggested_url} |`,
  )
  .join('\n')}

### パターン集計

| パターン | 件数 |
|---------|------|
${Object.entries(criticalByType)
  .sort((a, b) => b[1] - a[1])
  .map(([k, n]) => `| ${k} | ${n} |`)
  .join('\n')}

**最優先修正:** 「車内 灯油 こぼし」→ Final URL を \`/regions/{region}/touyu-kobosi/\` に統一（現状 \`pet-ke\` になっている地域が複数）。

---

## 2. HIGH — Path 2（表示URL）テーマ不一致

広告の表示パスがLPテーマと食い違うと、検索結果上で「意図と違うサービス」に見えCTRが落ちます。

### 頻出パターン

| パターン | 件数 |
|---------|------|
${Object.entries(path2Counter)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .map(([k, n]) => `| ${k} | ${n} |`)
  .join('\n')}

**推奨:** Path 2 を LP / AG テーマに合わせる（例: タバコAGなら \`タバコ消臭\`、灯油なら \`灯油こぼし\`、シートなら \`シート洗浄\`）。汎用の「嘔吐ニオイ清掃」の横断流用をやめる。

詳細: \`kw-lp-mismatch-path2.csv\`（${path2U.length} 行）  
うち Path2 に「嘔吐」を含む不一致広告行: **${path2VomitWrongRows}**

---

## 3. MEDIUM — 説明文のテーマ汚染

説明文に「ペット毛」が残ったまま、別テーマAG/LPに紐づいている例: **${descU.length}** AG

代表例:

${descU
  .slice(0, 15)
  .map(
    (d) =>
      `- [${d.campaign}] AG「${d.ad_group}」→ \`${d.actual_slug}\` … ${d.snippet.slice(0, 60)}…`,
  )
  .join('\n')}

---

## 4. MEDIUM — LOCATION ピン不一致

| キャンペーン | 広告グループ | ピン | URL |
|-------------|-------------|------|-----|
${locU
  .slice(0, 30)
  .map(
    (x) =>
      `| ${x.campaign} | ${x.ad_group} | ${x.location_pin} | ${x.final_url} |`,
  )
  .join('\n')}

---

## 修正チェックリスト（Google Ads Editor）

1. [ ] \`kw-lp-mismatch-hard.csv\` の \`suggested_url\` で Final URL を一括修正
2. [ ] 灯油AGは全地域で \`touyu-kobosi\` になっているか再確認
3. [ ] 嘔吐AG（\`AG_緊急_嘔吐\` / \`車 嘔吐 クリーニング\`）は \`kyuto-cleaning\` または \`vomit-cleaning\` のみ
4. [ ] Path 2 をテーマ別に書き換え（嘔吐パスの横断流用を停止）
5. [ ] 説明文の「ペット毛」「中古車タバコ」等のコピペ残骸をAGテーマに合わせて差し替え
6. [ ] LOCATION(City) ピンがキャンペーン都道府県と一致しているか確認

---

## 期待される正しい対応（抜粋）

| テーマ | 正しい slug |
|--------|------------|
| 嘔吐 | \`kyuto-cleaning\` / \`vomit-cleaning\` |
| 灯油 | \`touyu-kobosi\` |
| ペット毛 | \`pet-ke\` |
| タバコヤニ | \`tabako-yani\` / \`tobacco-odor\` |
| 中古車タバコ | \`chuko-tabako\` |
| 匂い消し | \`kuruma-nioi-keshi\` / \`odor-removal\` |

サイト定義: \`src/data/adKeywordPages.ts\` / \`src/data/lpAdPages.ts\`  
Ads設計: \`docs/google-ads/campaign-structure.md\`
`;

fs.writeFileSync(path.join(outDir, 'kw-lp-mismatch-report.md'), md, 'utf8');

console.log(
  JSON.stringify(
    {
      rows: rows.length,
      hard_unique: hardU.length,
      path2_unique: path2U.length,
      path2_vomit_wrong_rows: path2VomitWrongRows,
      loc_unique: locU.length,
      desc_unique: descU.length,
      outDir,
      criticalByType,
    },
    null,
    2,
  ),
);

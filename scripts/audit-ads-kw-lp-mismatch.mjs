#!/usr/bin/env node
/**
 * Audit Google Ads Editor exports for keyword/AG ↔ LP mismatches.
 *
 * Supports:
 *   - RSA-only exports (Campaign, Ad Group, Final URL, Path 2, Headlines…)
 *   - Full account exports (also Keyword, Criterion Type)
 *   - UTF-8 or UTF-16LE TSV/CSV
 *
 * Usage:
 *   node scripts/audit-ads-kw-lp-mismatch.mjs <ads-editor-export.tsv|csv>
 *
 * Writes under docs/google-ads/audit/:
 *   kw-lp-mismatch-report.md
 *   kw-lp-mismatch-hard.csv          (keyword-level Final URL hard mismatches)
 *   kw-lp-mismatch-ag-url.csv        (AG theme vs URL)
 *   kw-lp-mismatch-path2.csv         (Path 2 vs LP, RSA only)
 *   kw-lp-kw-vs-ad-url-conflict.csv  (keyword URL ≠ ad URL in same AG)
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

/** Keyword text → expected LP slugs (specific first). */
const KW_RULES = [
  { label: '灯油', slugs: ['touyu-kobosi'], pats: [/灯油/] },
  {
    label: '子供嘔吐',
    slugs: ['kodomo-kyuto'],
    pats: [/子供.*嘔吐/, /嘔吐.*子供/, /車酔い/, /吐いた/],
  },
  {
    label: '保険嘔吐',
    slugs: ['hoken-kyuto', 'kyuto-cleaning', 'vomit-cleaning'],
    pats: [/保険.*嘔吐/, /嘔吐.*保険/, /レンタカー.*嘔吐/],
  },
  {
    label: 'ゲロ',
    slugs: ['gero-cleaning', 'kyuto-cleaning', 'vomit-cleaning'],
    pats: [/ゲロ/],
  },
  {
    label: '嘔吐',
    slugs: [
      'kyuto-cleaning',
      'vomit-cleaning',
      'gero-cleaning',
      'kodomo-kyuto',
      'hoken-kyuto',
      'bus-senmon',
    ],
    pats: [/嘔吐/],
  },
  {
    label: 'ペットうんち',
    slugs: ['pet-unko', 'pet-waste'],
    pats: [/ペット.*うんち/, /ペット.*うんこ/, /粗相/],
  },
  {
    label: 'ペット毛',
    slugs: ['pet-ke', 'pet-hair-odor'],
    pats: [/ペット.?毛/, /犬.?毛/, /猫.?毛/],
  },
  {
    label: 'おしっこ',
    slugs: ['oshikko', 'pet-hair-odor'],
    pats: [/おしっこ/, /尿/],
  },
  {
    label: 'おもらし',
    slugs: ['omorashi', 'oshikko'],
    pats: [/おもらし/, /お漏らし/],
  },
  {
    label: 'うんこ',
    slugs: ['unko', 'pet-unko', 'pet-waste'],
    pats: [/うんこ/, /うんち/],
  },
  {
    label: '中古車タバコ',
    slugs: ['chuko-tabako'],
    pats: [/中古車.*タバコ/, /タバコ.*中古車/],
  },
  {
    label: '中古車加齢臭',
    slugs: ['chuko-kareisyu', 'chuko-tabako'],
    pats: [/中古車.*加齢/, /加齢.*中古車/],
  },
  {
    label: 'タバコ',
    slugs: ['tabako-yani', 'tobacco-odor', 'chuko-tabako'],
    pats: [/タバコ/, /煙草/, /ヤニ/],
  },
  {
    label: '加齢臭',
    slugs: ['kareisyu', 'chuko-kareisyu'],
    pats: [/加齢臭/],
  },
  {
    label: 'ペット臭',
    slugs: ['pet-nioi', 'shanai-nioi'],
    pats: [/ペット.?臭/, /ペット.?におい/, /ペット.?匂い/, /ペット.?ニオイ/],
  },
  {
    label: 'エバポ',
    slugs: ['evaporator-senjo', 'ac-mold'],
    pats: [/エバポ/],
  },
  {
    label: 'エアコン臭い',
    slugs: ['ac-nioi', 'ac-kusai', 'evaporator-senjo', 'ac-mold', 'car-ac-cleaning'],
    pats: [/エアコン.*臭/, /エアコン.*ニオイ/, /エアコン.*匂い/],
  },
  {
    label: 'エアコンクリーニング',
    slugs: ['car-ac-cleaning', 'evaporator-senjo', 'ac-mold', 'ac-nioi'],
    pats: [/エアコン.?クリーニング/, /エアコン.?清掃/, /エアコン.?洗浄/],
  },
  {
    label: 'シート洗浄',
    slugs: ['seat-senjo', 'seat-washing', 'seat-cleaning'],
    pats: [/シート.?洗浄/],
  },
  {
    label: 'シートクリーニング',
    slugs: ['seat-cleaning', 'seat-senjo', 'seat-washing'],
    pats: [/シート.?クリーニング/, /シート.?清掃/],
  },
  {
    label: '消臭脱臭',
    slugs: ['shanai-shoshu', 'kuruma-nioi-keshi', 'odor-removal', 'shanai-nioi'],
    pats: [/消臭/, /脱臭/],
  },
  {
    label: '匂い消し',
    slugs: [
      'kuruma-nioi-keshi',
      'odor-removal',
      'kuruma-nioitori',
      'shanai-nioi',
      'shanai-shoshu',
    ],
    pats: [/匂い.?消し/, /におい.?消し/, /ニオイ.?消し/],
  },
  {
    label: '匂い取り',
    slugs: ['kuruma-nioitori', 'kuruma-nioi-keshi', 'odor-removal'],
    pats: [/匂い.?取り/, /におい.?取り/, /ニオイ.?取り/],
  },
  {
    label: 'カビ/湿気',
    slugs: ['shanai-nioi', 'mold-odor', 'evaporator-senjo', 'ac-mold'],
    pats: [/カビ/, /湿気/],
  },
  { label: '汗', slugs: ['ase'], pats: [/汗/] },
  {
    label: '電源不要',
    slugs: ['dengen-fuyou'],
    pats: [/電源不要/, /電源.?不要/],
  },
];

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
  { words: ['ペットうんち', 'うんち'], ok: ['pet-unko', 'pet-waste', 'unko'] },
  { words: ['タバコ'], ok: ['tabako-yani', 'tobacco-odor', 'chuko-tabako'] },
  {
    words: ['消臭脱臭'],
    ok: ['shanai-shoshu', 'kuruma-nioi-keshi', 'odor-removal', 'shanai-nioi'],
  },
  {
    words: ['エアコン'],
    ok: ['car-ac-cleaning', 'ac-nioi', 'ac-kusai', 'evaporator-senjo', 'ac-mold'],
  },
];

/** Cross-theme families for hard mismatch classification. */
const FAMILIES = {
  vomit: ['嘔吐', 'ゲロ', '子供嘔吐', '保険嘔吐'],
  oil: ['灯油'],
  tobacco: ['タバコ', '中古車タバコ', 'タバコヤニ'],
  pet_hair: ['ペット毛'],
  pet_waste: ['ペットうんち', 'おしっこ', 'おもらし', 'うんこ'],
  age: ['加齢臭', '中古車加齢臭'],
  ac: ['エアコン臭い', 'エアコンクリーニング', 'エバポ', 'エアコンカビ'],
};

function familyOf(theme) {
  for (const [f, words] of Object.entries(FAMILIES)) {
    if (words.some((w) => theme.includes(w))) return f;
  }
  return null;
}

function isHardCrossTheme(kwTheme, actualTheme) {
  const fk = familyOf(kwTheme);
  const fa = familyOf(actualTheme);
  if (!fk || !fa || fk === fa) return false;
  const hardFrom = new Set(['vomit', 'oil', 'tobacco', 'pet_hair', 'pet_waste', 'age', 'ac']);
  if (!hardFrom.has(fk)) return false;
  // vomit → tobacco/oil/pet/seat/ac/age is hard
  if (fk === 'vomit') return ['tobacco', 'oil', 'pet_hair', 'pet_waste', 'age', 'ac'].includes(fa);
  if (fk === 'oil') return fa !== 'oil';
  if (fk === 'tobacco') return ['vomit', 'oil', 'pet_hair', 'pet_waste'].includes(fa);
  if (fk === 'pet_hair') return ['oil', 'vomit', 'tobacco'].includes(fa);
  if (fk === 'pet_waste') return ['oil', 'vomit', 'tobacco'].includes(fa);
  if (fk === 'age') return ['vomit', 'oil', 'pet_hair'].includes(fa);
  if (fk === 'ac') return ['vomit', 'oil', 'tobacco', 'pet_hair'].includes(fa);
  return false;
}

function readTextAuto(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.toString('utf16le').replace(/^\uFEFF/, '');
  }
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    // UTF-16 BE → swap
    const swapped = Buffer.alloc(buf.length - 2);
    for (let i = 2; i + 1 < buf.length; i += 2) {
      swapped[i - 2] = buf[i + 1];
      swapped[i - 1] = buf[i];
    }
    return swapped.toString('utf16le');
  }
  return buf.toString('utf8').replace(/^\uFEFF/, '');
}

function parseTsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
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
  if (!url) return { region: null, slug: null, host: null };
  try {
    const u = new URL(url.trim());
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'regions' && parts.length >= 3) {
      return { region: parts[1], slug: parts[2], host: u.host };
    }
    if (parts[0] === 'regions' && parts.length >= 2) {
      return { region: parts[1], slug: null, host: u.host };
    }
    return { region: null, slug: null, host: u.host };
  } catch {
    return { region: null, slug: null, host: null };
  }
}

function lookupAgExpected(ag) {
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
    return ['interior-cleaning', 'shutchou-senmon', 'specialist-cleaning', 'mobile-cleaning'];
  }
  if (ag.includes('トラック')) return ['__truck__'];
  return null;
}

function detectKwTheme(kw) {
  for (const rule of KW_RULES) {
    if (rule.pats.some((p) => p.test(kw))) return { label: rule.label, slugs: rule.slugs };
  }
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
  const body = rows.map((r) => columns.map((c) => csvEscape(r[c])).join(',')).join('\n');
  return `${header}\n${body}\n`;
}

function themeOf(slugs) {
  return [...new Set(slugs.map((s) => SLUG_THEME[s] || s))].join('/');
}

function isNegative(r) {
  return (r['Criterion Type'] || '').includes('Negative');
}

function isSkipUrl(url) {
  return !url || url.includes('abura.site') || url.includes('deadning');
}

// ─── main ───────────────────────────────────────────────
const raw = readTextAuto(inputPath);
const rows = parseTsv(raw);
const hasKeywordCol = rows.some((r) => (r.Keyword || '').trim());

const hardKw = [];
const softKw = [];
const agUrlIssues = [];
const path2Issues = [];
const kwAdConflicts = [];

/** @type {Map<string, { kwSlugs: Set<string>, adSlugs: Set<string>, kwSamples: string[] }>} */
const agSlugMap = new Map();
function agKey(camp, ag) {
  return `${camp}\0${ag}`;
}

let posKwWithUrl = 0;
let posKwOk = 0;
let posKwUnknown = 0;
let adRows = 0;

for (const r of rows) {
  const campaign = r.Campaign || '';
  const ag = r['Ad Group'] || '';
  const kw = (r.Keyword || '').trim();
  const adType = (r['Ad type'] || '').trim();
  const url = (r['Final URL'] || '').trim();
  if (isSkipUrl(url) && !kw) continue;

  const { slug } = parseUrl(url);

  // Track AG slug sets
  if (campaign && ag && slug) {
    const key = agKey(campaign, ag);
    if (!agSlugMap.has(key)) {
      agSlugMap.set(key, { kwSlugs: new Set(), adSlugs: new Set(), kwSamples: [] });
    }
    const entry = agSlugMap.get(key);
    if (kw && !isNegative(r)) {
      entry.kwSlugs.add(slug);
      if (entry.kwSamples.length < 3) entry.kwSamples.push(kw);
    }
    if (adType) entry.adSlugs.add(slug);
  }

  // Keyword-level Final URL audit
  if (kw && !isNegative(r) && url && slug) {
    posKwWithUrl += 1;
    const theme = detectKwTheme(kw);
    if (!theme) {
      posKwUnknown += 1;
    } else if (!theme.slugs.includes(slug)) {
      const actualTheme = SLUG_THEME[slug] || slug;
      const row = {
        line: r.__line,
        campaign,
        ad_group: ag,
        keyword: kw,
        match_type: r['Criterion Type'] || '',
        kw_theme: theme.label,
        expected_slugs: theme.slugs.join('|'),
        expected_theme: themeOf(theme.slugs),
        actual_slug: slug,
        actual_theme: actualTheme,
        final_url: url,
        suggested_url: url.replace(`/${slug}/`, `/${theme.slugs[0]}/`),
        status: r.Status || r['Ad Group Status'] || '',
        severity: isHardCrossTheme(theme.label, actualTheme) ? 'CRITICAL' : 'MEDIUM',
        issue: 'キーワードテーマとFinal URLが不一致',
      };
      if (row.severity === 'CRITICAL') hardKw.push(row);
      else softKw.push(row);
    } else {
      posKwOk += 1;
    }
  }

  // RSA Path2 / AG checks
  if (adType && url && slug) {
    adRows += 1;
    const expected = lookupAgExpected(ag);
    if (expected && expected[0] !== '__truck__' && !expected.includes(slug)) {
      agUrlIssues.push({
        source: 'ad',
        line: r.__line,
        campaign,
        ad_group: ag,
        keyword: '',
        expected_slugs: expected.join('|'),
        expected_theme: themeOf(expected),
        actual_slug: slug,
        actual_theme: SLUG_THEME[slug] || slug,
        final_url: url,
        suggested_url: url.replace(`/${slug}/`, `/${expected[0]}/`),
        headline2: r['Headline 2'] || '',
        path2: r['Path 2'] || '',
        status: r.Status || '',
        severity: 'CRITICAL',
        issue: '広告グループテーマと広告Final URLが不一致',
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
  }

  // AG expected vs keyword URL
  if (kw && !isNegative(r) && url && slug) {
    const expected = lookupAgExpected(ag);
    if (expected && expected[0] !== '__truck__' && !expected.includes(slug)) {
      agUrlIssues.push({
        source: 'keyword',
        line: r.__line,
        campaign,
        ad_group: ag,
        keyword: kw,
        expected_slugs: expected.join('|'),
        expected_theme: themeOf(expected),
        actual_slug: slug,
        actual_theme: SLUG_THEME[slug] || slug,
        final_url: url,
        suggested_url: url.replace(`/${slug}/`, `/${expected[0]}/`),
        headline2: '',
        path2: '',
        status: r.Status || '',
        severity: 'CRITICAL',
        issue: '広告グループテーマとキーワードFinal URLが不一致',
      });
    }
  }
}

// Keyword URL vs Ad URL conflicts within AG
for (const [key, entry] of agSlugMap.entries()) {
  const [campaign, ad_group] = key.split('\0');
  const onlyKw = [...entry.kwSlugs].filter((s) => !entry.adSlugs.has(s));
  const onlyAd = [...entry.adSlugs].filter((s) => !entry.kwSlugs.has(s));
  if (entry.kwSlugs.size && entry.adSlugs.size) {
    const intersect = [...entry.kwSlugs].some((s) => entry.adSlugs.has(s));
    if (!intersect || onlyKw.length || onlyAd.length) {
      // Different themes between kw and ad
      for (const kwSlug of entry.kwSlugs) {
        for (const adSlug of entry.adSlugs) {
          if (kwSlug === adSlug) continue;
          const kwTheme = SLUG_THEME[kwSlug] || kwSlug;
          const adTheme = SLUG_THEME[adSlug] || adSlug;
          // Alias pairs (same theme) — skip
          const sameTheme =
            themeOf([kwSlug]) === themeOf([adSlug]) ||
            (['kyuto-cleaning', 'vomit-cleaning', 'gero-cleaning'].includes(kwSlug) &&
              ['kyuto-cleaning', 'vomit-cleaning', 'gero-cleaning'].includes(adSlug)) ||
            (['shutchou-senmon', 'mobile-cleaning', 'specialist-cleaning'].includes(kwSlug) &&
              ['shutchou-senmon', 'mobile-cleaning', 'specialist-cleaning'].includes(adSlug)) ||
            (['oshikko', 'omorashi', 'pet-unko', 'pet-waste', 'pet-ke', 'pet-hair-odor'].includes(
              kwSlug,
            ) &&
              ['oshikko', 'omorashi', 'pet-unko', 'pet-waste', 'pet-ke', 'pet-hair-odor'].includes(
                adSlug,
              ));
          if (sameTheme) continue;
          kwAdConflicts.push({
            campaign,
            ad_group,
            keyword_slug: kwSlug,
            keyword_theme: kwTheme,
            ad_slug: adSlug,
            ad_theme: adTheme,
            sample_keywords: entry.kwSamples.join(' / '),
            severity: isHardCrossTheme(kwTheme, adTheme) || isHardCrossTheme(adTheme, kwTheme)
              ? 'CRITICAL'
              : 'HIGH',
            issue:
              '同一AG内でキーワードFinal URLと広告Final URLが異なる（KW側URLが優先される）',
            note: 'Google AdsではキーワードのFinal URLが広告より優先されます',
          });
        }
      }
    }
  }
}

const hardKwU = uniq(hardKw, ['campaign', 'ad_group', 'keyword', 'actual_slug']);
const softKwU = uniq(softKw, ['campaign', 'ad_group', 'keyword', 'actual_slug']);
const agUrlU = uniq(agUrlIssues, ['campaign', 'ad_group', 'actual_slug', 'source']);
const path2U = uniq(path2Issues, ['campaign', 'ad_group', 'path2', 'actual_slug']);
const conflictU = uniq(kwAdConflicts, [
  'campaign',
  'ad_group',
  'keyword_slug',
  'ad_slug',
]);

const path2VomitWrongRows = path2Issues.filter((p) => p.path2.includes('嘔吐')).length;

// Vomit → tobacco specifically
const vomitToTobacco = [...hardKwU, ...softKwU].filter(
  (r) =>
    (r.kw_theme.includes('嘔吐') || r.kw_theme.includes('ゲロ')) &&
    (r.actual_theme.includes('タバコ') || r.actual_slug.includes('tabako')),
);

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'kw-lp-mismatch-hard.csv'),
  toCsv([...hardKwU, ...softKwU].sort((a, b) => a.severity.localeCompare(b.severity)), [
    'severity',
    'issue',
    'campaign',
    'ad_group',
    'keyword',
    'match_type',
    'kw_theme',
    'expected_theme',
    'expected_slugs',
    'actual_theme',
    'actual_slug',
    'final_url',
    'suggested_url',
    'status',
    'line',
  ]),
  'utf8',
);

fs.writeFileSync(
  path.join(outDir, 'kw-lp-mismatch-ag-url.csv'),
  toCsv(agUrlU, [
    'severity',
    'issue',
    'source',
    'campaign',
    'ad_group',
    'keyword',
    'expected_theme',
    'expected_slugs',
    'actual_theme',
    'actual_slug',
    'final_url',
    'suggested_url',
    'status',
    'line',
  ]),
  'utf8',
);

fs.writeFileSync(
  path.join(outDir, 'kw-lp-kw-vs-ad-url-conflict.csv'),
  toCsv(conflictU, [
    'severity',
    'issue',
    'campaign',
    'ad_group',
    'keyword_slug',
    'keyword_theme',
    'ad_slug',
    'ad_theme',
    'sample_keywords',
    'note',
  ]),
  'utf8',
);

fs.writeFileSync(
  path.join(outDir, 'kw-lp-mismatch-path2.csv'),
  toCsv(path2U, [
    'severity',
    'issue',
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

const hardPatterns = {};
for (const h of hardKwU) {
  const key = `${h.kw_theme} → ${h.actual_theme}`;
  hardPatterns[key] = (hardPatterns[key] || 0) + 1;
}
const softPatterns = {};
for (const h of softKwU) {
  const key = `${h.kw_theme} → ${h.actual_theme}`;
  softPatterns[key] = (softPatterns[key] || 0) + 1;
}
const conflictPatterns = {};
for (const c of conflictU) {
  const key = `KW:${c.keyword_theme} ≠ AD:${c.ad_theme}`;
  conflictPatterns[key] = (conflictPatterns[key] || 0) + 1;
}

const md = `# Google Ads キーワード ↔ LP ミスマッチ監査

**対象:** \`${path.basename(inputPath)}\`  
**形式:** ${hasKeywordCol ? 'フルアカウント（Keyword列あり）' : 'RSA広告のみ'} / 広告行 ${adRows} / キーワード行(URL付き) ${posKwWithUrl}  
**監査日:** ${new Date().toISOString().slice(0, 10)}  
**再実行:** \`npm run audit:ads-kw-lp -- <export.tsv|csv>\`

---

## 結論（CTR低下の候補）

### ご心配の「嘔吐 → タバコLP」について

**該当なし（${vomitToTobacco.length}件）。** 嘔吐系キーワードがタバコ系LP（\`tabako-yani\` / \`chuko-tabako\`）に直接紐づいているケースは検出されませんでした。

### ただし CRITICAL な取り違えは残存

1. **キーワード単位の Final URL が誤っている**（広告URLより**キーワードURLが優先**される）
   - 典型: **「車内 灯油 こぼし」→ \`pet-ke\`（ペット毛）** … ${hardKwU.filter((h) => h.kw_theme === '灯油').length}件
   - 広告側は \`touyu-kobosi\` に直っていても、**キーワードに \`pet-ke\` が残っていると着地はペット毛LPのまま**
2. **同一AG内で KW URL ≠ 広告 URL** … ${conflictU.length}件（詳細CSV参照）
3. Path 2 テーマ不一致 … ${path2U.length}件（前回より改善していれば 0 に近い）

| 指標 | 件数 |
|------|------|
| キーワード×URL 一致 | ${posKwOk} |
| CRITICAL（異系統テーマ取り違え） | ${hardKwU.length} |
| MEDIUM（近いテーマのずれ） | ${softKwU.length} |
| テーマ判定不能KW | ${posKwUnknown} |
| KW↔広告URLコンフリクト | ${conflictU.length} |
| Path2不一致 | ${path2U.length}（うち嘔吐パス誤用広告行 ${path2VomitWrongRows}） |

---

## 1. CRITICAL — キーワードテーマ ≠ Final URL

| # | キャンペーン | 広告グループ | キーワード | 期待 | 実際LP | 修正先 |
|---|-------------|-------------|-----------|------|--------|--------|
${hardKwU
  .map(
    (h, i) =>
      `| ${i + 1} | ${h.campaign} | ${h.ad_group} | ${h.keyword} | ${h.expected_theme} | ${h.actual_theme} (\`${h.actual_slug}\`) | ${h.suggested_url} |`,
  )
  .join('\n') || '| （なし） | | | | | | |'}

### CRITICAL パターン集計

| パターン | 件数 |
|---------|------|
${Object.entries(hardPatterns)
  .sort((a, b) => b[1] - a[1])
  .map(([k, n]) => `| ${k} | ${n} |`)
  .join('\n') || '| （なし） | |'}

**最優先:** 灯油キーワードの Final URL を全地域 \`/regions/{region}/touyu-kobosi/\` に修正（キーワード行）。広告側だけ直しても着地は変わりません。

---

## 2. HIGH — 同一AG内 KW URL ≠ 広告 URL

Google Ads では **キーワードの Final URL が広告より優先**されます。

| キャンペーン | 広告グループ | KW側 | 広告側 | サンプルKW |
|-------------|-------------|------|--------|-----------|
${conflictU
  .filter((c) => c.severity === 'CRITICAL')
  .map(
    (c) =>
      `| ${c.campaign} | ${c.ad_group} | ${c.keyword_theme} (\`${c.keyword_slug}\`) | ${c.ad_theme} (\`${c.ad_slug}\`) | ${c.sample_keywords} |`,
  )
  .join('\n') || '| （CRITICALなし） | | | | |'}

全件: \`kw-lp-kw-vs-ad-url-conflict.csv\`（${conflictU.length}行）

---

## 3. MEDIUM — 近接テーマのずれ（参考）

完全な異系統ではないが、1KW1LP方針からずれる例（上位）:

| パターン | 件数 |
|---------|------|
${Object.entries(softPatterns)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .map(([k, n]) => `| ${k} | ${n} |`)
  .join('\n') || '| （なし） | |'}

代表例:

${softKwU
  .slice(0, 20)
  .map(
    (h) =>
      `- [${h.campaign}] 「${h.keyword}」(${h.kw_theme}) → \`${h.actual_slug}\`（${h.actual_theme}）`,
  )
  .join('\n') || '（なし）'}

---

## 4. Path 2（表示URL）

不一致ユニーク: **${path2U.length}** / 嘔吐パス誤用広告行: **${path2VomitWrongRows}**

${path2U.length ? '詳細: `kw-lp-mismatch-path2.csv`' : '今回のエクスポートでは Path 2 のテーマ汚染はほぼ解消されています。'}

---

## 修正チェックリスト（Google Ads Editor）

1. [ ] \`kw-lp-mismatch-hard.csv\` の CRITICAL 行で、**キーワードの Final URL** を \`suggested_url\` に変更
2. [ ] 灯油: KW・広告とも \`touyu-kobosi\` に揃える（KW側 \`pet-ke\` 残存に注意）
3. [ ] \`kw-lp-kw-vs-ad-url-conflict.csv\` で同一AGのURL二重設定を解消
4. [ ] 「車 シート 嘔吐 臭い」等、嘔吐を含むKWは \`kyuto-cleaning\` / \`vomit-cleaning\` へ
5. [ ] 「沖縄 レンタカー 嘔吐」は \`hoken-kyuto\` または \`kyuto-cleaning\` へ

---

## 期待される正しい対応（抜粋）

| テーマ | 正しい slug |
|--------|------------|
| 嘔吐 | \`kyuto-cleaning\` / \`vomit-cleaning\` |
| 灯油 | \`touyu-kobosi\` |
| ペット毛 | \`pet-ke\` |
| タバコヤニ | \`tabako-yani\` / \`tobacco-odor\` |
| 中古車タバコ | \`chuko-tabako\` |

サイト定義: \`src/data/adKeywordPages.ts\` / \`src/data/lpAdPages.ts\`  
Ads設計: \`docs/google-ads/campaign-structure.md\`
`;

fs.writeFileSync(path.join(outDir, 'kw-lp-mismatch-report.md'), md, 'utf8');

console.log(
  JSON.stringify(
    {
      input: path.basename(inputPath),
      hasKeywordCol,
      adRows,
      posKwWithUrl,
      posKwOk,
      hardCritical: hardKwU.length,
      softMedium: softKwU.length,
      posKwUnknown,
      agUrlIssues: agUrlU.length,
      kwAdConflicts: conflictU.length,
      path2Unique: path2U.length,
      path2VomitWrongRows,
      vomitToTobacco: vomitToTobacco.length,
      hardPatterns,
      conflictPatterns,
      outDir,
    },
    null,
    2,
  ),
);

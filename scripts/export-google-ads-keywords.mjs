/**
 * Google Ads ロングテールキーワード CSV 出力
 * 構成: 地域別キャンペーン × テーマ別広告グループ（AI学習・入札最適化向け）
 * Usage: node scripts/export-google-ads-keywords.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SITE = 'https://carinteriorcleaning.jp';

/**
 * 重点6地域（沖縄含む）
 * - LPは 1テーマ=1URL（Quality Score・SEO用）
 * - 広告は 1AG=複数KW→同一テーマLP（Smart Bidding学習用）
 */
const PRIORITY_REGIONS = [
  { id: 'chiba', label: '千葉', cities: ['千葉', '船橋', '柏'] },
  { id: 'aichi', label: '愛知', cities: ['愛知', '名古屋', '豊田'] },
  { id: 'osaka', label: '大阪', cities: ['大阪', '堺', '北摂'] },
  { id: 'hyogo', label: '兵庫', cities: ['兵庫', '神戸', '姫路'] },
  { id: 'fukuoka', label: '福岡', cities: ['福岡', '北九州', '博多'] },
  { id: 'okinawa', label: '沖縄', cities: ['沖縄', '那覇', '浦添'] },
];

/** @type {Array<{adGroup:string,slug:string,keywords:string[],maxCpc:number,tier:string,regions?:string[]}>} */
const THEME_GROUPS = [
  {
    adGroup: 'AG_緊急_嘔吐',
    slug: 'kyuto-cleaning',
    tier: 'S',
    maxCpc: 350,
    keywords: [
      '車 嘔吐 クリーニング 出張',
      '車 ゲロ 消臭 即日',
      '車 嘔吐 消臭 どこに 頼む',
      '車 嘔吐 しまった 出張 即日',
      '{city} 車内 嘔吐 出張',
      '{city} 嘔吐 車内清掃',
    ],
  },
  {
    adGroup: 'AG_緊急_子供嘔吐',
    slug: 'kodomo-kyuto',
    tier: 'S',
    maxCpc: 350,
    keywords: [
      '子供 車 吐いた シート',
      '車 子供 嘔吐 シート 洗浄',
      '車酔い 嘔吐 出張',
      '{city} 子供 嘔吐 車内',
    ],
  },
  {
    adGroup: 'AG_緊急_灯油',
    slug: 'touyu-kobosi',
    tier: 'S',
    maxCpc: 350,
    keywords: [
      '車 灯油 こぼし 出張',
      '車 灯油 臭い 取れない 業者',
      '車 灯油 こぼした 消臭 出張',
      '車内 灯油 こぼし 消臭',
      '{city} 灯油 こぼし 車',
    ],
    regions: ['chiba', 'aichi', 'osaka', 'hyogo', 'fukuoka'],
  },
  {
    adGroup: 'AG_緊急_ペット',
    slug: 'oshikko',
    tier: 'S',
    maxCpc: 320,
    keywords: [
      '車 おしっこ シート 洗浄 出張',
      '車 おもらし シート 洗浄',
      'ペット 粗相 車 消臭',
      '犬 車 お漏らし 消臭 業者',
      '{city} ペット 車内 清掃',
    ],
  },
  {
    adGroup: 'AG_消臭_口語',
    slug: 'kuruma-nioi-keshi',
    tier: 'S',
    maxCpc: 280,
    keywords: [
      '車 匂い 消し 業者',
      '車内 クサイ 消臭',
      '車 臭い 取れない プロ',
      '消臭スプレー 効かない 車',
      '車 芳香剤 臭い 取れない',
      '{city} 車内 消臭 出張',
    ],
  },
  {
    adGroup: 'AG_消臭_中古車',
    slug: 'chuko-tabako',
    tier: 'A',
    maxCpc: 300,
    keywords: [
      '中古車 タバコ臭 消せない',
      '中古車 加齢臭 車内',
      '車 タバコ臭 取れない 業者 出張',
      '{city} 中古車 臭い 車内',
    ],
  },
  {
    adGroup: 'AG_消臭_湿気カビ',
    slug: 'shanai-nioi',
    tier: 'A',
    maxCpc: 300,
    keywords: [
      '車内 カビ臭 取り方 業者',
      '車 湿気 臭い シート 洗浄',
      '車 原因不明 臭い 消臭 業者',
      '車 ペット臭 消臭 プロ 出張',
      '{city} 車内 カビ臭',
      '{city} 湿気 車内 臭い',
    ],
  },
  {
    adGroup: 'AG_エアコン_エバポレーター',
    slug: 'evaporator-senjo',
    tier: 'A',
    maxCpc: 400,
    keywords: [
      'エバポレーター洗浄 出張',
      '車 エアコン 酸っぱい 臭い 業者',
      'カーエアコン カビ臭 エバポレーター',
      '車 エアコン 臭い 取れない プロ',
      '車 エアコン 咳 目が痒い 洗浄',
      '車内クリーニング エバポレーター セット',
      '{city} エアコン 臭い 車',
      '{city} エバポレーター洗浄 出張',
    ],
  },
  {
    adGroup: 'AG_条件_出張',
    slug: 'shutchou-senmon',
    tier: 'S',
    maxCpc: 280,
    keywords: [
      '車内クリーニング 即日 出張 当日',
      '車内清掃 1席 出張',
      '出張 車内クリーニング おすすめ 業者',
      '車内清掃 出張 料金 いくら',
      '{city} 出張 車内清掃 即日',
      '{city} 車内クリーニング 出張',
    ],
  },
  {
    adGroup: 'AG_条件_電源不要',
    slug: 'dengen-fuyou',
    tier: 'S',
    maxCpc: 280,
    keywords: [
      '車内清掃 電源不要 出張',
      'マンション 車内クリーニング 出張',
      '{city} 車内清掃 電源不要',
    ],
    regions: ['chiba', 'aichi', 'osaka', 'hyogo', 'fukuoka'],
  },
  {
    adGroup: 'AG_保険_B2B',
    slug: 'hoken-kyuto',
    tier: 'B',
    maxCpc: 250,
    keywords: [
      '車内 嘔吐 保険 適用',
      'レンタカー 車内 嘔吐 清掃',
      '{city} 車内 嘔吐 保険',
    ],
  },
];

function finalUrl(regionId, slug) {
  if (slug === 'truck') return `${SITE}/regions/${regionId}-truck/`;
  return `${SITE}/regions/${regionId}/${slug}/`;
}

function expandKeywords(template, region) {
  const city = region.cities[0];
  return template.map((kw) => kw.replace(/\{city\}/g, city));
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function row(cols) {
  return cols.map(csvEscape).join(',');
}

const header = [
  'Campaign',
  'Ad group',
  'Keyword',
  'Match type',
  'Final URL',
  'Max CPC (JPY)',
  'Tier',
  'Region ID',
  'LP slug',
];

const rows = [row(header)];
let count = 0;

for (const region of PRIORITY_REGIONS) {
  const campaign = `${region.label}_車内清掃`;

  for (const theme of THEME_GROUPS) {
    if (theme.regions && !theme.regions.includes(region.id)) continue;

    const keywords = expandKeywords(theme.keywords, region);
    const url = finalUrl(region.id, theme.slug);

    for (const keyword of keywords) {
      const matchType = keyword.includes('灯油 こぼし 出張') ? 'Exact' : 'Phrase';
      rows.push(
        row([
          campaign,
          theme.adGroup,
          keyword,
          matchType,
          url,
          theme.maxCpc,
          theme.tier,
          region.id,
          theme.slug,
        ]),
      );
      count += 1;
    }
  }

  // 沖縄: 湿気・カビ特化の追加KW（エアコンAGへ同一LP）
  if (region.id === 'okinawa') {
    const okinawaExtra = [
      '那覇 車内クリーニング 出張',
      '沖縄本島 車内 清掃',
      '沖縄 レンタカー 嘔吐 清掃',
    ];
    const url = finalUrl('okinawa', 'shanai-nioi');
    for (const keyword of okinawaExtra) {
      rows.push(
        row([
          campaign,
          'AG_消臭_湿気カビ',
          keyword,
          'Phrase',
          url,
          300,
          'A',
          'okinawa',
          'shanai-nioi',
        ]),
      );
      count += 1;
    }
  }

  // バス（沖縄・千葉など対応エリア）
  if (['chiba', 'okinawa', 'fukuoka', 'osaka'].includes(region.id)) {
    rows.push(
      row([
        campaign,
        'AG_バス_トラック',
        region.id === 'okinawa' ? '沖縄 バス 車内 清掃' : 'バス 嘔吐 清掃 即日',
        'Phrase',
        finalUrl(region.id, 'bus-senmon'),
        200,
        'B',
        region.id,
        'bus-senmon',
      ]),
    );
    count += 1;
  }
}

const outDir = path.join(root, 'docs', 'google-ads');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'keywords-longtail.csv');
const bom = '\uFEFF';
fs.writeFileSync(outPath, bom + rows.join('\r\n'), 'utf8');

console.log(
  JSON.stringify(
    {
      outPath,
      keywordRows: count,
      campaigns: PRIORITY_REGIONS.map((r) => `${r.label}_車内清掃`),
      structure: '地域別キャンペーン × テーマ別AG × 複数KW → 1テーマLP',
    },
    null,
    2,
  ),
);

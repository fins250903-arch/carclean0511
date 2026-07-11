/**
 * Google Search Console — Search Analytics（実際の検索順位測定）
 *
 * 対象キーワードの平均掲載順位・表示回数・クリック・CTR を取得し、
 * 「上位（10位以内）に表示されていない」キーワードを抽出します。
 *
 * 必要な環境変数:
 *   GOOGLE_SERVICE_ACCOUNT_JSON  … サービスアカウントJSON（全文1行）
 *   SITE_URL (任意)              … 既定 https://carinteriorcleaning.jp/
 *   GSC_DAYS (任意)              … 直近何日分か。既定 28
 *   GSC_START_DATE / GSC_END_DATE (任意) … YYYY-MM-DD で明示指定
 *   GSC_ROW_LIMIT (任意)         … 取得行数上限。既定 5000
 *   GSC_TOP_POSITION (任意)      … 「上位」の閾値（掲載順位）。既定 10
 *   GSC_REGION (任意)            … ページ別集計を特定地域に絞る（例 gunma）
 *
 * 実行:  npm run gsc:rank
 */
import { getGoogleAuth, getServiceAccountCredentials, normalizeSiteUrl } from './shared.mjs';
import { google } from 'googleapis';

const READONLY_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

/** ユーザー提供のオーガニック重点キーワード（検索ボリューム） */
const TARGET_KEYWORDS = [
  '車 シート 洗浄',
  '車内 清掃',
  '車 エアコン 臭い',
  '車内 クリーニング',
  '車 ピカピカ 業者',
  '車 掃除',
  '車 車内 清掃',
  '車 クリーニング',
  'エバポレーター 洗浄',
  '車内 掃除',
  '車 の シート 洗浄',
  '車 シート クリーニング',
];

const TOP_POSITION = Number(process.env.GSC_TOP_POSITION || 10);
const ROW_LIMIT = Number(process.env.GSC_ROW_LIMIT || 5000);

function pad(str, len) {
  const s = String(str ?? '');
  // 全角を2幅としてざっくり調整
  let width = 0;
  for (const ch of s) width += ch.charCodeAt(0) > 0xff ? 2 : 1;
  return s + ' '.repeat(Math.max(0, len - width));
}

function fmt(n, digits = 1) {
  return typeof n === 'number' ? n.toFixed(digits) : '-';
}

/** 空白を除いた小文字 */
export function norm(s) {
  return String(s).replace(/\s+/g, '').toLowerCase();
}

/** キーワードのトークンが全て query に含まれるか（順不同・空白無視） */
export function matchesKeyword(query, keyword) {
  const q = norm(query);
  return keyword
    .split(/\s+/)
    .filter(Boolean)
    .every((tok) => q.includes(norm(tok)));
}

/**
 * 対象キーワードに一致する行を集計し、表示回数で加重平均した掲載順位を返す。
 * @returns {{matched:number, impressions:number, clicks:number, position:number|null, ctr:number}}
 */
export function summarizeKeyword(rows, keyword) {
  const matched = rows.filter((r) => matchesKeyword(r.keys[0], keyword));
  const impressions = matched.reduce((s, r) => s + (r.impressions || 0), 0);
  const clicks = matched.reduce((s, r) => s + (r.clicks || 0), 0);
  const position = impressions
    ? matched.reduce((s, r) => s + (r.position || 0) * (r.impressions || 0), 0) / impressions
    : null;
  const ctr = impressions ? (clicks / impressions) * 100 : 0;
  return { matched: matched.length, impressions, clicks, position, ctr };
}

function dateNDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function resolveSiteUrl(webmasters) {
  const desired = normalizeSiteUrl(process.env.SITE_URL || 'https://carinteriorcleaning.jp/');
  const list = await webmasters.sites.list();
  const entries = (list.data.siteEntry ?? []).map((e) => e.siteUrl);
  if (entries.includes(desired)) return desired;

  // URLプレフィックス→ドメインプロパティの順にドメイン一致を探す
  const host = new URL(desired).host;
  const urlPrefix = entries.find((s) => s.startsWith('http') && new URL(s).host === host);
  if (urlPrefix) return urlPrefix;
  const domainProp = entries.find((s) => s === `sc-domain:${host}`);
  if (domainProp) return domainProp;

  console.error(`\n[!] SITE_URL (${desired}) がアクセス可能プロパティに見つかりません。`);
  console.error('    アクセス可能: ' + (entries.length ? entries.join(', ') : '(なし)'));
  console.error('    → サービスアカウントを Search Console の「所有者」に追加してください。');
  process.exit(1);
}

async function query(webmasters, siteUrl, body) {
  const res = await webmasters.searchanalytics.query({ siteUrl, requestBody: body });
  return res.data.rows ?? [];
}

async function main() {
  const credentials = getServiceAccountCredentials();
  const authClient = await getGoogleAuth([READONLY_SCOPE]);
  google.options({ auth: authClient });
  const webmasters = google.webmasters('v3');

  console.log(`Service account: ${credentials.client_email}`);
  const siteUrl = await resolveSiteUrl(webmasters);

  const endDate = process.env.GSC_END_DATE || dateNDaysAgo(3); // GSCは直近2-3日が未確定
  const startDate =
    process.env.GSC_START_DATE ||
    (process.env.GSC_DAYS
      ? dateNDaysAgo(Number(process.env.GSC_DAYS) + 3)
      : dateNDaysAgo(31));

  console.log(`Property       : ${siteUrl}`);
  console.log(`Date range     : ${startDate} 〜 ${endDate}`);
  console.log(`「上位」閾値    : 掲載順位 ${TOP_POSITION} 位以内\n`);

  // 1) クエリ別
  const queryRows = await query(webmasters, siteUrl, {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: ROW_LIMIT,
  });

  if (queryRows.length === 0) {
    console.log('データがありません（新規プロパティ/計測期間外の可能性）。期間を延ばして再試行してください。');
    return;
  }

  // 2) 重点キーワードの順位
  console.log('==== 重点キーワードの実掲載順位 ====');
  console.log(
    pad('キーワード', 22) + pad('順位', 8) + pad('表示', 9) + pad('クリック', 10) + pad('CTR', 8) + '判定',
  );
  const notTop = [];
  for (const kw of TARGET_KEYWORDS) {
    const { matched, impressions, clicks, position, ctr } = summarizeKeyword(queryRows, kw);
    if (matched === 0) {
      console.log(pad(kw, 22) + pad('-', 8) + pad('0', 9) + pad('0', 10) + pad('-', 8) + '❌ データ無(未表示)');
      notTop.push({ kw, position: null, reason: '検索表示データなし（未インデックス/流入なし）' });
      continue;
    }
    const isTop = position > 0 && position <= TOP_POSITION;
    console.log(
      pad(kw, 22) +
        pad(fmt(position), 8) +
        pad(impressions, 9) +
        pad(clicks, 10) +
        pad(fmt(ctr) + '%', 8) +
        (isTop ? '✅ 圏内' : '⚠️ 圏外'),
    );
    if (!isTop) notTop.push({ kw, position, impressions, clicks, ctr });
  }

  // 3) 上位表示できていないキーワード
  console.log('\n==== 上位に表示されていない重点キーワード ====');
  if (notTop.length === 0) {
    console.log('（全て圏内）');
  } else {
    notTop
      .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
      .forEach((x) => {
        const pos = x.position ? `${fmt(x.position)}位` : '圏外/データなし';
        console.log(`  ・${x.kw} — 現在 ${pos}（表示${x.impressions || 0}回）`);
      });
  }

  // 4) 表示回数トップ30クエリ（全体像）
  console.log('\n==== 表示回数トップ30クエリ（全体） ====');
  console.log(pad('クエリ', 26) + pad('順位', 8) + pad('表示', 9) + pad('クリック', 10) + 'CTR');
  [...queryRows]
    .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
    .slice(0, 30)
    .forEach((r) => {
      const ctr = r.impressions ? (r.clicks / r.impressions) * 100 : 0;
      console.log(
        pad(r.keys[0], 26) +
          pad(fmt(r.position), 8) +
          pad(r.impressions, 9) +
          pad(r.clicks, 10) +
          fmt(ctr) + '%',
      );
    });

  // 5) ページ別（任意で地域絞り込み）
  const region = process.env.GSC_REGION;
  const pageBody = {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: ROW_LIMIT,
  };
  if (region) {
    pageBody.dimensionFilterGroups = [
      { filters: [{ dimension: 'page', operator: 'contains', expression: `/regions/${region}/` }] },
    ];
  }
  const pageRows = await query(webmasters, siteUrl, pageBody);
  console.log(`\n==== ページ別 表示回数トップ20${region ? `（${region}のみ）` : ''} ====`);
  console.log(pad('URL', 52) + pad('順位', 8) + pad('表示', 9) + 'クリック');
  [...pageRows]
    .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
    .slice(0, 20)
    .forEach((r) => {
      const path = r.keys[0].replace(/^https?:\/\/[^/]+/, '');
      console.log(pad(path, 52) + pad(fmt(r.position), 8) + pad(r.impressions, 9) + (r.clicks || 0));
    });

  console.log('\n完了。');
}

// 直接実行時のみAPIを叩く（import時は純粋関数のみ利用可能）
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('\n[ERROR] Search Analytics 取得に失敗しました:', err?.message || err);
    if (String(err?.message || '').includes('403')) {
      console.error('→ サービスアカウントを Search Console プロパティの「所有者」に追加してください。');
    }
    process.exit(1);
  });
}

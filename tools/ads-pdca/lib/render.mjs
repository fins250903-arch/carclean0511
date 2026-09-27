const PHASE_LABEL = { Plan: 'Plan', Check: 'Check', Do: 'Do', Act: 'Act' };

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function yen(value) {
  if (value == null) return '—';
  return `${Math.round(value).toLocaleString('ja-JP')}円`;
}

function count(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ja-JP');
}

function percent(value) {
  if (value == null) return '—';
  return `${(value * 100).toFixed(1)}%`;
}

function card(label, value, note) {
  return `<section class="card"><p class="label">${escapeHtml(label)}</p><p class="value">${escapeHtml(value)}</p><p class="note">${escapeHtml(note)}</p></section>`;
}

export function renderReport(report) {
  const generated = new Date().toISOString();
  const k = report.kpis;
  const groups = ['Plan', 'Check', 'Do', 'Act'].map((phase) => {
    const items = report.actions.filter((item) => item.phase === phase);
    const rows = items.length
      ? items
          .map(
            (item) =>
              `<tr><td>${escapeHtml(item.entity)}</td><td>${escapeHtml(item.detail)}</td></tr>`,
          )
          .join('')
      : '<tr><td colspan="2">この区分の指摘はありません。</td></tr>';
    return `<h2>${PHASE_LABEL[phase]}</h2><table><thead><tr><th>対象</th><th>判定</th></tr></thead><tbody>${rows}</tbody></table>`;
  });

  const warnings = report.warnings.length
    ? `<ul>${report.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')}</ul>`
    : '<p>不足している列はありません。</p>';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex, nofollow" />
  <title>社内限定 PDCA 資料</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: "Hiragino Sans", "Noto Sans JP", sans-serif; color: #1c1917; background: #f6f3ee; }
    main { max-width: 960px; margin: 0 auto; padding: 32px 20px 64px; }
    .banner { background: #7f1d1d; color: #fff; padding: 12px 16px; font-weight: 700; }
    h1 { font-size: 1.6rem; margin: 24px 0 8px; }
    .asof { font-size: 1.25rem; font-weight: 700; }
    h2 { font-size: 1.1rem; margin: 28px 0 8px; }
    .meta, .note, .label { color: #57534e; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .card { background: #fff; border: 1px solid #e7e5e4; padding: 12px 14px; }
    .value { font-size: 1.4rem; margin: 4px 0; font-variant-numeric: tabular-nums; }
    table { width: 100%; border-collapse: collapse; background: #fff; }
    th, td { border-bottom: 1px solid #e7e5e4; text-align: left; padding: 8px 10px; vertical-align: top; }
    th { background: #fafaf9; font-weight: 600; }
  </style>
</head>
<body>
  <p class="banner">社外秘。LP・広告・外部共有には使わない内部資料です。</p>
  <main>
    <h1>広告 PDCA 判定</h1>
    ${asOfHtml(report)}
    <p class="meta">作成 ${escapeHtml(generated)} / ソース ${escapeHtml(report.sourceLabel)} / 広告行 ${report.counts.ads} / 広告経由の台帳 ${report.counts.leads}</p>
    ${historyHtml(report)}
    <div class="cards">
      ${card('クリック率', percent(k.ctr), 'クリック ÷ 表示回数。目標 5% 以上')}
      ${card('問い合わせ率', percent(k.cvr), '広告コンバージョン ÷ クリック。緊急系の目安 5–10%')}
      ${card('問い合わせ獲得単価', yen(k.cpa), '費用 ÷ 電話・LINE などの広告コンバージョン')}
      ${card('成約率', percent(k.closeRate), '広告経由の成約 ÷ 問い合わせ')}
      ${card('成約獲得単価', yen(k.closeCpa), '広告費 ÷ 成約件数')}
      ${card('表示シェア', percent(k.impressionShare), '検索での掲載率。列があるときだけ算出')}
    </div>
    <h2>内訳</h2>
    <table>
      <tbody>
        <tr><th>表示回数</th><td>${escapeHtml(count(k.impressions))}</td></tr>
        <tr><th>クリック数</th><td>${escapeHtml(count(k.clicks))}</td></tr>
        <tr><th>費用</th><td>${escapeHtml(yen(k.cost))}</td></tr>
        <tr><th>広告コンバージョン</th><td>${escapeHtml(count(k.conversions))}</td></tr>
        <tr><th>問い合わせ件数</th><td>${escapeHtml(count(k.inquiries))}</td></tr>
        <tr><th>成約件数</th><td>${escapeHtml(count(k.closed))}</td></tr>
        <tr><th>成約金額</th><td>${escapeHtml(yen(k.adRevenue))}</td></tr>
        <tr><th>汎用キーワードの表示回数構成比</th><td>${escapeHtml(percent(k.genericImpressionShare))}</td></tr>
      </tbody>
    </table>
    <h2>データの過不足</h2>
    ${warnings}
    ${groups.join('\n')}
  </main>
</body>
</html>
`;
}

export function renderActionsCsv(report) {
  const lines = ['phase,severity,code,entity,detail'];
  for (const item of report.actions) {
    lines.push([item.phase, item.severity, item.code, item.entity, item.detail].map(csvCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function formatJapaneseDate(isoDate) {
  const match = String(isoDate ?? '').match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return String(isoDate ?? '');
  return `${match[1]}年${Number(match[2])}月${Number(match[3])}日`;
}

function asOfHtml(report) {
  if (!report.asOf?.date || report.asOf.ctr == null) return '';
  return `<p class="asof">${escapeHtml(formatJapaneseDate(report.asOf.date))}時点のクリック率は ${escapeHtml(percent(report.asOf.ctr))} です。</p>`;
}

function historyHtml(report) {
  const history = report.history ?? [];
  if (history.length === 0) return '';
  const rows = [...history].reverse().slice(0, 31).map((day) => (
    `<tr><td>${escapeHtml(formatJapaneseDate(day.date))}</td><td>${escapeHtml(percent(day.ctr))}</td><td>${escapeHtml(count(day.clicks))}</td><td>${escapeHtml(count(day.impressions))}</td><td>${escapeHtml(yen(day.cost))}</td><td>${escapeHtml(count(day.conversions))}</td><td>${escapeHtml(yen(day.cpa))}</td></tr>`
  )).join('');
  return `<h2>日次のクリック率</h2><table><thead><tr><th>日付</th><th>クリック率</th><th>クリック</th><th>表示</th><th>費用</th><th>コンバージョン</th><th>獲得単価</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function csvCell(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

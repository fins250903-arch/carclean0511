import assert from 'node:assert/strict';
import test from 'node:test';
import { objectsFromMatrix, parseCsv } from './lib/csv.mjs';
import { mapFields, parseNumber, parseRate } from './lib/fields.mjs';
import { assertInternalOutput } from './lib/paths.mjs';
import { buildReport } from './lib/pdca.mjs';
import { renderReport } from './lib/render.mjs';
import { selectInputs } from './lib/select.mjs';

const ads = [
  { キャンペーン: '大阪', キーワード: '車内清掃', 表示回数: 1000, クリック数: 10, 費用: 4000, コンバージョン: 0 },
  { キャンペーン: '大阪', キーワード: '嘔吐 出張', 表示回数: 400, クリック数: 40, 費用: 8000, コンバージョン: 4, 表示シェア: '80%' },
  { キャンペーン: '大阪', キーワード: '千葉 嘔吐', 表示回数: 500, クリック数: 20, 費用: 3000, コンバージョン: 1, 表示シェア: '50%' },
];

const deals = [
  { 日付: '2026-09-01', 媒体: 'Google広告', キャンペーン: '大阪', ステータス: '成約', 金額: '30,000円', 氏名: '山田太郎', 電話: '090-0000-0000' },
  { 日付: '2026-09-02', 媒体: 'Google広告', キャンペーン: '大阪', ステータス: '見積もり', 金額: '' },
  { 日付: '2026-09-03', 媒体: 'リスティング', キャンペーン: '大阪', ステータス: '失注', 金額: '' },
  { 日付: '2026-09-04', 媒体: '紹介', キャンペーン: '大阪', ステータス: '成約', 金額: '20000' },
];

test('parses yen, percents, and quoted csv', () => {
  assert.equal(parseNumber('¥1,200'), 1200);
  assert.ok(Math.abs(parseRate('5.2%') - 0.052) < 1e-9);
  assert.equal(parseRate(0.052), 0.052);
  assert.equal(parseRate('80%'), 0.8);
  const matrix = parseCsv('キーワード,費用\n"車,内",\"1,200\"\n');
  assert.equal(matrix[1][0], '車,内');
});

test('reads an order book whose header is below a totals row', () => {
  const records = objectsFromMatrix([
    ['', '', '', '0'],
    ['', '受注日', '顧客名', '連絡先', '受注金額'],
    ['問合', '6/5', '山田太郎', '090-0000-0000', ''],
    ['1', '6/8', '佐藤花子', '080-1111-2222', '28,000+10,000'],
  ]);
  const report = buildReport({ adsRecords: [], dealRecords: records, sourceLabel: '2609' });
  assert.equal(report.kpis.inquiries, 2);
  assert.equal(report.kpis.closed, 1);
  assert.equal(report.kpis.closeRate, 0.5);
  assert.equal(report.kpis.adRevenue, 38000);
  const html = renderReport(report);
  assert.equal(html.includes('山田太郎'), false);
  assert.equal(html.includes('090-0000-0000'), false);
  assert.match(report.warnings.join('\n'), /台帳全体/);
});

test('does not treat a missing conversion column as zero conversions', () => {
  const report = buildReport({
    adsRecords: [{ キャンペーン: '大阪', クリック数: 100, 費用: 8000, クリック率: '10%' }],
    dealRecords: [],
  });
  assert.equal(report.kpis.conversions, null);
  assert.equal(report.actions.some((item) => item.code === 'negative-keyword'), false);
  assert.equal(report.actions.some((item) => item.code === 'phase-1'), false);
  assert.ok(Math.abs(report.kpis.impressions - 1000) < 1);
});

test('drops personal columns', () => {
  const mapped = mapFields(deals[0]);
  assert.equal(mapped.status, '成約');
  assert.equal(mapped.revenue, 30000);
  assert.equal('氏名' in mapped, false);
  assert.equal('電話' in mapped, false);
});

test('builds PDCA metrics from ads and the deal sheet', () => {
  const report = buildReport({ adsRecords: ads, dealRecords: deals, sourceLabel: 'fixture' });
  assert.equal(report.kpis.impressions, 1900);
  assert.equal(report.kpis.clicks, 70);
  assert.equal(report.kpis.cost, 15000);
  assert.equal(report.kpis.conversions, 5);
  assert.ok(Math.abs(report.kpis.ctr - 70 / 1900) < 1e-9);
  assert.ok(Math.abs(report.kpis.cvr - 5 / 70) < 1e-9);
  assert.equal(report.kpis.cpa, 3000);
  assert.equal(report.kpis.inquiries, 3);
  assert.equal(report.kpis.closed, 1);
  assert.ok(Math.abs(report.kpis.closeRate - 1 / 3) < 1e-9);
  assert.equal(report.kpis.closeCpa, 15000);
  assert.equal(report.kpis.adRevenue, 30000);
  assert.ok(report.kpis.genericImpressionShare > 0.3);
  assert.ok(Math.abs(report.kpis.impressionShare - 570 / 900) < 1e-9);

  const codes = report.actions.map((item) => item.code);
  assert.ok(codes.includes('negative-keyword'));
  assert.ok(codes.includes('fix-relevance'));
  assert.ok(codes.includes('lower-bid'));
  assert.ok(codes.includes('add-keyword'));
  assert.ok(codes.includes('shift-budget'));
  assert.ok(codes.includes('phase-1'));
  assert.equal(codes.includes('phase-2'), false);

  const html = renderReport(report);
  assert.match(html, /社外秘/);
  assert.match(html, /noindex, nofollow/);
  assert.equal(html.includes('山田太郎'), false);
  assert.equal(html.includes('090-0000-0000'), false);
  assert.match(html, /3,000円/);
  assert.match(html, /15,000円/);
});

test('moves to target CPA after 10 conversions', () => {
  const report = buildReport({
    adsRecords: [{ キーワード: '嘔吐 出張', 表示回数: 100, クリック数: 20, 費用: 2000, コンバージョン: 12 }],
    dealRecords: [],
  });
  assert.equal(report.kpis.cpa, 167);
  const phase = report.actions.find((item) => item.code === 'phase-2');
  assert.ok(phase);
  assert.match(phase.detail, /200 円/);
});

test('keeps the report out of the public site', () => {
  assert.throws(() => assertInternalOutput('/workspace/public/pdca-report.html', '/workspace'));
  assert.throws(() => assertInternalOutput('/workspace/src/pages/secret.astro', '/workspace'));
  assert.equal(
    assertInternalOutput('/workspace/tools/ads-pdca/output/pdca-report.html', '/workspace').endsWith('pdca-report.html'),
    true,
  );
});

test('prefers the focused worksheet when several tabs exist', () => {
  const selected = selectInputs(
    [
      { sheetId: 1, title: '古い広告', records: [{ キーワード: 'a', 表示回数: 10, クリック数: 1, 費用: 100 }] },
      { sheetId: 42, title: '今月の広告', records: [{ キーワード: 'b', 表示回数: 20, クリック数: 2, 費用: 200 }] },
      { sheetId: 9, title: '台帳', records: [{ 日付: '2026-09-01', 媒体: 'Google広告', ステータス: '成約' }] },
    ],
    '42',
  );
  assert.equal(selected.adsRecords[0].キーワード, 'b');
  assert.equal(selected.dealRecords[0].ステータス, '成約');
  assert.match(selected.warnings[0], /今月の広告/);
});

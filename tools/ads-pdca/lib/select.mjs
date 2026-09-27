import { isAdsRow, isLeadRow, prepareRows } from './metrics.mjs';

function describe(table) {
  const rows = prepareRows(table.records ?? []);
  return {
    ...table,
    ads: rows.some(isAdsRow),
    deals: rows.some(isLeadRow),
  };
}

function pick(tables, focus) {
  if (tables.length === 0) return null;
  if (focus && tables.some((table) => table.sheetId === focus.sheetId)) return focus;
  return [...tables].sort((a, b) => (b.records?.length ?? 0) - (a.records?.length ?? 0))[0];
}

export function selectInputs(tables, focusGid) {
  const described = tables.map(describe);
  const focus = focusGid == null ? null : described.find((table) => String(table.sheetId) === String(focusGid)) ?? null;
  const adsTables = described.filter((table) => table.ads);
  const dealTables = described.filter((table) => table.deals);
  const dailyLog = adsTables.find((table) => table.title === '広告日次');
  const ads = dailyLog ?? pick(adsTables, focus);
  const deals = pick(dealTables, focus);
  const warnings = [];
  if (!dailyLog && adsTables.length > 1) {
    warnings.push(`広告実績のタブが複数あるため「${ads.title}」だけを使いました。`);
  }
  if (dealTables.length > 1) {
    warnings.push(`成約台帳のタブが複数あるため「${deals.title}」だけを使いました。`);
  }
  const titles = [ads?.title, deals?.title].filter((title, index, all) => title && all.indexOf(title) === index);
  return {
    adsRecords: ads?.records ?? [],
    dealRecords: deals?.records ?? [],
    warnings,
    sourceLabel: titles.join(' + ') || 'spreadsheet',
  };
}

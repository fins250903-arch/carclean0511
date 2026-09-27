import { isTotalLabel, mapFields } from './fields.mjs';

export function ratio(numerator, denominator) {
  if (numerator == null || denominator == null || denominator === 0) return null;
  return numerator / denominator;
}

export function isAdsRow(row) {
  return row.impressions != null || row.clicks != null || row.cost != null;
}

export function isAdSource(source) {
  if (!source) return false;
  return /google|広告|リスティング|ppc|adwords|gclid|検索広告/i.test(source);
}

const CLOSED_STATUS = /成約|受注|契約|施工済|施工済み|入金/;
const OPEN_STATUS = /未成約|不成約|失注|見送り|キャンセル|問合|問い合わせ|見積|商談|連絡|保留/;

export function isClosedLead(row) {
  if (row.closedFlag != null) return row.closedFlag;
  if (!row.status) return false;
  if (OPEN_STATUS.test(row.status)) return false;
  return CLOSED_STATUS.test(row.status);
}

export function isLeadRow(row) {
  if (isAdsRow(row)) return false;
  return Boolean(row.status || row.closedFlag != null || row.revenue != null || row.date || row.source);
}

function entityLabel(row) {
  return row.keyword || row.adGroup || row.campaign || row.region || '';
}

export function prepareRows(records) {
  return records
    .map((record) => mapFields(record))
    .filter((row) => !isTotalLabel(row.campaign) && !isTotalLabel(row.keyword) && !isTotalLabel(row.adGroup))
    .map((row) => {
      let impressions = row.impressions;
      if ((impressions == null || impressions === 0) && row.clicks != null && row.ctr != null && row.ctr > 0) {
        impressions = row.clicks / row.ctr;
      }
      const ctr = ratio(row.clicks, impressions) ?? row.ctr;
      const cvr = ratio(row.conversions, row.clicks) ?? row.cvr;
      const cpa = ratio(row.cost, row.conversions) ?? row.cpa;
      return { ...row, impressions, ctr, cvr, cpa, label: entityLabel(row) };
    });
}

export function sum(rows, field) {
  let total = 0;
  let seen = false;
  for (const row of rows) {
    if (row[field] == null) continue;
    total += row[field];
    seen = true;
  }
  return seen ? total : null;
}

export function weightedRate(rows, rateField, weightField) {
  let weighted = 0;
  let weight = 0;
  for (const row of rows) {
    if (row[rateField] == null || row[weightField] == null || row[weightField] <= 0) continue;
    weighted += row[rateField] * row[weightField];
    weight += row[weightField];
  }
  if (weight === 0) return null;
  return weighted / weight;
}

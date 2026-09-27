/**
 * Google Ads script. Paste into Google Ads → Tools → Bulk actions → Scripts.
 * It writes daily metrics into a private spreadsheet. It does not touch the public site.
 *
 * SPREADSHEET_ID below is filled before pasting. Schedule the script daily.
 */
var SPREADSHEET_ID = '__SPREADSHEET_ID__';
var TIME_ZONE = 'Asia/Tokyo';

var ACCOUNT_HEADERS = [
  '日付',
  '表示回数',
  'クリック数',
  '費用',
  'コンバージョン数',
  'クリック率',
  '平均クリック単価',
  'インプレッションシェア',
  'コンバージョン率',
  'コンバージョン単価',
];

var CAMPAIGN_HEADERS = [
  '日付',
  'キャンペーン',
  '表示回数',
  'クリック数',
  '費用',
  'コンバージョン数',
  'クリック率',
  '平均クリック単価',
];

function main() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var day = yesterdayKey();
  var range = day.replace(/-/g, '') + ',' + day.replace(/-/g, '');
  var accountStats = AdsApp.currentAccount().getStatsFor(range);
  appendAccountDay(spreadsheet, day, accountStats);
  appendCampaignDays(spreadsheet, day, range);
  writeSnapshot(spreadsheet, day, accountStats);
}

function yesterdayKey() {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  return Utilities.formatDate(date, TIME_ZONE, 'yyyy-MM-dd');
}

function appendAccountDay(spreadsheet, day, stats) {
  var sheet = sheetWithHeaders(spreadsheet, '広告日次', ACCOUNT_HEADERS);
  if (columnHas(sheet, 1, day)) return;
  sheet.appendRow([
    day,
    stats.getImpressions(),
    stats.getClicks(),
    roundMoney(stats.getCost()),
    stats.getConversions(),
    stats.getCtr(),
    roundMoney(stats.getAverageCpc()),
    searchShare(stats),
    stats.getConversions() > 0 ? stats.getConversions() / stats.getClicks() : '',
    stats.getConversions() > 0 ? roundMoney(stats.getCost() / stats.getConversions()) : '',
  ]);
  sheet.getRange(sheet.getLastRow(), 1).setNumberFormat('@');
}

function appendCampaignDays(spreadsheet, day, range) {
  var sheet = sheetWithHeaders(spreadsheet, '広告キャンペーン日次', CAMPAIGN_HEADERS);
  var seen = existingCampaignKeys(sheet, day);
  var iterator = AdsApp.campaigns().withCondition('campaign.status = ENABLED').get();
  while (iterator.hasNext()) {
    var campaign = iterator.next();
    var name = campaign.getName();
    if (seen[name]) continue;
    var stats = campaign.getStatsFor(range);
    sheet.appendRow([
      day,
      name,
      stats.getImpressions(),
      stats.getClicks(),
      roundMoney(stats.getCost()),
      stats.getConversions(),
      stats.getCtr(),
      roundMoney(stats.getAverageCpc()),
    ]);
  }
}

function writeSnapshot(spreadsheet, day, stats) {
  var sheet = spreadsheet.getSheetByName('PDCA最新');
  if (!sheet) sheet = spreadsheet.insertSheet('PDCA最新');
  sheet.clear();
  var clicks = stats.getClicks();
  var impressions = stats.getImpressions();
  var ctr = impressions > 0 ? clicks / impressions : 0;
  var ledger = ledgerCloseRate(spreadsheet, day);
  var closeText = ledger.inquiries > 0 ? (ledger.closed / ledger.inquiries) : '';
  sheet.getRange(1, 1).setValue(japaneseDate(day) + '時点のクリック率は ' + (ctr * 100).toFixed(1) + '% です。');
  sheet.getRange(3, 1, 1, 8).setValues([[
    '日付',
    'クリック率',
    '表示回数',
    'クリック数',
    '費用',
    '平均クリック単価',
    'コンバージョン数',
    '当月台帳の成約率',
  ]]);
  sheet.getRange(4, 1, 1, 8).setValues([[
    day,
    ctr,
    impressions,
    clicks,
    roundMoney(stats.getCost()),
    clicks > 0 ? roundMoney(stats.getCost() / clicks) : '',
    stats.getConversions(),
    closeText,
  ]]);
  sheet.getRange(4, 2).setNumberFormat('0.0%');
  sheet.getRange(4, 8).setNumberFormat('0.0%');
  sheet.getRange(6, 1).setValue('このタブは社内限定です。LPや広告文には貼らないでください。');
}

function ledgerCloseRate(spreadsheet, day) {
  var name = day.slice(2, 4) + day.slice(5, 7);
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) return { inquiries: 0, closed: 0 };
  var values = sheet.getDataRange().getValues();
  var headerIndex = -1;
  var limit = Math.min(values.length, 15);
  for (var i = 0; i < limit; i++) {
    var joined = values[i].join(' ').replace(/\s/g, '');
    if (joined.indexOf('受注金額') !== -1) {
      headerIndex = i;
      break;
    }
  }
  if (headerIndex < 0) return { inquiries: 0, closed: 0 };
  var headers = values[headerIndex].map(function (cell) {
    return String(cell).replace(/\s/g, '');
  });
  var amountCol = headers.indexOf('受注金額');
  var dateCol = headers.indexOf('受注日');
  var inquiries = 0;
  var closed = 0;
  for (var row = headerIndex + 1; row < values.length; row++) {
    var amount = money(amountCol >= 0 ? values[row][amountCol] : '');
    var orderDate = dateCol >= 0 ? String(values[row][dateCol] || '').trim() : '';
    var status = String(values[row][0] || '').trim();
    if (!orderDate && !(amount > 0) && !status) continue;
    inquiries++;
    if (amount > 0) closed++;
  }
  return { inquiries: inquiries, closed: closed };
}

function sheetWithHeaders(spreadsheet, name, headers) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  return sheet;
}

function columnHas(sheet, column, value) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var values = sheet.getRange(2, column, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === value) return true;
  }
  return false;
}

function existingCampaignKeys(sheet, day) {
  var found = {};
  var last = sheet.getLastRow();
  if (last < 2) return found;
  var values = sheet.getRange(2, 1, last - 1, 2).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === day) found[String(values[i][1])] = true;
  }
  return found;
}

function searchShare(stats) {
  if (typeof stats.getSearchImpressionShare !== 'function') return '';
  var value = stats.getSearchImpressionShare();
  return value == null ? '' : value;
}

function roundMoney(value) {
  if (value == null || value === '') return '';
  return Math.round(value);
}

function money(value) {
  var text = String(value == null ? '' : value).replace(/[¥￥,\s円]/g, '');
  if (!text) return null;
  if (text.indexOf('+') !== -1) {
    var parts = text.split('+');
    var total = 0;
    for (var i = 0; i < parts.length; i++) {
      var part = Number(parts[i]);
      if (!isFinite(part)) return null;
      total += part;
    }
    return total;
  }
  var parsed = Number(text);
  return isFinite(parsed) ? parsed : null;
}

function japaneseDate(isoDate) {
  var parts = isoDate.split('-');
  return parts[0] + '年' + Number(parts[1]) + '月' + Number(parts[2]) + '日';
}

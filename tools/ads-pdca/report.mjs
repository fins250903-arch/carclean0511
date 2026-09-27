/**
 * Internal-only PDCA report.
 * Writes under tools/ads-pdca/output and refuses src/, public/, and dist/.
 * The Astro site never imports this module.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { objectsFromMatrix, parseCsv } from './lib/csv.mjs';
import { loadEnv, readServiceAccount } from './lib/env.mjs';
import { assertInternalOutput } from './lib/paths.mjs';
import { buildReport } from './lib/pdca.mjs';
import { renderActionsCsv, renderReport } from './lib/render.mjs';
import { selectInputs } from './lib/select.mjs';
import { fetchSpreadsheetTables } from './lib/sheets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readRecords(file) {
  return objectsFromMatrix(parseCsv(fs.readFileSync(file, 'utf8')));
}

function parseArgs(argv) {
  const args = { csv: null, ads: null, deals: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--csv') args.csv = argv[++i];
    else if (token === '--ads') args.ads = argv[++i];
    else if (token === '--deals') args.deals = argv[++i];
    else throw new Error(`Unknown argument: ${token}`);
  }
  return args;
}

async function loadInput(args) {
  if (args.ads || args.deals) {
    return {
      adsRecords: args.ads ? readRecords(args.ads) : [],
      dealRecords: args.deals ? readRecords(args.deals) : [],
      warnings: [],
      sourceLabel: 'local csv',
    };
  }
  if (args.csv) {
    const records = readRecords(args.csv);
    return selectInputs([{ sheetId: 0, title: path.basename(args.csv), records }]);
  }

  const spreadsheetId = process.env.PDCA_SPREADSHEET_ID;
  const credentials = readServiceAccount();
  if (!spreadsheetId || !credentials) {
    throw new Error(
      [
        '非公開のスプレッドシートを読む設定が足りません。',
        'GOOGLE_SERVICE_ACCOUNT_JSON と PDCA_SPREADSHEET_ID を .env に置き、client_email を閲覧者にしてください。',
        '共有範囲は「リンクを知っている全員」にしないでください。',
        'ログイン済みの CSV で集計する場合: npm run pdca:report -- --ads <広告CSV> --deals <台帳CSV>',
      ].join('\n'),
    );
  }

  const spreadsheet = await fetchSpreadsheetTables(spreadsheetId, credentials);
  const selected = selectInputs(spreadsheet.tables, process.env.PDCA_SPREADSHEET_GID);
  return { ...selected, sourceLabel: `${spreadsheet.title} / ${selected.sourceLabel}` };
}

async function main() {
  loadEnv(root);
  const args = parseArgs(process.argv.slice(2));
  const input = await loadInput(args);
  const report = buildReport(input);
  const outDir = path.join(root, 'tools/ads-pdca/output');
  const htmlPath = assertInternalOutput(path.join(outDir, 'pdca-report.html'), root);
  const csvPath = assertInternalOutput(path.join(outDir, 'pdca-actions.csv'), root);
  const jsonPath = assertInternalOutput(path.join(outDir, 'pdca-summary.json'), root);
  fs.mkdirSync(outDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(htmlPath, renderReport(report), { encoding: 'utf8', mode: 0o600 });
  fs.writeFileSync(csvPath, renderActionsCsv(report), { encoding: 'utf8', mode: 0o600 });
  fs.writeFileSync(jsonPath, `${JSON.stringify({ kpis: report.kpis, actions: report.actions, warnings: report.warnings }, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  console.log('社内資料を書き出しました。公開ディレクトリには出していません。');
  console.log(htmlPath);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'PDCA report failed');
  process.exitCode = 1;
});

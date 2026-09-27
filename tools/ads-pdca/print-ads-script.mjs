/**
 * Write the Google Ads daily script with the spreadsheet id from .env.
 * The filled script stays in tools/ads-pdca/private and is not committed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/env.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function buildAdsScript(spreadsheetId, template) {
  if (!/^[a-zA-Z0-9_-]+$/.test(spreadsheetId)) {
    throw new Error('PDCA_SPREADSHEET_ID must be the id only, not a full URL.');
  }
  if (!template.includes('__SPREADSHEET_ID__')) {
    throw new Error('Ads script template is missing __SPREADSHEET_ID__.');
  }
  return template.replaceAll('__SPREADSHEET_ID__', spreadsheetId);
}

function main() {
  loadEnv(root);
  const spreadsheetId = process.env.PDCA_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('Set PDCA_SPREADSHEET_ID in .env. Do not commit that file.');
  }
  const templatePath = path.join(root, 'tools/ads-pdca/google-ads-daily.template.js');
  const script = buildAdsScript(spreadsheetId, fs.readFileSync(templatePath, 'utf8'));
  const outDir = path.join(root, 'tools/ads-pdca/private');
  const outPath = path.join(outDir, 'google-ads-daily.js');
  fs.mkdirSync(outDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(outPath, script, { encoding: 'utf8', mode: 0o600 });
  console.log(outPath);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

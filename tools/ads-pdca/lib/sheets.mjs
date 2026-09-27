import { google } from 'googleapis';
import { matrixToObjects } from './csv.mjs';

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

function quoteSheet(title) {
  return `'${String(title).replace(/'/g, "''")}'`;
}

export async function fetchSpreadsheetTables(spreadsheetId, credentials) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: [SHEETS_SCOPE],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  let meta;
  try {
    meta = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'properties.title,sheets.properties(sheetId,title)',
    });
  } catch (error) {
    const status = error?.code || error?.response?.status;
    if (status === 403 || status === 404) {
      throw new Error(
        `The spreadsheet is not readable by ${credentials.client_email}. Share it as Viewer with that account. Do not publish the sheet.`,
      );
    }
    throw new Error('Google Sheets request failed. The spreadsheet stayed private.');
  }

  const properties = meta.data.sheets?.map((sheet) => sheet.properties).filter(Boolean) ?? [];
  if (properties.length === 0) return { title: meta.data.properties?.title || 'spreadsheet', tables: [] };

  const ranges = properties.map((sheet) => quoteSheet(sheet.title));
  const values = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
    valueRenderOption: 'FORMATTED_VALUE',
  });

  const tables = properties.map((sheet, index) => ({
    sheetId: sheet.sheetId,
    title: sheet.title,
    records: matrixToObjects(values.data.valueRanges?.[index]?.values ?? []),
  }));

  return { title: meta.data.properties?.title || 'spreadsheet', tables };
}

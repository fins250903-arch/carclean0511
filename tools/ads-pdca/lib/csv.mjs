/**
 * Minimal RFC-style CSV parser. Keeps quoted commas and escaped quotes.
 * Does not interpret headers.
 */

export function parseCsv(text) {
  const input = String(text ?? '').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (char !== '\r') {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((value) => String(value).trim() !== ''));
}

const HEADER_MARKERS = ['受注金額', '顧客名', '表示回数', 'キャンペーン', 'クリック数'];

function compactHeader(value) {
  return String(value ?? '').replace(/[\s　]/g, '');
}

export function matrixToObjects(matrix, headerIndex = 0) {
  if (!matrix?.length) return [];
  const headerRow = matrix[headerIndex] ?? [];
  const headers = headerRow.map((header, index) => {
    const name = String(header ?? '').trim();
    if (name) return name;
    const samples = matrix.slice(headerIndex + 1, headerIndex + 8).map((row) => row[index]);
    if (samples.some((cell) => /問合/.test(String(cell ?? '')))) return '区分';
    return '';
  });
  return matrix.slice(headerIndex + 1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      if (!header) return;
      record[header] = cells[index] ?? '';
    });
    return record;
  });
}

/** Order sheets often put a totals row above the real header. */
export function objectsFromMatrix(matrix) {
  if (!matrix?.length) return [];
  const limit = Math.min(matrix.length, 15);
  let headerIndex = 0;
  for (let index = 0; index < limit; index += 1) {
    const cells = (matrix[index] ?? []).map(compactHeader);
    if (cells.some((cell) => HEADER_MARKERS.some((marker) => cell === marker || cell.includes(marker)))) {
      headerIndex = index;
      break;
    }
  }
  return matrixToObjects(matrix, headerIndex);
}

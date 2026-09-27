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

export function matrixToObjects(matrix) {
  if (!matrix?.length) return [];
  const headers = matrix[0].map((header) => String(header ?? '').trim());
  return matrix.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      if (!header) return;
      record[header] = cells[index] ?? '';
    });
    return record;
  });
}

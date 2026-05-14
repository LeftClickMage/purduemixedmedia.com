interface SheetsValuesResponse {
  range?: string;
  majorDimension?: string;
  values?: string[][];
}

export interface SheetRow {
  [column: string]: string;
}

/**
 * Fetch a range from a Google Sheet and return rows as objects keyed by the header row.
 * Sheet must be shared as "Anyone with the link can view" (or readable by the API key).
 */
export async function fetchSheet(sheetId: string, range: string): Promise<SheetRow[]> {
  const apiKey = import.meta.env.VITE_SHEETS_API_KEY;
  if (!apiKey) throw new Error('Missing VITE_SHEETS_API_KEY');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API ${res.status}: ${body}`);
  }
  const data = (await res.json()) as SheetsValuesResponse;
  console.log('[sheets] raw response:', data);
  const rows = data.values ?? [];
  console.log('[sheets] rows array:', rows);
  if (rows.length < 2) {
    console.log('[sheets] fewer than 2 rows, returning empty');
    return [];
  }

  const [headers, ...dataRows] = rows;
  console.log('[sheets] headers:', headers);
  console.log('[sheets] data rows:', dataRows);
  const parsed = dataRows.map(row => {
    const obj: SheetRow = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] ?? '';
    });
    return obj;
  });
  console.log('[sheets] parsed objects:', parsed);
  return parsed;
}

import Papa from 'papaparse';
import type { FactionSlice } from './types';

export interface SheetRow {
  coord: string;          // e.g. "G8"
  slices: FactionSlice[];
}

/**
 * Fetch and parse the occupation table from a Google Sheets published CSV.
 *
 * Expected format — first column is "Hex", remaining columns are faction names,
 * cell values are percentages (0–100, may be empty = 0):
 *
 *   Hex, Den, Axe, Rubi, ...
 *   G8,  70,  30,      ,
 *   M14,    , 40,      , 60
 */
export async function loadSheetRows(
  csvUrl: string,
  sideColors: Record<string, string>,
): Promise<SheetRow[]> {
  const response = await fetch(csvUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();

  const result = Papa.parse<string[]>(text, {
    skipEmptyLines: true,
  });

  const rows = result.data;
  if (rows.length < 2) return [];

  // Header row: ["Hex", "Den", "Axe", ...]
  const headers = rows[0].map((h) => h.trim());
  const factionNames = headers.slice(1);

  return rows.slice(1).map((row) => {
    const coord = (row[0] ?? '').trim();
    const slices: FactionSlice[] = [];
    factionNames.forEach((name, i) => {
      const raw = (row[i + 1] ?? '').trim();
      const percent = raw === '' ? 0 : parseFloat(raw);
      if (percent > 0) {
        slices.push({
          name,
          percent,
          color: sideColors[name] ?? '#888888',
        });
      }
    });
    return { coord, slices };
  });
}

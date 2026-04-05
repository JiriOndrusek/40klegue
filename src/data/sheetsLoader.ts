import Papa from 'papaparse';
import type { HexData } from './types';

/**
 * Fetch and parse hex data from a Google Sheets published CSV URL.
 *
 * Expected sheet columns (case-insensitive):
 *   col, row, name, faction, color
 *
 * To get the URL: in Google Sheets → File → Share → Publish to web
 * → select the sheet → CSV → Publish. Copy the resulting link.
 */
export async function loadHexesFromSheet(csvUrl: string): Promise<HexData[]> {
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();

  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  return result.data
    .map((row) => ({
      col: parseInt(row['col'] ?? '0', 10),
      row: parseInt(row['row'] ?? '0', 10),
      name: (row['name'] ?? '').trim(),
      faction: (row['faction'] ?? '').trim(),
      color: (row['color'] ?? '#444444').trim(),
    }))
    .filter((h) => !isNaN(h.col) && !isNaN(h.row));
}

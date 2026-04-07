import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadSheetRows } from './data/sheetsLoader';
import type { HexData, FactionSlice, GridConfig, RawSheetRow } from './data/types';
import { HexGrid } from './ui/HexGrid';
import { CalibrationPanel } from './ui/CalibrationPanel';
import { SelectionPanel } from './ui/SelectionPanel';
import { LegendPanel } from './ui/LegendPanel';
import { ClubsPanel } from './ui/ClubsPanel';
import VISIBLE_HEXES from './data/visibleHexes.json';
import SIDE_COLORS from './data/sides.json';

// ── Configuration ────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_azvvTFyHEjOR5-Ji5BpouBII9JjOSCPQqGzO7CkhtfJhSkig5BwNYOreBXvkXtTMCYQLCOJ5UG7p/pub?gid=0&single=true&output=csv';

const BACKGROUND_URL = '/40klegue/map.png';

// All values in image-pixel coordinates (image is 1280×960).
// Tune live by pressing C to open the calibration panel.
const INITIAL_CONFIG: GridConfig = {
  cols: 20,
  rows: 15,
  hexSize: 33.75,
  offsetX: -1,
  offsetY: 116.7,
};
// ─────────────────────────────────────────────────────────────────────────────

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; rawRows: RawSheetRow[] };

export default function App() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [config, setConfig] = useState<GridConfig>(INITIAL_CONFIG);
  const [calibrating, setCalibrating] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [legend, setLegend] = useState(true);
  const [clubs, setClubs] = useState<Record<string, string>>(SIDE_COLORS);
  const [clubsOpen, setClubsOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<Set<string>>(
    () => new Set<string>(VISIBLE_HEXES),
  );

  useEffect(() => {
    loadSheetRows(SHEET_CSV_URL)
      .then((rawRows) => setLoadState({ status: 'ok', rawRows }))
      .catch((err: unknown) =>
        setLoadState({
          status: 'error',
          message: err instanceof Error ? err.message : String(err),
        }),
      );
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'c' || e.key === 'C') setCalibrating((v) => !v);
    if (e.key === 's' || e.key === 'S') setSelecting((v) => !v);
    if (e.key === 'l' || e.key === 'L') setLegend((v) => !v);
    if (e.key === 'k' || e.key === 'K') setClubsOpen((v) => !v);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const toggleHex = useCallback((coord: string) => {
    setSelectedCoords((prev) => {
      const next = new Set(prev);
      if (next.has(coord)) next.delete(coord);
      else next.add(coord);
      return next;
    });
  }, []);

  const byCoord = useMemo<Map<string, HexData>>(() => {
    const rawRows = loadState.status === 'ok' ? loadState.rawRows : [];
    const map = new Map<string, HexData>();
    for (const row of rawRows) {
      const letter = row.coord[0]?.toUpperCase() ?? 'A';
      const num = parseInt(row.coord.slice(1), 10);
      if (isNaN(num)) continue;
      const r = letter.charCodeAt(0) - 65;
      const c = num - 1;
      const slices: FactionSlice[] = Object.entries(row.percents).map(([name, percent]) => ({
        name,
        percent,
        color: clubs[name] ?? '#888888',
      }));
      map.set(row.coord, { col: c, row: r, slices });
    }
    return map;
  }, [loadState, clubs]);

  const allHexes = useMemo<HexData[]>(() => {
    const result: HexData[] = [];
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const coord = `${String.fromCharCode(65 + row)}${col + 1}`;
        result.push(byCoord.get(coord) ?? { col, row, slices: [] });
      }
    }
    return result;
  }, [byCoord, config.cols, config.rows]);

  const visibleHexes = useMemo<HexData[]>(() => {
    if (selecting) return allHexes;
    return allHexes.filter((h) => {
      const coord = `${String.fromCharCode(65 + h.row)}${h.col + 1}`;
      return selectedCoords.has(coord);
    });
  }, [allHexes, selecting, selectedCoords]);

  if (loadState.status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        Loading map data…
      </div>
    );
  }

  if (loadState.status === 'error') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#f66' }}>
        Failed to load sheet: {loadState.message}
      </div>
    );
  }

  return (
    <>
      <HexGrid
        hexes={visibleHexes}
        config={config}
        backgroundUrl={BACKGROUND_URL}
        selectionMode={selecting}
        selectedHexes={selectedCoords}
        onToggleHex={toggleHex}
      />
      {legend && <LegendPanel clubs={clubs} />}
      {calibrating && <CalibrationPanel config={config} onChange={setConfig} />}
      {selecting && <SelectionPanel selected={selectedCoords} />}
      {clubsOpen && <ClubsPanel clubs={clubs} onChange={setClubs} />}
    </>
  );
}

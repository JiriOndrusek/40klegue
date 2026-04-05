import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadHexesFromSheet } from './data/sheetsLoader';
import type { HexData, GridConfig } from './data/types';
import { HexGrid } from './ui/HexGrid';
import { CalibrationPanel } from './ui/CalibrationPanel';

// ── Configuration ────────────────────────────────────────────────────────────
// Publish your Google Sheet as CSV: File → Share → Publish to web → CSV
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1K6zhkYVqTpI0MD5eq43uxBOLuqInEbAFXJuLRBKmo24/export?format=csv&gid=0';

const BACKGROUND_URL = '/40klegue/map.png';

// All values are in image-pixel coordinates (image is 1280×960).
// offsetX/Y: top-left origin of the hex grid on the image.
// hexSize: flat-top hex "radius" (center to corner) in pixels.
// Tune these live by pressing C to open the calibration panel.
const INITIAL_CONFIG: GridConfig = {
  cols: 20,
  rows: 15,
  hexSize: 33.75,
  offsetX: 28.67,
  offsetY: 66.5,
};
// ─────────────────────────────────────────────────────────────────────────────

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; hexes: HexData[] };

export default function App() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [config, setConfig] = useState<GridConfig>(INITIAL_CONFIG);
  const [calibrating, setCalibrating] = useState(false);

  useEffect(() => {
    loadHexesFromSheet(SHEET_CSV_URL)
      .then((hexes) => setLoadState({ status: 'ok', hexes }))
      .catch((err: unknown) =>
        setLoadState({
          status: 'error',
          message: err instanceof Error ? err.message : String(err),
        }),
      );
  }, []);

  const toggleCalibration = useCallback((e: KeyboardEvent) => {
    if (e.key === 'c' || e.key === 'C') setCalibrating((v) => !v);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', toggleCalibration);
    return () => window.removeEventListener('keydown', toggleCalibration);
  }, [toggleCalibration]);

  // Build the full grid from config, then overlay sheet data where available
  const hexes = useMemo<HexData[]>(() => {
    const sheetMap = new Map<string, HexData>();
    if (loadState.status === 'ok') {
      for (const h of loadState.hexes) sheetMap.set(`${h.col},${h.row}`, h);
    }
    const result: HexData[] = [];
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const key = `${col},${row}`;
        result.push(
          sheetMap.get(key) ?? { col, row, name: '', faction: '', color: '#444444' },
        );
      }
    }
    return result;
  }, [loadState, config.cols, config.rows]);

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
      <HexGrid hexes={hexes} config={config} backgroundUrl={BACKGROUND_URL} />
      {calibrating && <CalibrationPanel config={config} onChange={setConfig} />}
    </>
  );
}

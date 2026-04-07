import type { FactionSlice } from '../data/types';

interface Props {
  slices: FactionSlice[];
  x: number;
  y: number;
  coord: string;
}

const TOOLTIP_WIDTH = 190;
const ROW_HEIGHT = 34;
const V_PADDING = 20;

export function HexTooltip({ slices, x, y, coord }: Props) {
  const estimatedHeight = slices.length * ROW_HEIGHT + V_PADDING;
  const left = x + 12 + TOOLTIP_WIDTH > window.innerWidth ? x - TOOLTIP_WIDTH - 4 : x + 12;
  const top = y + 12 + estimatedHeight > window.innerHeight ? y - estimatedHeight - 4 : y + 12;

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        zIndex: 200,
        background: 'rgba(0,0,0,0.88)',
        color: '#eee',
        padding: '10px 14px',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: 13,
        pointerEvents: 'none',
        minWidth: 160,
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 14, color: '#fff', marginBottom: 8, letterSpacing: 1 }}>
        {coord}
      </div>
      {slices.map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 3,
              background: s.color,
              border: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1 }}>{s.name}</span>
          <span style={{ color: '#7df', fontWeight: 'bold' }}>{s.percent}%</span>
        </div>
      ))}
    </div>
  );
}

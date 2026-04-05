import type { FactionSlice } from '../data/types';

interface Props {
  slices: FactionSlice[];
  x: number;
  y: number;
}

export function HexTooltip({ slices, x, y }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        left: x + 12,
        top: y + 12,
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

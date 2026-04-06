import { useEffect, useState } from 'react';
import { hexCenter } from '../core/hexMath';
import type { GridConfig } from '../data/types';

interface Props {
  config: GridConfig;
  clubs: Record<string, string>;
}

// Native image resolution — must match HexGrid
const IMG_W = 1280;
const IMG_H = 960;

/** Converts an image-space point to screen pixels, accounting for SVG scaling. */
function toScreen(imgX: number, imgY: number, vw: number, vh: number) {
  const scale = Math.min(vw / IMG_W, vh / IMG_H);
  const marginX = (vw - IMG_W * scale) / 2;
  const marginY = (vh - IMG_H * scale) / 2;
  return {
    x: marginX + imgX * scale,
    y: marginY + imgY * scale,
  };
}

export function LegendPanel({ config, clubs }: Props) {
  const [vw, setVw] = useState(window.innerWidth);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // G1 = col 0, row 6 (G is the 7th letter, 0-indexed = 6)
  const G1_COL = 0;
  const G1_ROW = 6;
  const center = hexCenter(G1_COL, G1_ROW, config.hexSize);
  const screen = toScreen(
    center.x + config.offsetX,
    center.y + config.offsetY,
    vw,
    vh,
  );

  const sides = Object.entries(clubs);

  return (
    <div
      style={{
        position: 'fixed',
        top: screen.y,
        left: 16,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        color: '#eee',
        padding: '16px 20px',
        borderRadius: 8,
        minWidth: 180,
        fontFamily: 'monospace',
        fontSize: 13,
        transform: 'translate(100%, calc(-100% - 110px))',
      }}
    >
      <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 14 }}>
        Sides <span style={{ fontWeight: 'normal', opacity: 0.6 }}>(press L to close)</span>
      </div>

      {sides.map(([name, color]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: color,
              border: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}
          />
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}

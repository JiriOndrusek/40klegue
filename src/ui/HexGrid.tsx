import type { HexData, GridConfig } from '../data/types';
import { HexCell } from './HexCell';

// Native resolution of the background image — SVG uses the same coordinate space
// so the overlay scales in lockstep with the image regardless of viewport size.
const IMG_W = 1280;
const IMG_H = 960;

interface Props {
  hexes: HexData[];
  config: GridConfig;
  backgroundUrl: string;
  selectionMode?: boolean;
  selectedHexes?: Set<string>;
  onToggleHex?: (coord: string) => void;
}

export function HexGrid({ hexes, config, backgroundUrl, selectionMode, selectedHexes, onToggleHex }: Props) {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Background map image */}
      <img
        src={backgroundUrl}
        alt="League map"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />

      {/* SVG hex overlay — same viewBox as the image's native resolution */}
      <svg
        viewBox={`0 0 ${IMG_W} ${IMG_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {/* offsetX/Y shifts the entire grid within image pixel space */}
        <g transform={`translate(${config.offsetX}, ${config.offsetY})`}>
          {hexes.map((hex) => {
            const coord = `${String.fromCharCode(65 + hex.row)}${hex.col + 1}`;
            return (
              <HexCell
                key={`${hex.col},${hex.row}`}
                hex={hex}
                size={config.hexSize}
                selectionMode={selectionMode}
                isSelected={selectedHexes?.has(coord)}
                onToggle={() => onToggleHex?.(coord)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

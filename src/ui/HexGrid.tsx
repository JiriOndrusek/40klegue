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
}

export function HexGrid({ hexes, config, backgroundUrl }: Props) {
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
          {hexes.map((hex) => (
            <HexCell key={`${hex.col},${hex.row}`} hex={hex} size={config.hexSize} />
          ))}
        </g>
      </svg>
    </div>
  );
}

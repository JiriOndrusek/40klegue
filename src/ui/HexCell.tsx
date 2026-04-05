import { hexCenter, hexCorners, cornersToSvgPoints } from '../core/hexMath';
import type { HexData } from '../data/types';

interface Props {
  hex: HexData;
  size: number;
}

export function HexCell({ hex, size }: Props) {
  const { x, y } = hexCenter(hex.col, hex.row, size);
  const corners = hexCorners(x, y, size - 1); // 1px gap between hexes
  const points = cornersToSvgPoints(corners);

  const fontSize = size * 0.22;
  const coordLabel = `${String.fromCharCode(65 + hex.row)}${hex.col + 1}`;

  return (
    <g>
      <polygon
        points={points}
        fill={hex.color}
        fillOpacity={0.55}
        stroke="#888"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize * 1.4}
        fill="#fff"
        stroke="#000"
        strokeWidth={0.4}
        paintOrder="stroke"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {coordLabel}
      </text>
      {hex.name && (
        <text
          x={x}
          y={y - fontSize * 0.4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fill="#fff"
          stroke="#000"
          strokeWidth={0.4}
          paintOrder="stroke"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {hex.name}
        </text>
      )}
      {hex.faction && (
        <text
          x={x}
          y={y + fontSize * 1.1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize * 0.85}
          fill="#ddd"
          stroke="#000"
          strokeWidth={0.3}
          paintOrder="stroke"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {hex.faction}
        </text>
      )}
    </g>
  );
}

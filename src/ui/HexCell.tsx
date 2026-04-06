import { useState } from 'react';
import { createPortal } from 'react-dom';
import { hexCenter, hexCorners, cornersToSvgPoints } from '../core/hexMath';
import type { HexData } from '../data/types';
import { HexTooltip } from './HexTooltip';

interface Props {
  hex: HexData;
  size: number;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
}

export function HexCell({ hex, size, selectionMode, isSelected, onToggle }: Props) {
  const { x, y } = hexCenter(hex.col, hex.row, size);
  const corners = hexCorners(x, y, size - 1);
  const points = cornersToSvgPoints(corners);

  const fontSize = size * 0.22;
  const coordLabel = `${String.fromCharCode(65 + hex.row)}${hex.col + 1}`;
  const clipId = `hc-${hex.col}-${hex.row}`;

  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const hexTop = y - size;
  const hexHeight = 2 * size;
  const hexHalfWidth = Math.sqrt(3) * size;

  let cumPct = 0;
  const sliceRects = hex.slices.map((slice) => {
    const rectY = hexTop + hexHeight * (1 - (cumPct + slice.percent) / 100);
    const rectH = hexHeight * (slice.percent / 100);
    cumPct += slice.percent;
    return { ...slice, rectY, rectH };
  });

  const hasSlices = hex.slices.length > 0;
  const dominant = hex.slices.find((s) => s.percent > 50) ?? null;

  if (selectionMode) {
    return (
      <g onClick={onToggle} style={{ cursor: 'pointer' }}>
        <polygon
          points={points}
          fill={isSelected ? '#4a9' : '#222'}
          fillOpacity={isSelected ? 0.7 : 0.5}
          stroke={isSelected ? '#7fb' : '#555'}
          strokeWidth={isSelected ? 2 : 1}
        />
        <text
          x={x} y={y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={fontSize * 1.4}
          fill={isSelected ? '#fff' : '#555'}
          stroke="#000" strokeWidth={0.4} paintOrder="stroke"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {coordLabel}
        </text>
      </g>
    );
  }

  return (
    <>
      <g
        onMouseMove={hasSlices ? (e) => setMouse({ x: e.clientX, y: e.clientY }) : undefined}
        onMouseLeave={hasSlices ? () => setMouse(null) : undefined}
        style={{ cursor: hasSlices ? 'crosshair' : 'default' }}
      >
        <defs>
          <clipPath id={clipId}>
            <polygon points={points} />
          </clipPath>
        </defs>

        {/* Base fill — transparent for unoccupied hexes */}
        <polygon
          points={points}
          fill="transparent"
          stroke="#888"
          strokeWidth={1}
        />

        {/* Faction slices — filled bottom-to-top, clipped to hex shape */}
        {sliceRects.map((s) => (
          <rect
            key={s.name}
            x={x - hexHalfWidth}
            y={s.rectY}
            width={hexHalfWidth * 2}
            height={s.rectH}
            fill={s.color}
            fillOpacity={dominant ? 0.65 : 0.4}
            clipPath={`url(#${clipId})`}
          />
        ))}

        {/* Hex border on top of fills */}
        <polygon
          points={points}
          fill="none"
          stroke={dominant ? dominant.color : mouse ? '#fff' : '#888'}
          strokeWidth={dominant ? 3 : mouse ? 1.5 : 1}
          strokeOpacity={dominant ? 0.9 : 1}
        />

        {/* Coordinate label */}
        <text
          x={x} y={y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={fontSize * 1.4}
          fill="#fff"
          stroke="#000" strokeWidth={0.4} paintOrder="stroke"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {coordLabel}
        </text>
      </g>

      {mouse && hasSlices && createPortal(
        <HexTooltip slices={hex.slices} x={mouse.x} y={mouse.y} />,
        document.body,
      )}
    </>
  );
}

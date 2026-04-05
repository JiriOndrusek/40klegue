// ─── Core Layer – pure hex geometry (pointy-top, odd-r offset coords) ────────
// Reference: https://www.redblobgames.com/grids/hexagons/

export interface Point {
  x: number;
  y: number;
}

/**
 * Pixel center of hex at (col, row) for a pointy-top grid.
 * Odd rows shift right by half a hex width.
 */
export function hexCenter(col: number, row: number, size: number): Point {
  return {
    x:
      Math.sqrt(3) * size * col +
      (row % 2 === 1 ? (Math.sqrt(3) / 2) * size : 0) +
      (Math.sqrt(3) / 2) * size,
    y: 1.5 * size * row + size,
  };
}

/** Six corner points of a pointy-top hexagon centered at (cx, cy). */
export function hexCorners(cx: number, cy: number, size: number): Point[] {
  return Array.from({ length: 6 }, (_, i) => {
    const angleDeg = 30 + 60 * i; // 30° start → pointy-top
    const angleRad = (Math.PI / 180) * angleDeg;
    return {
      x: cx + size * Math.cos(angleRad),
      y: cy + size * Math.sin(angleRad),
    };
  });
}

/** SVG-ready polygon points string */
export function cornersToSvgPoints(corners: Point[]): string {
  return corners.map(({ x, y }) => `${x},${y}`).join(' ');
}

/** Total bounding box of the grid */
export function gridPixelSize(
  cols: number,
  rows: number,
  size: number,
): { width: number; height: number } {
  return {
    width: Math.sqrt(3) * size * (cols + 0.5),
    height: size * (1.5 * rows + 0.5),
  };
}

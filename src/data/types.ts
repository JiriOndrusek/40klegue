export interface HexData {
  col: number;
  row: number;
  name: string;
  faction: string;
  color: string; // CSS color string, e.g. "#3399ff"
}

export interface GridConfig {
  cols: number;
  rows: number;
  hexSize: number;
  offsetX: number;
  offsetY: number;
}

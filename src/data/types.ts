export interface FactionSlice {
  name: string;
  percent: number;
  color: string;
}

export interface RawSheetRow {
  coord: string;
  percents: Record<string, number>;
}

export interface HexData {
  col: number;
  row: number;
  slices: FactionSlice[];
}

export interface GridConfig {
  cols: number;
  rows: number;
  hexSize: number;
  offsetX: number;
  offsetY: number;
}

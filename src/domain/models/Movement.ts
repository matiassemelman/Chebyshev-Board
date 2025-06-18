import type { Coordinate } from './Coordinate';

export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export type Movement = {
  readonly from: Coordinate;
  readonly to: Coordinate;
  readonly direction: Direction;
  readonly stepNumber: number;
};
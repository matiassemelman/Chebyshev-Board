import type { Coordinate } from '../models/Coordinate';
import type { Movement, Direction } from '../models/Movement';

export const getDirectionBetweenPoints = (from: Coordinate, to: Coordinate): Direction => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const normalizedDx = dx === 0 ? 0 : dx / Math.abs(dx);
  const normalizedDy = dy === 0 ? 0 : dy / Math.abs(dy);

  const directionMap: Record<string, Direction> = {
    '0,1': 'N',   '1,1': 'NE',  '1,0': 'E',   '1,-1': 'SE',
    '0,-1': 'S',  '-1,-1': 'SW', '-1,0': 'W',  '-1,1': 'NW'
  };

  return directionMap[`${normalizedDx},${normalizedDy}`] || 'N';
};

export const calculateMovements = (coordinates: readonly Coordinate[]): readonly Movement[] => {
  if (coordinates.length <= 1) return [];

  const movements: Movement[] = [];

  for (let i = 1; i < coordinates.length; i++) {
    const from = coordinates[i - 1];
    const to = coordinates[i];
    const direction = getDirectionBetweenPoints(from, to);

    movements.push({
      from,
      to,
      direction,
      stepNumber: i
    });
  }

  return movements;
};
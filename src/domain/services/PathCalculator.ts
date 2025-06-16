/**
 * DOMAIN SERVICE: PathCalculator
 *
 * Implements the Chebyshev distance algorithm to calculate the minimum
 * number of steps between coordinates on a board where movement is allowed
 * in 8 directions (horizontal, vertical and diagonal).
 *
 * Chebyshev distance is: max(|dx|, |dy|)
 * This is more efficient than pathfinding algorithms like A* or BFS
 * because we take advantage that diagonal movement has no extra cost.
 */

import type { Coordinate } from '../models/Coordinate';

/**
 * CHEBYSHEV DISTANCE CALCULATION BETWEEN TWO POINTS
 *
 * This is the core function of the algorithm. The Chebyshev distance
 * represents the minimum number of steps to go from point A to point B
 * when you can move in 8 directions (including diagonals).
 *
 * Why max(|dx|, |dy|)?
 * - If dx=3, dy=2: you can move 2 steps diagonally (NE) and 1 step horizontally (E)
 * - Total: max(3,2) = 3 steps
 *
 * @param from - Source coordinate
 * @param to - Destination coordinate
 * @returns Minimum number of steps between the two points
 */
export const calculateChebyshevDistance = (from: Coordinate, to: Coordinate): number => {
  // Calculate absolute difference in X axis (horizontal)
  // Math.abs() ensures it's always positive regardless of direction
  const dx = Math.abs(to.x - from.x);

  // Calculate absolute difference in Y axis (vertical)
  const dy = Math.abs(to.y - from.y);

  // Chebyshev distance is the maximum of both differences
  // This represents minimum steps taking advantage of diagonal movement
  return Math.max(dx, dy);
};

/**
 * MINIMUM STEPS CALCULATION FOR A SEQUENCE OF COORDINATES
 *
 * Given a list of coordinates that must be visited IN ORDER,
 * calculates the total minimum steps to complete the path.
 *
 * Example: [(0,0), (1,2), (3,1)]
 * - From (0,0) to (1,2): max(|1-0|, |2-0|) = max(1,2) = 2 steps
 * - From (1,2) to (3,1): max(|3-1|, |1-2|) = max(2,1) = 2 steps
 * - Total: 2 + 2 = 4 steps
 *
 * @param coordinates - Array of coordinates to visit in order
 * @returns Total minimum steps for the complete path
 */
export const calculateMinimumSteps = (coordinates: Coordinate[]): number => {
  // Edge case: if there are 0 or 1 coordinates, there's no path to make
  if (coordinates.length <= 1) return 0;

  // Accumulator to sum all steps in the path
  let totalSteps = 0;

  // Iterate from the second coordinate (index 1) to the end
  // In each iteration we calculate the distance from the previous coordinate
  for (let i = 1; i < coordinates.length; i++) {
    // Current coordinate (step destination)
    const currentCoord = coordinates[i];

    // Previous coordinate (step origin)
    const previousCoord = coordinates[i - 1];

    // Calculate steps between these two coordinates and add to total
    totalSteps += calculateChebyshevDistance(previousCoord, currentCoord);
  }

  // Return total steps to complete the entire path
  return totalSteps;
};

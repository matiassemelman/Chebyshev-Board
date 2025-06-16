/**
 * DOMAIN MODEL: Coordinate
 *
 * Represents a position in a 2D board for minimum distance calculation.
 * This model is the heart of our Chebyshev algorithm and must remain
 * completely pure without external dependencies (Clean Architecture).
 */

// Define main type as readonly to ensure immutability
// This prevents accidental mutations that could corrupt state
export type Coordinate = {
  readonly x: number;
  readonly y: number;
};

/**
 * PURE COORDINATE VALIDATION
 *
 * Validates that a coordinate is valid for our board.
 * This function is pure (no side effects) and stays in domain
 * because it represents a fundamental business rule.
 *
 * @param coord - The coordinate to validate
 * @returns true if the coordinate is valid, false otherwise
 */
export const isValidCoordinate = (coord: Coordinate): boolean => {
  // Verify that x and y are integers (not decimal or NaN)
  const isXValid = Number.isInteger(coord.x) && coord.x >= 0;

  const isYValid = Number.isInteger(coord.y) && coord.y >= 0;

  // Both coordinates must be valid for the point to be valid
  return isXValid && isYValid;
};

/**
 * FACTORY FUNCTION TO CREATE COORDINATES
 *
 * Factory pattern that encapsulates coordinate creation.
 * This gives us control over how objects are constructed
 * and facilitates future extensions (e.g., automatic validation).
 *
 * @param x - Horizontal position (column)
 * @param y - Vertical position (row)
 * @returns New immutable coordinate
 */
export const createCoordinate = (x: number, y: number): Coordinate => ({
  x,
  y,
});

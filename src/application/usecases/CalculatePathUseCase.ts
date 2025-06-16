/**
 * APPLICATION LAYER: CalculatePathUseCase
 *
 * Orchestrates user input validation and domain logic.
 * This layer acts as a bridge between presentation and domain,
 * ensuring data arrives clean and validated.
 */

import { z } from 'zod';
import type { Coordinate } from '../../domain/models/Coordinate';
import { isValidCoordinate } from '../../domain/models/Coordinate';
import { calculateMinimumSteps } from '../../domain/services/PathCalculator';

// =============================================================================
// VALIDATION SCHEMAS WITH ZOD
// =============================================================================

/**
 * Schema to validate a single coordinate
 * Must be an object with x and y as non-negative integers
 */
const CoordinateSchema = z.object({
  x: z.number().int().min(0, "errors.validation.invalidCoordinate"),
  y: z.number().int().min(0, "errors.validation.invalidCoordinate")
}).refine(
  (coord) => isValidCoordinate(coord),
  { message: "errors.validation.invalidCoordinate" }
);

/**
 * Schema to validate a coordinates array
 * Must have at least 1 coordinate to be useful
 */
const CoordinatesArraySchema = z
  .array(CoordinateSchema)
  .min(1, "errors.validation.atLeastOne");

// =============================================================================
// DTOs (DATA TRANSFER OBJECTS)
// =============================================================================

/**
 * Use case input - what it receives from the presentation layer
 */
export type CalculatePathInput = {
  readonly coordinatesJson: string;
};

/**
 * Use case output - what it returns to the presentation layer
 */
export type CalculatePathOutput = {
  readonly success: true;
  readonly coordinates: readonly Coordinate[];
  readonly totalSteps: number;
} | {
  readonly success: false;
  readonly error: string;
};

// =============================================================================
// MAIN USE CASE
// =============================================================================

/**
 * USE CASE: Calculate Minimum Path
 *
 * Orchestrates the entire flow from raw input to final result:
 * 1. JSON string parsing
 * 2. Zod validation
 * 3. Domain service call
 * 4. Result formatting
 *
 * @param input - JSON string with user coordinates
 * @returns Successful result with steps or descriptive error
 */
export const calculatePath = (input: CalculatePathInput): CalculatePathOutput => {
  try {
    // STEP 1: JSON string parsing
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(input.coordinatesJson);
    } catch {
      return {
        success: false,
        error: "errors.validation.invalidJson"
      };
    }

    // STEP 2: Zod validation
    const validationResult = CoordinatesArraySchema.safeParse(parsedData);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map(err => err.message)
        .join(", ");

      return {
        success: false,
        error: `Validation failed: ${errorMessage}`
      };
    }

    // STEP 3: Domain service call
    const coordinates = validationResult.data as readonly Coordinate[];
    const totalSteps = calculateMinimumSteps([...coordinates]);

    // STEP 4: Successful return
    return {
      success: true,
      coordinates,
      totalSteps
    };

  } catch {
    // Unexpected error handling
    return {
      success: false,
      error: "errors.unexpected"
    };
  }
};

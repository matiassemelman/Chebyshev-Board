/**
 * PERSISTENCE IMPLEMENTATION - INFRASTRUCTURE LAYER
 *
 * Implements CoordinateRepository using browser's localStorage.
 *
 * WHY HERE AND NOT IN DOMAIN?
 * - This class contains specific technical details (localStorage, JSON, etc.)
 * - Domain only knows the interface, not this implementation
 * - We could create FirebaseRepository, APIRepository, etc. without touching domain
 * - Follows Clean Architecture: dependencies point inward
 *
 * IMPLEMENTED ROBUSTNESS:
 * - localStorage might be disabled (private mode, corporate policies)
 * - localStorage might be full (QuotaExceededError)
 * - Data might be corrupted (malformed JSON, incorrect structure)
 * - Zod validation to ensure data integrity
 */

import { z } from 'zod';
import type { Coordinate } from '../../domain/models/Coordinate';
import type { CoordinateRepository } from '../../domain/repositories/CoordinateRepository';

// =============================================================================
// CONFIGURATION AND CONSTANTS
// =============================================================================

/**
 * Unique key to identify our data in localStorage
 * Project prefix to avoid collisions with other applications
 */
const STORAGE_KEY = 'prosumia-coordinates' as const;

// =============================================================================
// VALIDATION SCHEMAS WITH ZOD
// =============================================================================

/**
 * Schema to validate a single coordinate loaded from localStorage
 * Must exactly match our domain model
 */
const CoordinateSchema = z.object({
  x: z.number().int().min(0, "X coordinate must be a non-negative integer"),
  y: z.number().int().min(0, "Y coordinate must be a non-negative integer")
});

/**
 * Schema to validate the complete coordinates array
 * Allows empty arrays (valid case when no data is saved)
 */
const CoordinatesArraySchema = z.array(CoordinateSchema);

// =============================================================================
// REPOSITORY IMPLEMENTATION
// =============================================================================

/**
 * LOCALSTORAGE REPOSITORY FOR COORDINATES
 *
 * Concrete implementation that handles all edge cases:
 * - localStorage disabled
 * - Corrupted or malformed data
 * - Serialization/deserialization errors
 * - Data integrity validation
 */
export class LocalStorageRepository implements CoordinateRepository {

  /**
   * SAVE COORDINATES TO LOCALSTORAGE
   *
   * Safely serializes and persists coordinates.
   *
   * Handled cases:
   * - localStorage disabled: returns false
   * - localStorage full: returns false
   * - Serialization error: returns false
   *
   * @param coordinates - List of coordinates to save
   * @returns Promise that resolves to true if saved successfully
   */
  async save(coordinates: readonly Coordinate[]): Promise<boolean> {
    try {
      // Serialize to JSON string for localStorage
      const serialized = JSON.stringify(coordinates);

      // Try to save - may fail for multiple reasons
      localStorage.setItem(STORAGE_KEY, serialized);

      // If we get here, save was successful
      return true;

    } catch {
      // Possible errors:
      // - localStorage disabled (private mode, policies)
      // - QuotaExceededError (localStorage full)
      // - SecurityError (insecure context)
      // - Any other unexpected error

      // In educational mode we could do console.warn, but in production
      // it's better to fail silently and return false
      return false;
    }
  }

  /**
   * LOAD COORDINATES FROM LOCALSTORAGE
   *
   * Deserializes and validates saved coordinates.
   *
   * Handled cases:
   * - No saved data: returns []
   * - localStorage disabled: returns []
   * - Malformed JSON: returns []
   * - Incorrect structure: returns []
   * - Zod validation fails: returns []
   *
   * @returns Promise with valid coordinates or empty array
   */
  async load(): Promise<readonly Coordinate[]> {
    try {
      // Try to get saved data
      const stored = localStorage.getItem(STORAGE_KEY);

      // If no saved data, return empty array (valid case)
      if (!stored) return [];

      // Parse JSON - may fail if corrupted
      const parsed = JSON.parse(stored);

      // Validate with Zod to ensure data integrity
      // If data doesn't match schema, parse() throws exception
      const validated = CoordinatesArraySchema.parse(parsed);

      // If we get here, data is valid
      return validated;

    } catch {
      // Possible errors:
      // - localStorage disabled
      // - JSON.parse() failed (corrupted data)
      // - Zod validation failed (incorrect structure)
      // - Any other unexpected error

      // In all cases, return empty array as safe fallback
      // This prevents the app from crashing due to corrupted data
      return [];
    }
  }
}
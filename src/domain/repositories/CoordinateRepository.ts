/**
 * REPOSITORY INTERFACE - DOMAIN LAYER
 *
 * WHY IS THE INTERFACE IN DOMAIN BUT IMPLEMENTED IN INFRASTRUCTURE?
 *
 * This is the application of the Dependency Inversion Principle (DIP):
 *
 * 1. PROBLEM WITHOUT DIP:
 *    Domain ← Application ← Infrastructure ← Presentation
 *    Domain would depend on infrastructure (localStorage, API, etc.)
 *    This violates Clean Architecture because domain should be independent.
 *
 * 2. SOLUTION WITH DIP:
 *    Domain (defines interface) ← Application ← Infrastructure (implements interface) ← Presentation
 *    Domain defines WHAT it needs (interface)
 *    Infrastructure defines HOW it does it (implementation)
 *    Dependencies point inward, respecting Clean Architecture.
 *
 * 3. BENEFITS:
 *    - Domain testable without external dependencies
 *    - Easy to change from localStorage to API without touching domain
 *    - Complies with SOLID principles (especially DIP)
 *    - Robust and maintainable architecture
 */

import type { Coordinate } from '../models/Coordinate';

/**
 * PERSISTENCE CONTRACT FOR COORDINATES
 *
 * Defines the operations that the domain needs to persist data.
 * This interface will be implemented in the infrastructure layer,
 * keeping the domain free from specific technical knowledge.
 */
export interface CoordinateRepository {
  /**
   * PERSIST COORDINATES
   *
   * Saves a list of coordinates for future use.
   * Domain doesn't know IF it's localStorage, API, file, etc.
   * It only knows THAT it can save coordinates.
   *
   * @param coordinates - List of coordinates to persist
   * @returns Promise that resolves to true if saved successfully
   */
  save(coordinates: readonly Coordinate[]): Promise<boolean>;

  /**
   * LOAD PERSISTED COORDINATES
   *
   * Retrieves the last saved list of coordinates.
   * If there's no data or an error occurs, returns empty array.
   * Domain doesn't worry about implementation details.
   *
   * @returns Promise with coordinates or empty array if no data
   */
  load(): Promise<readonly Coordinate[]>;
}
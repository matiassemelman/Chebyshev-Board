/**
 * CAPA DE APLICACIÓN: CalculatePathUseCase
 *
 * Orquesta la validación de input del usuario y la lógica de dominio.
 * Esta capa actúa como puente entre la presentación y el dominio,
 * asegurando que los datos lleguen limpios y validados.
 */

import { z } from 'zod';
import type { Coordinate } from '../../domain/models/Coordinate';
import { isValidCoordinate } from '../../domain/models/Coordinate';
import { calculateMinimumSteps } from '../../domain/services/PathCalculator';

// =============================================================================
// SCHEMAS DE VALIDACIÓN CON ZOD
// =============================================================================

/**
 * Schema para validar una coordenada individual
 * Debe ser un objeto con x e y como números enteros no negativos
 */
const CoordinateSchema = z.object({
  x: z.number().int().min(0, "errors.validation.invalidCoordinate"),
  y: z.number().int().min(0, "errors.validation.invalidCoordinate")
}).refine(
  (coord) => isValidCoordinate(coord),
  { message: "errors.validation.invalidCoordinate" }
);

/**
 * Schema para validar un array de coordenadas
 * Debe tener al menos 1 coordenada para ser útil
 */
const CoordinatesArraySchema = z
  .array(CoordinateSchema)
  .min(1, "errors.validation.atLeastOne");

// =============================================================================
// DTOs (DATA TRANSFER OBJECTS)
// =============================================================================

/**
 * Input del use case - lo que recibe desde la capa de presentación
 */
export type CalculatePathInput = {
  readonly coordinatesJson: string;
};

/**
 * Output del use case - lo que devuelve a la capa de presentación
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
// USE CASE PRINCIPAL
// =============================================================================

/**
 * CASO DE USO: Calcular Recorrido Mínimo
 *
 * Orquesta todo el flujo desde input crudo hasta resultado final:
 * 1. Parse del JSON string
 * 2. Validación con Zod
 * 3. Llamada al servicio de dominio
 * 4. Formateo del resultado
 *
 * @param input - JSON string con coordenadas del usuario
 * @returns Resultado exitoso con pasos o error descriptivo
 */
export const calculatePath = (input: CalculatePathInput): CalculatePathOutput => {
  try {
    // PASO 1: Parse del JSON string
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(input.coordinatesJson);
    } catch {
      return {
        success: false,
        error: "errors.validation.invalidJson"
      };
    }

    // PASO 2: Validación con Zod
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

    // PASO 3: Llamada al servicio de dominio
    const coordinates = validationResult.data as readonly Coordinate[];
    const totalSteps = calculateMinimumSteps([...coordinates]);

    // PASO 4: Retorno exitoso
    return {
      success: true,
      coordinates,
      totalSteps
    };

  } catch {
    // Manejo de errores inesperados
    return {
      success: false,
      error: "errors.unexpected"
    };
  }
};

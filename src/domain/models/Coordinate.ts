/**
 * MODELO DE DOMINIO: Coordinate
 *
 * Representa una posición en un tablero 2D para el cálculo de distancias mínimas.
 * Este modelo es el corazón de nuestro algoritmo Chebyshev y debe mantenerse
 * completamente puro sin dependencias externas (Clean Architecture).
 */

// Definimos el tipo principal como readonly para garantizar inmutabilidad
// Esto previene mutaciones accidentales que podrían corromper el estado
export type Coordinate = {
  readonly x: number;
  readonly y: number;
};

/**
 * VALIDACIÓN PURA DE COORDENADAS
 *
 * Valida que una coordenada sea válida para nuestro tablero.
 * Esta función es pura (sin side effects) y se mantiene en dominio
 * porque representa una regla de negocio fundamental.
 *
 * @param coord - La coordenada a validar
 * @returns true si la coordenada es válida, false en caso contrario
 */
export const isValidCoordinate = (coord: Coordinate): boolean => {
  // Verificamos que x e y sean un número entero (no decimal ni NaN)
  const isXValid = Number.isInteger(coord.x) && coord.x >= 0;

  const isYValid = Number.isInteger(coord.y) && coord.y >= 0;

  // Ambas coordenadas deben ser válidas para que el punto sea válido
  return isXValid && isYValid;
};

/**
 * FACTORY FUNCTION PARA CREAR COORDENADAS
 *
 * Patrón Factory que encapsula la creación de coordenadas.
 * Esto nos da control sobre cómo se construyen los objetos
 * y facilita futuras extensiones (ej: validación automática).
 *
 * @param x - Posición horizontal (columna)
 * @param y - Posición vertical (fila)
 * @returns Nueva coordenada inmutable
 */
export const createCoordinate = (x: number, y: number): Coordinate => ({
  x,
  y,
});

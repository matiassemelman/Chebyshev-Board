/**
 * SERVICIO DE DOMINIO: PathCalculator
 *
 * Implementa el algoritmo de distancia Chebyshev para calcular el número
 * mínimo de pasos entre coordenadas en un tablero donde se puede mover
 * en las 8 direcciones (horizontal, vertical y diagonal).
 *
 * La distancia Chebyshev es: max(|dx|, |dy|)
 * Esto es más eficiente que algoritmos de pathfinding como A* o BFS
 * porque aprovechamos que el movimiento diagonal no cuesta extra.
 */

import type { Coordinate } from '../models/Coordinate';

/**
 * CÁLCULO DE DISTANCIA CHEBYSHEV ENTRE DOS PUNTOS
 *
 * Esta es la función core del algoritmo. La distancia Chebyshev
 * representa el número mínimo de pasos para ir de un punto A a un punto B
 * cuando puedes moverte en las 8 direcciones (incluidas diagonales).
 *
 * ¿Por qué max(|dx|, |dy|)?
 * - Si dx=3, dy=2: puedes moverte 2 pasos en diagonal (NE) y 1 paso horizontal (E)
 * - Total: max(3,2) = 3 pasos
 *
 * @param from - Coordenada de origen
 * @param to - Coordenada de destino
 * @returns Número mínimo de pasos entre los dos puntos
 */
export const calculateChebyshevDistance = (from: Coordinate, to: Coordinate): number => {
  // Calculamos la diferencia absoluta en el eje X (horizontal)
  // Math.abs() asegura que siempre sea positivo independientemente de la dirección
  const dx = Math.abs(to.x - from.x);

  // Calculamos la diferencia absoluta en el eje Y (vertical)
  const dy = Math.abs(to.y - from.y);

  // La distancia Chebyshev es el máximo de ambas diferencias
  // Esto representa los pasos mínimos aprovechando el movimiento diagonal
  return Math.max(dx, dy);
};

/**
 * CÁLCULO DE PASOS MÍNIMOS PARA UNA SECUENCIA DE COORDENADAS
 *
 * Dada una lista de coordenadas que deben visitarse EN ORDEN,
 * calcula el total de pasos mínimos para completar el recorrido.
 *
 * Ejemplo: [(0,0), (1,2), (3,1)]
 * - De (0,0) a (1,2): max(|1-0|, |2-0|) = max(1,2) = 2 pasos
 * - De (1,2) a (3,1): max(|3-1|, |1-2|) = max(2,1) = 2 pasos
 * - Total: 2 + 2 = 4 pasos
 *
 * @param coordinates - Array de coordenadas a visitar en orden
 * @returns Número total de pasos mínimos para el recorrido completo
 */
export const calculateMinimumSteps = (coordinates: Coordinate[]): number => {
  // Caso edge: si hay 0 o 1 coordenadas, no hay recorrido que hacer
  if (coordinates.length <= 1) return 0;

  // Acumulador para sumar todos los pasos del recorrido
  let totalSteps = 0;

  // Iteramos desde la segunda coordenada (índice 1) hasta el final
  // En cada iteración calculamos la distancia desde la coordenada anterior
  for (let i = 1; i < coordinates.length; i++) {
    // Coordenada actual (destino del paso)
    const currentCoord = coordinates[i];

    // Coordenada anterior (origen del paso)
    const previousCoord = coordinates[i - 1];

    // Calculamos los pasos entre estas dos coordenadas y los sumamos al total
    totalSteps += calculateChebyshevDistance(previousCoord, currentCoord);
  }

  // Retornamos el total de pasos para completar todo el recorrido
  return totalSteps;
};

/**
 * COMPONENTE: BOARD - CAPA DE PRESENTACIÓN
 *
 * Tablero dinámico que visualiza las coordenadas y el recorrido mínimo.
 * Se adapta automáticamente al tamaño necesario basado en las coordenadas
 * y proporciona una representación visual educativa del algoritmo Chebyshev.
 *
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Grid dinámico que se ajusta a las coordenadas máximas
 * - Numeración de orden de visita en cada coordenada
 * - Colores diferenciados para start, intermediate y end points
 * - Responsive design con TailwindCSS
 * - Información educativa del recorrido
 */

import React from 'react';
import type { Coordinate } from '../../domain/models/Coordinate';
import { usePathContext } from '../context/PathContext';

/**
 * FUNCIÓN HELPER: CALCULAR DIMENSIONES DEL TABLERO
 *
 * Determina el tamaño mínimo del tablero necesario para mostrar
 * todas las coordenadas con un padding visual.
 *
 * @param coordinates - Array de coordenadas a mostrar
 * @returns Objeto con width y height del tablero
 */
const calculateBoardDimensions = (coordinates: readonly Coordinate[]) => {
  if (coordinates.length === 0) {
    return { width: 8, height: 8 }; // Tablero por defecto 8x8
  }

  const maxX = Math.max(...coordinates.map(coord => coord.x));
  const maxY = Math.max(...coordinates.map(coord => coord.y));

  // Añadimos 1 para incluir la coordenada máxima y padding mínimo
  return {
    width: Math.max(maxX + 2, 8),
    height: Math.max(maxY + 2, 8)
  };
};

/**
 * FUNCIÓN HELPER: OBTENER INFORMACIÓN DE CELDA
 *
 * Determina si una celda contiene una coordenada visitada
 * y en qué orden fue visitada.
 *
 * @param x - Coordenada X de la celda
 * @param y - Coordenada Y de la celda
 * @param coordinates - Array de coordenadas del recorrido
 * @returns Información de la celda o null si está vacía
 */
const getCellInfo = (x: number, y: number, coordinates: readonly Coordinate[]) => {
  const index = coordinates.findIndex(coord => coord.x === x && coord.y === y);

  if (index === -1) return null;

  return {
    order: index + 1, // 1-indexed para mostrar al usuario
    isStart: index === 0,
    isEnd: index === coordinates.length - 1,
    isIntermediate: index > 0 && index < coordinates.length - 1
  };
};

/**
 * FUNCIÓN HELPER: OBTENER CLASES CSS DE CELDA
 *
 * Determina las clases CSS apropiadas para una celda
 * basada en su estado (vacía, start, intermediate, end).
 *
 * @param cellInfo - Información de la celda
 * @returns String con las clases CSS
 */
const getCellClasses = (cellInfo: ReturnType<typeof getCellInfo>): string => {
  const baseClasses = 'aspect-square border border-gray-200 flex items-center justify-center text-xs font-bold transition-colors';

  if (!cellInfo) {
    return `${baseClasses} bg-gray-50 hover:bg-gray-100`;
  }

  if (cellInfo.isStart) {
    return `${baseClasses} bg-green-500 text-white shadow-md`;
  }

  if (cellInfo.isEnd) {
    return `${baseClasses} bg-red-500 text-white shadow-md`;
  }

  if (cellInfo.isIntermediate) {
    return `${baseClasses} bg-blue-500 text-white shadow-md`;
  }

  return baseClasses;
};

/**
 * BOARD COMPONENT
 *
 * Componente principal que renderiza el tablero educativo.
 * Se integra con el contexto global para mostrar el estado actual.
 */
export const Board: React.FC = () => {
  const { state } = usePathContext();
  const { coordinates } = state;

  // Calcular dimensiones dinámicas del tablero
  const { width, height } = calculateBoardDimensions(coordinates);

  // Generar array de celdas para el render
  const cells = [];
  for (let y = height - 1; y >= 0; y--) { // Empezamos desde arriba (y mayor)
    for (let x = 0; x < width; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div className="space-y-4">
      {/* TÍTULO Y INFORMACIÓN DEL TABLERO */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          🎯 Visualización del Recorrido
        </h2>
        <div className="text-sm text-gray-600">
          Tablero {width} × {height}
        </div>
      </div>

      {/* LEYENDA DE COLORES */}
      {coordinates.length > 0 && (
        <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Punto Inicial</span>
          </div>
          {coordinates.length > 2 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Puntos Intermedios</span>
            </div>
          )}
          {coordinates.length > 1 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Punto Final</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Celda Vacía</span>
          </div>
        </div>
      )}

      {/* TABLERO PRINCIPAL */}
      <div className="relative">
        <div
          className="grid gap-1 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-sm"
          style={{
            gridTemplateColumns: `repeat(${width}, 1fr)`,
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          {cells.map(({ x, y }) => {
            const cellInfo = getCellInfo(x, y, coordinates);
            const cellClasses = getCellClasses(cellInfo);

            return (
              <div
                key={`${x}-${y}`}
                className={cellClasses}
                title={cellInfo ? `Punto ${cellInfo.order}: (${x}, ${y})` : `(${x}, ${y})`}
              >
                {cellInfo ? cellInfo.order : ''}
              </div>
            );
          })}
        </div>

        {/* COORDENADAS DE REFERENCIA */}
      </div>

      {/* INFORMACIÓN EDUCATIVA DEL RECORRIDO */}
      {coordinates.length > 1 && (
                <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            📚 Análisis del Recorrido
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>Total de coordenadas:</strong> {coordinates.length}
            </p>
            <p>
              <strong>Pasos mínimos (distancia Chebyshev):</strong> {state.totalSteps}
            </p>
            <div>
              <strong>Secuencia de coordenadas:</strong>
              <div className="mt-1 font-mono text-xs bg-white p-2 rounded border">
                {coordinates.map((coord, index) => (
                  <span key={index}>
                    ({coord.x}, {coord.y})
                    {index < coordinates.length - 1 && (
                      <span className="text-blue-500"> → </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-blue-600 italic">
              💡 La distancia Chebyshev permite movimiento diagonal, así que los pasos mínimos
              entre dos puntos es max(|dx|, |dy|).
            </p>
          </div>
        </div>
      )}

      {/* MENSAJE CUANDO NO HAY COORDENADAS */}
      {coordinates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-lg font-medium">No hay coordenadas para mostrar</p>
          <p className="text-sm">Ingresa coordenadas arriba para ver la visualización del recorrido</p>
        </div>
      )}
    </div>
  );
};
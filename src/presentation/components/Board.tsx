/**
 * COMPONENT: BOARD - PRESENTATION LAYER
 *
 * Dynamic board that visualizes coordinates and minimum path.
 * Automatically adapts to the required size based on coordinates
 * and provides an educational visual representation of the Chebyshev algorithm.
 *
 * IMPLEMENTED FEATURES:
 * - Dynamic grid that adjusts to maximum coordinates
 * - Visit order numbering in each coordinate
 * - Different colors for start, intermediate and end points
 * - Responsive design with TailwindCSS
 * - Educational path information
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Coordinate } from '../../domain/models/Coordinate';
import type { Movement } from '../../domain/models/Movement';
import { usePathContext } from '../context/PathContext';
import { StepsList } from './StepsList';

/**
 * HELPER FUNCTION: CALCULATE BOARD DIMENSIONS
 *
 * Determines the minimum board size needed to display
 * all coordinates with visual padding.
 *
 * @param coordinates - Array of coordinates to display
 * @returns Object with board width and height
 */
const calculateBoardDimensions = (coordinates: readonly Coordinate[]) => {
  if (coordinates.length === 0) {
    return { width: 8, height: 8 }; // Default 8x8 board
  }

  const maxX = Math.max(...coordinates.map(coord => coord.x));
  const maxY = Math.max(...coordinates.map(coord => coord.y));

  // Add 1 to include maximum coordinate and minimum padding
  return {
    width: Math.max(maxX + 2, 8),
    height: Math.max(maxY + 2, 8)
  };
};

/**
 * HELPER FUNCTION: GET CELL INFORMATION
 *
 * Determines if a cell contains a visited coordinate
 * and in what order it was visited.
 *
 * @param x - Cell X coordinate
 * @param y - Cell Y coordinate
 * @param coordinates - Array of path coordinates
 * @returns Cell information or null if empty
 */
const getCellInfo = (x: number, y: number, coordinates: readonly Coordinate[]) => {
  const index = coordinates.findIndex(coord => coord.x === x && coord.y === y);

  if (index === -1) return null;

  return {
    order: index + 1, // 1-indexed for user display
    isStart: index === 0,
    isEnd: index === coordinates.length - 1,
    isIntermediate: index > 0 && index < coordinates.length - 1
  };
};

/**
 * HELPER FUNCTION: GET CELL CSS CLASSES
 *
 * Determines the appropriate CSS classes for a cell
 * based on its state (empty, start, intermediate, end).
 *
 * @param cellInfo - Cell information
 * @returns String with CSS classes
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
 * Main component that renders the educational board.
 * Integrates with global context to display current state.
 */
export const Board: React.FC = () => {
  const { state } = usePathContext();
  const { coordinates, movements } = state;
  const { t } = useTranslation();

  // Calculate dynamic board dimensions
  const { width, height } = calculateBoardDimensions(coordinates);

  // Generate cell array for render
  const cells = [];
  for (let y = height - 1; y >= 0; y--) { // Start from top (higher y)
    for (let x = 0; x < width; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div className="space-y-4">
      {/* BOARD TITLE AND INFORMATION */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('board.title')}
        </h2>
        <div className="text-sm text-gray-600">
          {t('board.size', { width, height })}
        </div>
      </div>

      {/* COLOR LEGEND */}
      {coordinates.length > 0 && (
        <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>{t('board.legend.start')}</span>
          </div>
          {coordinates.length > 2 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>{t('board.legend.intermediate')}</span>
            </div>
          )}
          {coordinates.length > 1 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>{t('board.legend.end')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>{t('board.legend.empty')}</span>
          </div>
        </div>
      )}

      {/* MAIN BOARD */}
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
                title={cellInfo ? `Point ${cellInfo.order}: (${x}, ${y})` : `(${x}, ${y})`}
              >
                {cellInfo ? cellInfo.order : ''}
              </div>
            );
          })}
        </div>

        {/* REFERENCE COORDINATES */}
      </div>

      {/* EDUCATIONAL PATH INFORMATION */}
      {coordinates.length > 1 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            {t('board.analysis.title')}
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>{t('board.analysis.totalCoordinates')}:</strong> {coordinates.length}
            </p>
            <p>
              <strong>{t('board.analysis.minSteps')}:</strong> {state.totalSteps}
            </p>
            <div>
              <strong>{t('board.analysis.sequence')}:</strong>
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
              {t('board.analysis.note')}
            </p>
          </div>
        </div>
      )}

      {/* STEPS LIST FOR EXPLANATIONS */}
      {movements.length > 0 && (
        <StepsList
          movements={movements}
          onStepClick={(movement: Movement) => {
            // This will be handled by HomePage
            window.dispatchEvent(new CustomEvent('stepClick', { detail: movement }));
          }}
        />
      )}

      {/* MESSAGE WHEN NO COORDINATES */}
      {coordinates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-lg font-medium">{t('board.noCoordinates.title')}</p>
          <p className="text-sm">{t('board.noCoordinates.description')}</p>
        </div>
      )}
    </div>
  );
};
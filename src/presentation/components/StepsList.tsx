import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Movement } from '../../domain/models/Movement';

interface StepsListProps {
  readonly movements: readonly Movement[];
  readonly onStepClick: (movement: Movement) => void;
}

const getDirectionIcon = (direction: Movement['direction']): string => {
  const icons = {
    N: '↑', NE: '↗', E: '→', SE: '↘',
    S: '↓', SW: '↙', W: '←', NW: '↖'
  };
  return icons[direction];
};

export const StepsList: React.FC<StepsListProps> = ({ movements, onStepClick }) => {
  const { t } = useTranslation();

  if (movements.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">
        {t('steps.title')}
      </h3>
      <div className="space-y-2">
        {movements.map((movement) => (
          <button
            key={`${movement.from.x}-${movement.from.y}-${movement.to.x}-${movement.to.y}`}
            onClick={() => onStepClick(movement)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{getDirectionIcon(movement.direction)}</span>
              <div>
                <div className="font-medium text-gray-900">
                  {t('steps.step')} {movement.stepNumber}: {movement.direction}
                </div>
                <div className="text-sm text-gray-600">
                  ({movement.from.x},{movement.from.y}) → ({movement.to.x},{movement.to.y})
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
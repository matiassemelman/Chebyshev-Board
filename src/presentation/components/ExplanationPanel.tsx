import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Movement } from '../../domain/models/Movement';

interface ExplanationPanelProps {
  readonly movement: Movement | null;
  readonly explanation: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onClose: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  movement,
  explanation,
  isLoading,
  error,
  onClose
}) => {
  const { t } = useTranslation();

  if (!movement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('explanation.title')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="font-medium text-blue-900">
            {t('steps.step')} {movement.stepNumber}: {movement.direction}
          </div>
          <div className="text-sm text-blue-700">
            ({movement.from.x},{movement.from.y}) → ({movement.to.x},{movement.to.y})
          </div>
        </div>

        <div className="mb-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              {t('explanation.loading')}
            </div>
          )}

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg">
              {t('explanation.error')}: {error}
            </div>
          )}

          {explanation && !isLoading && (
            <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {explanation}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};
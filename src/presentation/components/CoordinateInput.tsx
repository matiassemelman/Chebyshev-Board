/**
 * COMPONENTE: COORDINATE INPUT - CAPA DE PRESENTACIÓN
 *
 * Componente para entrada de coordenadas con validación visual.
 * Proporciona feedback inmediato al usuario sobre la validez del JSON
 * y conecta directamente con el contexto global de la aplicación.
 *
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Validación JSON en tiempo real
 * - Feedback visual (verde/rojo en border)
 * - Integración seamless con PathContext
 * - Manejo de errores user-friendly
 * - Ejemplo predeterminado
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePathContext } from '../context/PathContext';

/**
 * FUNCIÓN HELPER: VALIDAR JSON
 *
 * Valida si un string es JSON válido sin usar try/catch
 * en el render (mejor performance y predictibilidad).
 *
 * @param jsonString - String a validar
 * @returns true si es JSON válido, false en caso contrario
 */
const isValidJSON = (jsonString: string): boolean => {
  if (!jsonString.trim()) return false;

  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

/**
 * COORDINATE INPUT COMPONENT
 *
 * Componente controlado que maneja la entrada de coordenadas.
 * Se integra con el contexto global para estado reactivo.
 */
export const CoordinateInput: React.FC = () => {
  const { state, dispatch, calculateMinimumPath } = usePathContext();
  const { t } = useTranslation();

  /**
   * HANDLER: CAMBIO EN EL TEXTAREA
   *
   * Actualiza el estado global cada vez que el usuario escribe.
   * La validación visual se maneja en el render basada en el estado.
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    dispatch({ type: 'SET_COORDINATES_JSON', payload: value });
  };

  /**
   * HANDLER: CALCULAR PATH
   *
   * Ejecuta el cálculo solo si el JSON es válido.
   * El loading state se maneja automáticamente en el contexto.
   */
  const handleCalculate = () => {
    if (isValidJSON(state.coordinatesJson)) {
      calculateMinimumPath();
    }
  };

  /**
   * HANDLER: CARGAR EJEMPLO
   *
   * Carga un ejemplo educativo para que el usuario entienda el formato.
   */
  const handleLoadExample = () => {
    const exampleCoordinates = JSON.stringify([
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 1, y: 3 }
    ], null, 2);

    dispatch({ type: 'SET_COORDINATES_JSON', payload: exampleCoordinates });
  };

  // Determinar estado visual basado en validación
  const jsonIsValid = isValidJSON(state.coordinatesJson);
  const showValidation = state.coordinatesJson.trim().length > 0;

  // Clases CSS dinámicas para feedback visual
  const textareaClasses = [
    'w-full p-4 border-2 rounded-lg font-mono text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    showValidation
      ? (jsonIsValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
      : 'border-gray-300 bg-white'
  ].join(' ');

  return (
    <div className="space-y-4">
      {/* TÍTULO DE LA SECCIÓN */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('coordinateInput.title')}
        </h2>
        <button
          onClick={handleLoadExample}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          type="button"
        >
          {t('coordinateInput.loadExample')}
        </button>
      </div>

      {/* TEXTAREA PARA JSON */}
      <div className="relative">
        <textarea
          value={state.coordinatesJson}
          onChange={handleInputChange}
          placeholder={t('coordinateInput.placeholder')}
          rows={8}
          className={textareaClasses}
          disabled={state.isLoading}
        />

        {/* INDICADOR VISUAL DE VALIDACIÓN */}
                  {showValidation && (
          <div className="absolute top-2 right-2">
            {jsonIsValid ? (
              <span className="text-green-600 text-lg" title={t('coordinateInput.validation.validJson')}>✓</span>
            ) : (
              <span className="text-red-600 text-lg" title={t('coordinateInput.validation.invalidJson')}>✗</span>
            )}
          </div>
        )}
      </div>

      {/* INFORMACIÓN EDUCATIVA */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        💡 <strong>{t('coordinateInput.formatInfo')}</strong>
      </div>

      {/* BOTÓN DE CÁLCULO */}
      <button
        onClick={handleCalculate}
        disabled={!jsonIsValid || state.isLoading}
        className={[
          'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          jsonIsValid && !state.isLoading
            ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ].join(' ')}
        type="button"
      >
        {state.isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('coordinateInput.calculatingButton')}
          </span>
        ) : (
          t('coordinateInput.calculateButton')
        )}
      </button>

      {/* MOSTRAR ERRORES SI EXISTEN */}
      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <span className="text-red-600 text-lg mr-2">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-red-800">{t('errors.title')}</h3>
              <p className="text-sm text-red-700 mt-1">{t(state.error)}</p>
            </div>
          </div>
        </div>
      )}

      {/* MOSTRAR RESULTADO SI EXISTE */}
      {state.coordinates.length > 0 && !state.error && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-600 text-lg mr-2">✅</span>
            <div>
              <h3 className="text-sm font-medium text-green-800">
                {t('results.title')}
              </h3>
              <p className="text-sm text-green-700 mt-1">
                <strong>{t('results.steps')}:</strong> {state.totalSteps}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {t('results.pathFor', { count: state.coordinates.length })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
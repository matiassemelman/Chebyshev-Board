/**
 * CONTEXTO GLOBAL DE ESTADO - CAPA DE PRESENTACIÓN
 *
 * Maneja el estado completo de la aplicación de visualización de paths.
 * Utiliza useReducer para estado complejo relacionado y se integra con
 * la capa de infraestructura para persistencia.
 *
 * ¿POR QUÉ CONTEXT + USEREDUCER EN LUGAR DE USESTATE?
 * - Múltiples valores de estado relacionados (coordenadas, pasos, error, carga)
 * - Transiciones de estado complejas que necesitan ser atómicas
 * - Actualizaciones de estado predecibles a través de acciones
 * - Mejores capacidades de depuración y pruebas
 * - Separación de responsabilidades: reducer maneja el "cómo", componentes manejan el "qué"
 */

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Coordinate } from '../../domain/models/Coordinate';
import { LocalStorageRepository } from '../../infrastructure/persistence/LocalStorageRepository';
import { calculatePath } from '../../application/usecases/CalculatePathUseCase';

// =============================================================================
// DEFINICIÓN DEL ESTADO
// =============================================================================

/**
 * Estado global de la aplicación de pathfinding
 * Immutable por diseño - todas las propiedades son readonly
 */
export interface PathState {
  readonly coordinates: readonly Coordinate[];
  readonly totalSteps: number;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly coordinatesJson: string;
}

/**
 * Estado inicial de la aplicación
 * Valores seguros y predecibles para el inicio
 */
const initialState: PathState = {
  coordinates: [],
  totalSteps: 0,
  error: null,
  isLoading: false,
  coordinatesJson: '[]'
};

// =============================================================================
// DEFINICIÓN DE ACCIONES
// =============================================================================

/**
 * Acciones disponibles para modificar el estado
 * Siguiendo patrón Redux para predictibilidad
 */
export type PathAction =
  | { type: 'SET_COORDINATES_JSON'; payload: string }
  | { type: 'CALCULATE_START' }
  | { type: 'CALCULATE_SUCCESS'; payload: { coordinates: readonly Coordinate[]; totalSteps: number } }
  | { type: 'CALCULATE_ERROR'; payload: string }
  | { type: 'LOAD_FROM_STORAGE'; payload: readonly Coordinate[] };

// =============================================================================
// IMPLEMENTACIÓN DEL REDUCER
// =============================================================================

/**
 * REDUCER PURO PARA MANEJO DE ESTADO
 *
 * Implementa todas las transiciones de estado de forma predecible.
 * Cada acción produce un nuevo estado inmutable.
 *
 * @param state - Estado actual
 * @param action - Acción a ejecutar
 * @returns Nuevo estado inmutable
 */
const pathReducer = (state: PathState, action: PathAction): PathState => {
  switch (action.type) {
    case 'SET_COORDINATES_JSON':
      return {
        ...state,
        coordinatesJson: action.payload,
        error: null // Limpiar errores previos cuando el usuario escribe
      };

    case 'CALCULATE_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'CALCULATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        coordinates: action.payload.coordinates,
        totalSteps: action.payload.totalSteps,
        error: null
      };

    case 'CALCULATE_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        coordinates: action.payload,
        coordinatesJson: JSON.stringify(action.payload, null, 2)
      };

    default:
      return state;
  }
};

// =============================================================================
// CREACIÓN DEL CONTEXTO
// =============================================================================

/**
 * Contexto que expone el estado y las acciones
 * Incluye tanto el estado como el dispatch para las acciones
 */
interface PathContextValue {
  readonly state: PathState;
  readonly dispatch: React.Dispatch<PathAction>;
  readonly calculateMinimumPath: () => void;
}

const PathContext = createContext<PathContextValue | null>(null);

// =============================================================================
// COMPONENTE PROVIDER
// =============================================================================

/**
 * PROVIDER DEL CONTEXTO DE PATH
 *
 * Componente que provee el estado global a toda la aplicación.
 * Se encarga de:
 * - Inicializar el reducer
 * - Cargar datos persistidos al montar
 * - Persistir cambios automáticamente
 * - Exponer funciones helper para las acciones comunes
 */
interface PathProviderProps {
  readonly children: ReactNode;
}

export const PathProvider: React.FC<PathProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(pathReducer, initialState);
  const repository = new LocalStorageRepository();

  /**
   * EFECTO: CARGAR DATOS PERSISTIDOS AL MONTAR
   *
   * Se ejecuta una sola vez al montar el componente
   * para restaurar el estado desde localStorage
   */
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedCoordinates = await repository.load();
        if (savedCoordinates.length > 0) {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedCoordinates });
        }
      } catch (error) {
        // Si falla la carga, continuamos con estado inicial
        // No mostramos error porque no es crítico
        console.warn('Error al cargar coordenadas persistidas:', error);
      }
    };

    loadPersistedData();
  }, []);

  /**
   * EFECTO: PERSISTIR COORDENADAS CUANDO CAMBIAN
   *
   * Cada vez que las coordenadas cambian exitosamente,
   * las guardamos en localStorage para la próxima sesión
   */
  useEffect(() => {
    const persistCoordinates = async () => {
      if (state.coordinates.length > 0) {
        try {
          await repository.save(state.coordinates);
        } catch (error) {
          console.warn('Error al persistir coordenadas:', error);
        }
      }
    };

    persistCoordinates();
  }, [state.coordinates]);

  /**
   * FUNCIÓN HELPER: CALCULAR PATH MÍNIMO
   *
   * Encapsula la lógica de cálculo integrando con el caso de uso.
   * Maneja el flujo completo: carga → cálculo → resultado/error
   */
  const calculateMinimumPath = () => {
    dispatch({ type: 'CALCULATE_START' });

    try {
      const result = calculatePath({ coordinatesJson: state.coordinatesJson });

      if (result.success) {
        dispatch({
          type: 'CALCULATE_SUCCESS',
          payload: {
            coordinates: result.coordinates,
            totalSteps: result.totalSteps
          }
        });
      } else {
        dispatch({ type: 'CALCULATE_ERROR', payload: result.error });
      }
    } catch {
      dispatch({
        type: 'CALCULATE_ERROR',
        payload: 'Ocurrió un error inesperado durante el cálculo'
      });
    }
  };

  // Valor del contexto que se expone a los componentes
  const contextValue: PathContextValue = {
    state,
    dispatch,
    calculateMinimumPath
  };

  return (
    <PathContext.Provider value={contextValue}>
      {children}
    </PathContext.Provider>
  );
};

// =============================================================================
// HOOK PERSONALIZADO PARA CONSUMIR EL CONTEXTO
// =============================================================================

/**
 * HOOK PERSONALIZADO PARA CONSUMIR EL CONTEXTO
 *
 * Proporciona una API limpia y type-safe para acceder al estado global.
 * Incluye validación automática de que el hook se use dentro del Provider.
 *
 * @returns Estado y funciones del contexto de path
 * @throws Error si se usa fuera del PathProvider
 */
export const usePathContext = (): PathContextValue => {
  const context = useContext(PathContext);

  if (!context) {
    throw new Error(
      'usePathContext debe ser usado dentro de un PathProvider. ' +
      'Asegúrate de envolver tu árbol de componentes con <PathProvider>.'
    );
  }

  return context;
};
/**
 * GLOBAL STATE CONTEXT - PRESENTATION LAYER
 *
 * Manages the complete state of the path visualization application.
 * Uses useReducer for complex related state and integrates with
 * the infrastructure layer for persistence.
 *
 * WHY CONTEXT + USEREDUCER INSTEAD OF USESTATE?
 * - Multiple related state values (coordinates, steps, error, loading)
 * - Complex state transitions that need to be atomic
 * - Predictable state updates through actions
 * - Better debugging and testing capabilities
 * - Separation of concerns: reducer handles the "how", components handle the "what"
 */

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Coordinate } from '../../domain/models/Coordinate';
import { LocalStorageRepository } from '../../infrastructure/persistence/LocalStorageRepository';
import { calculatePath } from '../../application/usecases/CalculatePathUseCase';

// =============================================================================
// STATE DEFINITION
// =============================================================================

/**
 * Global state of the pathfinding application
 * Immutable by design - all properties are readonly
 */
export interface PathState {
  readonly coordinates: readonly Coordinate[];
  readonly totalSteps: number;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly coordinatesJson: string;
}

/**
 * Initial application state
 * Safe and predictable values for startup
 */
const initialState: PathState = {
  coordinates: [],
  totalSteps: 0,
  error: null,
  isLoading: false,
  coordinatesJson: '[]'
};

// =============================================================================
// ACTION DEFINITIONS
// =============================================================================

/**
 * Available actions to modify the state
 * Following Redux pattern for predictability
 */
export type PathAction =
  | { type: 'SET_COORDINATES_JSON'; payload: string }
  | { type: 'CALCULATE_START' }
  | { type: 'CALCULATE_SUCCESS'; payload: { coordinates: readonly Coordinate[]; totalSteps: number } }
  | { type: 'CALCULATE_ERROR'; payload: string }
  | { type: 'LOAD_FROM_STORAGE'; payload: readonly Coordinate[] };

// =============================================================================
// REDUCER IMPLEMENTATION
// =============================================================================

/**
 * PURE REDUCER FOR STATE MANAGEMENT
 *
 * Implements all state transitions in a predictable way.
 * Each action produces a new immutable state.
 *
 * @param state - Current state
 * @param action - Action to execute
 * @returns New immutable state
 */
const pathReducer = (state: PathState, action: PathAction): PathState => {
  switch (action.type) {
    case 'SET_COORDINATES_JSON':
      return {
        ...state,
        coordinatesJson: action.payload,
        error: null // Clear previous errors when user types
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
// CONTEXT CREATION
// =============================================================================

/**
 * Context that exposes state and actions
 * Includes both state and dispatch for actions
 */
interface PathContextValue {
  readonly state: PathState;
  readonly dispatch: React.Dispatch<PathAction>;
  readonly calculateMinimumPath: () => void;
}

const PathContext = createContext<PathContextValue | null>(null);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

/**
 * PATH CONTEXT PROVIDER
 *
 * Component that provides global state to the entire application.
 * Handles:
 * - Reducer initialization
 * - Loading persisted data on mount
 * - Automatic persistence of changes
 * - Exposing helper functions for common actions
 */
interface PathProviderProps {
  readonly children: ReactNode;
}

export const PathProvider: React.FC<PathProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(pathReducer, initialState);
  const repository = new LocalStorageRepository();

  /**
   * EFFECT: LOAD PERSISTED DATA ON MOUNT
   *
   * Runs only once when the component mounts
   * to restore state from localStorage
   */
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedCoordinates = await repository.load();
        if (savedCoordinates.length > 0) {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedCoordinates });
        }
      } catch (error) {
        // If loading fails, continue with initial state
        // No error shown as it's not critical
        console.warn('Error loading persisted coordinates:', error);
      }
    };

    loadPersistedData();
  }, []);

  /**
   * EFFECT: PERSIST COORDINATES WHEN THEY CHANGE
   *
   * Every time coordinates change successfully,
   * we save them to localStorage for the next session
   */
  useEffect(() => {
    const persistCoordinates = async () => {
      if (state.coordinates.length > 0) {
        try {
          await repository.save(state.coordinates);
        } catch (error) {
          console.warn('Error persisting coordinates:', error);
        }
      }
    };

    persistCoordinates();
  }, [state.coordinates]);

  /**
   * HELPER FUNCTION: CALCULATE MINIMUM PATH
   *
   * Encapsulates calculation logic integrating with the use case.
   * Handles the complete flow: loading → calculation → result/error
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
        payload: 'An unexpected error occurred during calculation'
      });
    }
  };

  // Context value exposed to components
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
// CUSTOM HOOK FOR CONSUMING THE CONTEXT
// =============================================================================

/**
 * CUSTOM HOOK FOR CONSUMING THE CONTEXT
 *
 * Provides a clean and type-safe API to access global state.
 * Includes automatic validation to ensure the hook is used within the Provider.
 *
 * @returns State and functions of the path context
 * @throws Error if used outside the PathProvider
 */
export const usePathContext = (): PathContextValue => {
  const context = useContext(PathContext);

  if (!context) {
    throw new Error(
      'usePathContext must be used within a PathProvider. ' +
      'Ensure you wrap your component tree with <PathProvider>.'
    );
  }

  return context;
};
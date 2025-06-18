📋 Plan Detallado
Paso 1: Domain Layer - Movement Model
Archivos a crear:
src/domain/models/Movement.ts (nuevo)
src/domain/services/MovementCalculator.ts (nuevo)
Cambios exactos:
// Movement.ts - Modelo inmutable para direcciones
export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
export type Movement = {
  readonly from: Coordinate;
  readonly to: Coordinate;
  readonly direction: Direction;
  readonly stepNumber: number;
};

// MovementCalculator.ts - Pure functions para descomponer paths
export const calculateMovements = (coordinates: readonly Coordinate[]): readonly Movement[]
export const getDirectionBetweenPoints = (from: Coordinate, to: Coordinate): Direction

Paso 2: Domain Layer - LLM Repository Interface
Archivos a crear:
src/domain/repositories/ExplanationRepository.ts (nuevo)
Cambios exactos:
export interface ExplanationRepository {
  getExplanation(movement: Movement, language: string): Promise<string | null>;
  cacheExplanation(movement: Movement, language: string, explanation: string): Promise<void>;
}
Commit: feat: add ExplanationRepository interface for LLM cache

Paso 3: Infrastructure Layer - Groq Client
Archivos a crear:
src/infrastructure/llm/GroqClient.ts (nuevo)
src/infrastructure/persistence/ExplanationCacheRepository.ts (nuevo)
Cambios exactos:
// GroqClient.ts
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export class GroqClient {
  async generateExplanation(movement: Movement, language: string): Promise<string>
}

// ExplanationCacheRepository.ts - Implementa ExplanationRepository
export class ExplanationCacheRepository implements ExplanationRepository {
  // localStorage con TTL pattern como LocalStorageRepository existente
}
Dependencias nuevas:
npm i @ai-sdk/groq

Paso 4: Application Layer - Use Case
Archivos a crear:
src/application/usecases/GetStepExplanationUseCase.ts (nuevo)
Cambios exactos:
export type GetExplanationInput = {
  readonly movement: Movement;
  readonly language: string;
};

export type GetExplanationOutput = {
  readonly success: true;
  readonly explanation: string;
  readonly cached: boolean;
} | {
  readonly success: false;
  readonly error: string;
};

export const getStepExplanation = async (
  input: GetExplanationInput,
  repository: ExplanationRepository,
  groqClient: GroqClient
): Promise<GetExplanationOutput>

Paso 5: Presentation Layer - Extend PathContext
Archivo a modificar:
src/presentation/context/PathContext.tsx (líneas 29-45 para state, 57-65 para actions)
Cambios exactos:
// Agregar a PathState (línea ~35)
readonly movements: readonly Movement[];
readonly explanationMode: boolean;

// Agregar a PathAction (línea ~60)
| { type: 'ENABLE_EXPLANATION_MODE' }
| { type: 'DISABLE_EXPLANATION_MODE' }
| { type: 'SET_MOVEMENTS'; payload: readonly Movement[] }

// Agregar case en reducer (línea ~95)
case 'ENABLE_EXPLANATION_MODE':
  return { ...state, explanationMode: true };

Paso 6: Presentation Layer - StepsList Component
Archivo a crear:
src/presentation/components/StepsList.tsx (nuevo)
Cambios exactos:
interface StepsListProps {
  readonly movements: readonly Movement[];
  readonly onStepClick: (movement: Movement) => void;
}

export const StepsList: React.FC<StepsListProps> = ({ movements, onStepClick }) => {
  // Lista clicable de movimientos con iconos direccionales
  // Formato: "Step 1: NE from (0,0) to (1,1)"
}

Paso 7: Presentation Layer - ExplanationPanel Component
Archivo a crear:
src/presentation/components/ExplanationPanel.tsx (nuevo)
Cambios exactos:
interface ExplanationPanelProps {
  readonly movement: Movement | null;
  readonly explanation: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onClose: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = (props) => {
  // Drawer lateral o tooltip con explicación LLM
  // Skeleton loader durante carga
  // Error fallback a explicación estática
}

Paso 8: Presentation Layer - Integration
Archivo a modificar:
src/presentation/components/Board.tsx (agregar StepsList después de línea 200)
src/presentation/pages/HomePage.tsx (agregar ExplanationPanel)
Cambios exactos:
// En Board.tsx después del analysis section
{state.explanationMode && state.movements.length > 0 && (
  <StepsList movements={state.movements} onStepClick={handleStepClick} />
)}

// En HomePage.tsx
<ExplanationPanel
  movement={selectedMovement}
  explanation={currentExplanation}
  isLoading={isLoadingExplanation}
  error={explanationError}
  onClose={handleCloseExplanation}
/>

Paso 9: i18n - Translation Keys
Archivos a modificar:
public/locales/en/translation.json (agregar sección "explanations")
public/locales/es/translation.json (agregar sección "explanations")
Cambios exactos:
"explanations": {
  "enableMode": "Enable Explanations",
  "disableMode": "Disable Explanations",
  "stepTitle": "Step {{number}}: {{direction}}",
  "loading": "Generating explanation...",
  "error": "Failed to generate explanation",
  "cached": "Cached explanation"
}

Paso 10: Environment & Final Integration
Archivos a modificar:
.env.example (agregar VITE_GROQ_API_KEY)
src/presentation/context/PathContext.tsx (integrar MovementCalculator)
Cambios exactos:
// En calculateMinimumPath function (línea ~210)
if (result.success) {
  const movements = calculateMovements(result.coordinates);
  dispatch({
    type: 'CALCULATE_SUCCESS',
    payload: {
      coordinates: result.coordinates,
      totalSteps: result.totalSteps,
      movements // Nuevo campo
    }
  });
}

✅ Checklist Problema ↔ Solución
P1: No existen movimientos individuales → Resuelto vía Paso 1 (Movement model + MovementCalculator)
P2: No hay interfaz para explicaciones → Resuelto vía Paso 2 (ExplanationRepository interface)
P3: Falta integración Groq API → Resuelto vía Paso 3 (GroqClient + cache repository)
P4: No hay orchestración LLM → Resuelto vía Paso 4 (GetStepExplanation use case)
P5: Estado no maneja explanations → Resuelto vía Paso 5 (PathContext extension)
P6: No hay UI para pasos clicables → Resuelto vía Paso 6 (StepsList component)
P7: Falta panel de explicaciones → Resuelto vía Paso 7 (ExplanationPanel component)
P8: No hay integración en UI principal → Resuelto vía Paso 8 (Board + HomePage integration)
P9: Faltan traducciones → Resuelto vía Paso 9 (i18n keys para explanations)
P10: Falta configuración final → Resuelto vía Paso 10 (Environment + integration completa)
🎯 Resultado final: Feature LLM completamente funcional manteniendo Clean Architecture, con cache local, error handling robusto, UI no invasiva y soporte multiidioma.
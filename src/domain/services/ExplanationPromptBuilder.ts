import type { Movement } from '../models/Movement';

export type MovementType = 'diagonal' | 'linear' | 'mixed';

export type EducationalContext = {
  readonly dx: number;
  readonly dy: number;
  readonly chebyshevDistance: number;
  readonly movementType: MovementType;
  readonly explanation: string;
  readonly formula: string;
};

export const buildEducationalContext = (movement: Movement): EducationalContext => {
  const dx = Math.abs(movement.to.x - movement.from.x);
  const dy = Math.abs(movement.to.y - movement.from.y);
  const chebyshevDistance = Math.max(dx, dy);

  // Classify movement type for specialized explanations
  const movementType: MovementType =
    dx === dy && dx > 0 ? 'diagonal' :
    (dx === 0 || dy === 0) ? 'linear' : 'mixed';

  // Generate specific educational explanation
  const explanation = generateMovementExplanation(dx, dy, movementType);

  return {
    dx,
    dy,
    chebyshevDistance,
    movementType,
    explanation,
    formula: `max(|${dx}|, |${dy}|) = ${chebyshevDistance}`
  };
};

const generateMovementExplanation = (dx: number, dy: number, type: MovementType): string => {
  switch (type) {
    case 'diagonal':
      return `This diagonal movement reduces both x and y coordinates by ${dx} simultaneously, requiring only ${dx} step(s) instead of ${dx + dy} separate moves.`;
    case 'linear':
      return `This linear movement changes only one coordinate, requiring exactly ${Math.max(dx, dy)} step(s) along a single axis.`;
    case 'mixed':
      return `This mixed movement combines ${Math.min(dx, dy)} diagonal step(s) plus ${Math.abs(dx - dy)} linear step(s), totaling ${Math.max(dx, dy)} steps.`;
  }
};
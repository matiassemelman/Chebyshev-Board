import type { Movement } from '../models/Movement';

export interface ExplanationRepository {
  getExplanation(movement: Movement, language: string): Promise<string | null>;
  cacheExplanation(movement: Movement, language: string, explanation: string): Promise<void>;
}
import type { Movement } from '../../domain/models/Movement';
import type { ExplanationRepository } from '../../domain/repositories/ExplanationRepository';
import { GroqClient } from '../../infrastructure/llm/GroqClient';

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
  repository: ExplanationRepository
): Promise<GetExplanationOutput> => {
  try {
    // Try cache first
    const cachedExplanation = await repository.getExplanation(input.movement, input.language);

    if (cachedExplanation) {
      return {
        success: true,
        explanation: cachedExplanation,
        cached: true
      };
    }

    // Generate new explanation
    const groqClient = new GroqClient();
    const explanation = await groqClient.generateExplanation(input.movement, input.language);

    // Cache for future use
    await repository.cacheExplanation(input.movement, input.language, explanation);

    return {
      success: true,
      explanation,
      cached: false
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate explanation'
    };
  }
};
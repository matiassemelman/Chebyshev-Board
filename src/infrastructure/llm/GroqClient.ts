import { generateText, wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import type { Movement } from '../../domain/models/Movement';

export class GroqClient {
  private readonly groqProvider;
  private readonly enhancedModel;

  constructor() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GROQ_API_KEY environment variable is required');
    }

    // Create Groq provider with explicit API key
    this.groqProvider = createGroq({
      apiKey: apiKey
    });

    // Enhanced model with reasoning middleware to extract <think> tags
    this.enhancedModel = wrapLanguageModel({
      model: this.groqProvider('deepseek-r1-distill-llama-70b'),
      middleware: extractReasoningMiddleware({
        tagName: 'think',
      }),
    });
  }

  async generateExplanation(movement: Movement, language: string): Promise<string> {
    const prompt = this.buildPrompt(movement, language);

    // Using enhanced model with reasoning middleware
    const { text } = await generateText({
      model: this.enhancedModel,
      prompt,
      maxTokens: 1024, // Reduced for concise explanations
      temperature: 0.6, // Groq best practice for reasoning models
    });

    // Return clean text (reasoning already extracted by middleware)
    return text.trim();
  }

  private buildPrompt(movement: Movement, language: string): string {
    const templates = {
      en: `You must respond ONLY in English. Explain in simple, educational terms why moving from (${movement.from.x},${movement.from.y}) to (${movement.to.x},${movement.to.y}) in direction ${movement.direction} is optimal for Chebyshev distance. Give a direct, concise answer without thinking process. Maximum 40 words.`,
      es: `Debes responder ÚNICAMENTE en español. Explica de forma simple y educativa por qué moverse de (${movement.from.x},${movement.from.y}) a (${movement.to.x},${movement.to.y}) en dirección ${movement.direction} es óptimo para la distancia Chebyshev. Da una respuesta directa y concisa sin proceso de pensamiento. Máximo 40 palabras.`
    };

    return templates[language as keyof typeof templates] || templates.en;
  }
}
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
      maxTokens: 1024, // Reduced for simpler explanations
      temperature: 0.7, // Slightly higher for more natural language
    });

    // Return clean text (reasoning already extracted by middleware)
    return text.trim();
  }

  private buildPrompt(movement: Movement, language: string): string {
    // Calculate simple movement distances
    const dx = Math.abs(movement.to.x - movement.from.x);
    const dy = Math.abs(movement.to.y - movement.from.y);

    const templates = {
      en: `You are a friendly tutor helping a high school student understand how a chess king moves on a board.

SITUATION: Moving from (${movement.from.x},${movement.from.y}) to (${movement.to.x},${movement.to.y})

Think of this like a chess king that can move in any direction: up, down, left, right, or diagonally.

- We need to move ${dx} spaces horizontally and ${dy} spaces vertically
- The smart move is "${movement.direction}" because...

EXPLAIN LIKE I'M 15: Why is this single move the best choice? Use simple language, think of it like giving directions to a friend. Focus on why moving diagonally is often smarter than moving in separate steps.

Keep it under 150 simple words. No math formulas or technical terms.`,

      es: `Eres un tutor amigable ayudando a un estudiante de secundaria a entender cómo se mueve un rey de ajedrez en un tablero.

SITUACIÓN: Moviéndose de (${movement.from.x},${movement.from.y}) a (${movement.to.x},${movement.to.y})

Piensa en esto como un rey de ajedrez que puede moverse en cualquier dirección: arriba, abajo, izquierda, derecha, o en diagonal.

- Necesitamos movernos ${dx} espacios horizontalmente y ${dy} espacios verticalmente
- La jugada inteligente es "${movement.direction}" porque...

EXPLICA COMO SI TUVIERA 15 AÑOS: ¿Por qué este movimiento es la mejor opción? Usa lenguaje simple, piénsalo como dar indicaciones a un amigo. Enfócate en por qué moverse en diagonal es a menudo más inteligente que moverse en pasos separados.

Máximo 150 palabras simples. Sin fórmulas matemáticas o términos técnicos.`
    };

    return templates[language as keyof typeof templates] || templates.en;
  }
}
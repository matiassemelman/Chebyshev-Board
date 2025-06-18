import type { Movement } from '../../domain/models/Movement';
import type { ExplanationRepository } from '../../domain/repositories/ExplanationRepository';

const CACHE_KEY = 'prosumia-explanations';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

type CacheEntry = {
  explanation: string;
  timestamp: number;
};

export class ExplanationCacheRepository implements ExplanationRepository {

  async getExplanation(movement: Movement, language: string): Promise<string | null> {
    try {
      const key = this.buildCacheKey(movement, language);
      const stored = localStorage.getItem(`${CACHE_KEY}-${key}`);

      if (!stored) return null;

      const entry: CacheEntry = JSON.parse(stored);
      const isExpired = Date.now() - entry.timestamp > CACHE_TTL;

      if (isExpired) {
        localStorage.removeItem(`${CACHE_KEY}-${key}`);
        return null;
      }

      return entry.explanation;
    } catch {
      return null;
    }
  }

  async cacheExplanation(movement: Movement, language: string, explanation: string): Promise<void> {
    try {
      const key = this.buildCacheKey(movement, language);
      const entry: CacheEntry = {
        explanation,
        timestamp: Date.now()
      };

      localStorage.setItem(`${CACHE_KEY}-${key}`, JSON.stringify(entry));
    } catch {
      // Fail silently on cache errors
    }
  }

  private buildCacheKey(movement: Movement, language: string): string {
    return `${movement.from.x},${movement.from.y}-${movement.to.x},${movement.to.y}-${movement.direction}-${language}`;
  }
}
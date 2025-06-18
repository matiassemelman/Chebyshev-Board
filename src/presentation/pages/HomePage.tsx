/**
 * MAIN PAGE - PRESENTATION LAYER
 *
 * Composes the specific functionality of the pathfinding visualizer.
 * Handles the educational structure and layout of the application.
 *
 * RESPONSIBILITIES:
 * - Compose CoordinateInput and Board in responsive layout
 * - Provide cohesive educational structure
 * - Handle specific application visual flow
 * - Maintain separation of concerns within presentation
 *
 * WHY SEPARATED FROM APP.tsx?
 * - App.tsx = infrastructure (providers, global configuration)
 * - HomePage.tsx = specific presentation logic
 * - Facilitates scalability (multiple pages in the future)
 * - Respects Clean Architecture: separation of concerns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CoordinateInput } from '../components/CoordinateInput';
import { Board } from '../components/Board';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { ExplanationCacheRepository } from '../../infrastructure/persistence/ExplanationCacheRepository';
import { getStepExplanation } from '../../application/usecases/GetStepExplanationUseCase';
import type { Movement } from '../../domain/models/Movement';

/**
 * HOME PAGE COMPONENT
 *
 * Main page that orchestrates the complete user experience.
 * Composes input and visualization components in an educational layout.
 */
export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new ExplanationCacheRepository();

  const handleStepClick = async (movement: Movement) => {
    setSelectedMovement(movement);
    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const result = await getStepExplanation(
        { movement, language: i18n.language },
        repository
      );

      if (result.success) {
        setExplanation(result.explanation);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseExplanation = () => {
    setSelectedMovement(null);
    setExplanation(null);
    setError(null);
  };

  // Listen for step clicks from Board component
  useEffect(() => {
    const handleStepClickEvent = (event: CustomEvent) => {
      handleStepClick(event.detail as Movement);
    };

    window.addEventListener('stepClick', handleStepClickEvent as EventListener);
    return () => {
      window.removeEventListener('stepClick', handleStepClickEvent as EventListener);
    };
  }, []);

  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <main className="space-y-8">
        {/* INTRODUCTORY EDUCATIONAL SECTION */}
        <section className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              {t('home.chebyshev.title')}
            </h2>
            <div className="text-blue-700 space-y-2">
              <p dangerouslySetInnerHTML={{ __html: t('home.chebyshev.description') }} />
              <p className="text-sm">
                {t('home.chebyshev.efficiencyNote')}
              </p>
            </div>
          </div>
        </section>

        {/* MAIN LAYOUT - RESPONSIVE GRID */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: COORDINATE INPUT */}
          <section className="space-y-4">
            <CoordinateInput />
          </section>

          {/* RIGHT COLUMN: BOARD VISUALIZATION */}
          <section className="space-y-4">
            <Board />
          </section>
        </div>

        {/* FINAL EDUCATIONAL SECTION */}
        <section className="mt-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('home.concepts.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{t('home.concepts.architecture.title')}</h4>
                <ul className="space-y-1">
                  <li>{t('home.concepts.architecture.domain')}</li>
                  <li>{t('home.concepts.architecture.application')}</li>
                  <li>{t('home.concepts.architecture.infrastructure')}</li>
                  <li>{t('home.concepts.architecture.presentation')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{t('home.concepts.technologies.title')}</h4>
                <ul className="space-y-1">
                  <li dangerouslySetInnerHTML={{ __html: t('home.concepts.technologies.react') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('home.concepts.technologies.tailwind') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('home.concepts.technologies.zod') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('home.concepts.technologies.context') }} />
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ExplanationPanel
        movement={selectedMovement}
        explanation={explanation}
        isLoading={isLoading}
        error={error}
        onClose={handleCloseExplanation}
      />
    </>
  );
};

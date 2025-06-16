/**
 * PÁGINA PRINCIPAL - CAPA DE PRESENTACIÓN
 *
 * Compone la funcionalidad específica del visualizador de pathfinding.
 * Se encarga de la estructura y layout educativo de la aplicación.
 *
 * RESPONSABILIDADES:
 * - Componer CoordinateInput y Board en layout responsive
 * - Proporcionar estructura educativa cohesiva
 * - Manejar el flujo visual de la aplicación específica
 * - Mantener separación de responsabilidades dentro de presentación
 *
 * ¿POR QUÉ SEPARADO DE APP.tsx?
 * - App.tsx = infraestructura (providers, configuración global)
 * - HomePage.tsx = lógica específica de presentación
 * - Facilita escalabilidad (multiple páginas en el futuro)
 * - Respeta Clean Architecture: separación de concerns
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CoordinateInput } from '../components/CoordinateInput';
import { Board } from '../components/Board';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

/**
 * HOME PAGE COMPONENT
 *
 * Página principal que orquesta la experiencia completa del usuario.
 * Compone los componentes de input y visualización en un layout educativo.
 */
export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <main className="space-y-8">
        {/* SECCIÓN EDUCATIVA INTRODUCTORIA */}
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

        {/* LAYOUT PRINCIPAL - GRID RESPONSIVE */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* COLUMNA IZQUIERDA: ENTRADA DE COORDENADAS */}
          <section className="space-y-4">
            <CoordinateInput />
          </section>

          {/* COLUMNA DERECHA: VISUALIZACIÓN DEL TABLERO */}
          <section className="space-y-4">
            <Board />
          </section>
        </div>

        {/* SECCIÓN EDUCATIVA FINAL */}
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
    </>
  );
};

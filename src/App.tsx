/**
 * MAIN APPLICATION - INFRASTRUCTURE LAYER
 *
 * This file is responsible ONLY for infrastructure configuration:
 * - Global context providers (PathProvider)
 * - Base application configuration
 * - Main page import
 *
 * WHY DON'T WE PUT SPECIFIC LOGIC HERE?
 * - App.tsx should be agnostic to specific domain
 * - Facilitates testing and maintenance
 * - Allows scaling with multiple pages/features
 * - Respects Clean Architecture: infrastructure separated from presentation
 */

import './App.css';
import { PathProvider } from './presentation/context/PathContext';
import { LanguageProvider } from './presentation/context/LanguageContext';
import { HomePage } from './presentation/pages/HomePage';
import { LanguageModal } from './presentation/components/LanguageModal';
import { useTranslation } from 'react-i18next';

/**
 * MAIN APPLICATION COMPONENT
 *
 * Responsibilities:
 * - Configure global providers
 * - Render main page
 * - Maintain infrastructure configuration
 */
function App() {
  const { t } = useTranslation();
  return (
    <LanguageProvider>
      <PathProvider>
        <LanguageModal />
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t('app.title')}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('app.subtitle')}
              </p>
            </header>
            <HomePage />
          </div>
        </div>
      </PathProvider>
    </LanguageProvider>
  );
}

export default App;

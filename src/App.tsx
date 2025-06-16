/**
 * APLICACIÓN PRINCIPAL - CAPA DE INFRAESTRUCTURA
 *
 * Este archivo se encarga ÚNICAMENTE de la configuración de infraestructura:
 * - Proveedores de contexto global (PathProvider)
 * - Configuración de la aplicación base
 * - Importación de la página principal
 *
 * ¿POR QUÉ NO PONEMOS LÓGICA ESPECÍFICA AQUÍ?
 * - App.tsx debe ser agnóstico del dominio específico
 * - Facilita testing y mantenimiento
 * - Permite escalar con múltiples páginas/features
 * - Respeta Clean Architecture: infraestructura separada de presentación
 */

import './App.css';
import { PathProvider } from './presentation/context/PathContext';
import { LanguageProvider } from './presentation/context/LanguageContext';
import { HomePage } from './presentation/pages/HomePage';
import { LanguageModal } from './presentation/components/LanguageModal';
import { useTranslation } from 'react-i18next';

/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 *
 * Responsabilidades:
 * - Configurar providers globales
 * - Renderizar la página principal
 * - Mantener configuración de infraestructura
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

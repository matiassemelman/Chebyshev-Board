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
import { HomePage } from './presentation/pages/HomePage';

/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 *
 * Responsabilidades:
 * - Configurar providers globales
 * - Renderizar la página principal
 * - Mantener configuración de infraestructura
 */
function App() {
  return (
    <PathProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🚀 Algoritmo Chebyshev
            </h1>
            <p className="text-gray-600 text-lg">
              Visualizador educativo de recorridos mínimos en tableros 2D
            </p>
          </header>
          <HomePage />
        </div>
      </div>
    </PathProvider>
  );
}

export default App;

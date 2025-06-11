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
import { CoordinateInput } from '../components/CoordinateInput';
import { Board } from '../components/Board';

/**
 * HOME PAGE COMPONENT
 *
 * Página principal que orquesta la experiencia completa del usuario.
 * Compone los componentes de input y visualización en un layout educativo.
 */
export const HomePage: React.FC = () => {
  return (
    <main className="space-y-8">
      {/* SECCIÓN EDUCATIVA INTRODUCTORIA */}
      <section className="text-center space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            🎯 ¿Cómo funciona la distancia Chebyshev?
          </h2>
          <div className="text-blue-700 space-y-2">
            <p>
              En un tablero donde puedes moverte en <strong>8 direcciones</strong> (incluidas diagonales),
              la distancia mínima entre dos puntos es: <code className="bg-blue-100 px-2 py-1 rounded">max(|dx|, |dy|)</code>
            </p>
            <p className="text-sm">
              💡 Esto es más eficiente que algoritmos como A* porque aprovechamos que el movimiento diagonal no cuesta extra.
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
            📚 Conceptos implementados
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🏛️ Arquitectura Limpia</h4>
              <ul className="space-y-1">
                <li>• Dominio: Lógica pura (Coordinate, PathCalculator)</li>
                <li>• Aplicación: Casos de uso con validación</li>
                <li>• Infraestructura: Persistencia (localStorage)</li>
                <li>• Presentación: Componentes React desacoplados</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">⚡ Tecnologías</h4>
              <ul className="space-y-1">
                <li>• <strong>React 19</strong> + TypeScript</li>
                <li>• <strong>TailwindCSS</strong> para estilos</li>
                <li>• <strong>Zod</strong> para validación robusta</li>
                <li>• <strong>Context API</strong> para estado global</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

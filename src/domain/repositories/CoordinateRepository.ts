/**
 * REPOSITORY INTERFACE - CAPA DE DOMINIO
 *
 * ¿POR QUÉ LA INTERFACE ESTÁ EN DOMINIO PERO SE IMPLEMENTA EN INFRAESTRUCTURA?
 *
 * Esta es la aplicación del Principio de Inversión de Dependencias (DIP):
 *
 * 1. PROBLEMA SIN DIP:
 *    Domain ← Application ← Infrastructure ← Presentation
 *    El dominio dependería de infraestructura (localStorage, API, etc.)
 *    Esto viola Clean Architecture porque el dominio debe ser independiente.
 *
 * 2. SOLUCIÓN CON DIP:
 *    Domain (define interface) ← Application ← Infrastructure (implementa interface) ← Presentation
 *    El dominio define QUÉ necesita (interface)
 *    La infraestructura define CÓMO lo hace (implementación)
 *    Las dependencias apuntan hacia adentro, respetando Clean Architecture.
 *
 * 3. BENEFICIOS:
 *    - Dominio testeable sin dependencias externas
 *    - Fácil cambio de localStorage a API sin tocar dominio
 *    - Cumple SOLID principles (especialmente DIP)
 *    - Arquitectura robusta y mantenible
 */

import type { Coordinate } from '../models/Coordinate';

/**
 * CONTRATO DE PERSISTENCIA PARA COORDENADAS
 *
 * Define las operaciones que necesita el dominio para persistir datos.
 * Esta interface será implementada en la capa de infraestructura,
 * manteniendo el dominio libre de conocimiento técnico específico.
 */
export interface CoordinateRepository {
  /**
   * PERSISTIR COORDENADAS
   *
   * Guarda una lista de coordenadas para uso futuro.
   * El dominio no sabe SI es localStorage, API, archivo, etc.
   * Solo sabe QUE puede guardar coordenadas.
   *
   * @param coordinates - Lista de coordenadas a persistir
   * @returns Promise que resuelve a true si se guardó exitosamente
   */
  save(coordinates: readonly Coordinate[]): Promise<boolean>;

  /**
   * CARGAR COORDENADAS PERSISTIDAS
   *
   * Recupera la última lista de coordenadas guardada.
   * Si no hay datos o hay error, retorna array vacío.
   * El dominio no se preocupa por detalles de implementación.
   *
   * @returns Promise con las coordenadas o array vacío si no hay datos
   */
  load(): Promise<readonly Coordinate[]>;
}
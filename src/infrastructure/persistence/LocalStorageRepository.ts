/**
 * IMPLEMENTACIÓN DE PERSISTENCIA - CAPA DE INFRAESTRUCTURA
 *
 * Implementa CoordinateRepository usando localStorage del navegador.
 *
 * ¿POR QUÉ AQUÍ Y NO EN DOMINIO?
 * - Esta clase contiene detalles técnicos específicos (localStorage, JSON, etc.)
 * - El dominio solo conoce la interface, no esta implementación
 * - Podríamos crear FirebaseRepository, APIRepository, etc. sin tocar dominio
 * - Cumple Clean Architecture: dependencias apuntan hacia adentro
 *
 * ROBUSTEZ IMPLEMENTADA:
 * - localStorage puede estar deshabilitado (modo privado, políticas corporativas)
 * - localStorage puede estar lleno (QuotaExceededError)
 * - Datos pueden estar corruptos (JSON malformado, estructura incorrecta)
 * - Validación con Zod para asegurar integridad de datos
 */

import { z } from 'zod';
import type { Coordinate } from '../../domain/models/Coordinate';
import type { CoordinateRepository } from '../../domain/repositories/CoordinateRepository';

// =============================================================================
// CONFIGURACIÓN Y CONSTANTES
// =============================================================================

/**
 * Clave única para identificar nuestros datos en localStorage
 * Prefijo del proyecto para evitar colisiones con otras aplicaciones
 */
const STORAGE_KEY = 'prosumia-coordinates' as const;

// =============================================================================
// SCHEMAS DE VALIDACIÓN CON ZOD
// =============================================================================

/**
 * Schema para validar una coordenada individual cargada desde localStorage
 * Debe coincidir exactamente con nuestro modelo de dominio
 */
const CoordinateSchema = z.object({
  x: z.number().int().min(0, "X coordinate must be a non-negative integer"),
  y: z.number().int().min(0, "Y coordinate must be a non-negative integer")
});

/**
 * Schema para validar el array completo de coordenadas
 * Permite arrays vacíos (caso válido cuando no hay datos guardados)
 */
const CoordinatesArraySchema = z.array(CoordinateSchema);

// =============================================================================
// IMPLEMENTACIÓN DEL REPOSITORY
// =============================================================================

/**
 * REPOSITORY DE LOCALSTORAGE PARA COORDENADAS
 *
 * Implementación concreta que maneja todos los casos edge:
 * - localStorage deshabilitado
 * - Datos corruptos o malformados
 * - Errores de serialización/deserialización
 * - Validación de integridad de datos
 */
export class LocalStorageRepository implements CoordinateRepository {

  /**
   * GUARDAR COORDENADAS EN LOCALSTORAGE
   *
   * Serializa y persiste las coordenadas de forma segura.
   *
   * Casos manejados:
   * - localStorage deshabilitado: retorna false
   * - localStorage lleno: retorna false
   * - Error de serialización: retorna false
   *
   * @param coordinates - Lista de coordenadas a guardar
   * @returns Promise que resuelve a true si se guardó exitosamente
   */
  async save(coordinates: readonly Coordinate[]): Promise<boolean> {
    try {
      // Serializamos a JSON string para localStorage
      const serialized = JSON.stringify(coordinates);

      // Intentamos guardar - puede fallar por múltiples razones
      localStorage.setItem(STORAGE_KEY, serialized);

      // Si llegamos aquí, el guardado fue exitoso
      return true;

        } catch {
      // Posibles errores:
      // - localStorage deshabilitado (modo privado, políticas)
      // - QuotaExceededError (localStorage lleno)
      // - SecurityError (contexto inseguro)
      // - Cualquier otro error inesperado

      // En modo educativo podríamos hacer console.warn, pero en producción
      // es mejor fallar silenciosamente y retornar false
      return false;
    }
  }

  /**
   * CARGAR COORDENADAS DESDE LOCALSTORAGE
   *
   * Deserializa y valida las coordenadas guardadas.
   *
   * Casos manejados:
   * - No hay datos guardados: retorna []
   * - localStorage deshabilitado: retorna []
   * - JSON malformado: retorna []
   * - Estructura incorrecta: retorna []
   * - Validación Zod falla: retorna []
   *
   * @returns Promise con las coordenadas válidas o array vacío
   */
  async load(): Promise<readonly Coordinate[]> {
    try {
      // Intentamos obtener los datos guardados
      const stored = localStorage.getItem(STORAGE_KEY);

      // Si no hay datos guardados, retornamos array vacío (caso válido)
      if (!stored) return [];

      // Parseamos el JSON - puede fallar si está corrupto
      const parsed = JSON.parse(stored);

      // Validamos con Zod para asegurar integridad de datos
      // Si los datos no cumplen el schema, parse() lanza excepción
      const validated = CoordinatesArraySchema.parse(parsed);

      // Si llegamos aquí, los datos son válidos
      return validated;

        } catch {
      // Posibles errores:
      // - localStorage deshabilitado
      // - JSON.parse() falló (datos corruptos)
      // - Zod validation falló (estructura incorrecta)
      // - Cualquier otro error inesperado

      // En todos los casos, retornamos array vacío como fallback seguro
      // Esto evita que la aplicación crashee por datos corruptos
      return [];
    }
  }
}
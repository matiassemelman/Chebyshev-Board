# PRD: Funcionalidad de Internacionalización (i18n)

**Versión:** 2.1 (Simplificada, sin persistencia)
**Estado:** Listo para implementación

---

### 1. Visión General

Implementar un sistema de internacionalización (i18n) por sesión para **Español (es)** e **Inglés (en)**, respetando estrictamente los principios de Clean Architecture.

### 2. Objetivos

-   **Técnico:** Integrar i18n sin violar la regla de dependencia de Clean Architecture.
-   **Usuario:** Proporcionar una selección de idioma clara al inicio de cada sesión.
-   **Mantenibilidad:** La arquitectura debe ser simple y permitir añadir nuevos idiomas o textos con un esfuerzo mínimo.

### 3. Requisitos Funcionales (FR)

-   **FR1: Lógica de Carga de Idioma:**
    1.  Al iniciar la aplicación, detectar el idioma del navegador (`navigator.language`). Usar `es` o `en` si coinciden; de lo contrario, usar `en` como predeterminado.
    2.  El idioma activo se gestionará a través de un `LanguageContext` dedicado.

-   **FR2: Modal de Selección de Idioma:**
    1.  Al cargar la aplicación, siempre se mostrará un modal para la selección de idioma.
    2.  Ofrecerá dos opciones claras: "Español" e "Inglés", con el idioma detectado del navegador preseleccionado.
    3.  Al seleccionar, se actualizará el `LanguageContext` y el modal se cerrará.

-   **FR3: Traducción de la Interfaz de Usuario:**
    1.  Todos los textos estáticos en la capa de `presentation` serán servidos a través del sistema i18n.
    2.  Los errores de validación de la capa de `application` devolverán una **clave de error semántica** (ej: `'validation.invalidJson'`), que la capa `presentation` usará para buscar la traducción.

-   **FR4: Cambio de Idioma Manual:**
    1.  Un componente `LanguageSwitcher` estará visible en la UI.
    2.  Permitirá al usuario cambiar de idioma en cualquier momento, actualizando el `LanguageContext` de forma reactiva.

### 4. Propuesta de Arquitectura y Técnica

-   **Dependencias:**
    -   `i18next`
    -   `react-i18next`
    -   `i18next-browser-languagedetector`

-   **Estructura de Archivos Propuesta:**
    ```plaintext
    public/
    └─ locales/
       ├─ en/
       │  └─ translation.json
       └─ es/
          └─ translation.json
    src/
    ├─ application/
    │  └─ usecases/CalculatePathUseCase.ts   // <-- Modificado para devolver errorKey
    ├─ infrastructure/
    │  └─ i18n/
    │     └─ config.ts                       // <-- Configuración de i18next
    └─ presentation/
       ├─ components/
       │  ├─ LanguageModal.tsx               // <-- Nuevo
       │  └─ LanguageSwitcher.tsx            // <-- Nuevo
       └─ context/
          └─ LanguageContext.tsx             // <-- Nuevo, para estado de idioma
    ```

### 5. Tracker de Implementación

- [x] **Paso 1: Setup:** Instalar dependencias (`i18next`, `react-i18next`, `i18next-browser-languagedetector`).
- [x] **Paso 2: Archivos de Traducción:** Crear la estructura `public/locales` y los archivos `translation.json` con claves iniciales.
- [x] **Paso 3: Configuración i18n:** Crear `src/infrastructure/i18n/config.ts` y configurar `i18next`.
- [x] **Paso 4: Contexto de Idioma:** Implementar `LanguageContext.tsx` para gestionar el estado del idioma.
- [x] **Paso 5: Integración Principal:** Envolver `App` con `LanguageProvider` y `I18nextProvider`.
- [x] **Paso 6: Refactor (Application):** Modificar `CalculatePathUseCase.ts` para que devuelva `errorKey`.
- [x] **Paso 7: Refactor (Presentation):** Actualizar `CoordinateInput.tsx` para usar `t(state.error)`.
- [x] **Paso 8: Componentes de UI:** Crear y estilizar `LanguageModal.tsx` y `LanguageSwitcher.tsx`.
- [x] **Paso 9: Traducción Completa:** Reemplazar todos los textos estáticos en la capa de `presentation` con el hook `useTranslation()`.
- [ ] **Paso 10: Pruebas:** Verificar todos los flujos en ambos idiomas.
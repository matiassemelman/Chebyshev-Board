import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// DEFINICIÓN DEL ESTADO Y CONTEXTO
// =============================================================================

/**
 * Define la forma del valor del contexto del idioma.
 */
interface LanguageContextValue {
  readonly language: string;
  readonly setLanguage: (language: 'en' | 'es') => void;
}

/**
 * Creación del Contexto de React.
 * Se inicializa con `null` y se proveerá un valor real en el Provider.
 */
const LanguageContext = createContext<LanguageContextValue | null>(null);

// =============================================================================
// COMPONENTE PROVIDER
// =============================================================================

interface LanguageProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider que encapsula la lógica para gestionar el idioma de la aplicación.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLang] = useState(i18n.language);

  /**
   * Cambia el idioma de la aplicación.
   * La función está envuelta en `useCallback` para evitar re-renders innecesarios
   * en los componentes consumidores si la función se pasara como prop.
   */
  const setLanguage = useCallback((newLanguage: 'en' | 'es') => {
    i18n.changeLanguage(newLanguage);
    setLang(newLanguage);
  }, [i18n]);

  const contextValue: LanguageContextValue = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// =============================================================================
// HOOK PERSONALIZADO
// =============================================================================

/**
 * Hook personalizado para acceder fácilmente al contexto del idioma.
 * Proporciona una capa de abstracción y asegura que el contexto no sea `null`.
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
};
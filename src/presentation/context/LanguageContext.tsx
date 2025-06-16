import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// STATE AND CONTEXT DEFINITION
// =============================================================================

/**
 * Defines the shape of the language context value.
 */
interface LanguageContextValue {
  readonly language: string;
  readonly setLanguage: (language: 'en' | 'es') => void;
}

/**
 * React Context creation.
 * Initialized with `null` and will be provided with a real value in the Provider.
 */
const LanguageContext = createContext<LanguageContextValue | null>(null);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface LanguageProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider that encapsulates the logic for managing the application's language.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLang] = useState(i18n.language);

  /**
   * Changes the application's language.
   * The function is wrapped in `useCallback` to prevent unnecessary re-renders
   * in consumer components if the function is passed as a prop.
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
// CUSTOM HOOK
// =============================================================================

/**
 * Custom hook to easily access the language context.
 * Provides an abstraction layer and ensures the context is not `null`.
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
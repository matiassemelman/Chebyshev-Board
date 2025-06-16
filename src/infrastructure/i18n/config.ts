import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translations using http backend
  // Learn more here: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // Detect user's language
  // Learn more here: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initial i18next configuration
  // Learn more here: https://www.i18next.com/overview/configuration-options
  .init({
    // Default language if detection fails
    fallbackLng: 'en',
    // List of supported languages
    supportedLngs: ['en', 'es'],
    // Enable debug mode to see logs in console
    debug: true,
    interpolation: {
      // React already escapes values by default, not needed for it
      escapeValue: false,
    },
    // Options for the backend that loads JSON files
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
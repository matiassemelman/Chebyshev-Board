import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Carga de traducciones usando http backend
  // Aprende más aquí: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // Detecta el idioma del usuario
  // Aprende más aquí: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pasa la instancia de i18n a react-i18next
  .use(initReactI18next)
  // Configuración inicial de i18next
  // Aprende más aquí: https://www.i18next.com/overview/configuration-options
  .init({
    // Idioma por defecto si la detección falla
    fallbackLng: 'en',
    // Lista de idiomas soportados
    supportedLngs: ['en', 'es'],
    // Habilitar modo de depuración para ver logs en la consola
    debug: true,
    interpolation: {
      // React ya escapa los valores por defecto, no es necesario para él
      escapeValue: false,
    },
    // Opciones para el backend que carga los archivos JSON
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
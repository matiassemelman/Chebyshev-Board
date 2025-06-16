import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        disabled={language === 'en'}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white cursor-default'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        disabled={language === 'es'}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'es'
            ? 'bg-blue-600 text-white cursor-default'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        ES
      </button>
    </div>
  );
};
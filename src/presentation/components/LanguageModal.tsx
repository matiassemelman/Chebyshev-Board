import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

export const LanguageModal: React.FC = () => {
  const { setLanguage } = useLanguage();
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language.split('-')[0]);

  useEffect(() => {
    setSelectedLanguage(i18n.language.split('-')[0]);
  }, [i18n.language]);

  const handleSelect = () => {
    if (selectedLanguage === 'en' || selectedLanguage === 'es') {
      setLanguage(selectedLanguage);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">{t('languageModal.title')}</h2>
        <p className="text-gray-600 mb-6">{t('languageModal.description')}</p>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
              selectedLanguage === 'en'
                ? 'bg-blue-600 text-white scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {t('languageModal.english')}
          </button>
          <button
            onClick={() => setSelectedLanguage('es')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
              selectedLanguage === 'es'
                ? 'bg-blue-600 text-white scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {t('languageModal.spanish')}
          </button>
        </div>

        <button
          onClick={handleSelect}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {t('languageModal.confirm')}
        </button>
      </div>
    </div>
  );
};
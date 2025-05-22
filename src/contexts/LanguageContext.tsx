
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { Globe } from "lucide-react";

type LanguageContextType = {
  language: string;
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  LanguageToggle: React.FC;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Detectar automáticamente el idioma del navegador o usar inglés como predeterminado
  const getBrowserLanguage = (): string => {
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
  };

  const [language, setLanguage] = useState(() => {
    // Intentar obtener el idioma guardado o detectar del navegador
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage && translations[savedLanguage] 
      ? savedLanguage
      : getBrowserLanguage();
  });

  useEffect(() => {
    // Guardar la preferencia de idioma
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  // Componente para cambiar entre idiomas
  const LanguageToggle: React.FC = () => {
    const toggleLanguage = () => {
      const newLanguage = language === 'en' ? 'es' : 'en';
      changeLanguage(newLanguage);
    };

    return (
      <button 
        onClick={toggleLanguage}
        className="flex items-center gap-1 py-1 px-2 text-sm rounded-md hover:bg-gray-100"
        aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
      >
        <Globe className="h-4 w-4" />
        <span>{language === 'en' ? 'ES' : 'EN'}</span>
      </button>
    );
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, LanguageToggle }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

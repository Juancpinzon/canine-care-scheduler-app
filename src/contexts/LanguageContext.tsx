
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../i18n/translations';

type LanguageContextType = {
  language: string;
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('es'); // Default to Spanish as requested

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
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

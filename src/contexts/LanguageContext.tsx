
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { Globe } from "lucide-react";
import { supabase } from '../lib/supabase';

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
    return 'en'; // Force English by default as requested: "el idioma principal pasa a ser inglés"
  };

  const [language, setLanguage] = useState(() => {
    // Use a new storage key to ignore any old cached 'es' preferences
    const savedLanguage = localStorage.getItem('q4_lang');
    return savedLanguage && translations[savedLanguage] 
      ? savedLanguage
      : getBrowserLanguage();
  });

  useEffect(() => {
    // Guardar la preferencia de idioma
    localStorage.setItem('q4_lang', language);
    
    // Si hay usuario logueado, sincronizar con Supabase
    const syncUserLanguage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({ preferred_language: language })
          .eq('id', session.user.id);
      }
    };
    syncUserLanguage();
  }, [language]);

  useEffect(() => {
    // Cargar preferencia de Supabase al montar si está logueado
    const loadUserLanguage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferred_language')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.preferred_language && translations[profile.preferred_language]) {
          setLanguage(profile.preferred_language);
        }
      }
    };
    loadUserLanguage();
  }, []);

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
        className="flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-gray-800 transition-colors"
        aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
      >
        <Globe className="h-4 w-4 text-gray-400" />
        <span style={{ fontSize: 11, letterSpacing: "0.1em", fontWeight: 600 }}>
          <span style={{ color: language === 'es' ? '#C9A84C' : 'rgba(240,237,232,0.4)', transition: 'color 0.2s' }}>ES</span>
          <span style={{ color: 'rgba(240,237,232,0.2)', margin: '0 4px' }}>|</span>
          <span style={{ color: language === 'en' ? '#C9A84C' : 'rgba(240,237,232,0.4)', transition: 'color 0.2s' }}>EN</span>
        </span>
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

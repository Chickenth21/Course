import React, { createContext, useContext, useState, useEffect } from 'react';
import vi from '../locales/vi.js';
import en from '../locales/en.js';

const translations = { vi, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Default to Vietnamese ('vi') or saved preference in localStorage
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (key, fallback = '') => {
    const currentDict = translations[language] || translations.vi;
    return currentDict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

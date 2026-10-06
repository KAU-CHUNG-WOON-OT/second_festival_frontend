import { createContext, useContext, useState, type ReactNode } from 'react';
import i18n from '../i18n';
import { track } from '@/lib/mixpanel';

export type Language = 'KOR' | 'ENG';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'KOR',
  toggleLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const getInitialLanguage = (): Language => {
    const saved = localStorage.getItem('i18nextLng');
    return saved === 'en' ? 'ENG' : 'KOR';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const toggleLanguage = () => {
    const next: Language = language === 'KOR' ? 'ENG' : 'KOR';
    track('language_changed', { from: language, to: next });
    setLanguage(next);
    i18n.changeLanguage(next === 'KOR' ? 'ko' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
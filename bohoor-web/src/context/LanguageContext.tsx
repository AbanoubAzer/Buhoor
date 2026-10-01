'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, getLocalized as getLocalizedHelper } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  t: (key: keyof typeof translations.ar) => string;
  getLocalized: (item: any, field: string) => string;
  formatPrice: (amount?: number | string | null) => string;
  formatArea: (area?: number | string | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export function LanguageProvider({ children, initialLanguage = 'ar' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    // Check localStorage or cookie on client mount to ensure perfect client-side consistency
    try {
      const saved = localStorage.getItem('bohoor_lang') as Language;
      if (saved === 'ar' || saved === 'en') {
        if (saved !== language) {
          setLanguageState(saved);
        }
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
        document.cookie = `bohoor_lang=${saved};path=/;max-age=31536000;SameSite=Lax`;
      } else if (initialLanguage) {
        localStorage.setItem('bohoor_lang', initialLanguage);
        document.cookie = `bohoor_lang=${initialLanguage};path=/;max-age=31536000;SameSite=Lax`;
      }
    } catch (e) {
      console.error('Language sync error:', e);
    }
  }, [initialLanguage, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('bohoor_lang', lang);
      document.cookie = `bohoor_lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
    } catch (e) {
      console.error('Error saving language:', e);
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  const t = (key: keyof typeof translations.ar): string => {
    const dict = translations[language] || translations.ar;
    return dict[key] || translations.ar[key] || (key as string);
  };

  const getLocalized = (item: any, field: string): string => {
    return getLocalizedHelper(item, field, language);
  };

  const formatPrice = (amount?: number | string | null): string => {
    const num = Number(amount || 0);
    if (!num || num <= 0) return t('priceOnDemand');
    const currencyStr = t('currency');
    const formatted = num.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    return language === 'ar' ? `${formatted} ${currencyStr}` : `${currencyStr} ${formatted}`;
  };

  const formatArea = (area?: number | string | null): string => {
    const num = Number(area || 0);
    if (!num || num <= 0) return '-';
    return `${num} ${t('sqm')}`;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        dir,
        isRTL,
        t,
        getLocalized,
        formatPrice,
        formatArea,
      }}
    >
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

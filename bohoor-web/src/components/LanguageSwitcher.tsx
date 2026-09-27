'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'compact';
}

export default function LanguageSwitcher({
  className = '',
  variant = 'button',
}: LanguageSwitcherProps) {
  const { language, toggleLanguage, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 hover:border-primary/40 bg-white hover:bg-gray-50 text-gray-700 transition shadow-2xs ${className}`}
        title="تغيير اللغة / Switch Language"
      >
        <span className="text-base">{language === 'ar' ? '🇬🇧' : '🇪🇬'}</span>
        <span>{language === 'ar' ? 'English' : 'عربي'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 hover:border-primary/40 bg-white/80 hover:bg-white text-gray-700 hover:text-primary transition shadow-xs backdrop-blur-sm shrink-0 ${className}`}
      title="تغيير اللغة / Switch Language"
    >
      <GlobeAltIcon className="w-4 h-4 text-primary shrink-0" />
      <span className="hidden sm:inline text-sm">{language === 'ar' ? '🇬🇧 English' : '🇪🇬 عربي'}</span>
      <span className="sm:hidden text-xs font-bold">{language === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import AiSearchModal from "./AiSearchModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Buhoor Realty" className="h-10 object-contain rounded-lg" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-accent font-medium transition">{t('home')}</Link>
            <Link href="/units" className="text-gray-600 hover:text-accent font-medium transition">{t('units')}</Link>
            <Link href="/projects" className="text-gray-600 hover:text-accent font-medium transition">{t('projects')}</Link>
            <Link href="/areas" className="text-gray-600 hover:text-accent font-medium transition">{t('areas')}</Link>
            <Link href="/developers" className="text-gray-600 hover:text-accent font-medium transition">{t('developers')}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <AiSearchModal />

            <Link href="/add-property" className="hidden sm:inline-flex items-center gap-2 bg-accent hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold transition shadow-md shadow-accent/20 text-sm">
              <span>{t('addProperty')}</span>
              <span>{isRTL ? '←' : '→'}</span>
            </Link>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t('home')}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 bg-black/40 z-40 lg:hidden backdrop-blur-xs" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl absolute w-full left-0 z-50">
            <div className="space-y-1.5 px-4 pb-6 pt-4">
              <Link onClick={() => setMobileMenuOpen(false)} href="/" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('home')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/units" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('units')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/projects" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('projects')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/areas" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('areas')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/developers" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('developers')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/add-property" className="block sm:hidden mt-3 bg-accent hover:bg-orange-600 text-white text-center rounded-xl px-4 py-3 text-base font-bold shadow-md transition">
                {t('addProperty')} {isRTL ? '←' : '→'}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

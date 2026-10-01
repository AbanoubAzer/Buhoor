"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import AiSearchModal from "./AiSearchModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiSearchOpen, setAiSearchOpen] = useState(false);
  const { t, isRTL, dir } = useLanguage();

  return (
    <header dir={dir} className="sticky top-0 z-50 glass">
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

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <LanguageSwitcher />

            <AiSearchModal isOpen={aiSearchOpen} setIsOpen={setAiSearchOpen} />

            <Link href="/add-property" className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition shadow-md shadow-accent/20 text-xs sm:text-sm">
              <span>{t('addProperty')}</span>
              <span>{isRTL ? '←' : '→'}</span>
            </Link>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition border border-gray-200 shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={isRTL ? "القائمة" : "Menu"}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-x-0 top-16 bottom-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl absolute top-16 inset-x-0 z-50">
            <div className="space-y-1 px-4 pb-6 pt-4 max-h-[calc(100dvh-5rem)] overflow-y-auto">
              {/* Featured AI Smart Search Card */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(false);
                  setAiSearchOpen(true);
                }}
                className="w-full mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-primary text-white shadow-lg shadow-indigo-500/25 flex items-center justify-between text-right group active:scale-98 transition-transform border border-indigo-400/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0">
                    ✨
                  </div>
                  <div>
                    <div className="font-extrabold text-sm flex items-center gap-1.5">
                      <span>{t('aiSearchBtn')}</span>
                      <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.5 rounded font-black">AI</span>
                    </div>
                    <p className="text-[11px] text-white/80 font-medium mt-0.5">
                      {t('aiSearchSub')}
                    </p>
                  </div>
                </div>
                <span className="text-white font-bold text-lg">{isRTL ? '←' : '→'}</span>
              </button>

              <Link onClick={() => setMobileMenuOpen(false)} href="/" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('home')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/units" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('units')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/projects" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('projects')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/areas" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('areas')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/developers" className="block rounded-xl px-3 py-2.5 text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition">{t('developers')}</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/add-property" className="block mt-3 bg-accent hover:bg-orange-600 text-white text-center rounded-xl px-4 py-3 text-base font-bold shadow-md transition">
                {t('addProperty')} {isRTL ? '←' : '→'}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

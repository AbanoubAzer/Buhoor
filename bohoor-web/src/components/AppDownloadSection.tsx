'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  BellAlertIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function AppDownloadSection() {
  const { t, isRTL } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | null>(null);

  const handleStoreClick = (platform: 'ios' | 'android') => {
    setSelectedPlatform(platform);
    setModalOpen(true);
  };

  return (
    <section className="py-12 sm:py-16 my-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#0c1f3d] via-[#091830] to-[#040e1d] text-white overflow-hidden shadow-2xl border border-white/10">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:p-16">
          {/* Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-accent text-xs sm:text-sm font-bold">
              <SparklesIcon className="w-4 h-4" />
              <span>{t('mobileAppTitle')}</span>
              <span className="bg-emerald-400/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full border border-emerald-400/30">
                Android {t('availableNow')}
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[11px] px-2 py-0.5 rounded-full border border-amber-400/30">
                iOS {t('comingSoon')}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-cairo tracking-tight leading-tight">
              {t('downloadAppTitle')}
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              {t('downloadAppSubtitle')}
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-2">
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <BellAlertIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  {isRTL ? 'إشعارات لحظية بالمطابقات الجديدة' : 'Instant match & deal alerts'}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-primary/40 text-primary-200 flex items-center justify-center shrink-0">
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  {isRTL ? 'تواصل مباشر مع كبرى شركات التطوير' : 'Direct contact with developers'}
                </span>
              </div>
            </div>

            {/* Download Badges */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              {/* Google Play Android - AVAILABLE NOW */}
              <button
                type="button"
                onClick={() => handleStoreClick('android')}
                className="group relative flex items-center gap-3.5 bg-black/80 hover:bg-black text-white px-5 py-3.5 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-start cursor-pointer min-w-[210px]"
              >
                {/* Available Now Ribbon Badge */}
                <span className="absolute -top-2.5 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1 border border-emerald-300/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {t('availableNow')}
                </span>

                <svg className="w-8 h-8 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 512 512">
                  <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 59.9z" />
                  <path fill="#34A853" d="M47 38.3l238.4 238.4L47 515.1V38.3z" />
                  <path fill="#EA4335" d="M325.3 277.7l60.1 59.9L104.6 499l220.7-221.3z" />
                  <path fill="#FBBC04" d="M448.2 231.2l-62.8-37-60.1 60.1 60.1 59.9 63.8-37.5c16.3-9.6 16.3-35.9-1-45.5z" />
                </svg>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold font-sans tracking-tight">
                      Google Play
                    </span>
                    <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                      Android
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-semibold">
                    {t('getItOnGooglePlay')}
                  </span>
                </div>
              </button>

              {/* Apple iOS Store - COMING SOON */}
              <button
                type="button"
                onClick={() => handleStoreClick('ios')}
                className="group relative flex items-center gap-3.5 bg-black/80 hover:bg-black text-white px-5 py-3.5 rounded-2xl border border-white/20 hover:border-white/40 shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-start cursor-pointer min-w-[210px]"
              >
                {/* Coming Soon Ribbon Badge */}
                <span className="absolute -top-2.5 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1 border border-amber-300/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {t('comingSoon')}
                </span>

                <svg className="w-8 h-8 fill-current text-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.67 1.38-.58.65-1.09 1.71-.96 2.74 1.05.08 2.1-.5 2.71-1.25z"/>
                </svg>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold font-sans tracking-tight">
                      App Store
                    </span>
                    <span className="text-[11px] font-black text-accent bg-accent/20 px-1.5 py-0.2 rounded">
                      iOS
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold">
                    {t('comingSoon')} • iPhone & iPad
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Mockup Column */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-64 sm:w-72 aspect-[9/18.5] bg-gray-950 rounded-[3rem] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[5px] border-gray-700/60 ring-1 ring-white/20 select-none">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-4" />
                <div className="w-2 h-2 rounded-full bg-blue-950/80" />
              </div>

              {/* Screen Content Mockup */}
              <div className="w-full h-full bg-[#0a182e] rounded-[2.3rem] overflow-hidden flex flex-col justify-between p-4 pt-10 text-white relative">
                {/* App Screen Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center font-bold text-xs text-white">
                        ب
                      </div>
                      <span className="font-bold font-cairo text-sm">بُحور العقارية</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* App Screen Search Pill */}
                  <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2 text-xs text-gray-300 mb-3 border border-white/10">
                    <span className="text-accent">🔍</span>
                    <span className="truncate">{isRTL ? 'ابحث عن شقة، فيلا، مطور...' : 'Search apartment, villa...'}</span>
                  </div>

                  {/* App Screen Card Mockup */}
                  <div className="bg-white/10 rounded-2xl p-2.5 border border-white/10 backdrop-blur-xs mb-2.5">
                    <div className="h-20 bg-gradient-to-tr from-primary to-accent/40 rounded-xl relative overflow-hidden flex items-end p-2 mb-2">
                      <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        {isRTL ? 'إطلالة بحرية' : 'Sea View'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2.5 bg-white/40 rounded w-3/4" />
                      <div className="h-2 bg-white/20 rounded w-1/2" />
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                    <div className="flex items-center justify-between text-[10px] text-gray-300">
                      <span>{isRTL ? 'أحدث الإضافات' : 'New Additions'}</span>
                      <span className="text-accent font-bold">120+</span>
                    </div>
                  </div>
                </div>

                {/* App Screen Bottom Navigation */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl py-2 px-3 flex items-center justify-around text-base border border-white/10">
                  <span className="text-accent">🏠</span>
                  <span className="text-gray-400">🔍</span>
                  <span className="text-gray-400">❤️</span>
                  <span className="text-gray-400">👤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Interactive Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 text-gray-900 dark:text-white shadow-2xl border border-gray-100 dark:border-gray-800 relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="text-center pt-2 pb-1">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">{selectedPlatform === 'android' ? '🤖' : '🍏'}</span>
              </div>

              {selectedPlatform === 'android' ? (
                <>
                  <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {t('availableNow')} • Android
                  </span>

                  <h3 className="text-xl font-bold font-cairo mb-2">
                    {isRTL ? 'تحميل تطبيق بُحور لنظام أندرويد' : 'Download Bohoor for Android'}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {isRTL 
                      ? 'يمكنك الآن تحميل التطبيق مباشرة بصيغة APK والتثبيت على هاتفك بسهولة لتجربة سريعة ومتكاملة.' 
                      : 'You can now directly download and install the APK on your Android device for a fast and integrated experience.'}
                  </p>

                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4 text-xs text-emerald-900 dark:text-emerald-200 text-start space-y-2 mb-6 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{t('forAndroid')} (Android 8.0+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{isRTL ? 'تحديثات ومطابقات عقارية فورية' : 'Instant updates and property matches'}</span>
                    </div>
                  </div>

                  <a
                    href={process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL || '/bohoor.apk'}
                    download
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 block text-center"
                  >
                    <span>{t('downloadAndroidNow')}</span>
                    <span>📥</span>
                  </a>
                </>
              ) : (
                <>
                  <span className="inline-block bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {t('comingSoon')} • App Store (iOS)
                  </span>

                  <h3 className="text-xl font-bold font-cairo mb-2">
                    {t('appComingSoonTitle')}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {t('appComingSoonDesc')}
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 text-xs text-gray-500 dark:text-gray-400 text-start space-y-2 mb-6 border border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{t('forIos')} (iPhone & iPad - iOS 15.0+)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition shadow-md"
                  >
                    {isRTL ? 'حسناً، سأنتظر الإطلاق على App Store!' : 'Got it, looking forward to App Store release!'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

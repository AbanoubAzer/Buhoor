'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const { t, isRTL, language, setLanguage } = useLanguage();

  return (
    <footer className="bg-primary text-white pt-0 pb-8 mt-auto rounded-t-[2rem] sm:rounded-t-[3rem] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Trust Banner */}
      <div className="bg-[#0f2142] py-4 relative overflow-hidden mb-8 sm:mb-12">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-accent/10 rounded-l-[100px] blur-2xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center text-sm gap-4 sm:gap-6">
          <button 
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer bg-transparent border-0"
            title={isRTL ? "تغيير اللغة إلى الإنجليزية" : "Switch language to Arabic"}
          >
            <span className="font-bold">{language === 'ar' ? '🇪🇬 عربي' : '🇬🇧 English'}</span>
          </button>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 items-center text-xs sm:text-sm text-gray-300">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              <span>{t('trustTitle1')}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              <span>{t('trustTitle2')}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              <span>{t('trustTitle3')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & App Download */}
          <div className="flex flex-col justify-between">
            <div>
              <img src="/logo.jpg" alt="Buhoor" className="h-12 mb-4 opacity-90 rounded-xl" />
              <p className="text-primary-100 text-sm leading-relaxed text-gray-300">
                {t('footerDesc')}
              </p>
            </div>

            {/* Mobile App Download - Clean & Integrated */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="text-xs font-bold text-gray-200 block mb-2.5 font-cairo">
                {isRTL ? 'تطبيق بُحور للموبايل' : 'Bohoor Mobile App'}
              </span>
              
              <div className="flex flex-wrap gap-2">
                {/* Android Direct Download */}
                <a
                  href={process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL || '/bohoor.apk'}
                  download
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 rounded-xl px-3 py-2 transition group"
                  title={isRTL ? 'تحميل ملف APK لأجهزة أندرويد' : 'Download APK for Android'}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 512 512">
                    <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 59.9z" />
                    <path fill="#34A853" d="M47 38.3l238.4 238.4L47 515.1V38.3z" />
                    <path fill="#EA4335" d="M325.3 277.7l60.1 59.9L104.6 499l220.7-221.3z" />
                    <path fill="#FBBC04" d="M448.2 231.2l-62.8-37-60.1 60.1 60.1 59.9 63.8-37.5c16.3-9.6 16.3-35.9-1-45.5z" />
                  </svg>
                  <div className="flex flex-col text-start">
                    <span className="text-[9px] text-gray-400 font-medium leading-none">Android</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                      {isRTL ? 'تحميل APK' : 'Download'}
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </span>
                  </div>
                </a>

                {/* iOS App Store */}
                <button
                  type="button"
                  onClick={() => alert(t('appComingSoonToast'))}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 transition text-start cursor-pointer group"
                  title={isRTL ? 'تطبيق iOS قريباً على App Store' : 'iOS app coming soon on App Store'}
                >
                  <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.67 1.38-.58.65-1.09 1.71-.96 2.74 1.05.08 2.1-.5 2.71-1.25z"/>
                  </svg>
                  <div className="flex flex-col text-start">
                    <span className="text-[9px] text-gray-400 font-medium leading-none">iOS</span>
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1 mt-0.5">
                      App Store
                      <span className="text-[9px] text-amber-300 bg-amber-400/20 px-1 py-0.2 rounded font-normal">
                        {t('comingSoon')}
                      </span>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6 font-cairo">{t('quickLinks')}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/units?type=apartment" className="hover:text-accent transition">{t('apartmentsForSale')}</Link></li>
              <li><Link href="/units?type=villa" className="hover:text-accent transition">{t('villasForSale')}</Link></li>
              <li><Link href="/developers" className="hover:text-accent transition">{t('topDevelopersFooter')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 font-cairo">{t('popularAreasTitle')}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/areas/new-cairo" className="hover:text-accent transition">{isRTL ? 'القاهرة الجديدة' : 'New Cairo'}</Link></li>
              <li><Link href="/areas/sheikh-zayed" className="hover:text-accent transition">{isRTL ? 'الشيخ زايد' : 'Sheikh Zayed'}</Link></li>
              <li><Link href="/areas/north-coast" className="hover:text-accent transition">{isRTL ? 'الساحل الشمالي' : 'North Coast'}</Link></li>
              <li><Link href="/areas/new-capital" className="hover:text-accent transition">{isRTL ? 'العاصمة الإدارية' : 'New Capital'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 font-cairo">{t('contactUs')}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="mailto:info@buhoor.com.eg" className="hover:text-accent transition">info@buhoor.com.eg</a></li>
              <li><a href="tel:+201000000000" className="hover:text-accent transition" dir="ltr">+20 100 000 0000</a></li>
              <li className="pt-4">
                <Link href="/add-property" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition inline-block border border-white/20">
                  {t('addProperty')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t('buhoorRealty')}. {t('copyright')}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-white transition">{t('termsAndConditions')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

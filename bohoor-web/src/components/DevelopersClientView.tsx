'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface DevelopersClientViewProps {
  developers: any[];
}

export default function DevelopersClientView({ developers }: DevelopersClientViewProps) {
  const { t, getLocalized, isRTL } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-cairo" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('developersPageTitle')}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          {t('developersPageSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(developers || []).map((dev: any) => {
          const devName = getLocalized(dev, 'name');
          const devBio = getLocalized(dev, 'bio');

          return (
            <div key={dev.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300">
              <div className="h-44 bg-gray-50/70 flex items-center justify-center p-6 border-b border-gray-100">
                <div className="w-24 h-24 bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  {dev.logoUrl ? (
                    <img
                      src={dev.logoUrl}
                      alt={devName}
                      className="w-full h-full object-contain"
                      onError={(e: any) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}
                  <div className={`${dev.logoUrl ? 'hidden' : ''} text-primary flex items-center justify-center`}>
                    <BuildingOfficeIcon className="w-12 h-12" />
                  </div>
                </div>
              </div>
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{devName}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {devBio || t('defaultDevBio')}
                </p>
                <Link href={`/developers/${dev.slug || dev.id}`} className="inline-block bg-primary/10 text-accent hover:bg-primary hover:text-white font-medium px-6 py-2 rounded-xl transition w-full">
                  {t('viewProjects')}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

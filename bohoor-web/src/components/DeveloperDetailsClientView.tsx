'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface DeveloperDetailsClientViewProps {
  developer: any;
  projects: any[];
}

export default function DeveloperDetailsClientView({ developer, projects }: DeveloperDetailsClientViewProps) {
  const { t, getLocalized, isRTL } = useLanguage();

  const devName = getLocalized(developer, 'name');
  const devBio = getLocalized(developer, 'bio');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-cairo" dir={isRTL ? 'rtl' : 'ltr'}>
      <nav className="flex mb-8 text-sm text-gray-500 font-medium">
        <Link href="/" className="hover:text-primary transition">{t('home')}</Link>
        <span className="mx-2">/</span>
        <Link href="/developers" className="hover:text-primary transition">{t('developers')}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{devName}</span>
      </nav>

      {/* Developer Header */}
      <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 mb-12">
        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-50 rounded-3xl p-3 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
          {developer.logoUrl ? (
            <img
              src={developer.logoUrl}
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
          <div className={`${developer.logoUrl ? 'hidden' : ''} text-primary flex items-center justify-center`}>
            <BuildingOfficeIcon className="w-16 h-16" />
          </div>
        </div>
        <div className="text-center md:text-start flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{devName}</h1>
          <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl whitespace-pre-line text-sm sm:text-base">
            {devBio || t('noDescriptionAvailable')}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-primary font-bold text-base">{projects?.length ?? 0}</span>
              <span>{t('projectsCountLabel')}</span>
            </div>
            {(developer.units?.length > 0 || (developer._count?.units && developer._count.units > 0)) && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-700 font-bold text-base">{developer.units?.length ?? developer._count?.units}</span>
                <span>{t('unitsCountLabel')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">{t('developerProjectsTitle')}</h2>
        
        {(!projects || projects.length === 0) ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center text-gray-500">
            {t('noProjectsForDeveloper')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj: any) => {
              const projName = getLocalized(proj, 'name');
              const projLocation = getLocalized(proj, 'location');
              const projDesc = getLocalized(proj, 'description');

              return (
                <Link href={`/projects/${proj.slug || proj.id}`} key={proj.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={proj.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'} 
                      alt={projName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 start-4 text-white font-bold text-xl">{projName}</h3>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-gray-500 mb-3 text-sm gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {projLocation || (isRTL ? 'غير محدد' : 'N/A')}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {projDesc || t('noProjectDescription')}
                      </p>
                    </div>
                    <span className="text-primary font-medium group-hover:text-primary/90 transition">
                      {t('viewProjectUnits')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

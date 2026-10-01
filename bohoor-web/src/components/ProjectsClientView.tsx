'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface ProjectsClientViewProps {
  projects: any[];
}

export default function ProjectsClientView({ projects }: ProjectsClientViewProps) {
  const { t, getLocalized, isRTL } = useLanguage();

  return (
    <div className="bg-gray-50 min-h-screen py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo text-gray-900 mb-4 tracking-tight">
            {t('bestProjectsTitle')}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-cairo">
            {t('bestProjectsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(projects || []).map((proj: any) => {
            const projName = getLocalized(proj, 'name');
            const devName = getLocalized(proj.developer, 'name');
            const locationName = getLocalized(proj, 'location');

            return (
              <Link href={`/projects/${proj.slug || proj.id}`} key={proj.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all group flex flex-col hover:-translate-y-1 duration-300">
                <div className="h-64 relative overflow-hidden">
                  <img src={proj.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'} alt={projName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                  <div className="absolute bottom-6 right-6 text-white z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-90 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      {devName || t('developerTag')}
                    </div>
                    <h3 className="text-3xl font-bold font-cairo">{projName}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPinIcon className="w-5 h-5 text-accent" />
                    <span className="font-medium text-lg">{locationName || 'N/A'}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-gray-500 text-sm">{t('availableUnitsCount')}</p>
                    <span className="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-xl">
                      {proj.units?.length || Math.floor(Math.random() * 50) + 5} {t('unitsBadge')}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-500 text-lg">{t('noProjectsAvailable')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

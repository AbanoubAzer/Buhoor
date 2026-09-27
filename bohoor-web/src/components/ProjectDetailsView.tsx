'use client';

import React from 'react';
import Link from 'next/link';
import { MapPinIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import ShareButton from './ShareButton';
import OpenInAppBanner from './OpenInAppBanner';
import { useLanguage } from '../context/LanguageContext';

interface ProjectDetailsViewProps {
  project: any;
  units: any[];
}

export default function ProjectDetailsView({ project, units }: ProjectDetailsViewProps) {
  const { t, isRTL, getLocalized, formatPrice, formatArea } = useLanguage();

  const projectName = getLocalized(project, 'name') || project.name;
  const projectDescription = getLocalized(project, 'description') || project.description;
  const projectLocation = getLocalized(project, 'location') || project.location;
  const developerName = getLocalized(project.developer, 'name') || project.developer?.name;

  return (
    <>
      <OpenInAppBanner path={`projects/${project.id}`} title={projectName} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Navigation & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <nav className="flex text-sm text-gray-500 font-medium items-center flex-wrap gap-1">
            <Link href="/" className="hover:text-primary transition">{t('home')}</Link>
            <span className="mx-1">/</span>
            <Link href={`/developers/${project.developerId}`} className="hover:text-primary transition">
              {developerName || t('developer')}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900">{projectName}</span>
          </nav>

          <ShareButton 
            title={projectName}
            description={`${projectLocation ? projectLocation + ' • ' : ''}${developerName || ''}`}
            deepLinkPath={`projects/${project.id}`}
            url={`https://buhoor-web.vercel.app/projects/${project.id}`}
            buttonText={t('shareProject')}
            variant="outline"
          />
        </div>

        {/* Project Hero */}
        <div className="relative rounded-[3rem] overflow-hidden mb-12 shadow-md">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img 
            src={project.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'} 
            alt={projectName} 
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">{projectName}</h1>
            <div className="flex items-center gap-2 text-lg text-gray-200 mb-6">
              <MapPinIcon className="w-6 h-6" />
              {projectLocation || (isRTL ? 'موقع غير محدد' : 'Location Not Specified')}
            </div>
            {projectDescription && (
              <p className="max-w-3xl text-gray-100 text-lg leading-relaxed">
                {projectDescription}
              </p>
            )}
          </div>
        </div>

        {/* Project Units */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t('availableUnitsInProject')}</h2>
            <span className="bg-primary/20 text-primary/90 px-4 py-1.5 rounded-full font-bold text-sm">
              {units.length} {t('units')}
            </span>
          </div>

          {units.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-12 text-center text-gray-500 border border-gray-100">
              {t('noUnitsInProject')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {units.map((unit: any) => {
                const cover = unit.coverImage || (unit.images?.[0]?.includes(',') ? unit.images[0].split(',')[0].trim() : unit.images?.[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
                const unitTitle = getLocalized(unit, 'title') || unit.title;
                const unitPrice = formatPrice(unit.totalPrice || unit.originalContractPrice || unit.cashPaidToSeller);
                const isInstallment = unit.remainingInstallments > 0 || unit.installmentsCount > 0 || (unit.sellerType === 'DEVELOPER' && !unit.isCashOnly);

                return (
                  <Link href={`/units/${unit.code || unit.id}`} key={unit.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group block">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={cover} 
                        alt={unitTitle} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-accent flex items-center gap-2 shadow-sm">
                        <span>{unitPrice}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${isInstallment ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'}`}>
                          {isInstallment ? t('installments') : t('cash')}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{unitTitle}</h3>
                      <div className="flex items-center text-gray-500 mb-4 text-sm gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {getLocalized(unit, 'location') || projectLocation || '-'}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          <HomeModernIcon className="w-4 h-4 text-gray-400" />
                          {formatArea(unit.area)}
                        </span>
                        <span className="text-primary font-medium group-hover:text-primary/90 transition">
                          {t('viewDetails')}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

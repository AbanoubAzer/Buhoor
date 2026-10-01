'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPinIcon,
  HomeModernIcon,
  VideoCameraIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import ShareButton from './ShareButton';
import OpenInAppBanner from './OpenInAppBanner';
import { useLanguage } from '../context/LanguageContext';

interface ProjectDetailsViewProps {
  project: any;
  units: any[];
}

export default function ProjectDetailsView({ project, units }: ProjectDetailsViewProps) {
  const { t, isRTL, getLocalized, formatPrice, formatArea } = useLanguage();
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);

  const projectName = getLocalized(project, 'name') || project.name;
  const projectDescription = getLocalized(project, 'description') || project.description;
  const projectLocation = getLocalized(project, 'location') || project.location;
  const developerName = getLocalized(project.developer, 'name') || project.developer?.name;

  // Combine cover image + gallery images into a unified gallery list (removing duplicates)
  const galleryImages: string[] = Array.from(
    new Set([
      ...(project.coverImage ? [project.coverImage] : []),
      ...(Array.isArray(project.images) ? project.images : []),
    ].filter(Boolean))
  );

  return (
    <>
      <OpenInAppBanner path={`projects/${project.slug || project.id}`} title={projectName} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-arabic" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Navigation & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <nav className="flex text-sm text-gray-500 font-medium items-center flex-wrap gap-1">
            <Link href="/" className="hover:text-primary transition">{t('home')}</Link>
            <span className="mx-1">/</span>
            <Link href={`/developers/${project.developer?.slug || project.developerId}`} className="hover:text-primary transition">
              {developerName || (isRTL ? 'المطور' : 'Developer')}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 font-bold">{projectName}</span>
          </nav>

          <ShareButton 
            title={projectName}
            description={`${projectLocation ? projectLocation + ' • ' : ''}${developerName || ''}`}
            deepLinkPath={`projects/${project.slug || project.id}`}
            url={`https://buhoor-web.vercel.app/projects/${project.slug || project.id}`}
            buttonText={t('shareProject')}
            variant="outline"
          />
        </div>

        {/* Cover Image Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
          <img 
            src={project.coverImage || galleryImages[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'} 
            alt={projectName} 
            className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 text-white">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {project.developer && (
                <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-white/20">
                  <BuildingOffice2Icon className="w-3.5 h-3.5" />
                  {developerName}
                </span>
              )}
              {projectLocation && (
                <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {projectLocation}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 text-white drop-shadow-sm">{projectName}</h1>

            {project.videoLink && (
              <a 
                href={project.videoLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 mt-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-md w-fit"
              >
                <VideoCameraIcon className="w-5 h-5" />
                {isRTL ? 'مشاهدة الفيديو' : 'Watch Video'}
              </a>
            )}
          </div>
        </div>

        {/* Description Section (تحت الصورة) */}
        {projectDescription && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span>{isRTL ? 'عن المشروع' : 'About Project'}</span>
            </h2>
            <div className="text-gray-700 leading-relaxed text-base sm:text-lg space-y-3 whitespace-pre-line font-arabic">
              {projectDescription}
            </div>
          </div>
        )}

        {/* Interactive Image Gallery */}
        {galleryImages.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <PhotoIcon className="w-6 h-6 text-primary" />
                <span>{isRTL ? 'معرض صور المشروع' : 'Project Gallery'}</span>
              </h2>
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                {galleryImages.length} {isRTL ? 'صور' : 'Photos'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImgIndex(i)}
                  className="group relative rounded-2xl overflow-hidden h-44 sm:h-52 bg-gray-100 cursor-pointer shadow-sm hover:shadow-md border border-gray-100"
                >
                  <img 
                    src={img} 
                    alt={`${projectName} ${i + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow transition transform translate-y-2 group-hover:translate-y-0">
                      {isRTL ? 'تكبير' : 'Enlarge'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImgIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button 
              onClick={() => setSelectedImgIndex(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-50"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>

            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={() => setSelectedImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : (prev ?? 0) - 1))}
                  className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-50"
                >
                  <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <button 
                  onClick={() => setSelectedImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : (prev ?? 0) + 1))}
                  className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-50"
                >
                  <ChevronRightIcon className="w-7 h-7" />
                </button>
              </>
            )}

            <div className="max-w-4xl max-h-[85vh] relative flex flex-col items-center">
              <img 
                src={galleryImages[selectedImgIndex]} 
                alt="Selected" 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl" 
              />
              <div className="mt-4 text-white/80 text-sm font-semibold bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                {selectedImgIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}

        {/* Project Units */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('availableUnitsInProject')}</h2>
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

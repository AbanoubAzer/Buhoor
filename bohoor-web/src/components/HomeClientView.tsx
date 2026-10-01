'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPinIcon, 
  HomeModernIcon, 
  BuildingOfficeIcon, 
  ChatBubbleLeftRightIcon,
  BuildingOffice2Icon,
  HeartIcon
} from "@heroicons/react/24/outline";
import HeroSlider from './HeroSlider';
import AppDownloadSection from './AppDownloadSection';
import { useLanguage } from '../context/LanguageContext';

interface HomeClientViewProps {
  heroSlides: any[];
  projectsData: any[];
  projects: any[];
  developers: any[];
  locations: any[];
  units: any[];
  fallbackAreaImages: string[];
}

export default function HomeClientView({
  heroSlides,
  projectsData,
  projects,
  developers,
  locations,
  units,
  fallbackAreaImages,
}: HomeClientViewProps) {
  const { t, getLocalized, isRTL, formatPrice, formatArea } = useLanguage();

  return (
    <div className="flex flex-col gap-10 sm:gap-16 lg:gap-20 pb-16" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/201000000000" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 sm:p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center group"
        aria-label={t('contactWhatsApp')}
      >
        <span className="hidden sm:inline-block absolute right-full mr-4 bg-white text-gray-800 text-sm px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg font-bold">
          {t('contactWhatsApp')}
        </span>
        <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-8 sm:h-8" />
      </a>

      <HeroSlider initialSlides={heroSlides} allProjects={projectsData} />

      {/* 1. Browse by Type */}
      <section className="max-w-[98%] mx-auto w-full pt-12 pb-8 font-arabic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-cairo text-gray-900">{t('browseByTypeLabel')} <span className="text-primary">{t('typeLabel')}</span> &larr;</h2>
            <Link href="/projects" className="text-gray-500 hover:text-accent font-bold transition text-sm">{t('allProjects')} &larr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: t('apartmentsCategory'), query: "شقة", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", icon: BuildingOfficeIcon },
              { name: t('villasCategory'), query: "فيلا", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", icon: HomeModernIcon },
              { name: t('chaletsCategory'), query: "شاليه", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2", icon: HomeModernIcon },
              { name: t('commercialCategory'), query: "تجاري", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", icon: BuildingOffice2Icon },
              { name: t('landsCategory'), query: "أرض", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", icon: MapPinIcon },
            ].map((type, i) => (
              <Link href={`/units?type=${encodeURIComponent(type.query)}`} key={i} className="bg-white rounded-[2rem] p-2 flex items-center justify-between shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all group overflow-hidden h-24">
                <div className="flex-1 text-center font-bold text-gray-800">
                  <type.icon className="w-6 h-6 mx-auto text-primary mb-1 group-hover:scale-110 transition-transform" />
                  {type.name}
                </div>
                <div className="w-1/2 h-full rounded-2xl overflow-hidden relative">
                  <Image src={type.img} fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt={type.name} sizes="(max-width: 768px) 50vw, 20vw" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Latest Projects */}
      <section className="max-w-[98%] mx-auto w-full pb-16 font-arabic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold font-cairo text-gray-900 border-r-4 border-accent pr-4">{t('latestProjects')}</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Promotional Vertical Banner */}
            <div className="lg:w-1/4 bg-[#0f2142] rounded-3xl overflow-hidden relative p-8 text-white flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <Image src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800" fill className="object-cover opacity-40 mix-blend-overlay" alt="Promo" sizes="(max-width: 1024px) 100vw, 25vw" />
              
              <div className="relative z-20">
                <div className="flex items-center gap-2 mb-8">
                  <img src="/logo.jpg" className="h-8 rounded" alt="Buhoor" />
                  <span className="font-bold">{t('buhoorRealty')}</span>
                </div>
                <h3 className="text-3xl font-bold font-cairo leading-snug mb-4">
                  {t('featuredProjects')} <br/>
                  <span className="text-accent">{t('bestInvestmentInEgypt')}</span>
                </h3>
              </div>
              <div className="relative z-20 mt-auto">
                <Link href="/projects" className="inline-flex items-center gap-2 border border-white/40 hover:bg-white hover:text-[#0f2142] px-6 py-3 rounded-xl font-bold transition text-sm">
                  {t('exploreProjects')} &larr;
                </Link>
              </div>
            </div>

            {/* Project Cards */}
            <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj: any) => {
                const projName = getLocalized(proj, 'name') || proj.name;
                const projLoc = getLocalized(proj, 'location') || proj.location;
                return (
                  <Link href={`/projects/${proj.slug || proj.id}`} key={proj.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
                    <div className="h-48 relative overflow-hidden">
                      <Image src={proj.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'} alt={projName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
                        <MapPinIcon className="w-4 h-4 text-gray-500" /> {projLoc || '-'}
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm">
                        <HeartIcon className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-between text-center bg-white">
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-1">{projName}</h3>
                        <p className="text-sm text-gray-500 mb-4">{projLoc || '-'}</p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1"><BuildingOfficeIcon className="w-4 h-4 text-gray-400"/> {t('projects')}</div>
                        <div className="flex items-center gap-1"><HomeModernIcon className="w-4 h-4 text-gray-400"/> {proj._count?.units || proj.units?.length || 0} {t('unitsCountLabel')}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Top Developers */}
      <section className="bg-gray-50 py-16 font-arabic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold font-cairo text-gray-900">{t('topDevelopersTitle')}</h2>
            <Link href="/developers" className="text-primary hover:text-accent font-bold transition">{t('viewAll')} &larr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {developers.map((dev: any) => {
              const devName = getLocalized(dev, 'name') || dev.name;
              const pCount = dev._count?.projects ?? dev.projects?.length ?? 0;
              const uCount = dev._count?.units ?? dev.units?.length ?? 0;
              return (
                <Link href={`/developers/${dev.slug || dev.id}`} key={dev.id} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all group flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors overflow-hidden border border-gray-100 p-2">
                    {dev.logoUrl ? (
                      <img src={dev.logoUrl} alt={devName} className="w-full h-full object-contain rounded-full" onError={(e: any) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <BuildingOfficeIcon className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{devName}</h3>
                  <p className="text-sm text-gray-500">{pCount} {t('projectsCountLabel')} | {uCount} {t('unitsCountLabel')}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Top Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full font-arabic">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold font-cairo text-gray-900">{t('popularAreasTitle')}</h2>
          <Link href="/areas" className="text-primary hover:text-accent font-bold transition">{t('allAreas')} &larr;</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc: any, i: number) => {
            const locName = getLocalized(loc, 'name') || loc.name;
            const govName = getLocalized(loc, 'governorate') || loc.governorate;
            return (
              <Link href={`/units?location=${encodeURIComponent(locName)}`} key={loc.id || i} className="relative h-64 rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all block">
                <Image 
                  src={loc.imageUrl || loc.image || fallbackAreaImages[i % fallbackAreaImages.length]} 
                  alt={locName} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
                
                {govName && (
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {govName}
                  </span>
                )}

                <div className="absolute bottom-6 right-6 text-white">
                  <h3 className="text-2xl font-bold font-cairo mb-1">{locName}</h3>
                  <p className="text-sm text-gray-300">{t('exploreAvailableProperties')} &larr;</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Units */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full font-arabic">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold font-cairo text-gray-900">{t('featuredUnitsTitle')}</h2>
          <Link href="/units" className="text-primary hover:text-accent font-bold transition">{t('viewAll')} &larr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit: any) => {
            const unitTitle = getLocalized(unit, 'title') || unit.title;
            const unitLoc = getLocalized(unit, 'location') || '-';
            const unitPrice = formatPrice(unit.totalPrice || unit.originalContractPrice || unit.cashPaidToSeller);
            const isInstallment = unit.remainingInstallments > 0 || unit.installmentsCount > 0 || (unit.sellerType === 'DEVELOPER' && !unit.isCashOnly);

            return (
              <Link href={`/units/${unit.code || unit.id}`} key={unit.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
                <div className="relative h-60 overflow-hidden">
                  <Image 
                    src={unit.coverImage || unit.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} 
                    alt={unitTitle} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                    {unit.isVerified && (
                      <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                        ⭐ {t('verified')}
                      </span>
                    )}
                    {unit.expectedRentalRoi > 0 && (
                      <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                        💰 {t('expectedRoi')} {Number(unit.expectedRentalRoi)}%
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm">
                    <HeartIcon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{unitTitle}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      {unitLoc}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-3">
                      <span className="text-2xl font-extrabold text-primary font-cairo">{unitPrice}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isInstallment ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'}`}>
                        {isInstallment ? t('installments') : t('cash')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-500 text-xs pt-2 border-t border-gray-50">
                      <span>🛏️ {unit.bedrooms || 0} {t('bedrooms')}</span>
                      <span>🚿 {unit.bathrooms || 0} {t('bathrooms')}</span>
                      <span>📐 {formatArea(unit.area)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. Mobile App Download Showcase */}
      <AppDownloadSection />
    </div>
  );
}

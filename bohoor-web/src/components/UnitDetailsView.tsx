'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPinIcon, 
  HomeModernIcon, 
  BuildingOffice2Icon, 
  PhoneIcon, 
  ShareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import UnitLeadForm from './UnitLeadForm';
import UnitGallery from './UnitGallery';
import ShareButton from './ShareButton';
import OpenInAppBanner from './OpenInAppBanner';
import { useLanguage } from '../context/LanguageContext';

interface UnitDetailsViewProps {
  unit: any;
}

export default function UnitDetailsView({ unit }: UnitDetailsViewProps) {
  const { t, language, isRTL, getLocalized, formatPrice, formatArea } = useLanguage();

  const getDirectImageUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('drive.google.com/file/d/')) {
      const id = url.split('/file/d/')[1]?.split('/')[0];
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  };

  const title = getLocalized(unit, 'title') || unit.title;
  const description = getLocalized(unit, 'description') || unit.description;
  const locationLabel = getLocalized(unit, 'location');
  const unitTypeName = getLocalized(unit, 'unitType') || unit.unitType?.name;

  const rawPrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
  const formattedPriceText = formatPrice(rawPrice);
  const totalFormattedText = formatPrice(unit.totalPrice);

  const isSea = Boolean(
    unit.isSeaView || 
    unit.location?.name?.includes('جونة') || 
    unit.location?.name?.includes('ساحل') || 
    unit.location?.name?.includes('بحر')
  );

  const rawImages = unit.images 
    ? (Array.isArray(unit.images) 
        ? unit.images.flatMap((img: string) => img.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean)) 
        : [unit.images])
    : [];
  const galleryImages = rawImages.map(getDirectImageUrl);
  const coverImage = getDirectImageUrl(unit.coverImage || galleryImages[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

  const freqLabel = (freq?: string) => {
    switch (freq) {
      case 'MONTHLY': return t('freqMonthly');
      case 'QUARTERLY': return t('freqQuarterly');
      case 'SEMI_ANNUAL': return t('freqSemiAnnual');
      case 'ANNUAL': return t('freqAnnual');
      default: return freq || '';
    }
  };

  return (
    <>
      <OpenInAppBanner path={`units/${unit.id}`} title={title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Breadcrumbs & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <nav className="flex text-sm text-gray-500 font-medium items-center flex-wrap gap-1">
            <Link href="/" className="hover:text-primary transition">{t('home')}</Link>
            <span className="mx-1">/</span>
            <Link href="/units" className="hover:text-primary transition">{t('units')}</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 truncate max-w-xs">{title}</span>
          </nav>

          <div className="flex items-center gap-3">
            <ShareButton 
              title={title}
              description={`${locationLabel ? locationLabel + ' • ' : ''}${formatArea(unit.area)}`}
              priceText={formattedPriceText}
              deepLinkPath={`units/${unit.id}`}
              url={`https://buhoor-web.vercel.app/units/${unit.id}`}
              buttonText={t('shareProperty')}
              variant="outline"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cover Image & Gallery */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-96 bg-gray-50 flex items-center justify-center">
                <img 
                  src={coverImage} 
                  alt={title}
                  className="w-full h-full object-contain"
                />
              </div>
              {galleryImages.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">{t('otherPhotos')}</h4>
                  <div className="pt-2">
                    <UnitGallery images={galleryImages} />
                  </div>
                </div>
              )}

              {/* Videos Section */}
              {unit.videos && unit.videos.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">{t('videos')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unit.videos.flatMap((vid: string) => vid.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean)).map((vid: string, i: number) => {
                      let embedUrl = vid;
                      if (vid.includes('youtube.com/watch?v=')) {
                        const videoId = vid.split('v=')[1]?.split('&')[0];
                        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
                      } else if (vid.includes('youtu.be/')) {
                        const videoId = vid.split('youtu.be/')[1]?.split('?')[0];
                        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
                      }
                      
                      return (
                        <div key={i} className="rounded-2xl overflow-hidden shadow-sm aspect-video bg-black">
                          <iframe 
                            src={embedUrl} 
                            title="Video" 
                            className="w-full h-full border-0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Details Content Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                  <div className="flex items-center text-gray-600 font-medium gap-2 text-base">
                    <MapPinIcon className="w-5 h-5 text-primary shrink-0" />
                    <span>{locationLabel || (isRTL ? 'موقع غير محدد' : 'Location Not Specified')}</span>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {isSea && (
                      <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                        🌊 {t('seaView')}
                      </span>
                    )}
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      📈 {t('expectedRoi')} {Number(unit.expectedRentalRoi) > 0 ? Number(unit.expectedRentalRoi) : (isSea ? 16.5 : 12)}% {t('perYear')}
                    </span>
                    {unit.sellerType && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs ${
                        unit.sellerType === 'DEVELOPER'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}>
                        {unit.sellerType === 'DEVELOPER' ? `🏢 ${t('directDeveloper')}` : `👤 ${t('resale')}`}
                      </span>
                    )}
                    {unit.deliveryStatus && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
                        {unit.deliveryStatus === 'READY' ? `✅ ${t('readyToDeliver')}` : `🏗️ ${t('underConstruction')} ${unit.deliveryYear || ''}`}
                      </span>
                    )}
                    {unit.isCashOnly && (
                      <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold px-3 py-1 rounded-full">
                        💵 {t('cashOnly')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex flex-col gap-2 min-w-[220px] w-full md:w-auto">
                  <div className="text-left bg-primary/10 px-6 py-3.5 rounded-2xl border border-primary/20">
                    <p className="text-primary text-sm font-semibold mb-1">
                      {unit.sellerType === 'DEVELOPER' && unit.cashPaidToSeller ? t('downPayment') : t('totalPrice')}
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      {formattedPriceText}
                    </p>
                  </div>
                  {unit.totalPrice && Number(unit.totalPrice) > 0 && unit.cashPaidToSeller && Number(unit.cashPaidToSeller) !== Number(unit.totalPrice) && (
                    <div className="text-left bg-gray-50 px-6 py-2.5 rounded-2xl border border-gray-100">
                      <p className="text-gray-500 text-xs font-semibold mb-0.5">{t('totalPrice')}</p>
                      <p className="text-lg font-bold text-gray-800">
                        {totalFormattedText}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Developer & Project Info Card */}
              {(unit.developer || unit.project) && (
                <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-5 rounded-2xl border border-indigo-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    {unit.developer && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{t('developer')}:</span>
                        <Link href={`/developers/${unit.developer.id}`} className="text-base font-bold text-indigo-950 hover:text-primary transition underline decoration-indigo-300">
                          🏢 {getLocalized(unit.developer, 'name') || unit.developer.name}
                        </Link>
                      </div>
                    )}
                    {unit.project && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">{t('project')}:</span>
                        <Link href={`/projects/${unit.project.id}`} className="font-bold text-purple-950 hover:text-primary transition underline decoration-purple-300">
                          🏗️ {getLocalized(unit.project, 'name') || unit.project.name}
                        </Link>
                      </div>
                    )}
                  </div>
                  {unit.project && (
                    <Link 
                      href={`/projects/${unit.project.id}`}
                      className="bg-white hover:bg-indigo-50 text-indigo-950 border border-indigo-200 text-xs font-bold px-4 py-2 rounded-xl transition shadow-2xs whitespace-nowrap"
                    >
                      {t('viewProjectDetails')} &larr;
                    </Link>
                  )}
                </div>
              )}

              {/* Installment Plan Breakdown */}
              {Number(unit.remainingInstallments) > 0 ? (
                <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>💳</span> {t('installmentPlan')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-gray-500 text-xs block mb-1">{t('downPayment')}</span>
                      <span className="font-extrabold text-primary text-lg">{formatPrice(unit.cashPaidToSeller)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-gray-500 text-xs block mb-1">{t('remainingInstallments')}</span>
                      <span className="font-extrabold text-gray-800 text-lg">{formatPrice(unit.remainingInstallments)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-gray-500 text-xs block mb-1">{t('monthlyInstallment')}</span>
                      <span className="font-extrabold text-accent text-lg">{formatPrice(unit.monthlyEquivalentInstallment)} / {t('month')}</span>
                    </div>
                    {unit.installmentsCount && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-gray-500 text-xs block mb-1">{t('installmentsCount')}</span>
                        <span className="font-extrabold text-gray-800 text-base">{unit.installmentsCount} {t('installment')}</span>
                      </div>
                    )}
                    {unit.installmentFrequency && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-gray-500 text-xs block mb-1">{t('paymentFrequency')}</span>
                        <span className="font-extrabold text-gray-800 text-base">
                          {freqLabel(unit.installmentFrequency)}
                        </span>
                      </div>
                    )}
                    {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-2xs">
                        <span className="text-emerald-700 text-xs block mb-1">{t('cashDiscount')}</span>
                        <span className="font-extrabold text-emerald-800 text-base">{unit.cashDiscountPercentage}% {t('discount')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : unit.isCashOnly ? (
                <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-200/80 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{t('cashOnly')}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{isRTL ? 'هذا العقار معروض للبيع السريع نظام كاش بدون أقساط طويلة الأجل' : 'This property is offered for fast sale, cash only with no long-term installments.'}</p>
                  </div>
                  {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-sm font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200">
                      {t('cashDiscount')} {unit.cashDiscountPercentage}%
                    </span>
                  )}
                </div>
              ) : null}

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <HomeModernIcon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-gray-500 text-xs mb-0.5">{t('area')}</span>
                  <span className="font-bold text-gray-900 text-base">{formatArea(unit.area)}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <BuildingOffice2Icon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-gray-500 text-xs mb-0.5">{t('unitType')}</span>
                  <span className="font-bold text-gray-900 text-base">{unitTypeName || '-'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <span className="w-6 h-6 flex items-center justify-center text-primary mb-2 text-xl">🛏️</span>
                  <span className="text-gray-500 text-xs mb-0.5">{t('bedrooms')}</span>
                  <span className="font-bold text-gray-900 text-base">{unit.bedrooms || '-'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <span className="w-6 h-6 flex items-center justify-center text-primary mb-2 text-xl">🚿</span>
                  <span className="text-gray-500 text-xs mb-0.5">{t('bathrooms')}</span>
                  <span className="font-bold text-gray-900 text-base">{unit.bathrooms || '-'}</span>
                </div>
                {unit.isSeaView && (
                  <div className="bg-cyan-50/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-cyan-200/60">
                    <span className="w-6 h-6 flex items-center justify-center text-cyan-600 mb-2 text-xl">🌊</span>
                    <span className="text-cyan-800 text-xs mb-0.5 font-semibold">{t('view')}</span>
                    <span className="font-bold text-cyan-950 text-sm">{t('directSeaView')}</span>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <span className="w-6 h-6 flex items-center justify-center text-amber-600 mb-2 text-xl">🔑</span>
                  <span className="text-gray-500 text-xs mb-0.5">{t('delivery')}</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {unit.deliveryStatus === 'READY' ? t('ready') : `${unit.deliveryYear || ''}`}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <span className="w-6 h-6 flex items-center justify-center text-indigo-600 mb-2 text-xl">🏛️</span>
                  <span className="text-gray-500 text-xs mb-0.5">{t('governorate')}</span>
                  <span className="font-bold text-gray-900 text-sm">{getLocalized(unit, 'governorate') || '-'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <span className="w-6 h-6 flex items-center justify-center text-emerald-600 mb-2 text-xl">📈</span>
                  <span className="text-gray-500 text-xs mb-0.5">{t('roi')}</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {Number(unit.expectedRentalRoi) > 0 ? `${unit.expectedRentalRoi}%` : (isSea ? '16.5%' : '12%')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('descriptionAndDetails')}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                  {description || (isRTL 
                    ? 'وحدة مميزة بموقع استراتيجي متكامل الخدمات وتشطيب راقٍ، مناسبة جداً للسكن والاستثمار العقاري.' 
                    : 'A prime property with strategic location, full services, and high-end finishing, ideal for living and real estate investment.')
                  }
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Lead Form */}
            <UnitLeadForm 
              unitPrice={[
                unit.isCashOnly ? unit.cashPaidToSeller : null,
                unit.totalPrice,
                unit.cashPaidToSeller,
                unit.originalContractPrice
              ].map(v => Number(v)).find(v => v && v > 0) || 0} 
              unitId={unit.id} 
              sellerType={unit.sellerType}
            />

            {/* Share Card */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ShareIcon className="w-4 h-4 text-primary" />
                {t('shareProperty')}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {isRTL 
                  ? 'يمكنك مشاركة تفاصيل هذه الوحدة مع عائلتك أو أصدقائك عبر واتساب وشبكات التواصل، أو فتحها مباشرة في تطبيق بُحور.'
                  : 'Share this property details with family and friends via WhatsApp, social platforms, or open directly in the Bohoor app.'
                }
              </p>
              <ShareButton 
                title={title}
                description={`${locationLabel ? locationLabel + ' • ' : ''}${formatArea(unit.area)}`}
                priceText={formattedPriceText}
                deepLinkPath={`units/${unit.id}`}
                url={`https://buhoor-web.vercel.app/units/${unit.id}`}
                variant="primary"
                className="w-full justify-center"
                buttonText={t('shareUnitNow')}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

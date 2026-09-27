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

  const uPrice = [
    unit.isCashOnly ? unit.cashPaidToSeller : null,
    unit.totalPrice,
    unit.cashPaidToSeller,
    unit.originalContractPrice
  ].map(v => Number(v)).find(v => v && v > 0) || rawPrice || 0;

  const rentalYield = Number(unit.expectedRentalRoi) > 0 
    ? Number(unit.expectedRentalRoi) 
    : (isSea ? 16.5 : 12.0);
  const annualRent = Math.round(uPrice * (rentalYield / 100));
  const nightlyRate = Math.round(annualRent / 270);
  const appreciation = isSea ? 30 : 10;
  const annualAppreciationEgp = Math.round(uPrice * (appreciation / 100));
  const totalRoi = Number((rentalYield + appreciation).toFixed(1));
  const totalAnnualEgp = annualRent + annualAppreciationEgp;
  const paybackYears = annualRent > 0 ? (uPrice / annualRent).toFixed(1) : null;
  const totalPaybackYears = totalRoi > 0 ? (100 / totalRoi).toFixed(1) : null;

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Breadcrumbs & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <nav className="flex text-xs sm:text-sm text-gray-500 font-medium items-center flex-wrap gap-1">
            <Link href="/" className="hover:text-primary transition">{t('home')}</Link>
            <span className="mx-1">/</span>
            <Link href="/units" className="hover:text-primary transition">{t('units')}</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-xs">{title}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          
          {/* Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Cover Image & Gallery */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-64 sm:h-96 bg-gray-50 flex items-center justify-center">
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
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
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

              {/* ROI & Investment Calculator Card */}
              {uPrice > 0 && (
                <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-50/90 p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-emerald-200/90 mb-8 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center text-xl shrink-0">
                        📈
                      </span>
                      <div>
                        <h3 className="text-lg font-extrabold text-emerald-950 font-cairo">
                          {isRTL ? 'الجدوى والعائد على الاستثمار (ROI Breakdown)' : 'Investment ROI & Feasibility Study'}
                        </h3>
                        <p className="text-xs text-emerald-800/80 font-medium">
                          {isRTL 
                            ? 'تقدير الأرباح الإيجارية (270 ليلة - إشغال 75%) مع معدل ارتفاع قيمة العقار السنوي'
                            : 'Estimated rental income (270 nights - 75% occupancy) + annual capital appreciation'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs flex items-center gap-1 ${
                      isSea ? 'bg-cyan-100/90 text-cyan-900 border-cyan-300' : 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                    }`}>
                      {isSea 
                        ? (isRTL ? '🌊 مشروع سياحي بحري (+30% نمو سنوي)' : '🌊 Coastal Tourist Project (+30% Growth)') 
                        : (isRTL ? '🏢 مشروع سكني (+10% نمو سنوي)' : '🏢 Residential Project (+10% Growth)')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* 1. الإيجار السنوي */}
                    <div className="bg-white/95 backdrop-blur p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                      <span className="text-[11px] font-bold text-gray-500 block mb-1">
                        🏡 {isRTL ? 'العائد الإيجاري السنوي' : 'Annual Rental Income'}
                      </span>
                      <span className="text-xl font-black text-emerald-800 block">
                        {formatPrice(annualRent)} / {isRTL ? 'سنة' : 'yr'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                        {isRTL ? `عائد ${rentalYield}% (~${nightlyRate.toLocaleString('ar-EG')} ج/ليلة)` : `${rentalYield}% ROI (~${nightlyRate.toLocaleString()} EGP/night)`}
                      </span>
                    </div>

                    {/* 2. نمو ثمن العقار */}
                    <div className="bg-white/95 backdrop-blur p-4 rounded-2xl border border-blue-100 shadow-2xs">
                      <span className="text-[11px] font-bold text-gray-500 block mb-1">
                        📈 {isRTL ? 'نمو قيمة العقار السنوي' : 'Annual Capital Growth'}
                      </span>
                      <span className="text-xl font-black text-blue-800 block">
                        +{appreciation}% {isRTL ? 'سنوياً' : '/year'}
                      </span>
                      <span className="text-[11px] font-bold text-blue-600 block mt-1">
                        +{formatPrice(annualAppreciationEgp)} {isRTL ? 'زيادة متوقعة' : 'expected gain'}
                      </span>
                    </div>

                    {/* 3. إجمالي العائد */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm">
                      <span className="text-[11px] font-bold text-emerald-100 block mb-1">
                        🚀 {isRTL ? 'إجمالي العائد (Total ROI)' : 'Total Annual ROI'}
                      </span>
                      <span className="text-2xl font-black block">
                        {totalRoi}%
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-100 block mt-1">
                        ~{formatPrice(totalAnnualEgp)} {isRTL ? 'أرباح سنوية شاملة' : 'total yearly profit'}
                      </span>
                    </div>

                    {/* 4. استرداد كامل قيمة الوحدة */}
                    <div className="bg-white/95 backdrop-blur p-4 rounded-2xl border border-amber-200/90 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold text-amber-900 block">
                            ⏳ {isRTL ? 'استرداد ثمن العقار' : 'Payback Period'}
                          </span>
                          <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            {isRTL ? 'رؤيتان' : '2 views'}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center bg-amber-50/90 px-2 py-1 rounded-lg border border-amber-200/60">
                            <span className="text-[10px] font-bold text-amber-900">{isRTL ? '💵 إيجار كاش فقط:' : '💵 Pure Rental:'}</span>
                            <span className="text-xs font-black text-amber-800">{paybackYears ? `${paybackYears} ${isRTL ? 'سنوات' : 'yrs'}` : '-'}</span>
                          </div>
                          <div className="flex justify-between items-center bg-emerald-50/90 px-2 py-1 rounded-lg border border-emerald-200/60">
                            <span className="text-[10px] font-bold text-emerald-950">{isRTL ? '🚀 إجمالي العائد:' : '🚀 Total ROI:'}</span>
                            <span className="text-xs font-black text-emerald-700">{totalPaybackYears ? `${totalPaybackYears} ${isRTL ? 'سنوات' : 'yrs'}` : '-'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold block mt-1.5">
                        {isRTL ? 'استرداد كاش صافٍ أو مضاعفة الثروة' : 'Cash recovery or wealth compound'}
                      </span>
                    </div>
                  </div>

                  {/* Compound Capital Appreciation Breakdown */}
                  {(() => {
                    const rate = appreciation / 100;
                    const year1Value = Math.round(uPrice * Math.pow(1 + rate, 1));
                    const year3Value = Math.round(uPrice * Math.pow(1 + rate, 3));
                    const year5Value = Math.round(uPrice * Math.pow(1 + rate, 5));
                    const year1GainPercent = Math.round((Math.pow(1 + rate, 1) - 1) * 100);
                    const year3GainPercent = Math.round((Math.pow(1 + rate, 3) - 1) * 100);
                    const year5GainPercent = Math.round((Math.pow(1 + rate, 5) - 1) * 100);
                    const year3TotalRent = annualRent * 3;
                    const year5TotalRent = annualRent * 5;

                    return (
                      <div className="mt-5 pt-5 border-t border-emerald-200/80 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📈</span>
                            <h4 className="text-sm font-extrabold text-emerald-950 font-cairo">
                              {isRTL ? 'توقعات نمو القيمة الرأسمالية التراكمية (العائد المركّب)' : 'Compound Capital Appreciation Forecast'}
                            </h4>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                            {isRTL 
                              ? `نمو تراكمي سنوي: ${appreciation}% (يُحسب كل عام على القيمة الجديدة)`
                              : `Annual Compound: ${appreciation}% (calculated on compounding base)`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Year 1 */}
                          <div className="bg-white/95 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-gray-500">{isRTL ? 'بعد سنة (Year 1)' : 'Year 1'}</span>
                              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">+{year1GainPercent}%</span>
                            </div>
                            <span className="text-base font-black text-gray-900 block">
                              {formatPrice(year1Value)}
                            </span>
                            <span className="text-[11px] text-gray-500 block">
                              {isRTL ? `+ أرباح إيجارية: ${formatPrice(annualRent)}` : `+ Rental profit: ${formatPrice(annualRent)}`}
                            </span>
                          </div>

                          {/* Year 3 */}
                          <div className="bg-white/95 p-3.5 rounded-2xl border border-blue-200 shadow-2xs space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-blue-900">{isRTL ? 'بعد 3 سنوات (Year 3)' : 'Year 3'}</span>
                              <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">+{year3GainPercent}%</span>
                            </div>
                            <span className="text-base font-black text-blue-950 block">
                              {formatPrice(year3Value)}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold block">
                              {isRTL ? `+ إجمالي إيجار مجمع: ${formatPrice(year3TotalRent)}` : `+ Cumulative Rent: ${formatPrice(year3TotalRent)}`}
                            </span>
                          </div>

                          {/* Year 5 */}
                          <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-3.5 rounded-2xl shadow-sm space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-emerald-100">{isRTL ? 'بعد 5 سنوات (Year 5)' : 'Year 5'}</span>
                              <span className="text-[11px] font-extrabold text-white bg-white/20 px-2 py-0.5 rounded-md">+{year5GainPercent}%</span>
                            </div>
                            <span className="text-base font-black text-white block">
                              {formatPrice(year5Value)}
                            </span>
                            <span className="text-[11px] text-emerald-200 block">
                              {isRTL ? `+ إجمالي إيجار مجمع: ${formatPrice(year5TotalRent)}` : `+ Cumulative Rent: ${formatPrice(year5TotalRent)}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {paybackYears && (
                    <div className="mt-4 bg-emerald-100/70 border border-emerald-200/90 text-emerald-950 p-4 rounded-2xl text-xs space-y-2.5">
                      <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                        <span className="text-base">💡</span>
                        <span>{isRTL ? 'رؤيتان لاسترداد رأس المال:' : 'Two perspectives on capital recovery:'}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/95 p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                          <span className="font-extrabold text-amber-900 flex items-center gap-1">
                            <span>💵</span> {isRTL ? '1. استرداد نقدي بحت (Pure Rental Cash):' : '1. Pure Rental Cash Flow:'}
                          </span>
                          <p className="text-gray-600 leading-relaxed text-[11px]">
                            {isRTL 
                              ? <>تسترد كامل ثمن الوحدة <strong>سيولة نقدية في جيبك</strong> خلال <strong>{paybackYears} سنوات</strong> من أرباح الإيجار اليومي فقط، ويبقى أصل العقار ملكاً حراً لك مجاناً.</>
                              : <>Recover the entire property purchase price in <strong>liquid cash</strong> within <strong>{paybackYears} years</strong> purely from rental profits, retaining the property debt-free.</>}
                          </p>
                        </div>
                        <div className="bg-white/95 p-3 rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                          <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                            <span>🚀</span> {isRTL ? '2. استرداد القيمة الشاملة (Total ROI):' : '2. Total Wealth Generation (Total ROI):'}
                          </span>
                          <p className="text-gray-600 leading-relaxed text-[11px]">
                            {isRTL 
                              ? <>بدمج إيرادات الإيجار مع نمو قيمة العقار السنوي (+{appreciation}% سنوياً)، يتجاوز إجمالي ما حققه استثمارك 100% من ثمن الشراء في غضون <strong>{totalPaybackYears} سنة فقط</strong>!</>
                              : <>Combining rental yields with capital appreciation (+{appreciation}%/yr), your combined investment gain exceeds 100% of purchase price in just <strong>{totalPaybackYears} years</strong>!</>}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

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

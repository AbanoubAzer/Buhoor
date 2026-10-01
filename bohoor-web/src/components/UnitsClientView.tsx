'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import UnitSortSelector from './UnitSortSelector';
import UnitFilterSidebar from './UnitFilterSidebar';
import ShareButton from './ShareButton';
import {
  MapPinIcon,
  HomeModernIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface UnitsClientViewProps {
  units: any[];
  totalUnits: number;
  totalPages: number;
  page: number;
  sortBy?: string;
  query?: string;
  sellerType?: string;
  isCashOnly?: string;
  governorate?: string;
  locationNameParam?: string;
  effectiveLocationId?: string;
  unitTypeId?: string;
  developerId?: string;
  projectId?: string;
  minCashRequired?: string;
  maxCashRequired?: string;
  minMonthlyInstallment?: string;
  maxMonthlyInstallment?: string;
  minArea?: string;
  maxArea?: string;
  bedrooms?: string;
  bathrooms?: string;
  seaView?: string;
  locations: any[];
  unitTypes: any[];
  developers: any[];
  projects: any[];
  governorates: string[];
}

export default function UnitsClientView({
  units,
  totalUnits,
  totalPages,
  page,
  sortBy,
  query,
  sellerType,
  isCashOnly,
  governorate,
  locationNameParam,
  effectiveLocationId,
  unitTypeId,
  developerId,
  projectId,
  minCashRequired,
  maxCashRequired,
  minMonthlyInstallment,
  maxMonthlyInstallment,
  minArea,
  maxArea,
  bedrooms,
  bathrooms,
  seaView,
  locations,
  unitTypes,
  developers,
  projects,
  governorates,
}: UnitsClientViewProps) {
  const { t, getLocalized, isRTL } = useLanguage();

  const buildQuery = (newPage: number, newSort?: string) => {
    const p = new URLSearchParams();
    p.set('page', newPage.toString());
    if (query) p.set('q', query);
    if (sellerType) p.set('sellerType', sellerType);
    if (isCashOnly) p.set('isCashOnly', isCashOnly);
    if (governorate) p.set('governorate', governorate);
    if (effectiveLocationId) p.set('locationId', effectiveLocationId);
    if (locationNameParam) p.set('location', locationNameParam);
    if (unitTypeId) p.set('unitTypeId', unitTypeId);
    if (developerId) p.set('developerId', developerId);
    if (projectId) p.set('projectId', projectId);
    if (minCashRequired) p.set('minCashRequired', minCashRequired);
    if (maxCashRequired) p.set('maxCashRequired', maxCashRequired);
    if (minMonthlyInstallment) p.set('minMonthlyInstallment', minMonthlyInstallment);
    if (maxMonthlyInstallment) p.set('maxMonthlyInstallment', maxMonthlyInstallment);
    if (minArea) p.set('minArea', minArea);
    if (maxArea) p.set('maxArea', maxArea);
    if (bedrooms) p.set('bedrooms', bedrooms);
    if (bathrooms) p.set('bathrooms', bathrooms);
    const targetSort = newSort || sortBy;
    if (targetSort) p.set('sortBy', targetSort);
    return `/units?${p.toString()}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-10 font-cairo" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BuildingOfficeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              {t('exploreAvailablePropertiesTitle')}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {t('unitsCountLabel')}: {totalUnits}
            </p>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">{t('sortBy')}:</label>
            <div className="flex-1 md:w-60">
              <UnitSortSelector currentSort={sortBy || 'default'} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <UnitFilterSidebar
              locations={locations}
              unitTypes={unitTypes}
              developers={developers}
              projects={projects}
              governorates={governorates}
              currentParams={{
                q: query,
                sellerType,
                isCashOnly,
                governorate,
                locationId: effectiveLocationId,
                location: locationNameParam,
                unitTypeId,
                developerId,
                projectId,
                minCashRequired,
                maxCashRequired,
                minMonthlyInstallment,
                maxMonthlyInstallment,
                minArea,
                maxArea,
                bedrooms,
                bathrooms,
                seaView,
                sortBy,
              }}
            />
          </aside>

          {/* Main Units Content */}
          <div className="flex-1">
            {units.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('noUnitsFound')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                  {t('aiNoMatches')}
                </p>
                <Link href="/units" className="inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-accent transition">
                  {t('clearFilters')}
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {units.map((unit: any) => {
                    const title = getLocalized(unit, 'title');
                    const locationName = getLocalized(unit, 'location');
                    const cover = unit.coverImage || (unit.images?.[0]?.includes(',') ? unit.images[0].split(',')[0].trim() : unit.images?.[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
                    const isDev = unit.sellerType === 'DEVELOPER';
                    const displayCash = Number(unit.cashPaidToSeller || 0);
                    const displayTotal = Number(unit.originalContractPrice || unit.totalPrice || 0);
                    const isTotalSort = sortBy === 'total_price_asc' || sortBy === 'total_price_desc';

                    return (
                      <Link href={`/units/${unit.code || unit.id}`} key={unit.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={cover}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />

                          {/* Share button on card */}
                          <div className="absolute top-3 left-3 z-10">
                            <ShareButton
                              title={title}
                              priceText={`${(isTotalSort && displayTotal > 0 ? displayTotal : displayCash).toLocaleString()} ${t('currency')}`}
                              deepLinkPath={`units/${unit.code || unit.id}`}
                              url={`https://buhoor-web.vercel.app/units/${unit.code || unit.id}`}
                              variant="icon"
                            />
                          </div>

                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            {unit.isVerified && (
                              <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                                ⭐ {t('verified')}
                              </span>
                            )}
                            {unit.isSeaView && (
                              <span className="bg-cyan-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                                🌊 {t('seaView')}
                              </span>
                            )}
                            {(() => {
                              const isSeaUnit = Boolean(
                                unit.isSeaView ||
                                unit.location?.name?.includes('جونة') ||
                                unit.location?.name?.includes('ساحل') ||
                                unit.location?.name?.includes('بحر')
                              );
                              const unitRoi = Number(unit.expectedRentalRoi) > 0 ? Number(unit.expectedRentalRoi) : (isSeaUnit ? 16.5 : null);
                              if (!unitRoi) return null;
                              return (
                                <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                                  💰 {t('roi')} {unitRoi}%
                                </span>
                              );
                            })()}
                            <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                              {isTotalSort && displayTotal > 0
                                ? `${t('totalPrice')}: ${displayTotal.toLocaleString()} ${t('currency')}`
                                : `${unit.isCashOnly ? t('cashOnly') + ': ' : t('downPayment') + ': '}${displayCash.toLocaleString()} ${t('currency')}`}
                            </span>
                            {!isTotalSort && displayTotal > 0 && displayTotal !== displayCash && (
                              <span className="bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm">
                                {t('totalPrice')}: {displayTotal.toLocaleString()} {t('currency')}
                              </span>
                            )}
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${isDev ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}`}>
                              {isDev ? `🏢 ${t('developerTag')}` : `👤 ${t('resaleTag')}`}
                            </span>
                          </div>

                          {unit.location?.governorate && (
                            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                              📍 {unit.location.governorate}
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">{title}</h3>
                            <div className="flex items-center text-gray-500 text-xs mb-3 gap-1">
                              <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
                              <span className="truncate">{locationName || 'N/A'}</span>
                            </div>
                          </div>

                          {/* Pricing breakdown */}
                          <div className="bg-gray-50 p-3 rounded-2xl mb-4 space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-gray-700">
                              <span>{unit.isCashOnly ? t('cashPaidToSeller') + ':' : t('downPayment') + ':'}</span>
                              <span className="text-primary font-bold">{displayCash.toLocaleString()} {t('currency')}</span>
                            </div>
                            {!unit.isCashOnly && displayTotal > 0 && (
                              <div className="flex justify-between text-gray-600 text-[11px]">
                                <span>{t('originalContractPrice')}:</span>
                                <span className="font-bold">{displayTotal.toLocaleString()} {t('currency')}</span>
                              </div>
                            )}
                            {unit.monthlyEquivalentInstallment > 0 && (
                              <div className="flex justify-between text-gray-500">
                                <span>{t('monthlyInstallment')}:</span>
                                <span className="font-semibold text-gray-900">{Number(unit.monthlyEquivalentInstallment).toLocaleString()} {t('currency')}/{t('month')}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-gray-600 text-xs pt-3 border-t border-gray-100 font-semibold">
                            <span className="flex items-center gap-1"><HomeModernIcon className="w-4 h-4 text-gray-400" /> {unit.area} {t('sqm')}</span>
                            <span>{unit.bedrooms || 3} {t('bedrooms')}</span>
                            <span>{unit.bathrooms || 2} {t('bathrooms')}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2 items-center">
                    {page > 1 && (
                      <Link href={buildQuery(page - 1)} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-50 shadow-sm text-sm">
                        {t('prevStep')}
                      </Link>
                    )}
                    <span className="text-xs font-bold text-gray-500 px-3">
                      {page} / {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link href={buildQuery(page + 1)} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-accent shadow-md transition text-sm">
                        {t('nextStep')}
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

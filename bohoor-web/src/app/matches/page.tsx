'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  SparklesIcon, 
  MapPinIcon, 
  HomeModernIcon, 
  PhoneIcon, 
  ArrowTopRightOnSquareIcon,
  Squares2X2Icon,
  Bars3Icon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  UserIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '@/api/client';
import AiSearchModal from '@/components/AiSearchModal';
import { useLanguage } from '@/context/LanguageContext';

function MatchesContent() {
  const { t, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'score' | 'price_asc' | 'price_desc' | 'area_desc'>('score');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);

  const urlQuery = searchParams.get('q');
  const urlName = searchParams.get('name');
  const urlPhone = searchParams.get('phone');

  useEffect(() => {
    // 1. Try reading from sessionStorage first
    try {
      const stored = sessionStorage.getItem('bohoor_last_match');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMatchData(parsed);
      }
    } catch (e) {
      console.error('Failed to parse cached matches:', e);
    }

    // 2. If URL query is passed, run a fresh match query
    if (urlQuery) {
      fetchMatches(urlQuery, urlName || undefined, urlPhone || undefined);
    }
  }, [urlQuery, urlName, urlPhone]);

  const fetchMatches = async (query: string, name?: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await api.aiSearch.match({
        query,
        customerName: name,
        customerPhone: phone,
      });
      setMatchData(res);
      sessionStorage.setItem('bohoor_last_match', JSON.stringify(res));
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const matches: any[] = matchData?.matches || [];
  const filters = matchData?.extractedFilters || {};

  // Filter by score
  const filteredMatches = matches.filter((item) => {
    if (minScoreFilter > 0 && item.matchScore < minScoreFilter) return false;
    return true;
  });

  // Sort
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'score') {
      return b.matchScore - a.matchScore;
    }
    const priceA = Number(a.unit?.cashPaidToSeller || a.unit?.totalPrice || a.unit?.originalContractPrice || 0);
    const priceB = Number(b.unit?.cashPaidToSeller || b.unit?.totalPrice || b.unit?.originalContractPrice || 0);
    if (sortBy === 'price_asc') {
      return priceA - priceB;
    }
    if (sortBy === 'price_desc') {
      return priceB - priceA;
    }
    if (sortBy === 'area_desc') {
      const areaA = Number(a.unit?.area || 0);
      const areaB = Number(b.unit?.area || 0);
      return areaB - areaA;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-cairo" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#0a192f] via-primary to-indigo-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-md">
                <SparklesIcon className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI Property Matching Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {t('aiMatchingResultsTitle')}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                {t('aiMatchingResultsSub')}
              </p>
            </div>

            {/* Quick Action Button to re-open or trigger AI Search */}
            <div className="shrink-0 flex items-center gap-3">
              <AiSearchModal />
              <Link
                href="/units"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-white/20 transition flex items-center gap-1.5"
              >
                <span>{t('browseAllUnits')}</span>
                <span>{isRTL ? '←' : '→'}</span>
              </Link>
            </div>
          </div>

          {/* Extracted Requirements Summary Card */}
          {matchData && (
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2 text-xs text-indigo-100 font-bold">
                  <span>{t('recordedQuery')}</span>
                  <span className="text-white font-normal bg-black/30 px-3 py-1 rounded-lg">
                    &quot;{matchData.query || urlQuery || t('customSearch')}&quot;
                  </span>
                </div>
                <div className="text-xs text-amber-300 font-bold">
                  {t('foundMatchedCount').replace('{count}', String(matches.length))}
                </div>
              </div>

              {/* Extracted Criteria Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-indigo-200 font-bold">{t('extractedSpecs')}</span>
                {filters.location && (
                  <span className="text-xs bg-indigo-600/80 text-white px-3 py-1 rounded-lg border border-indigo-400/30 font-semibold">
                    📍 {t('requestedLocation')} {filters.location}
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="text-xs bg-emerald-600/80 text-white px-3 py-1 rounded-lg border border-emerald-400/30 font-semibold">
                    💰 {t('maxBudgetEgp')}: {Number(filters.maxPrice).toLocaleString(isRTL ? 'ar-EG' : 'en-US')} {t('currency')}
                  </span>
                )}
                {filters.bedrooms && (
                  <span className="text-xs bg-blue-600/80 text-white px-3 py-1 rounded-lg border border-blue-400/30 font-semibold">
                    🛏️ {t('requestedBedrooms')} {filters.bedrooms}
                  </span>
                )}
                {filters.propertyType && (
                  <span className="text-xs bg-purple-600/80 text-white px-3 py-1 rounded-lg border border-purple-400/30 font-semibold">
                    🏢 {t('requestedType')} {filters.propertyType}
                  </span>
                )}
                {filters.seaView && (
                  <span className="text-xs bg-cyan-600/80 text-white px-3 py-1 rounded-lg border border-cyan-400/30 font-semibold">
                    🌊 {t('seaView')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Controls Bar: Sorting, Filters & View Toggle */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200/80 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          
          {/* Quick Score Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500">{t('matchPercentageFilter')}</span>
            <button
              onClick={() => setMinScoreFilter(0)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                minScoreFilter === 0 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isRTL ? `الكل (${matches.length})` : `All (${matches.length})`}
            </button>
            <button
              onClick={() => setMinScoreFilter(85)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                minScoreFilter === 85 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {t('exceptionalFilter')}
            </button>
            <button
              onClick={() => setMinScoreFilter(70)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                minScoreFilter === 70 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {t('greatFilter')}
            </button>
          </div>

          {/* Right Controls: Sort & View Mode */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 outline-none focus:border-primary"
              >
                <option value="score">{t('sortMatchScore')}</option>
                <option value="price_asc">{t('sortPriceAsc')}</option>
                <option value="price_desc">{t('sortPriceDesc')}</option>
                <option value="area_desc">{t('sortAreaDesc')}</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-xs text-primary' : 'text-gray-500'}`}
                title={t('gridViewTooltip')}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-xs text-primary' : 'text-gray-500'}`}
                title={t('listViewTooltip')}
              >
                <Bars3Icon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm space-y-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-bold text-gray-800">{t('analyzingRequests')}</h3>
            <p className="text-xs text-gray-500">{t('comparingSpecsAcrossPlatform')}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedMatches.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {matchData ? t('noMatchesWithFilter') : t('noAiSearchYet')}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              {matchData 
                ? t('expandSearchTip')
                : t('startAiSearchPrompt')}
            </p>
            <div className="pt-2">
              <AiSearchModal />
            </div>
          </div>
        )}

        {/* Matches Listing */}
        {!loading && sortedMatches.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sortedMatches.map((item: any, idx: number) => {
              const unit = item.unit;
              const score = item.matchScore;
              const criteria = item.matchedCriteria || {};
              const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
              const cover = unit.coverImage || (unit.images?.[0]?.includes(',') ? unit.images[0].split(',')[0].trim() : unit.images?.[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
              const isDev = unit.sellerType === 'DEVELOPER';

              let badgeBg = 'bg-emerald-600 text-white';
              let matchLabel = t('exceptionalMatch');
              if (score < 85) {
                badgeBg = 'bg-blue-600 text-white';
                matchLabel = t('greatMatch');
              }
              if (score < 70) {
                badgeBg = 'bg-amber-600 text-white';
                matchLabel = t('goodMatch');
              }

              // GRID VIEW CARD
              if (viewMode === 'grid') {
                return (
                  <div 
                    key={unit.id || idx}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/80 flex flex-col group"
                  >
                    {/* Image with match badge & overlays */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={cover} 
                        alt={unit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Match Score Badge (Prominent) */}
                      <div className={`absolute top-3 ${isRTL ? 'right-3 items-end' : 'left-3 items-start'} flex flex-col gap-1`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1 ${badgeBg}`}>
                          <span>{score}%</span>
                          <span>{matchLabel}</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${isDev ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}`}>
                          {isDev ? t('directDevCommissionFree') : t('resaleIndividual')}
                        </span>
                      </div>

                      {unit.location?.governorate && (
                        <span className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold`}>
                          📍 {unit.location.name || unit.location.governorate}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Title */}
                        <Link href={`/units/${unit.code || unit.id}`}>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition line-clamp-2 leading-snug">
                            {unit.title}
                          </h3>
                        </Link>
                        {unit.project?.name && (
                          <p className="text-xs text-primary font-bold mt-1">{t('projectWord')} {unit.project.name}</p>
                        )}

                        {/* Specs Chips */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded-lg">🛏️ {unit.bedrooms || 0} {isRTL ? 'غرف' : 'Beds'}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded-lg">🚿 {unit.bathrooms || 0} {t('bathsSuffix')}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded-lg">📐 {unit.area} {t('sqm')}</span>
                          {unit.isSeaView && (
                            <span className="bg-cyan-50 text-cyan-800 font-bold px-2 py-1 rounded-lg">🌊 {t('seaView')}</span>
                          )}
                        </div>

                        {/* Why it matched */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                          {criteria.locationMatch && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                              <span>{t('targetAreaMatched')}</span>
                            </span>
                          )}
                          {criteria.priceMatch && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                              <span>{t('budgetMatched')}</span>
                            </span>
                          )}
                          {criteria.bedroomsMatch && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                              <span>{t('bedroomsMatched')}</span>
                            </span>
                          )}
                          {criteria.seaViewMatch && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                              <span>{t('seaViewMatched')}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-xs text-gray-500 font-medium">{t('requiredPrice')}</span>
                          <span className="text-lg font-black text-accent">
                            {price.toLocaleString(isRTL ? 'ar-EG' : 'en-US')} {t('currency')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/units/${unit.code || unit.id}`}
                            className="bg-gray-100 hover:bg-primary hover:text-white text-gray-800 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition"
                          >
                            <span>{t('detailsBtn')}</span>
                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                          </Link>
                          <a
                            href={`https://wa.me/201000000000?text=${encodeURI(isRTL ? `مرحباً منصة بحور، استفسر عن العقار المتطابق: ${unit.title} (كود: ${unit.code || unit.id})` : `Hello Bohoor, I am inquiring about matched unit: ${unit.title} (Code: ${unit.code || unit.id})`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition"
                          >
                            <span>{t('whatsAppBtn')}</span>
                            <PhoneIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // LIST VIEW ROW
              return (
                <div 
                  key={unit.id || idx}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto flex-1">
                    <img 
                      src={cover} 
                      alt={unit.title}
                      className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0" 
                    />

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${badgeBg}`}>
                          {score}% {matchLabel}
                        </span>
                        <Link href={`/units/${unit.code || unit.id}`} className="font-bold text-gray-900 hover:text-primary transition text-sm sm:text-base">
                          {unit.title}
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>📍 {unit.location?.name || unit.location?.governorate || '-'}</span>
                        <span>•</span>
                        <span>🛏️ {unit.bedrooms || 0} {isRTL ? 'غرف' : 'Beds'}</span>
                        <span>•</span>
                        <span>🚿 {unit.bathrooms || 0} {t('bathsSuffix')}</span>
                        <span>•</span>
                        <span>📐 {unit.area} {t('sqm')}</span>
                        {isDev && <span className="text-blue-600 font-bold">• {t('zeroCommission')}</span>}
                      </div>

                      {/* Criteria */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {criteria.locationMatch && <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold">✓ {t('targetAreaMatched')}</span>}
                        {criteria.priceMatch && <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold">✓ {t('budgetMatched')}</span>}
                        {criteria.bedroomsMatch && <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold">✓ {t('bedroomsMatched')}</span>}
                        {criteria.seaViewMatch && <span className="text-[10px] bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-md font-bold">✓ {t('seaViewMatched')}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className={`flex md:flex-col items-center ${isRTL ? 'md:items-end' : 'md:items-start'} justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <span className="text-xs text-gray-400 block md:mb-0.5">{t('requiredPrice')}</span>
                      <span className="text-base sm:text-lg font-black text-accent font-cairo">
                        {price.toLocaleString(isRTL ? 'ar-EG' : 'en-US')} {t('currency')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/units/${unit.code || unit.id}`}
                        className="bg-gray-100 hover:bg-primary hover:text-white text-gray-800 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition"
                      >
                        <span>{t('detailsBtn')}</span>
                        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href={`https://wa.me/201000000000?text=${encodeURI(isRTL ? `مرحباً منصة بحور، استفسر عن العقار المتطابق: ${unit.title} (كود: ${unit.code || unit.id})` : `Hello Bohoor, I am inquiring about matched unit: ${unit.title} (Code: ${unit.code || unit.id})`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition"
                      >
                        <span>{t('whatsAppBtn')}</span>
                        <PhoneIcon className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default function MatchesPage() {
  const { isRTL } = useLanguage();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-cairo">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-gray-600">{isRTL ? 'جاري تحميل نتائج المطابقة الذكية...' : 'Loading AI match results...'}</p>
        </div>
      </div>
    }>
      <MatchesContent />
    </Suspense>
  );
}

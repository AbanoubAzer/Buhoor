'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FunnelIcon, 
  SparklesIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface UnitFilterSidebarProps {
  locations: any[];
  unitTypes: any[];
  developers: any[];
  projects: any[];
  governorates: string[];
  currentParams: {
    q?: string;
    sellerType?: string;
    isCashOnly?: string;
    governorate?: string;
    locationId?: string;
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
    sortBy?: string;
  };
}

const DEFAULT_EGYPT_GOVERNORATES = [
  'البحر الأحمر',
  'القاهرة',
  'الجيزة',
  'مطروح',
  'الإسكندرية',
  'السويس',
  'جنوب سيناء',
  'شمال سيناء',
];

export default function UnitFilterSidebar({
  locations,
  unitTypes,
  developers,
  governorates,
  currentParams,
}: UnitFilterSidebarProps) {
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Combine default governorates with any dynamic governorates from backend
  const allGovernorates = Array.from(
    new Set([
      ...DEFAULT_EGYPT_GOVERNORATES,
      ...(governorates || []),
      ...(locations || []).map((loc) => loc.governorate).filter(Boolean),
    ])
  );

  // State
  const [sellerType, setSellerType] = useState(currentParams.sellerType || 'ALL');
  const [isCashOnly, setIsCashOnly] = useState(currentParams.isCashOnly || 'all');
  const [selectedGov, setSelectedGov] = useState(currentParams.governorate || '');
  const [selectedLoc, setSelectedLoc] = useState(currentParams.locationId || '');
  const [selectedUnitType, setSelectedUnitType] = useState(currentParams.unitTypeId || '');
  const [selectedDev, setSelectedDev] = useState(currentParams.developerId || '');
  const [seaView, setSeaView] = useState(currentParams.seaView === 'true');

  // Count active filters
  const activeCount = [
    Boolean(currentParams.q),
    currentParams.sellerType && currentParams.sellerType !== 'ALL',
    currentParams.isCashOnly && currentParams.isCashOnly !== 'all',
    Boolean(currentParams.governorate),
    Boolean(currentParams.locationId),
    Boolean(currentParams.unitTypeId),
    Boolean(currentParams.developerId),
    Boolean(currentParams.minCashRequired || currentParams.maxCashRequired),
    Boolean(currentParams.minMonthlyInstallment || currentParams.maxMonthlyInstallment),
    Boolean(currentParams.minArea || currentParams.maxArea),
    Boolean(currentParams.bedrooms),
    Boolean(currentParams.bathrooms),
    currentParams.seaView === 'true',
  ].filter(Boolean).length;

  // Filter locations dynamically by selected governorate with fallback to all locations if no match
  const govMatched = selectedGov
    ? locations.filter((loc) => 
        loc.governorate && loc.governorate.trim().toLowerCase() === selectedGov.trim().toLowerCase()
      )
    : locations;

  const filteredLocations = (selectedGov && govMatched.length > 0)
    ? govMatched
    : locations;

  const executeFilter = (formData: FormData) => {
    const p = new URLSearchParams();

    // Query Search
    const q = formData.get('q')?.toString().trim();
    if (q) p.set('q', q);

    // Seller Type
    if (sellerType && sellerType !== 'ALL') p.set('sellerType', sellerType);

    // Payment System
    if (isCashOnly && isCashOnly !== 'all') p.set('isCashOnly', isCashOnly);

    // Governorate & Location
    if (selectedGov) p.set('governorate', selectedGov);
    if (selectedLoc) p.set('locationId', selectedLoc);

    // Numeric Ranges
    const minCash = formData.get('minCashRequired')?.toString();
    if (minCash) p.set('minCashRequired', minCash);

    const maxCash = formData.get('maxCashRequired')?.toString();
    if (maxCash) p.set('maxCashRequired', maxCash);

    const minMonthly = formData.get('minMonthlyInstallment')?.toString();
    if (minMonthly) p.set('minMonthlyInstallment', minMonthly);

    const maxMonthly = formData.get('maxMonthlyInstallment')?.toString();
    if (maxMonthly) p.set('maxMonthlyInstallment', maxMonthly);

    const minAreaVal = formData.get('minArea')?.toString();
    if (minAreaVal) p.set('minArea', minAreaVal);

    const maxAreaVal = formData.get('maxArea')?.toString();
    if (maxAreaVal) p.set('maxArea', maxAreaVal);

    // Bedrooms & Bathrooms
    const beds = formData.get('bedrooms')?.toString();
    if (beds) p.set('bedrooms', beds);

    const baths = formData.get('bathrooms')?.toString();
    if (baths) p.set('bathrooms', baths);

    // Unit Type & Developer
    if (selectedUnitType) p.set('unitTypeId', selectedUnitType);

    if (sellerType !== 'INDIVIDUAL' && selectedDev) {
      p.set('developerId', selectedDev);
    }

    // Sea view
    if (seaView) p.set('seaView', 'true');

    // Preserve sort
    if (currentParams.sortBy) p.set('sortBy', currentParams.sortBy);

    p.set('page', '1');

    setMobileDrawerOpen(false);
    router.push(`/units?${p.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    executeFilter(formData);
  };

  // Quick mobile pill click handler
  const handleQuickPill = (key: string, val: string) => {
    const p = new URLSearchParams(window.location.search);
    if (p.get(key) === val) {
      p.delete(key);
    } else {
      p.set(key, val);
    }
    p.set('page', '1');
    router.push(`/units?${p.toString()}`);
  };

  // Shared form inputs
  const renderFormContent = (isMobileModal = false) => (
    <>
      {/* Search Term */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">كلمة البحث</label>
        <div className="relative">
          <input 
            type="text" 
            name="q"
            defaultValue={currentParams.q || ''}
            placeholder="عنوان العقار، اسم المنطقة..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 pl-10 text-sm focus:ring-2 focus:ring-primary outline-none"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* 1. Seller Type Tabs */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">جهة العرض (المطور أم أفراد)</label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-center text-xs font-bold">
          <button
            type="button"
            onClick={() => setSellerType('ALL')}
            className={`py-2 rounded-lg transition ${sellerType === 'ALL' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            الكل
          </button>
          <button
            type="button"
            onClick={() => setSellerType('DEVELOPER')}
            className={`py-2 rounded-lg transition ${sellerType === 'DEVELOPER' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            🏢 مطور
          </button>
          <button
            type="button"
            onClick={() => setSellerType('INDIVIDUAL')}
            className={`py-2 rounded-lg transition ${sellerType === 'INDIVIDUAL' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            👤 أفراد
          </button>
        </div>
      </div>

      {/* 2. Payment Method Tabs */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">نظام السداد</label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-center text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsCashOnly('all')}
            className={`py-2 rounded-lg transition ${isCashOnly === 'all' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            الكل
          </button>
          <button
            type="button"
            onClick={() => setIsCashOnly('true')}
            className={`py-2 rounded-lg transition ${isCashOnly === 'true' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            💵 كاش فقط
          </button>
          <button
            type="button"
            onClick={() => setIsCashOnly('false')}
            className={`py-2 rounded-lg transition ${isCashOnly === 'false' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            📅 تقسيط
          </button>
        </div>
      </div>

      {/* Dynamic Financial Ranges based on Payment System */}
      {isCashOnly === 'true' && (
        <div className="space-y-2 bg-green-50/60 p-3 rounded-2xl border border-green-100 transition-all">
          <label className="block text-sm font-bold text-green-900">💵 إجمالي سعر الشقة الكاش (ج.م)</label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="number" 
              name="minCashRequired"
              defaultValue={currentParams.minCashRequired || ''}
              placeholder="أدنى سعر" 
              className="w-full bg-white border border-green-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
              dir="ltr"
            />
            <input 
              type="number" 
              name="maxCashRequired"
              defaultValue={currentParams.maxCashRequired || ''}
              placeholder="أقصى سعر" 
              className="w-full bg-white border border-green-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
              dir="ltr"
            />
          </div>
        </div>
      )}

      {isCashOnly === 'false' && (
        <div className="space-y-3 bg-blue-50/60 p-3 rounded-2xl border border-blue-100 transition-all">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-blue-900">💰 المقدم المطلوب (ج.م)</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                name="minCashRequired"
                defaultValue={currentParams.minCashRequired || ''}
                placeholder="أدنى مقدم" 
                className="w-full bg-white border border-blue-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
              <input 
                type="number" 
                name="maxCashRequired"
                defaultValue={currentParams.maxCashRequired || ''}
                placeholder="أقصى مقدم" 
                className="w-full bg-white border border-blue-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-blue-100">
            <label className="block text-sm font-bold text-blue-900">📅 القسط الشهري (ج.م/شهر)</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                name="minMonthlyInstallment"
                defaultValue={currentParams.minMonthlyInstallment || ''}
                placeholder="أدنى قسط" 
                className="w-full bg-white border border-blue-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
              <input 
                type="number" 
                name="maxMonthlyInstallment"
                defaultValue={currentParams.maxMonthlyInstallment || ''}
                placeholder="أقصى قسط" 
                className="w-full bg-white border border-blue-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {(isCashOnly === 'all' || !isCashOnly) && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">المبلغ الكاش / المقدم (ج.م)</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                name="minCashRequired"
                defaultValue={currentParams.minCashRequired || ''}
                placeholder="من" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
              <input 
                type="number" 
                name="maxCashRequired"
                defaultValue={currentParams.maxCashRequired || ''}
                placeholder="إلى" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">القسط الشهري (ج.م)</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                name="minMonthlyInstallment"
                defaultValue={currentParams.minMonthlyInstallment || ''}
                placeholder="من" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
              <input 
                type="number" 
                name="maxMonthlyInstallment"
                defaultValue={currentParams.maxMonthlyInstallment || ''}
                placeholder="إلى" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {/* Governorate & Location */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">المحافظة</label>
          <select 
            value={selectedGov} 
            onChange={(e) => {
              setSelectedGov(e.target.value);
              setSelectedLoc('');
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">جميع المحافظات</option>
            {allGovernorates.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">المنطقة</label>
          <select 
            value={selectedLoc} 
            onChange={(e) => setSelectedLoc(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">جميع المناطق</option>
            {filteredLocations.map((loc: any) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} {loc.governorate ? `(${loc.governorate})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Area Range */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-sm font-bold text-gray-700">المساحة (م²)</label>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number" 
            name="minArea"
            defaultValue={currentParams.minArea || ''}
            placeholder="الأدنى م²" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none"
            dir="ltr"
          />
          <input 
            type="number" 
            name="maxArea"
            defaultValue={currentParams.maxArea || ''}
            placeholder="الأقصى م²" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-primary outline-none"
            dir="ltr"
          />
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">عدد الغرف</label>
          <select 
            name="bedrooms" 
            defaultValue={currentParams.bedrooms || ""} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-2 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
          >
            <option value="">الكل</option>
            <option value="1">غرفة واحدة</option>
            <option value="2">غرفتان (2)</option>
            <option value="3">3 غرف</option>
            <option value="4">4 غرف</option>
            <option value="5">5+ غرف</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">عدد الحمامات</label>
          <select 
            name="bathrooms" 
            defaultValue={currentParams.bathrooms || ""} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-2 text-xs focus:ring-2 focus:ring-primary outline-none font-semibold"
          >
            <option value="">الكل</option>
            <option value="1">حمام (1)</option>
            <option value="2">حمامان (2)</option>
            <option value="3">3 حمامات</option>
            <option value="4">4+ حمامات</option>
          </select>
        </div>
      </div>

      {/* Sea View Toggle */}
      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setSeaView(!seaView)}
          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
            seaView 
              ? 'bg-blue-50 border-blue-400 text-blue-800' 
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>🌊 إطلالة بحرية فقط</span>
          <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${seaView ? 'bg-primary border-primary text-white' : 'border-gray-400'}`}>
            {seaView && <CheckIcon className="w-3 h-3 stroke-[3]" />}
          </span>
        </button>
      </div>

      {/* Property Type & Developer */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">نوع العقار</label>
          <select 
            value={selectedUnitType} 
            onChange={(e) => setSelectedUnitType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">كل الأنواع</option>
            {unitTypes.map((type: any) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            المطور العقاري {sellerType === 'INDIVIDUAL' && <span className="text-gray-400 font-normal">(للمطورين فقط)</span>}
          </label>
          <select 
            value={selectedDev} 
            onChange={(e) => setSelectedDev(e.target.value)}
            disabled={sellerType === 'INDIVIDUAL'}
            className={`w-full border rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none ${
              sellerType === 'INDIVIDUAL' ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <option value="">جميع المطورين</option>
            {developers.map((dev: any) => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Mobile Filter Bar (Visible on mobile/tablet < lg) */}
      <div className="lg:hidden mb-6 flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 bg-white border border-gray-200 hover:border-primary shadow-sm rounded-2xl py-3 px-4 flex items-center justify-between text-gray-800 font-bold transition active:scale-98"
          >
            <div className="flex items-center gap-2 text-sm">
              <FunnelIcon className="w-5 h-5 text-primary" />
              <span>تصفية وفلاتر متقدمة</span>
            </div>
            {activeCount > 0 ? (
              <span className="bg-primary text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                {activeCount} نشط
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-normal">تحديد الخيارات</span>
            )}
          </button>

          {activeCount > 0 && (
            <Link
              href="/units"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-3 rounded-2xl whitespace-nowrap transition"
            >
              إلغاء الفلاتر
            </Link>
          )}
        </div>

        {/* Quick Filter Horizontal Scroll Pills on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => handleQuickPill('isCashOnly', 'true')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold border transition ${
              currentParams.isCashOnly === 'true'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            💵 كاش فقط
          </button>
          <button
            type="button"
            onClick={() => handleQuickPill('isCashOnly', 'false')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold border transition ${
              currentParams.isCashOnly === 'false'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            📅 تقسيط
          </button>
          <button
            type="button"
            onClick={() => handleQuickPill('sellerType', 'DEVELOPER')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold border transition ${
              currentParams.sellerType === 'DEVELOPER'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            🏢 مطورين
          </button>
          <button
            type="button"
            onClick={() => handleQuickPill('sellerType', 'INDIVIDUAL')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold border transition ${
              currentParams.sellerType === 'INDIVIDUAL'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            👤 إعادة بيع
          </button>
          <button
            type="button"
            onClick={() => handleQuickPill('seaView', 'true')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold border transition ${
              currentParams.seaView === 'true'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            🌊 إطلالة بحر
          </button>
        </div>
      </div>

      {/* 2. Mobile Bottom Sheet / Modal Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white w-full rounded-t-[2.5rem] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
            dir="rtl"
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-gray-900">فلاتر البحث الذكية</h2>
                  {activeCount > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                      {activeCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Link 
                    href="/units" 
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    إعادة ضبط
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain">
                {renderFormContent(true)}
              </div>

              {/* Modal Sticky Bottom Action */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-accent text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base"
                >
                  <SparklesIcon className="w-5 h-5" />
                  تطبيق الفلاتر وعرض النتائج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Desktop Sticky Sidebar (Visible only on lg+) */}
      <div className="hidden lg:flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
          
          {/* Pinned Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-primary" />
              فلاتر البحث الذكية
            </h2>
            <Link href="/units" className="text-xs text-primary font-bold hover:underline">
              إعادة ضبط
            </Link>
          </div>

          {/* Scrollable Filters Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain">
            {renderFormContent(false)}
          </div>

          {/* Pinned Footer with Action Button */}
          <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm shrink-0">
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-xl transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              تطبيق فلاتر البحث
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

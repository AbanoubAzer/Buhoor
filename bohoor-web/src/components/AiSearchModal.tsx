'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  SparklesIcon, 
  XMarkIcon, 
  MapPinIcon, 
  PhoneIcon, 
  UserIcon,
  CurrencyDollarIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '@/api/client';
import { useLanguage } from '../context/LanguageContext';

interface AiSearchModalProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function AiSearchModal({ isOpen: controlledIsOpen, setIsOpen: controlledSetIsOpen }: AiSearchModalProps = {}) {
  const router = useRouter();
  const { t, language, isRTL } = useLanguage();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-search', handleOpen);
    return () => window.removeEventListener('open-ai-search', handleOpen);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // 1. Mandatory User & Budget
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [budget, setBudget] = useState('');

  // 2. Query & Quick Options
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [isSeaView, setIsSeaView] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const budgetOptions = ['3,000,000', '5,000,000', '8,000,000', '12,000,000', '20,000,000+'];
  const locationOptions = isRTL 
    ? ['سهل حشيش', 'الجونة', 'الغردقة', 'الساحل الشمالي', 'القاهرة الجديدة', 'الشيخ زايد']
    : ['Sahl Hasheesh', 'El Gouna', 'Hurghada', 'North Coast', 'New Cairo', 'Sheikh Zayed'];
  const typeOptions = isRTL 
    ? ['شاليه', 'شقة', 'فيلا', 'دوبلكس', 'استوديو']
    : ['Chalet', 'Apartment', 'Villa', 'Duplex', 'Studio'];
  const bedroomOptions = ['1', '2', '3', '4+'];

  const quickPrompts = isRTL ? [
    'شاليه غرفتين في الجونة على البحر',
    'شقة 3 غرف في التجمع الخامس تقسيط',
    'استوديو في سهل حشيش استثمار Airbnb',
    'فيلا مستقلة استلام فوري',
  ] : [
    '2-bedroom chalet in El Gouna with sea view',
    '3-bedroom apartment in New Cairo with installments',
    'Studio in Sahl Hasheesh for Airbnb investment',
    'Standalone villa ready for delivery',
  ];

  const handleSearch = async () => {
    // Mandatory Validations: Name, Phone, Budget
    if (!customerName.trim()) {
      setError('يرجى إدخال اسمك الكريم (مطلوب).');
      return;
    }
    
    const cleanPhone = customerPhone.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setError('يرجى إدخال رقم هاتف صحيح للتواصل (مطلوب).');
      return;
    }

    if (!budget.trim()) {
      setError('يرجى إدخال الميزانية القصوى أو اختيار إحدى الميزانيات السريعة (مطلوب).');
      return;
    }

    // Build combined natural query
    let combinedQuery = query.trim();
    const parts: string[] = [];

    if (selectedType) parts.push(selectedType);
    if (selectedBedrooms) parts.push(`${selectedBedrooms} غرف`);
    if (selectedLocation) parts.push(`في ${selectedLocation}`);
    if (isSeaView) parts.push('إطلالة بحرية مباشرة صف أول');
    parts.push(`ميزانية أقصاها ${budget} ج.م`);

    if (combinedQuery) {
      combinedQuery = `${combinedQuery} (${parts.join('، ')})`;
    } else {
      combinedQuery = parts.join('، ');
    }

    const fullPhone = customerPhone.startsWith('+') ? customerPhone : `+${customerPhone}`;

    setLoading(true);
    setError(null);
    try {
      const res = await api.aiSearch.match({
        query: combinedQuery,
        customerName: customerName.trim(),
        customerPhone: fullPhone.trim(),
      });
      setResult(res);

      try {
        sessionStorage.setItem(
          'bohoor_last_match',
          JSON.stringify({
            ...res,
            query: combinedQuery,
            customerName: customerName.trim(),
            customerPhone: fullPhone.trim(),
          })
        );
      } catch (e) {
        console.error('SessionStorage error:', e);
      }

      // Close modal and navigate directly to dedicated /matches listing page
      setIsOpen(false);
      router.push('/matches');
    } catch (err: any) {
      console.error('AI Search Error:', err);
      setError(err?.message || 'حدث خطأ أثناء معالجة البحث، يرجى المحاولة ثانية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-primary text-white px-2.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 border border-indigo-400/30 ring-2 ring-indigo-400/20"
        title={isRTL ? 'البحث الذكي بالـ AI' : 'AI Smart Search'}
      >
        <SparklesIcon className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
        <span className="font-extrabold whitespace-nowrap">
          {isRTL ? 'البحث الذكي' : 'AI Search'}
        </span>
      </button>

      {/* Modal - Highly Responsive Portal Container */}
      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-fadeIn"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] max-h-[90dvh] flex flex-col shadow-2xl overflow-hidden border border-indigo-100 font-cairo my-0 sm:my-auto"
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Sticky Header - Never Cut off */}
            <div className="shrink-0 flex items-center justify-between p-3.5 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-white sticky top-0 z-20">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition shrink-0"
                aria-label="إغلاق"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <div className="text-right flex-1 mr-2 sm:mr-3">
                <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    Matching Engine
                  </span>
                  <h3 className="text-sm sm:text-lg font-extrabold text-indigo-950">
                    البحث الذكي ومطابقة العقارات (AI) 🎯
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                  أدخل بياناتك وميزانيتك، ثم اكتب طلبك أو اختر من الخيارات
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-right overscroll-contain">
              
              {/* Error Banner */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2 justify-end">
                  <span>{error}</span>
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500 shrink-0" />
                </div>
              )}

              {/* STEP 1: Mandatory Name, Phone & Budget */}
              <div className="bg-indigo-50/70 p-3.5 sm:p-5 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-md">
                    الخطوة 1 (مطلوبة)
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-indigo-950">
                    بياناتك والميزانية <span className="text-red-500">*</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      الاسم الكريم <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: أحمد محمد"
                        className="w-full py-2 sm:py-2.5 px-3 pl-8 text-right rounded-xl border border-gray-200 bg-white focus:border-indigo-500 outline-none text-xs sm:text-sm text-gray-800"
                        required
                      />
                      <UserIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5 sm:top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {isRTL ? "رقم الهاتف / واتساب" : "Phone / WhatsApp"} <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div dir="ltr" className="react-phone-input-container">
                      <PhoneInput
                        country={'eg'}
                        enableSearch={true}
                        searchPlaceholder={isRTL ? "البحث عن الدولة..." : "Search country..."}
                        value={customerPhone}
                        onChange={(p) => setCustomerPhone(p)}
                        inputStyle={{ width: '100%', height: '42px', borderRadius: '0.75rem', borderColor: '#e5e7eb', backgroundColor: '#ffffff', fontSize: '0.875rem' }}
                        buttonStyle={{ borderRadius: '0.75rem 0 0 0.75rem', borderColor: '#e5e7eb', backgroundColor: '#ffffff', direction: 'ltr' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    الميزانية القصوى (ج.م) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="مثال: 5000000 أو اختر من الميزانيات أدناه"
                      className="w-full py-2 sm:py-2.5 px-3 pl-8 text-right rounded-xl border border-gray-200 bg-white focus:border-indigo-500 outline-none text-xs sm:text-sm text-gray-800 font-sans font-bold"
                      required
                    />
                    <CurrencyDollarIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5 sm:top-3" />
                  </div>

                  {/* Quick Budget Chips */}
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {budgetOptions.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b.replace(/[^0-9]/g, ''))}
                        className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-lg border transition font-bold ${
                          budget === b.replace(/[^0-9]/g, '')
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {b} ج
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 2: Quick Search or Pick from Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md">
                    الخطوة 2
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">
                    اكتب طلبك أو اختر المواصفات
                  </h4>
                </div>

                {/* Free Text Input */}
                <div>
                  <textarea
                    rows={2}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="اكتب بحرية، مثال: محتاج شقة غرفتين في سهل حشيش تشطيب الترا سوبر لوكس وإطلالة بحر..."
                    className="w-full p-2.5 sm:p-3 text-right rounded-xl sm:rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-gray-800 placeholder-gray-400 text-xs sm:text-sm leading-relaxed"
                  />
                  {/* Quick prompt suggestions */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 justify-end mt-1.5">
                    <span className="text-[10px] text-gray-400">أمثلة سريعة:</span>
                    {quickPrompts.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setQuery(p)}
                        className="text-[10px] sm:text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-500 px-2 py-0.5 rounded-md border border-gray-200 transition"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Pick Options Grid */}
                <div className="bg-gray-50/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 space-y-2.5">
                  <span className="text-xs font-bold text-gray-600 block">أو اختر المواصفات بنقرة واحدة:</span>

                  {/* Locations */}
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">المنطقة المطلوبة:</span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {locationOptions.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setSelectedLocation(selectedLocation === loc ? '' : loc)}
                          className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                            selectedLocation === loc
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Unit Types & Bedrooms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">نوع العقار:</span>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {typeOptions.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSelectedType(selectedType === t ? '' : t)}
                            className={`text-[11px] sm:text-xs px-2 py-1 rounded-lg border font-semibold transition ${
                              selectedType === t
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">غرف النوم:</span>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {bedroomOptions.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBedrooms(selectedBedrooms === b ? '' : b)}
                            className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                              selectedBedrooms === b
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                          >
                            {b} غرف
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sea View Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsSeaView(!isSeaView)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition ${
                      isSeaView 
                        ? 'bg-cyan-50 border-cyan-300 text-cyan-900 font-bold' 
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="text-xs">🌊 إطلالة بحرية مباشرة على الشاطئ</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-md ${isSeaView ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {isSeaView ? 'مفعلة ✓' : 'تفعيل'}
                    </span>
                  </button>
                </div>
              </div>

              {/* STEP 3: Results Display */}
              {result && (
                <div className="space-y-4 pt-3 border-t border-gray-100">
                  {/* Extracted Filters Summary */}
                  {result.extractedFilters && (
                    <div className="bg-indigo-50/70 p-3 sm:p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-indigo-200/80 text-indigo-900 font-bold px-2 py-0.5 rounded-md">
                          الفلاتر المستخرجة بالـ AI
                        </span>
                        <h4 className="text-xs font-bold text-indigo-950">
                          فهم النظام لاحتياجاتك:
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {result.extractedFilters.location && (
                          <span className="text-xs bg-white text-indigo-900 px-2 py-0.5 rounded-lg border border-indigo-200 font-semibold">
                            📍 الموقع: {result.extractedFilters.location}
                          </span>
                        )}
                        {result.extractedFilters.maxPrice && (
                          <span className="text-xs bg-white text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 font-semibold">
                            💰 ميزانية: {result.extractedFilters.maxPrice.toLocaleString('ar-EG')} ج.م
                          </span>
                        )}
                        {result.extractedFilters.bedrooms && (
                          <span className="text-xs bg-white text-blue-800 px-2 py-0.5 rounded-lg border border-blue-200 font-semibold">
                            🛏️ غرف: {result.extractedFilters.bedrooms}
                          </span>
                        )}
                        {result.extractedFilters.propertyType && (
                          <span className="text-xs bg-white text-purple-800 px-2 py-0.5 rounded-lg border border-purple-200 font-semibold">
                            🏢 نوع: {result.extractedFilters.propertyType}
                          </span>
                        )}
                        {result.extractedFilters.seaView && (
                          <span className="text-xs bg-white text-cyan-800 px-2 py-0.5 rounded-lg border border-cyan-200 font-semibold">
                            🌊 إطلالة بحر
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Matched Properties */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {result.matches?.length || 0} عقارات متطابقة
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                        أفضل العقارات المتطابقة
                      </h4>
                    </div>

                    <Link
                      href="/matches"
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <SparklesIcon className="w-4 h-4 text-amber-300" />
                      <span>عرض النتائج في صفحة مخصصة كاملة (Listed View) &larr;</span>
                    </Link>

                    {result.matches?.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-xs">
                        لم نجد عقارات متطابقة مع هذا البحث، جرب تعديل الميزانية أو خيارات البحث.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {result.matches.map((item: any, idx: number) => {
                          const unit = item.unit;
                          const score = item.matchScore;
                          const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);

                          let badgeColor = 'bg-emerald-500 text-white';
                          let matchText = 'تطابق استثنائي';
                          if (score < 80) {
                            badgeColor = 'bg-blue-600 text-white';
                            matchText = 'تطابق ممتاز';
                          }
                          if (score < 60) {
                            badgeColor = 'bg-amber-600 text-white';
                            matchText = 'تطابق تقريبي';
                          }

                          return (
                            <div 
                              key={unit.id || idx}
                              className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col sm:flex-row-reverse justify-between items-stretch sm:items-center gap-2.5 sm:gap-3"
                            >
                              <div className="text-right flex-1">
                                <div className="flex items-center justify-end gap-2 mb-1 flex-wrap">
                                  <Link 
                                    href={`/units/${unit.code || unit.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="font-bold text-gray-900 hover:text-primary transition text-xs sm:text-sm"
                                  >
                                    {unit.title}
                                  </Link>
                                  <span className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}>
                                    {score}% {matchText}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2 text-[11px] text-gray-500">
                                  <span className="font-bold text-accent text-xs sm:text-sm">
                                    {price.toLocaleString('ar-EG')} ج.م
                                  </span>
                                  <span>•</span>
                                  <span>{unit.location?.name || unit.location?.governorate || '-'}</span>
                                  <span>•</span>
                                  <span>{unit.bedrooms} غرف</span>
                                  <span>•</span>
                                  <span>{unit.area} م²</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                                <Link 
                                  href={`/units/${unit.code || unit.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-xs font-bold bg-gray-100 hover:bg-primary hover:text-white text-gray-700 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                                >
                                  <span>تفاصيل</span>
                                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                </Link>
                                <a
                                  href={`https://wa.me/201000000000?text=${encodeURI(`مرحباً بُحور، أستفسر عن العقار المتطابق: ${unit.title} (كود: ${unit.code || unit.id})`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                                >
                                  <span>واتساب</span>
                                  <PhoneIcon className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Action Footer */}
            <div className="shrink-0 p-3 sm:p-4 bg-gray-50 border-t border-gray-100 sticky bottom-0 z-20">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-primary to-indigo-700 hover:opacity-95 text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
              >
                {loading ? (
                  <span>جاري تحليل الطلب واستخراج الفلاتر ومطابقة العقارات... ⏳</span>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                    <span>بدء البحث والمطابقة الذكية (AI Matching)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  SparklesIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CheckCircleIcon,
  PhoneIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { api } from '@/api/client';

export default function AiSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const exampleQueries = [
    'I need a 2 bedroom apartment in Sahl Hasheesh, max 5M, sea view',
    'شاليه غرفتين في الجونة على البحر أقل من 6 مليون',
    'شقة 3 غرف في التجمع الخامس تقسيط ميزانية 5 مليون',
    'فيلا مستقلة في زايد استلام فوري',
  ];

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.aiSearch.match({
        query: q,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
      });
      setResult(res);
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
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        <SparklesIcon className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>البحث الذكي بالـ AI</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-indigo-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-white">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
                    Matching Engine
                  </span>
                  <h3 className="text-xl font-extrabold text-indigo-950 font-cairo">
                    البحث الذكي ومطابقة العقارات (AI Search)
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  اكتب مواصفات عقارك بحرية، ومحرك الذكاء الاصطناعي سيقوم باستخراج الفلاتر ومطابقة أفضل العقارات بنسبة مئوية
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Input Form */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="مثال: I need a 2 bedroom apartment in Sahl Hasheesh, max 5M, sea view أو شاليه غرفتين في الجونة على البحر أقل من 6 مليون..."
                    className="w-full p-4 text-right rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-800 placeholder-gray-400 text-sm leading-relaxed"
                  />
                </div>

                {/* Example Pills */}
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <span className="text-xs text-gray-400 font-medium">أمثلة سريعة:</span>
                  {exampleQueries.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(ex);
                        handleSearch(ex);
                      }}
                      className="text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 transition"
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                {/* Optional Lead Capture Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="رقم الهاتف (اختياري لاستلام العروض عبر واتساب)"
                    className="p-3 text-right rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs text-gray-800"
                  />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اسمك الكريم (اختياري)"
                    className="p-3 text-right rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs text-gray-800"
                  />
                </div>

                {/* Submit button */}
                <button
                  onClick={() => handleSearch()}
                  disabled={loading || !query.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-primary hover:opacity-95 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
                >
                  {loading ? (
                    <span>جاري التحليل واستخراج الفلاتر وحساب التطابق... ⏳</span>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 text-amber-300" />
                      <span>بدء البحث والمطابقة الذكية</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl text-right">
                  {error}
                </div>
              )}

              {/* Search Results */}
              {result && (
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  {/* Extracted Filters Summary */}
                  {result.extractedFilters && (
                    <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-indigo-200/80 text-indigo-900 font-bold px-2 py-0.5 rounded-md">
                          الفلاتر المستخرجة بالـ AI
                        </span>
                        <h4 className="text-sm font-bold text-indigo-950 font-cairo">
                          تم فهم طلبك كالتالي:
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end pt-1">
                        {result.extractedFilters.location && (
                          <span className="text-xs bg-white text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200 font-semibold">
                            📍 الموقع: {result.extractedFilters.location}
                          </span>
                        )}
                        {result.extractedFilters.maxPrice && (
                          <span className="text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                            💰 أقصى ميزانية: {result.extractedFilters.maxPrice.toLocaleString('ar-EG')} ج.م
                          </span>
                        )}
                        {result.extractedFilters.bedrooms && (
                          <span className="text-xs bg-white text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 font-semibold">
                            🛏️ غرف النوم: {result.extractedFilters.bedrooms}
                          </span>
                        )}
                        {result.extractedFilters.propertyType && (
                          <span className="text-xs bg-white text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200 font-semibold">
                            🏢 النوع: {result.extractedFilters.propertyType}
                          </span>
                        )}
                        {result.extractedFilters.seaView && (
                          <span className="text-xs bg-white text-cyan-800 px-2.5 py-1 rounded-lg border border-cyan-200 font-semibold">
                            🌊 إطلالة بحرية مباشرة
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Matched Properties */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">
                        تم فحص {result.matches?.length || 0} عقارات مطابقة
                      </span>
                      <h4 className="text-base font-extrabold text-gray-900 font-cairo">
                        العقارات المتطابقة حسب الأفضلية
                      </h4>
                    </div>

                    {result.matches?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        لم نجد عقارات متطابقة مع هذا البحث بدقة، جرب توسيع معايير البحث.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {result.matches.map((item: any, idx: number) => {
                          const unit = item.unit;
                          const score = item.matchScore;
                          const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);

                          let badgeColor = 'bg-emerald-500 text-white';
                          let matchText = 'تطابق استثنائي';
                          if (score < 80) {
                            badgeColor = 'bg-blue-600 text-white';
                            matchText = 'تطابق جيد جداً';
                          }
                          if (score < 60) {
                            badgeColor = 'bg-amber-600 text-white';
                            matchText = 'تطابق تقريبي';
                          }

                          return (
                            <div 
                              key={unit.id || idx}
                              className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <Link 
                                  href={`/units/${unit.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-xs font-bold bg-gray-100 hover:bg-primary hover:text-white text-gray-700 px-3 py-2 rounded-xl transition flex items-center gap-1"
                                >
                                  <span>تفاصيل</span>
                                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                </Link>
                                <a
                                  href={`https://wa.me/201000000000?text=${encodeURI(`أستفسر عن العقار المتطابق: ${unit.title} (كود: ${unit.code || unit.id})`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl transition flex items-center gap-1"
                                >
                                  <span>واتساب</span>
                                  <PhoneIcon className="w-3.5 h-3.5" />
                                </a>
                              </div>

                              <div className="text-right flex-1">
                                <div className="flex items-center justify-end gap-2 mb-1">
                                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                                    {score}% {matchText}
                                  </span>
                                  <Link 
                                    href={`/units/${unit.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="font-bold text-gray-900 hover:text-primary transition"
                                  >
                                    {unit.title}
                                  </Link>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-gray-500">
                                  <span className="font-bold text-accent text-sm">
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
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <Link 
                href="/admin/searches"
                onClick={() => setIsOpen(false)}
                className="text-indigo-600 hover:text-indigo-800 font-bold underline"
              >
                لوحة تحكم الطلبات والـ Excel (Business) &larr;
              </Link>
              <span>نظام المطابقة الذكي من بُحور</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

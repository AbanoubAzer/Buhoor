import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  ArrowDownTrayIcon, 
  SparklesIcon, 
  UserIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

export default function SearchesPage() {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    setLoading(true);
    try {
      const data = await api.aiSearch.getAllSearches();
      setSearches(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching searches:', err);
      toast.error('تعذر جلب طلبات واستعلامات العملاء');
    } finally {
      setLoading(false);
    }
  };

  const exportUrl = api.aiSearch.getExportUrl();

  const filteredSearches = searches.filter((s) => {
    if (!filterText.trim()) return true;
    const txt = filterText.toLowerCase();
    return (
      (s.customerName && s.customerName.toLowerCase().includes(txt)) ||
      (s.customerPhone && s.customerPhone.includes(txt)) ||
      (s.query && s.query.toLowerCase().includes(txt)) ||
      (s.extractedFilters?.location && s.extractedFilters.location.toLowerCase().includes(txt))
    );
  });

  const totalSearches = searches.length;
  const withPhoneCount = searches.filter((s) => Boolean(s.customerPhone)).length;
  const locationsCount: Record<string, number> = {};
  searches.forEach((s) => {
    const loc = s.extractedFilters?.location;
    if (loc) {
      locationsCount[loc] = (locationsCount[loc] || 0) + 1;
    }
  });
  const topLocation = Object.entries(locationsCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'غير محدد';

  return (
    <div className="space-y-6 font-arabic" dir="rtl">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
              AI Matching Engine
            </span>
            <h1 className="text-2xl font-black text-gray-900 font-arabic">
              طلبات ومطابقات العملاء بالذكاء الاصطناعي 🎯
            </h1>
          </div>
          <p className="text-xs text-gray-500">
            متابعة دقيقة لكل عميل وما كان يبحث عنه ومطابقته بأفضل العقارات في المنصة
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href={exportUrl}
            download="bohoor-ai-leads-matches.xlsx"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-emerald-100" />
            <span>تصدير إلى Excel (XLSX)</span>
          </a>
          <button
            onClick={fetchSearches}
            className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-200 transition"
            title="تحديث البيانات"
          >
            🔄
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 block mb-1">إجمالي استعلامات الـ AI</span>
          <span className="text-3xl font-black text-indigo-950">{totalSearches}</span>
          <span className="text-xs text-indigo-600 font-semibold block mt-1">عمليات بحث مسجلة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 block mb-1">عملاء مهتمون بأرقام هواتف</span>
          <span className="text-3xl font-black text-emerald-600">{withPhoneCount}</span>
          <span className="text-xs text-emerald-700 font-semibold block mt-1">فرص بيعية جاهزة للإغلاق</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 block mb-1">المنطقة الأكثر طلباً بالذكاء الاصطناعي</span>
          <span className="text-2xl font-black text-primary truncate block">{topLocation}</span>
          <span className="text-xs text-gray-400 block mt-1">بناءً على طلبات العملاء الفعلية</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="تصفية حسب اسم العميل، الهاتف، أو نص البحث..."
          className="flex-1 outline-none text-sm text-gray-800 font-arabic"
        />
        {filterText && (
          <button 
            onClick={() => setFilterText('')}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            مسح
          </button>
        )}
      </div>

      {/* Searches List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs font-bold text-gray-500">
          <span>نتائج البحث ({filteredSearches.length})</span>
          <span>سجل العملاء والمطابقات</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-indigo-600">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-bold">جاري تحميل الاستعلامات...</p>
          </div>
        ) : filteredSearches.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <SparklesIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-bold text-gray-600">لا توجد عمليات بحث مطابقة</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSearches.map((s: any) => {
              const filters = s.extractedFilters || {};
              const dateStr = new Date(s.createdAt).toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={s.id} className="p-5 hover:bg-gray-50/60 transition space-y-3">
                  {/* Customer Info & WhatsApp */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">
                          {s.customerName || 'عميل عبر المنصة'}
                        </span>
                        {s.customerPhone ? (
                          <span className="text-xs text-gray-500 font-mono">{s.customerPhone}</span>
                        ) : (
                          <span className="text-[11px] text-gray-400">بدون هاتف مسجل</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {s.customerPhone && (
                        <a
                          href={`https://wa.me/${s.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>تواصل واتساب</span>
                        </a>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-sans">
                        <ClockIcon className="w-4 h-4" />
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Query */}
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-sm text-gray-800 font-sans leading-relaxed">
                    <span className="text-xs text-gray-400 font-arabic font-bold block mb-1">نص البحث:</span>
                    &quot;{s.query}&quot;
                  </div>

                  {/* Extracted Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">فلاتر AI:</span>
                    {filters.location && (
                      <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-lg font-bold">
                        📍 {filters.location}
                      </span>
                    )}
                    {filters.maxPrice && (
                      <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-lg font-bold">
                        💰 ميزانية: {Number(filters.maxPrice).toLocaleString('ar-EG')} ج
                      </span>
                    )}
                    {filters.bedrooms && (
                      <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-lg font-bold">
                        🛏️ {filters.bedrooms} غرف
                      </span>
                    )}
                    {filters.propertyType && (
                      <span className="text-xs bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-lg font-bold">
                        🏢 {filters.propertyType}
                      </span>
                    )}
                    {filters.seaView && (
                      <span className="text-xs bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-lg font-bold">
                        🌊 إطلالة بحرية
                      </span>
                    )}
                  </div>

                  {/* Matched Properties */}
                  {s.matches && s.matches.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-500 block mb-2">
                        العقارات المتطابقة بنسب مئوية (Matched Properties):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {s.matches.slice(0, 3).map((match: any) => {
                          const unit = match.unit;
                          if (!unit) return null;
                          const uPrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);

                          return (
                            <div
                              key={match.id}
                              className="bg-white p-3 rounded-xl border border-gray-200 text-xs flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    #{unit.code || unit.id.slice(0, 6)}
                                  </span>
                                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    تطابق {match.matchScore}%
                                  </span>
                                </div>
                                <h4 className="font-bold text-gray-900 truncate">
                                  {unit.title}
                                </h4>
                              </div>
                              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 text-[11px]">
                                <span className="font-bold text-accent">
                                  {uPrice.toLocaleString('ar-EG')} ج.م
                                </span>
                                <span className="text-gray-500 truncate max-w-[120px]">
                                  {unit.location?.name || '-'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

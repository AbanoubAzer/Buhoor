import { api } from '@/api/client';
import Link from 'next/link';
import { 
  ArrowDownTrayIcon, 
  SparklesIcon, 
  UserIcon, 
  PhoneIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSearchesPage() {
  let searches: any[] = [];
  try {
    searches = await api.aiSearch.getAllSearches();
  } catch (err) {
    console.error('Failed to fetch searches:', err);
  }

  const exportUrl = api.aiSearch.getExportUrl();

  // Compute quick stats
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-cairo">
      
      {/* Top Header & Export Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full">
              Business & Sales CRM
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              طلبات العملاء ومطابقات الـ AI 🎯
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            متابعة كل عميل وما كان يبحث عنه بدقة مع العقارات المتطابقة ونسب التطابق (Matching %)
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href={exportUrl}
            download="bohoor-ai-leads-matches.xlsx"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-sm hover:shadow transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-emerald-100" />
            <span>تصدير إلى Excel (XLSX)</span>
          </a>

          <Link
            href="/units"
            className="text-xs font-bold text-gray-600 hover:text-primary bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-200 transition"
          >
            تصفح العقارات
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs text-right">
          <span className="text-xs font-bold text-gray-400 block mb-1">إجمالي عمليات البحث المحفوظة</span>
          <span className="text-3xl font-black text-indigo-950 font-cairo">{totalSearches}</span>
          <span className="text-xs text-indigo-600 font-semibold block mt-1">عمليات بحث مسجلة بالكامل</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs text-right">
          <span className="text-xs font-bold text-gray-400 block mb-1">العملاء المحتملون بأرقام هواتف</span>
          <span className="text-3xl font-black text-emerald-600 font-cairo">{withPhoneCount}</span>
          <span className="text-xs text-emerald-700 font-semibold block mt-1">فرصة بيع جاهزة للمتابعة الفورية</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs text-right">
          <span className="text-xs font-bold text-gray-400 block mb-1">المنطقة الأكثر طلباً</span>
          <span className="text-2xl font-black text-primary font-cairo">{topLocation}</span>
          <span className="text-xs text-gray-500 font-semibold block mt-1">بناءً على استعلامات العملاء الطبيعية</span>
        </div>
      </div>

      {/* Searches Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-500">
            يعرض أحدث {searches.length} استعلام بحث
          </span>
          <h2 className="text-lg font-bold text-gray-900">سجل استعلامات وتطابقات العملاء</h2>
        </div>

        {searches.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <SparklesIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-bold text-gray-600">لا توجد عمليات بحث مسجلة حتى الآن</p>
            <p className="text-xs text-gray-400 mt-1">جرب استخدام البحث الذكي بالـ AI لتسجيل أول استعلام وتطابق</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {searches.map((s: any) => {
              const filters = s.extractedFilters || {};
              const dateStr = new Date(s.createdAt).toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={s.id} className="p-6 hover:bg-gray-50/60 transition space-y-4">
                  
                  {/* Top Bar: Customer & Date */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-right">
                    <div className="flex items-center gap-2">
                      {s.customerPhone && (
                        <a
                          href={`https://wa.me/${s.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>تواصل واتساب</span>
                        </a>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">
                          {s.customerName || 'عميل عبر المنصة'}
                        </span>
                        {s.customerPhone ? (
                          <span className="text-xs text-gray-500 font-mono">{s.customerPhone}</span>
                        ) : (
                          <span className="text-[11px] text-gray-400">بدون هاتف مسجل</span>
                        )}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Query Bubble */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-right">
                    <span className="text-xs text-gray-400 font-semibold block mb-1">نص الاستعلام الأصلي:</span>
                    <p className="text-gray-800 text-sm font-medium leading-relaxed font-sans">
                      &quot;{s.query}&quot;
                    </p>
                  </div>

                  {/* Extracted Filters Pills */}
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="text-xs text-gray-400 font-medium">الفلاتر المستخرجة:</span>
                    {filters.location && (
                      <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg font-bold">
                        📍 {filters.location}
                      </span>
                    )}
                    {filters.maxPrice && (
                      <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                        💰 ميزانية: {Number(filters.maxPrice).toLocaleString('ar-EG')} ج
                      </span>
                    )}
                    {filters.bedrooms && (
                      <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
                        🛏️ {filters.bedrooms} غرف
                      </span>
                    )}
                    {filters.propertyType && (
                      <span className="text-xs bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg font-bold">
                        🏢 {filters.propertyType}
                      </span>
                    )}
                    {filters.seaView && (
                      <span className="text-xs bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-1 rounded-lg font-bold">
                        🌊 إطلالة بحرية
                      </span>
                    )}
                  </div>

                  {/* Matched Properties Preview */}
                  {s.matches && s.matches.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-500 block text-right">
                        أفضل العقارات المتطابقة (Matched Properties):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {s.matches.slice(0, 3).map((match: any) => {
                          const unit = match.unit;
                          if (!unit) return null;
                          const uPrice = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);

                          return (
                            <Link
                              key={match.id}
                              href={`/units/${unit.id}`}
                              target="_blank"
                              className="bg-white p-3 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-xs transition text-right flex flex-col justify-between"
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
                                <h4 className="text-xs font-bold text-gray-900 truncate">
                                  {unit.title}
                                </h4>
                              </div>
                              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 text-[11px]">
                                <span className="font-bold text-accent">
                                  {uPrice.toLocaleString('ar-EG')} ج.م
                                </span>
                                <span className="text-gray-500">
                                  {unit.location?.name || '-'}
                                </span>
                              </div>
                            </Link>
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

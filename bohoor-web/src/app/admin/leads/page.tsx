import { api } from '@/api/client';
import Link from 'next/link';
import { 
  ArrowDownTrayIcon, 
  SparklesIcon, 
  UserIcon, 
  PhoneIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  HomeModernIcon,
  BuildingOfficeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLeadsPage() {
  let leadsData: any = { data: [], total: 0 };
  try {
    leadsData = await api.leads.getAll();
  } catch (err) {
    console.error('Failed to fetch leads:', err);
  }

  const leads: any[] = Array.isArray(leadsData) ? leadsData : (leadsData?.data || []);
  const exportUrl = api.leads.getExportUrl();

  // Compute stats
  const totalLeads = leads.length;
  const readyNowCount = leads.filter((l) => l.readiness && l.readiness.includes('النهاردة')).length;
  const developerCount = leads.filter((l) => l.sellerType === 'DEVELOPER').length;
  const resaleCount = leads.filter((l) => l.sellerType === 'INDIVIDUAL').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full font-cairo">
      
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              CRM & Lead Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              طلبات المعاينة وحجز الوحدات 📋
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            متابعة جميع العملاء الذين سجلوا رغبتهم في معاينة وحجز الوحدات مع درجة جاهزيتهم للشراء
          </p>
        </div>

        {/* Action: Export to Excel */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href={exportUrl}
            download="bohoor-leads.xlsx"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-sm hover:shadow transition text-sm sm:text-base"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-emerald-100" />
            <span>تصدير إلى Excel (XLSX)</span>
          </a>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-2">
        <Link
          href="/admin/leads"
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2"
        >
          <DocumentTextIcon className="w-4 h-4" />
          <span>طلبات المعاينة (Leads)</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {totalLeads}
          </span>
        </Link>
        <Link
          href="/admin/searches"
          className="text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold text-sm transition border border-gray-200 flex items-center gap-2"
        >
          <SparklesIcon className="w-4 h-4 text-purple-600" />
          <span>مطابقات البحث الذكي (AI Searches)</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs text-right">
          <span className="text-xs font-bold text-gray-400 block mb-1">إجمالي طلبات المعاينة</span>
          <span className="text-3xl font-black text-gray-900 font-cairo">{totalLeads}</span>
          <span className="text-xs text-gray-500 font-semibold block mt-1">طلب معاينة مسجل</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs text-right bg-gradient-to-br from-emerald-50/50 to-white">
          <span className="text-xs font-bold text-emerald-700 block mb-1">🔥 جاهزون للتنفيذ الفوري</span>
          <span className="text-3xl font-black text-emerald-800 font-cairo">{readyNowCount}</span>
          <span className="text-xs text-emerald-600 font-semibold block mt-1">أولوية اتصال عاجل</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs text-right">
          <span className="text-xs font-bold text-blue-700 block mb-1">🏢 وحدات مطورين (0% عمولة)</span>
          <span className="text-3xl font-black text-blue-900 font-cairo">{developerCount}</span>
          <span className="text-xs text-blue-600 font-semibold block mt-1">مباشر من المطور</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs text-right">
          <span className="text-xs font-bold text-amber-800 block mb-1">👤 إعادة بيع أفراد (1.25%)</span>
          <span className="text-3xl font-black text-amber-900 font-cairo">{resaleCount}</span>
          <span className="text-xs text-amber-700 font-semibold block mt-1">مع عمولة المنصة</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-500">
            أحدث الطلبات مرتبة من الأحدث إلى الأقدم
          </span>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {totalLeads} طلب مسجل
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="p-16 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">لا توجد طلبات معاينة بعد</h3>
            <p className="text-xs text-gray-500">
              عند قيام أي عميل بملء نموذج حجز المعاينة على أي وحدة، ستظهر بياناته هنا فوراً ويمكنك تصديرها لإكسل بضغطة زر.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold text-gray-500">
                  <th className="py-3.5 px-4">تاريخ الطلب</th>
                  <th className="py-3.5 px-4">العميل</th>
                  <th className="py-3.5 px-4">الهاتف / واتساب</th>
                  <th className="py-3.5 px-4">درجة الجاهزية</th>
                  <th className="py-3.5 px-4">الاستفسارات</th>
                  <th className="py-3.5 px-4">نوع الوحدة والعمولة</th>
                  <th className="py-3.5 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leads.map((lead: any) => {
                  const dateStr = new Date(lead.createdAt).toLocaleString('ar-EG', {
                    timeZone: 'Africa/Cairo',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                  const isImmediate = lead.readiness && lead.readiness.includes('النهاردة');
                  const isMedium = lead.readiness && lead.readiness.includes('شهر');

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span>{dateStr}</span>
                          <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-4 px-4 whitespace-nowrap font-bold text-gray-900">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span>{lead.name}</span>
                          <UserIcon className="w-4 h-4 text-primary shrink-0" />
                        </div>
                      </td>

                      {/* Phone & Direct WhatsApp */}
                      <td className="py-4 px-4 whitespace-nowrap" dir="ltr">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="font-mono text-xs font-bold text-gray-800">
                            {lead.phone}
                          </span>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-1.5 rounded-lg transition"
                              title="محادثة واتساب مباشرة"
                            >
                              <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Readiness Badge */}
                      <td className="py-4 px-4 text-xs font-bold">
                        {isImmediate ? (
                          <span className="inline-block bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                            🔥 فوري (خلال 48 ساعة)
                          </span>
                        ) : isMedium ? (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200">
                            📅 خلال 1 - 3 شهور
                          </span>
                        ) : (
                          <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                            👀 استفسار ومعلومات
                          </span>
                        )}
                      </td>

                      {/* Questions */}
                      <td className="py-4 px-4 text-xs text-gray-600 max-w-xs">
                        <p className="line-clamp-2" title={lead.questions || ''}>
                          {lead.questions || '-'}
                        </p>
                      </td>

                      {/* Seller Type & Commission */}
                      <td className="py-4 px-4 text-xs">
                        <div className="space-y-0.5">
                          <span className={`font-bold block ${lead.sellerType === 'DEVELOPER' ? 'text-blue-700' : 'text-amber-800'}`}>
                            {lead.sellerType === 'DEVELOPER' ? '🏢 مطور مباشر' : '👤 إعادة بيع'}
                          </span>
                          <span className="text-[11px] text-gray-400 block">
                            {lead.commission || '-'}
                          </span>
                        </div>
                      </td>

                      {/* Unit Link / Action */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {lead.unitId ? (
                          <a
                            href={lead.unitId.startsWith('http') ? lead.unitId : `/units/${lead.unitId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent font-bold hover:underline"
                          >
                            <span>فتح الوحدة</span>
                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

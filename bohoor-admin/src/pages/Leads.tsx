import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  ArrowDownTrayIcon, 
  UserIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentListIcon,
  HomeModernIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'crm' | 'properties_sheet'>('crm');
  const [activeSheetGid, setActiveSheetGid] = useState<'392586599' | '835859943'>('392586599');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const toast = useToast();

  const googleSheets = {
    properties: {
      name: 'عرض العقارات (الملاك - شيت 2)',
      gid: '392586599',
      url: 'https://docs.google.com/spreadsheets/d/1cC-IO1uMUJ0DF7JOu6xLvXc8-3xPOJdiu2_kqoP-GEI/htmlembed?gid=392586599&widget=true&headers=true'
    },
    inquiries: {
      name: 'الطلبات والاستفسارات السابقة (شيت 1)',
      gid: '835859943',
      url: 'https://docs.google.com/spreadsheets/d/1cC-IO1uMUJ0DF7JOu6xLvXc8-3xPOJdiu2_kqoP-GEI/htmlembed?gid=835859943&widget=true&headers=true'
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.leads.getAll(1, 100);
      const data = Array.isArray(res) ? res : (res?.data || []);
      setLeads(data);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      toast.error('تعذر جلب طلبات واستفسارات العملاء');
    } finally {
      setLoading(false);
    }
  };

  const exportUrl = api.leads.getExportUrl();

  const filteredLeads = leads.filter((l) => {
    if (!filterText.trim()) return true;
    const txt = filterText.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(txt)) ||
      (l.phone && l.phone.includes(txt)) ||
      (l.questions && l.questions.toLowerCase().includes(txt)) ||
      (l.readiness && l.readiness.toLowerCase().includes(txt)) ||
      (l.unitId && l.unitId.toLowerCase().includes(txt))
    );
  });

  const totalLeads = leads.length;
  const readyNowCount = leads.filter((l) => l.readiness && l.readiness.includes('النهاردة')).length;
  const developerCount = leads.filter((l) => l.sellerType === 'DEVELOPER').length;
  const resaleCount = leads.filter((l) => l.sellerType === 'INDIVIDUAL').length;

  return (
    <div className="flex flex-col gap-6 font-arabic p-2 sm:p-4" dir="rtl">
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'crm'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            <span>طلبات حجز ومعاينة الوحدات (Leads CRM)</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'crm' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('properties_sheet')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'properties_sheet'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <HomeModernIcon className="w-5 h-5" />
            <span>طلبات عرض العقارات (الملاك)</span>
          </button>
        </div>

        {/* If on Google Sheets Tab, show sub-sheet switcher and external open link */}
        {activeTab === 'properties_sheet' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSheetGid('392586599')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSheetGid === '392586599'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {googleSheets.properties.name}
            </button>
            <button
              onClick={() => setActiveSheetGid('835859943')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSheetGid === '835859943'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {googleSheets.inquiries.name}
            </button>
            <a
              href="https://docs.google.com/spreadsheets/d/1cC-IO1uMUJ0DF7JOu6xLvXc8-3xPOJdiu2_kqoP-GEI/edit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              title="فتح الملف مباشرة في Google Sheets"
            >
              <span>فتح في Google Sheets</span>
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {activeTab === 'crm' && (
        <>
          {/* Header and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              قاعدة البيانات المباشرة
            </span>
            <h1 className="text-2xl font-bold text-gray-800">
              طلبات الحجز والاستفسارات 📋
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            متابعة جميع طلبات المعاينة وحجز العقارات المقدمة عبر المنصة، مع تصدير مباشر لملفات Excel
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary transition"
            title="تحديث البيانات"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>

          <a
            href={exportUrl}
            download="bohoor-leads.xlsx"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition text-sm"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-emerald-100" />
            <span>تصدير إلى Excel (XLSX)</span>
          </a>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-gray-400 block mb-1">إجمالي طلبات المعاينة</span>
          <span className="text-3xl font-black text-gray-900">{totalLeads}</span>
          <span className="text-xs text-gray-500 font-semibold block mt-1">طلب مسجل في قاعدة البيانات</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 block mb-1">🔥 جاهزون للتنفيذ الفوري</span>
          <span className="text-3xl font-black text-emerald-800">{readyNowCount}</span>
          <span className="text-xs text-emerald-600 font-semibold block mt-1">أولوية اتصال عاجل (خلال 48 س)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-xs font-bold text-blue-700 block mb-1">🏢 وحدات مطورين (0% عمولة)</span>
          <span className="text-3xl font-black text-blue-900">{developerCount}</span>
          <span className="text-xs text-blue-600 font-semibold block mt-1">عرض مباشر من شركة التطوير</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-xs font-bold text-amber-800 block mb-1">👤 إعادة بيع أفراد (1.25%)</span>
          <span className="text-3xl font-black text-amber-900">{resaleCount}</span>
          <span className="text-xs text-amber-700 font-semibold block mt-1">مع عمولة المنصة</span>
        </div>
      </div>

      {/* Table & Search Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Table Search Header */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="بحث بالاسم، رقم الهاتف، أو نص الاستفسار..."
              className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="text-xs text-gray-500 font-bold self-end sm:self-center">
            عرض {filteredLeads.length} من أصل {totalLeads} طلب
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-primary">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-bold text-gray-600">جاري تحميل الطلبات من قاعدة البيانات...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <ClipboardDocumentListIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-bold text-gray-700 mb-1">لا توجد طلبات تطابق البحث</h3>
            <p className="text-xs text-gray-500">
              {leads.length === 0 ? 'لم يسجل أي عميل طلب معاينة بعد.' : 'جرب تعديل كلمة البحث.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold text-gray-500">
                  <th className="py-3.5 px-4">تاريخ الطلب</th>
                  <th className="py-3.5 px-4">اسم العميل</th>
                  <th className="py-3.5 px-4">الهاتف / واتساب</th>
                  <th className="py-3.5 px-4">درجة الجاهزية للتنفيذ</th>
                  <th className="py-3.5 px-4">الاستفسارات والأسئلة</th>
                  <th className="py-3.5 px-4">جهة العرض والعمولة</th>
                  <th className="py-3.5 px-4 text-center">الوحدة المطلوبة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredLeads.map((lead: any) => {
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
                    <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors">
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

                      {/* Readiness */}
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

                      {/* Seller & Commission */}
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

                      {/* Unit Link */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {lead.unitId ? (
                          <a
                            href={lead.unitId.startsWith('http') ? lead.unitId : `http://localhost:3000/units/${lead.unitId}`}
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
    </>
  )}

      {/* TAB 2: Property Submissions (Google Sheets Embed) */}
      {activeTab === 'properties_sheet' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-210px)] min-h-[650px] relative">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <TableCellsIcon className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-gray-800">
                {activeSheetGid === '392586599' ? googleSheets.properties.name : googleSheets.inquiries.name}
              </span>
              <span className="text-gray-400">| Google Sheets المباشر</span>
            </div>
            <a
              href={`https://docs.google.com/spreadsheets/d/1cC-IO1uMUJ0DF7JOu6xLvXc8-3xPOJdiu2_kqoP-GEI/edit#gid=${activeSheetGid}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-bold flex items-center gap-1"
            >
              <span>فتح وتعديل في Google Sheets</span>
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex-1 relative w-full h-full">
            {/* Loading placeholder underneath */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 -z-10">
              <div className="flex flex-col items-center text-gray-400">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-2"></div>
                <p className="text-sm">جاري تحميل جدول البيانات من Google Sheets...</p>
              </div>
            </div>

            <iframe
              key={activeSheetGid}
              src={`https://docs.google.com/spreadsheets/d/1cC-IO1uMUJ0DF7JOu6xLvXc8-3xPOJdiu2_kqoP-GEI/htmlembed?gid=${activeSheetGid}&widget=true&headers=true`}
              className="w-full h-full border-0 z-10 relative bg-transparent"
              title="Property Submissions Sheet"
            />
          </div>
        </div>
      )}

    </div>
  );
}

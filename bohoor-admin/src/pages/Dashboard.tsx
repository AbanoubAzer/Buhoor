import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

// ───── Icons (inline SVG) ─────────────────────────────────────────────────────
const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V7l6-4v18M9 10h6M9 14h6M9 18h6" />
  </svg>
);
const FolderIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
  </svg>
);
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8M5 21h14" />
  </svg>
);
const PersonIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);
// ───── Stat Card ─────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;   // gradient classes
  link?: string;
}
function StatCard({ label, value, icon, color, link }: StatCardProps) {
  const inner = (
    <div className={`group relative overflow-hidden rounded-2xl p-5 shadow-lg flex items-center gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${color}`}>
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="text-white">
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-3xl font-extrabold leading-none mt-0.5">{value}</p>
      </div>
      {/* shimmer */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
}

// ───── Donut Chart (pure CSS) ──────────────────────────────────────────────
interface DonutProps { approved: number; sold: number; hidden: number; }
function DonutChart({ approved, sold, hidden }: DonutProps) {
  const total = approved + sold + hidden || 1;
  const a = (approved / total) * 100;
  const s = (sold / total) * 100;
  const gradient = `conic-gradient(
    #10b981 0% ${a}%,
    #f43f5e ${a}% ${a + s}%,
    #94a3b8 ${a + s}% 100%
  )`;
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-36 h-36 flex-shrink-0">
        <div className="w-full h-full rounded-full shadow-inner" style={{ background: gradient }} />
        <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">{approved + sold + hidden}</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> متاح <strong>{approved}</strong></li>
        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500" /> تم البيع <strong>{sold}</strong></li>
        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400" /> إخفاء <strong>{hidden}</strong></li>
      </ul>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.stats.getSummary();
      setStats(data);
    } catch {
      setError('تعذّر تحميل البيانات، تأكد من تشغيل الـ Backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3 animate-pulse">
        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-200" />
        <p className="text-indigo-500 font-medium">جار التحميل…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
        <button onClick={loadStats} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          إعادة المحاولة
        </button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6 md:p-8 space-y-8 font-arabic">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-1">نظرة شاملة على حالة المنصة</p>
        </div>
        <button onClick={loadStats} title="تحديث" className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:shadow-md transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0120 15.418M19.418 15A8 8 0 014 8.582" />
          </svg>
        </button>
      </header>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="المطورين" value={stats?.developersCount ?? 0} icon={<BuildingIcon />} color="from-indigo-500 to-indigo-700" link="/developers" />
        <StatCard label="المشاريع" value={stats?.projectsCount ?? 0} icon={<FolderIcon />} color="from-violet-500 to-violet-700" />
        <StatCard label="وحدات المطورين" value={stats?.devUnitsCount ?? 0} icon={<HomeIcon />} color="from-sky-500 to-sky-700" link="/units" />
        <StatCard label="عقارات الأفراد" value={stats?.indUnitsCount ?? 0} icon={<PersonIcon />} color="from-pink-500 to-pink-700" link="/units" />
      </section>

      {/* ── Middle Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Donut Chart */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">حالة الوحدات</h2>
          <DonutChart
            approved={stats?.approvedCount ?? 0}
            sold={stats?.soldCount ?? 0}
            hidden={stats?.hiddenCount ?? 0}
          />
        </div>

        {/* Top Developer Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-sm p-6 flex flex-col justify-between text-white">
          <h2 className="text-sm font-semibold opacity-80 mb-2">🏆 المطور الأنشط</h2>
          {stats?.topDeveloper ? (
            <>
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={stats.topDeveloper.logoUrl}
                  alt={stats.topDeveloper.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow"
                  onError={(e: any) => { e.target.src = 'https://placehold.co/56x56?text=DEV'; }}
                />
                <div>
                  <p className="text-xl font-extrabold">{stats.topDeveloper.name}</p>
                  <p className="text-xs opacity-80">{stats.topDeveloper.unitsCount ?? 0} وحدة</p>
                </div>
              </div>
              <Link to="/developers" className="mt-4 self-start text-xs underline opacity-80 hover:opacity-100">
                عرض جميع المطورين ←
              </Link>
            </>
          ) : <p className="text-sm opacity-70">لا توجد بيانات</p>}
        </div>

        {/* Quick stats */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-800">ملخص سريع</h2>
          {[
            { label: 'إجمالي الوحدات', value: stats?.unitsCount ?? 0, bar: 100, color: 'bg-indigo-500' },
            { label: 'متاح', value: stats?.approvedCount ?? 0, bar: Math.round(((stats?.approvedCount ?? 0) / (stats?.unitsCount || 1)) * 100), color: 'bg-emerald-500' },
            { label: 'تم البيع', value: stats?.soldCount ?? 0, bar: Math.round(((stats?.soldCount ?? 0) / (stats?.unitsCount || 1)) * 100), color: 'bg-rose-500' },
            { label: 'إخفاء', value: stats?.hiddenCount ?? 0, bar: Math.round(((stats?.hiddenCount ?? 0) / (stats?.unitsCount || 1)) * 100), color: 'bg-slate-400' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Projects Section ────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🏢 أكبر المشاريع العقارية</h2>
            <p className="text-gray-500 text-xs mt-0.5">أكثر المشاريع نشاطاً واحتواءً على وحدات متاحة</p>
          </div>
          <Link to="/projects" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">
            عرض كل المشاريع ←
          </Link>
        </div>

        {stats?.topProjects && stats.topProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.topProjects.map((p: any) => (
              <div key={p.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition bg-gradient-to-br from-white to-gray-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full">{p.location}</span>
                    <span className="text-xs text-gray-500 font-semibold">{p.totalUnits} وحدة</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base mb-1">{p.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    {p.developerLogo && <img src={p.developerLogo} className="w-4 h-4 rounded-full object-cover" onError={(e: any) => e.target.style.display='none'} />}
                    <span>{p.developerName}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>الوحدات المتاحة</span>
                    <span className="font-bold text-green-600">{p.availablePercentage}% ({p.approvedUnits} من {p.totalUnits})</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${p.availablePercentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">لا توجد مشاريع مضافة حالياً</p>
        )}
      </section>

    </div>
  );
}

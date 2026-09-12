import { useState, useEffect, useMemo, useCallback } from 'react';
import UnitForm from '../components/UnitForm';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

export default function Units() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [units, setUnits]                 = useState<any[]>([]);
  const [totalCount, setTotalCount]       = useState(0);
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [loading, setLoading]             = useState(false);

  const [developers, setDevelopers]       = useState<any[]>([]);
  const [projects, setProjects]           = useState<any[]>([]);
  const [locations, setLocations]         = useState<any[]>([]);
  const [unitTypes, setUnitTypes]         = useState<any[]>([]);
  const [editingUnit, setEditingUnit]     = useState<any>(null);

  // Filters
  const [searchQuery, setSearchQuery]           = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter]         = useState('');
  const [sellerTypeFilter, setSellerTypeFilter] = useState('');
  const [locationFilter, setLocationFilter]     = useState('');
  const [developerFilter, setDeveloperFilter]   = useState('');
  const [projectFilter, setProjectFilter]       = useState('');

  const toast = useToast();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch dropdown metadata once
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [devsData, projsData, locsData, typesData] = await Promise.all([
          api.developers.getAll(),
          api.projects.getAll(),
          api.locations.getAll(),
          api.unitTypes.getAll(),
        ]);
        setDevelopers(devsData);
        setProjects(projsData);
        setLocations(locsData);
        setUnitTypes(typesData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch units with server-side pagination and filtering
  const fetchUnits = useCallback(async (pageToLoad = currentPage) => {
    setLoading(true);
    try {
      const res = await api.units.getAll({
        page: pageToLoad,
        limit: 9,
        search: debouncedSearchQuery.trim() || undefined,
        status: statusFilter || undefined,
        sellerType: sellerTypeFilter || undefined,
        locationId: locationFilter || undefined,
        developerId: developerFilter || undefined,
        projectId: projectFilter || undefined,
      });

      if (res && res.data) {
        setUnits(res.data);
        setTotalCount(res.total || 0);
        setCurrentPage(res.page || 1);
        setTotalPages(res.totalPages || 1);
      } else if (Array.isArray(res)) {
        setUnits(res);
        setTotalCount(res.length);
        setTotalPages(1);
      }
    } catch (err: any) {
      toast.error(err.message || 'فشل جلب الوحدات العقارية');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, statusFilter, sellerTypeFilter, locationFilter, developerFilter, projectFilter, toast]);

  useEffect(() => {
    fetchUnits(1);
  }, [debouncedSearchQuery, statusFilter, sellerTypeFilter, locationFilter, developerFilter, projectFilter]);

  // When developer filter changes, reset project filter
  const handleDevFilter = (val: string) => {
    setDeveloperFilter(val);
    setProjectFilter('');
  };

  // Projects filtered by selected developer
  const filteredProjectsForDropdown = useMemo(() =>
    developerFilter ? projects.filter(p => p.developerId === developerFilter) : projects,
    [projects, developerFilter]
  );

  const handleEditClick = (unit: any) => {
    setEditingUnit(unit);
    setIsFormVisible(true);
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوحدة؟ (سيتم إخفاؤها وحفظها كـ Soft Delete)')) {
      return;
    }
    try {
      await api.units.remove(unitId);
      toast.success('تم حذف العقار بنجاح');
      fetchUnits(currentPage);
    } catch (err: any) {
      toast.error(err.message || 'فشل حذف العقار');
    }
  };

  const handleStatusChange = async (unitId: string, newStatus: string) => {
    try {
      await api.units.updateStatus(unitId, newStatus);
      const label = newStatus === 'APPROVED' ? 'متاح' : newStatus === 'SOLD' ? 'تم البيع' : 'إخفاء';
      toast.success(`تم تغيير حالة العقار إلى "${label}"`);
      fetchUnits(currentPage);
    } catch (err: any) {
      toast.error(err.message || 'فشل تغيير حالة العقار');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">متاح</span>;
      case 'SOLD':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs font-bold">تم البيع</span>;
      case 'HIDDEN':
      case 'PENDING_REVIEW':
      case 'REJECTED':
      default:
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold">إخفاء</span>;
    }
  };

  const clearFilters = () => {
    setSearchQuery(''); setStatusFilter(''); setSellerTypeFilter('');
    setLocationFilter(''); setDeveloperFilter(''); setProjectFilter('');
  };
  const hasFilters = searchQuery || statusFilter || sellerTypeFilter || locationFilter || developerFilter || projectFilter;

  return (
    <div className="space-y-6 font-arabic" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العقارات والوحدات</h1>
          <p className="text-gray-500 text-sm mt-0.5">إدارة ومراجعة وفلترة جميع الوحدات السكنية والتجارية</p>
        </div>
        {!isFormVisible && (
          <button
            onClick={() => { setEditingUnit(null); setIsFormVisible(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm hover:shadow"
          >
            + إضافة عقار
          </button>
        )}
      </div>

      {isFormVisible ? (
        <UnitForm
          developers={developers}
          projects={projects}
          locations={locations}
          unitTypes={unitTypes}
          initialData={editingUnit}
          onSubmit={async (data) => {
            try {
              if (editingUnit) {
                await api.units.update(editingUnit.id, data);
                toast.success('تم تحديث بيانات العقار بنجاح!');
              } else {
                await api.units.create(data);
                toast.success('تمت إضافة العقار الجديد بنجاح!');
              }
              setIsFormVisible(false);
              setEditingUnit(null);
              fetchUnits(currentPage);
            } catch (err: any) {
              toast.error(err.message || 'حدث خطأ أثناء حفظ العقار');
            }
          }}
          onCancel={() => { setIsFormVisible(false); setEditingUnit(null); }}
        />
      ) : (
        <>
          {/* ── Filters ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث بعنوان أو كود العقار…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
                />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
                <option value="">كل الحالات</option>
                <option value="APPROVED">متاح</option>
                <option value="SOLD">تم البيع</option>
                <option value="HIDDEN">إخفاء</option>
              </select>
              <select value={sellerTypeFilter} onChange={e => setSellerTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
                <option value="">كل الأنواع</option>
                <option value="DEVELOPER">مطورين</option>
                <option value="INDIVIDUAL">أفراد</option>
              </select>
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
                <option value="">كل المناطق</option>
                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
            </div>
            {/* Row 2 – Developer & Project filters */}
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <select value={developerFilter} onChange={e => handleDevFilter(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
                <option value="">كل المطورين</option>
                {developers.map(dev => <option key={dev.id} value={dev.id}>{dev.name}</option>)}
              </select>
              <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
                disabled={filteredProjectsForDropdown.length === 0}>
                <option value="">كل المشاريع</option>
                {filteredProjectsForDropdown.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
              </select>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="text-sm text-rose-600 hover:text-rose-800 whitespace-nowrap font-medium transition px-2">
                  مسح الفلاتر ✕
                </button>
              )}
              <span className="text-xs text-gray-500 font-semibold whitespace-nowrap bg-gray-100 px-3 py-1.5 rounded-lg">
                {totalCount} عقار
              </span>
            </div>
          </div>

          {/* ── Units Grid ── */}
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">جار تحميل العقارات…</div>
          ) : units.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {units.map(unit => (
                <div key={unit.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="relative">
                      {/* Action buttons top */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                        <button onClick={() => handleEditClick(unit)}
                          className="bg-white/90 p-2 rounded-xl shadow hover:bg-indigo-600 hover:text-white transition"
                          title="تعديل العقار">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteUnit(unit.id)}
                          className="bg-white/90 p-2 rounded-xl shadow hover:bg-rose-600 hover:text-white transition"
                          title="حذف العقار">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {unit.coverImage ? (
                        <img src={unit.coverImage} alt={unit.title} className="w-full h-44 object-cover" />
                      ) : (
                        <div className="w-full h-44 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-4xl">🏠</div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1">{unit.title}</h3>
                        {getStatusBadge(unit.status)}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span>📍 {unit.location?.name ?? '—'}</span>
                        <span>•</span>
                        <span>🏷 {unit.unitType?.name ?? '—'}</span>
                      </div>

                      {unit.project && (
                        <div className="text-xs text-indigo-600 font-medium mb-1.5 truncate">📁 {unit.project?.name}</div>
                      )}
                      {unit.developer && (
                        <div className="text-xs text-gray-500 mb-2 truncate">🏢 {unit.developer?.name}</div>
                      )}

                      <div className="flex justify-between items-center text-sm pt-2.5 border-t border-gray-100">
                        <span className="font-bold text-indigo-700">{Number(unit.cashPaidToSeller).toLocaleString('ar-EG')} ج</span>
                        {unit.isCashOnly ? (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">كاش فقط</span>
                        ) : (
                          <span className="text-gray-500 text-xs">قسط: {Number(unit.monthlyEquivalentInstallment).toLocaleString('ar-EG')} ج/ش</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Status Selector */}
                  <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 font-medium">الحالة:</span>
                    <select
                      value={unit.status === 'PENDING_REVIEW' || unit.status === 'REJECTED' ? 'HIDDEN' : (unit.status || 'APPROVED')}
                      onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                      className="text-xs font-bold py-1 px-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                    >
                      <option value="APPROVED">🟢 متاح</option>
                      <option value="SOLD">🔴 تم البيع</option>
                      <option value="HIDDEN">⚪ إخفاء</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              لا توجد عقارات تطابق بحثك حالياً.
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3.5 shadow-sm">
              <span className="text-xs text-gray-500">
                صفحة {currentPage} من إجمالي {totalPages} صفحة
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const prev = Math.max(1, currentPage - 1);
                    setCurrentPage(prev);
                    fetchUnits(prev);
                  }}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                    currentPage <= 1 ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : 'hover:bg-indigo-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                  السابق
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gray-400">…</span>}
                      <button
                        onClick={() => {
                          setCurrentPage(p);
                          fetchUnits(p);
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                          currentPage === p ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    const next = Math.min(totalPages, currentPage + 1);
                    setCurrentPage(next);
                    fetchUnits(next);
                  }}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                    currentPage >= totalPages ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : 'hover:bg-indigo-50 border-gray-200 text-gray-700'
                  }`}
                >
                  التالي
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

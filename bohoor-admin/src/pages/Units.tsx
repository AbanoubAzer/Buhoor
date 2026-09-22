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
  const [governorateFilter, setGovernorateFilter] = useState('');
  const [locationFilter, setLocationFilter]     = useState('');
  const [developerFilter, setDeveloperFilter]   = useState('');
  const [projectFilter, setProjectFilter]       = useState('');

  // Default Sort Setting for Website
  const [defaultSort, setDefaultSort]           = useState('priority_first');
  const [isSavingSort, setIsSavingSort]         = useState(false);

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
        const [devsData, projsData, locsData, typesData, sortRes] = await Promise.all([
          api.developers.getAll(),
          api.projects.getAll(),
          api.locations.getAll(),
          api.unitTypes.getAll(),
          api.settings.getDefaultSort().catch(() => ({ defaultSort: 'priority_first' })),
        ]);
        setDevelopers(devsData);
        setProjects(projsData);
        setLocations(locsData);
        setUnitTypes(typesData);
        if (sortRes?.defaultSort) {
          setDefaultSort(sortRes.defaultSort);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeta();
  }, []);

  // Unique governorates
  const governorates = useMemo(() => {
    const set = new Set<string>();
    locations.forEach(loc => {
      if (loc.governorate) set.add(loc.governorate);
    });
    return Array.from(set);
  }, [locations]);

  // Filtered locations dropdown based on governorate
  const filteredLocationsForDropdown = useMemo(() => {
    if (!governorateFilter) return locations;
    return locations.filter(loc => loc.governorate === governorateFilter);
  }, [locations, governorateFilter]);

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
        governorate: governorateFilter || undefined,
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
  }, [currentPage, debouncedSearchQuery, statusFilter, sellerTypeFilter, governorateFilter, locationFilter, developerFilter, projectFilter, toast]);

  useEffect(() => {
    fetchUnits(1);
  }, [debouncedSearchQuery, statusFilter, sellerTypeFilter, governorateFilter, locationFilter, developerFilter, projectFilter]);

  const handleGovFilter = (val: string) => {
    setGovernorateFilter(val);
    setLocationFilter('');
  };

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

  const handleSaveDefaultSort = async (newSort: string) => {
    setIsSavingSort(true);
    try {
      await api.settings.updateDefaultSort(newSort);
      setDefaultSort(newSort);
      toast.success('تم تحديث وحفظ ترتيب الموقع الافتراضي بنجاح! سيتم تطبيقه على جميع زوار المنصة');
      fetchUnits(1);
    } catch (err: any) {
      toast.error(err.message || 'فشل حفظ إعداد الترتيب الافتراضي');
    } finally {
      setIsSavingSort(false);
    }
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
    setGovernorateFilter(''); setLocationFilter(''); setDeveloperFilter(''); setProjectFilter('');
  };
  const hasFilters = searchQuery || statusFilter || sellerTypeFilter || governorateFilter || locationFilter || developerFilter || projectFilter;

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
          {/* ── Global Website Default Sort Control ── */}
          <div className="bg-gradient-to-l from-indigo-900 via-indigo-850 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-700/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-1 rounded-md font-bold border border-indigo-400/30">
                  ⚙️ إعدادات المنصة
                </span>
                <h2 className="text-base font-bold text-white">ترتيب ظهور العقارات الافتراضي لزوار الموقع</h2>
              </div>
              <p className="text-xs text-indigo-200/90 leading-relaxed max-w-2xl">
                يحدد كيفية ترتيب الوحدات تلقائياً عند دخول الزائر للموقع أو صفحة العقارات. (العقارات المحددة برقم ترتيب يدوي تظهر بالقمة أولاً دائماً).
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm p-1.5 rounded-xl border border-white/15 self-start md:self-auto">
              <select
                value={defaultSort}
                disabled={isSavingSort}
                onChange={(e) => handleSaveDefaultSort(e.target.value)}
                className="bg-white text-gray-900 text-xs sm:text-sm font-bold py-2 px-3 rounded-lg outline-none cursor-pointer border border-transparent focus:ring-2 focus:ring-indigo-400"
              >
                <option value="priority_first">📌 الترتيب اليدوي المخصص أولاً (ثم الأحدث)</option>
                <option value="highest_roi">📈 أعلى عائد استثماري إيجاري أولاً (Highest ROI)</option>
                <option value="newest">⏱️ الأحدث إضافة أولاً (Newest)</option>
                <option value="price_asc">💰 السعر: الأقل إلى الأعلى (المقدم كاش)</option>
                <option value="price_desc">💎 السعر: الأعلى إلى الأقل (المقدم كاش)</option>
                <option value="sea_view_first">🌊 العقارات المطلة على البحر أولاً</option>
                <option value="verified_first">⭐ العقارات الموثقة (Verified) أولاً</option>
              </select>
              {isSavingSort && <span className="text-xs text-indigo-200 animate-pulse px-2">جاري الحفظ…</span>}
            </div>
          </div>

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
              <select value={governorateFilter} onChange={e => handleGovFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
                <option value="">كل المحافظات</option>
                {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
              </select>
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
                <option value="">كل المناطق</option>
                {filteredLocationsForDropdown.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
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

                      {/* Display Order Badge if pinned */}
                      {unit.displayOrder && Number(unit.displayOrder) > 0 ? (
                        <div className="absolute top-2.5 right-2.5 z-10 bg-amber-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                          <span>📌 أولوية #{unit.displayOrder}</span>
                        </div>
                      ) : null}

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
                        <span>📍 {unit.location?.governorate ? `${unit.location.governorate}، ${unit.location.name}` : (unit.location?.name ?? '—')}</span>
                        <span>•</span>
                        <span>🏷 {unit.unitType?.name ?? '—'}</span>
                      </div>

                      {unit.project && (
                        <div className="text-xs text-indigo-600 font-medium mb-1.5 truncate">📁 {unit.project?.name}</div>
                      )}
                      {unit.developer && (
                        <div className="text-xs text-gray-500 mb-2 truncate">🏢 {unit.developer?.name}</div>
                      )}

                      {(unit.isSeaView || (unit.expectedRentalRoi && Number(unit.expectedRentalRoi) > 0)) && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          {unit.isSeaView && (
                            <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                              🌊 إطلالة بحرية
                            </span>
                          )}
                          {unit.expectedRentalRoi && Number(unit.expectedRentalRoi) > 0 && (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              📈 ROI {Number(unit.expectedRentalRoi)}%
                            </span>
                          )}
                        </div>
                      )}

                      {unit.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2.5 leading-relaxed bg-gray-50 p-2 rounded-xl border border-gray-100">
                          {unit.description}
                        </p>
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

                  {/* Quick Status and Display Order Controls */}
                  <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 font-medium">الترتيب:</span>
                      <input
                        type="number"
                        min="1"
                        key={`${unit.id}-${unit.displayOrder}`}
                        defaultValue={unit.displayOrder || ''}
                        placeholder="تلقائي"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        onBlur={async (e) => {
                          const val = e.target.value.trim();
                          const numVal = val === '' ? null : Number(val);
                          const currentVal = unit.displayOrder ? Number(unit.displayOrder) : null;
                          if (numVal !== currentVal) {
                            try {
                              await api.units.updateOrder(unit.id, numVal && numVal > 0 ? numVal : null);
                              toast.success(`تم تحديث ترتيب العقار إلى: ${numVal ? `#${numVal}` : 'تلقائي'}`);
                              fetchUnits(currentPage);
                            } catch (err: any) {
                              toast.error(err.message || 'فشل تحديث الترتيب');
                            }
                          }
                        }}
                        className="w-16 text-center text-xs font-bold py-1 px-1.5 rounded-lg border border-gray-200 bg-white text-indigo-900 outline-none focus:ring-1 focus:ring-indigo-400"
                        title="أدخل رقم الترتيب واضغط Enter أو انقر بالخارج للحفظ"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 font-medium">الحالة:</span>
                      <select
                        value={unit.status === 'PENDING_REVIEW' || unit.status === 'REJECTED' ? 'HIDDEN' : (unit.status || 'APPROVED')}
                        onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                        className="text-xs font-bold py-1 px-2 rounded-lg border border-gray-200 bg-white text-gray-800 outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                      >
                        <option value="APPROVED">🟢 متاح</option>
                        <option value="SOLD">🔴 تم البيع</option>
                        <option value="HIDDEN">⚪ إخفاء</option>
                      </select>
                    </div>
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

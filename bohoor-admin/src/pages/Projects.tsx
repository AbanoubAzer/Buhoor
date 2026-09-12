import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import UnitForm from '../components/UnitForm';
import { useToast } from '../context/ToastContext';
import ImageUpload from '../components/ImageUpload';

// ── Icons ────────────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const ChevronUp = () => (
  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED:       'bg-emerald-100 text-emerald-800',
    SOLD:           'bg-rose-100 text-rose-800',
    HIDDEN:         'bg-gray-100 text-gray-700',
    PENDING_REVIEW: 'bg-gray-100 text-gray-700',
    REJECTED:       'bg-gray-100 text-gray-700',
  };
  const label: Record<string, string> = {
    APPROVED: 'متاح',
    SOLD: 'تم البيع',
    HIDDEN: 'إخفاء',
    PENDING_REVIEW: 'إخفاء',
    REJECTED: 'إخفاء',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {label[status] ?? status}
    </span>
  );
}

// ── Project Form Modal ───────────────────────────────────────────────────────
function ProjectModal({
  developers, onSave, onClose, initial,
}: { developers: any[]; onSave: (data: any) => void; onClose: () => void; initial?: any }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    developerId: initial?.developerId ?? '',
    location: initial?.location ?? '',
    description: initial?.description ?? '',
    coverImage: initial?.coverImage ?? '',
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-4" dir="rtl">
        <h2 className="text-lg font-bold text-gray-800">{initial ? 'تعديل مشروع' : 'إضافة مشروع جديد'}</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">اسم المشروع *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">المطور *</label>
            <select value={form.developerId} onChange={e => setForm(f => ({ ...f, developerId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none">
              <option value="">اختر مطور</option>
              {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">الموقع *</label>
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">الوصف</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none" />
          </div>
          <div className="pt-2">
            <ImageUpload 
              label="صورة الغلاف" 
              value={form.coverImage} 
              onChange={(url) => setForm(f => ({ ...f, coverImage: url }))} 
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={() => onSave(form)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-semibold transition">
            حفظ
          </button>
          <button onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-sm font-semibold transition">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDev = searchParams.get('dev') || '';
  
  const [projects, setProjects]           = useState<any[]>([]);
  const [developers, setDevelopers]       = useState<any[]>([]);
  const [locations, setLocations]         = useState<any[]>([]);
  const [unitTypes, setUnitTypes]         = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [devFilter, setDevFilter]         = useState(initialDev);
  const [expandedProject, setExpanded]    = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject]     = useState<any>(null);
  const [addUnitProject, setAddUnitProject]     = useState<any>(null);
  const toast = useToast();

  const handleDevFilterChange = (devId: string) => {
    setDevFilter(devId);
    if (devId) {
      setSearchParams({ dev: devId });
    } else {
      setSearchParams({});
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [projs, devs, locs, types] = await Promise.all([
        api.projects.getAll(devFilter || undefined),
        api.developers.getAll(),
        api.locations.getAll(),
        api.unitTypes.getAll(),
      ]);
      setProjects(projs);
      setDevelopers(devs);
      setLocations(locs);
      setUnitTypes(types);
    } catch (e) {
      toast.error('فشل جلب بيانات المشاريع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [devFilter]);

  const handleSaveProject = async (data: any) => {
    try {
      if (editingProject) {
        await api.projects.update(editingProject.id, data);
        toast.success('تم تحديث بيانات المشروع بنجاح');
      } else {
        await api.projects.create(data);
        toast.success('تم إضافة المشروع الجديد بنجاح');
      }
      setShowProjectModal(false);
      setEditingProject(null);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'فشل حفظ المشروع');
    }
  };

  const handleAddUnit = async (unitData: any) => {
    try {
      unitData.projectId = addUnitProject.id;
      unitData.developerId = addUnitProject.developerId;
      unitData.sellerType = 'DEVELOPER';
      await api.units.create(unitData);
      toast.success('تم إضافة الوحدة إلى المشروع بنجاح');
      setAddUnitProject(null);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'فشل إضافة الوحدة');
    }
  };

  return (
    <div dir="rtl" className="space-y-6 font-arabic">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المشاريع العقارية</h1>
          <p className="text-gray-500 text-sm mt-0.5">تصفح المشاريع، إضافة وحدات داخلها، ومتابعة نسب المتاح منها</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm hover:shadow"
        >
          <PlusIcon /> إضافة مشروع
        </button>
      </div>

      {/* Developer Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-2.5 items-center">
        <span className="text-sm text-gray-500 font-medium">فلتر بالمطور:</span>
        <button
          onClick={() => handleDevFilterChange('')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${devFilter === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          الكل ({projects.length})
        </button>
        {developers.map(dev => (
          <button key={dev.id}
            onClick={() => handleDevFilterChange(dev.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${devFilter === dev.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <img src={dev.logoUrl} className="w-4 h-4 rounded-full object-cover" onError={(e: any) => e.target.style.display='none'} />
            {dev.name}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">جار التحميل…</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          لا توجد مشاريع مضافة لهذا الفلتر
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(proj => {
            const isOpen = expandedProject === proj.id;
            const total = proj._count?.units ?? proj.units?.length ?? 0;
            const approved = (proj.units ?? []).filter((u: any) => u.status === 'APPROVED').length;
            const percent = total > 0 ? Math.round((approved / total) * 100) : 0;

            return (
              <div key={proj.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition hover:border-indigo-100">
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition"
                  onClick={() => setExpanded(isOpen ? null : proj.id)}>
                  
                  <div className="flex items-center gap-4 min-w-0">
                    {proj.coverImage ? (
                      <img src={proj.coverImage} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400 text-2xl flex-shrink-0">🏗</div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-base">{proj.name}</h3>
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full">{proj.location}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {proj.developer && (
                          <span className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                            <img src={proj.developer.logoUrl} className="w-4 h-4 rounded-full object-cover" onError={(e: any) => e.target.style.display='none'} />
                            {proj.developer.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">إجمالي {total} وحدة</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar & Actions */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    {total > 0 && (
                      <div className="w-36 sm:w-44 hidden sm:block">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>المتاح: {approved} من {total}</span>
                          <span className="font-bold text-emerald-600">{percent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); setEditingProject(proj); setShowProjectModal(true); }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 transition"
                        title="تعديل المشروع"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setAddUnitProject(proj); }}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition"
                      >
                        <PlusIcon /> إضافة وحدة
                      </button>
                      <span className="text-gray-400 mr-1">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
                    </div>
                  </div>
                </div>

                {/* Units inside project */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50/60 p-4">
                    {!proj.units || proj.units.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        لا توجد وحدات في هذا المشروع حالياً. يمكنك إضافة وحدة جديدة بالضغط على &quot;إضافة وحدة&quot;.
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-500 text-xs border-b border-gray-100 bg-gray-50/80">
                              <th className="px-4 py-3 text-right font-medium">الوحدة</th>
                              <th className="px-4 py-3 text-right font-medium">النوع</th>
                              <th className="px-4 py-3 text-right font-medium">الكاش المطلوب</th>
                              <th className="px-4 py-3 text-right font-medium">الحالة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {proj.units.map((unit: any) => (
                              <tr key={unit.id} className="hover:bg-indigo-50/30 transition border-b border-gray-100 last:border-0">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    {unit.coverImage && (
                                      <img src={unit.coverImage} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                                    )}
                                    <span className="font-semibold text-gray-800 truncate max-w-xs">{unit.title}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                  {unit.sellerType === 'DEVELOPER' ? '🏢 مطور' : '👤 فرد'}
                                </td>
                                <td className="px-4 py-3 font-bold text-indigo-600 whitespace-nowrap">
                                  {Number(unit.cashPaidToSeller).toLocaleString('ar-EG')} ج
                                </td>
                                <td className="px-4 py-3"><StatusBadge status={unit.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectModal && (
        <ProjectModal
          developers={developers}
          initial={editingProject}
          onSave={handleSaveProject}
          onClose={() => { setShowProjectModal(false); setEditingProject(null); }}
        />
      )}

      {/* Add Unit to Project - Fullscreen form */}
      {addUnitProject && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-6" dir="rtl">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setAddUnitProject(null)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 font-semibold">
                ← رجوع
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                إضافة وحدة إلى مشروع: <span className="text-indigo-600">{addUnitProject.name}</span>
              </h2>
            </div>
            <UnitForm
              developers={developers}
              projects={projects}
              locations={locations}
              unitTypes={unitTypes}
              initialData={{ sellerType: 'DEVELOPER', developerId: addUnitProject.developerId, projectId: addUnitProject.id }}
              onSubmit={handleAddUnit}
              onCancel={() => setAddUnitProject(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

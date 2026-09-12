import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DeveloperForm from '../components/DeveloperForm';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  PhoneIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Developers() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [editingDeveloper, setEditingDeveloper] = useState<any>(null);
  const [selectedDevDetails, setSelectedDevDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const fetchDevelopers = async () => {
    try {
      const data = await api.developers.getAll();
      setDevelopers(data);
    } catch (error: any) {
      toast.error('فشل جلب قائمة المطورين');
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleEditClick = (dev: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingDeveloper(dev);
    setIsFormVisible(true);
  };

  const handleViewDetails = async (devId: string) => {
    try {
      const data = await api.developers.getOne(devId);
      setSelectedDevDetails(data);
    } catch (error: any) {
      toast.error('فشل جلب تفاصيل المطور');
    }
  };

  const filteredDevelopers = useMemo(() => {
    if (!searchQuery.trim()) return developers;
    const q = searchQuery.toLowerCase();
    return developers.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.phone?.toLowerCase().includes(q) ||
        d.bio?.toLowerCase().includes(q)
    );
  }, [developers, searchQuery]);

  return (
    <div className="space-y-6 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المطورين العقاريين</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة واعتماد كبار شركات التطوير العقاري ومشاريعها</p>
        </div>
        {!isFormVisible && (
          <button
            onClick={() => {
              setEditingDeveloper(null);
              setIsFormVisible(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm hover:shadow"
          >
            + إضافة مطور جديد
          </button>
        )}
      </div>

      {isFormVisible ? (
        <DeveloperForm
          initialData={editingDeveloper}
          onSubmit={async (data) => {
            try {
              if (editingDeveloper) {
                await api.developers.update(editingDeveloper.id, data);
                toast.success('تم تحديث بيانات المطور بنجاح');
              } else {
                await api.developers.create(data);
                toast.success('تمت إضافة المطور الجديد بنجاح');
              }
              setIsFormVisible(false);
              setEditingDeveloper(null);
              fetchDevelopers();
            } catch (err: any) {
              toast.error(err.message || 'حدث خطأ أثناء الحفظ');
            }
          }}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingDeveloper(null);
          }}
        />
      ) : (
        <>
          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="ابحث باسم المطور، رقم الهاتف، أو الوصف…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-400 hover:text-gray-600 px-2"
              >
                مسح
              </button>
            )}
          </div>

          {filteredDevelopers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDevelopers.map((dev) => {
                const projectsCount = dev._count?.projects ?? dev.projects?.length ?? 0;
                const unitsCount = dev._count?.units ?? dev.units?.length ?? 0;

                return (
                  <div
                    key={dev.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 p-5 flex flex-col justify-between hover:shadow-md transition group"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={dev.logoUrl}
                            alt={dev.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition duration-300"
                            onError={(e: any) => {
                              e.target.src = 'https://placehold.co/60x60?text=DEV';
                            }}
                          />
                          <div>
                            <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition">
                              {dev.name}
                            </h3>
                            {dev.phone ? (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5" dir="ltr">
                                <span>{dev.phone}</span>
                                <PhoneIcon className="w-3 h-3 text-gray-400" />
                              </p>
                            ) : (
                              <p className="text-xs text-gray-400 mt-0.5">لا يوجد هاتف مسجل</p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleEditClick(dev, e)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="تعديل المطور"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Bio preview */}
                      {dev.bio && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-4 bg-gray-50/70 p-2.5 rounded-lg leading-relaxed">
                          {dev.bio}
                        </p>
                      )}

                      {/* Stat badges */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-indigo-50/70 border border-indigo-100/50 rounded-xl p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1 text-xs text-indigo-700 font-medium">
                            <BuildingOffice2Icon className="w-4 h-4" />
                            <span>المشاريع</span>
                          </div>
                          <span className="text-lg font-extrabold text-indigo-900 mt-0.5 block">
                            {projectsCount}
                          </span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-100/50 rounded-xl p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1 text-xs text-emerald-700 font-medium">
                            <HomeModernIcon className="w-4 h-4" />
                            <span>الوحدات</span>
                          </div>
                          <span className="text-lg font-extrabold text-emerald-900 mt-0.5 block">
                            {unitsCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-xs font-semibold">
                      <button
                        onClick={() => handleViewDetails(dev.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      >
                        <InformationCircleIcon className="w-4 h-4" />
                        التفاصيل
                      </button>
                      <button
                        onClick={() => navigate(`/projects?dev=${dev.id}`)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
                      >
                        عرض المشاريع ←
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-400 text-sm">
                {searchQuery ? 'لا توجد نتائج تطابق بحثك.' : 'لا يوجد مطورين حالياً. قم بإضافة المطور الأول!'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Developer Details Modal */}
      {selectedDevDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDevDetails.logoUrl}
                  alt={selectedDevDetails.name}
                  className="w-12 h-12 rounded-xl object-cover border shadow-sm"
                  onError={(e: any) => {
                    e.target.src = 'https://placehold.co/48x48?text=DEV';
                  }}
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedDevDetails.name}</h2>
                  <p className="text-xs text-gray-500" dir="ltr">{selectedDevDetails.phone || 'بدون هاتف'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDevDetails(null)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {selectedDevDetails.bio && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">نبذة عن المطور</h4>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl">
                    {selectedDevDetails.bio}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                  مشاريع المطور ({selectedDevDetails.projects?.length || 0})
                </h4>
                {selectedDevDetails.projects && selectedDevDetails.projects.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDevDetails.projects.map((proj: any) => (
                      <div
                        key={proj.id}
                        className="p-3.5 border border-gray-100 rounded-xl hover:border-indigo-200 transition bg-white flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {proj.coverImage ? (
                            <img
                              src={proj.coverImage}
                              alt={proj.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                              🏗
                            </div>
                          )}
                          <div className="min-w-0">
                            <h5 className="font-bold text-sm text-gray-800 truncate">{proj.name}</h5>
                            <span className="text-xs text-gray-400">{proj.location}</span>
                          </div>
                        </div>
                        <div className="text-left flex-shrink-0">
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
                            {proj.units?.length || proj._count?.units || 0} وحدة
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-3 text-center">لا توجد مشاريع مسجلة لهذا المطور بعد.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={() => setSelectedDevDetails(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    subtitle: '',
    desc: '',
    projectName: '',
    projectLocation: '',
    projectLocationAr: '',
    projectType: '',
    projectArea: '',
    projectPrice: '',
    projectLink: '/projects',
    isActive: true,
    order: 0,
  });

  const fetchSlides = async () => {
    try {
      const data = await api.heroSlides.getAll();
      setSlides(data);
    } catch (error: any) {
      toast.error('فشل تحميل السلايدر');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        order: Number(formData.order)
      };

      if (editingId) {
        await api.heroSlides.update(editingId, payload);
        toast.success('تم التحديث بنجاح');
      } else {
        await api.heroSlides.create(payload);
        toast.success('تمت الإضافة بنجاح');
      }
      setIsModalOpen(false);
      fetchSlides();
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ');
    }
  };

  const handleEdit = (slide: any) => {
    setFormData({
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle,
      desc: slide.desc,
      projectName: slide.projectName,
      projectLocation: slide.projectLocation,
      projectLocationAr: slide.projectLocationAr,
      projectType: slide.projectType,
      projectArea: slide.projectArea,
      projectPrice: slide.projectPrice,
      projectLink: slide.projectLink || '/projects',
      isActive: slide.isActive,
      order: slide.order,
    });
    setEditingId(slide.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await api.heroSlides.remove(id);
      toast.success('تم الحذف بنجاح');
      fetchSlides();
    } catch (error: any) {
      toast.error('فشل الحذف');
    }
  };

  const openNewModal = () => {
    setFormData({
      image: '',
      title: '',
      subtitle: '',
      desc: '',
      projectName: '',
      projectLocation: '',
      projectLocationAr: '',
      projectType: '',
      projectArea: '',
      projectPrice: '',
      projectLink: '/projects',
      isActive: true,
      order: 0,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold font-cairo text-gray-800">إدارة السلايدر (Hero)</h1>
          <p className="text-gray-500 text-sm mt-1">تحكم في الصور والنصوص المعروضة في الصفحة الرئيسية</p>
        </div>
        <button onClick={openNewModal} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          إضافة شريحة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="p-8 text-center text-gray-500 w-full col-span-full">جاري التحميل...</p>
        ) : slides.length === 0 ? (
          <p className="p-8 text-center text-gray-500 w-full col-span-full">لا يوجد شرائح. السلايدر الافتراضي قيد العرض حالياً.</p>
        ) : (
          slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
              <img src={slide.image} alt={slide.title} className="w-full h-48 object-cover" />
              {!slide.isActive && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">معطل</div>
              )}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                الترتيب: {slide.order}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{slide.title}</h3>
                <p className="text-sm text-primary mb-3">{slide.subtitle}</p>
                <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                  <strong>مشروع:</strong> {slide.projectName} ({slide.projectLocationAr}) <br/>
                  <strong>نوع:</strong> {slide.projectType} - {slide.projectArea} <br/>
                  <strong>سعر:</strong> {slide.projectPrice}
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(slide)} className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                    <PencilIcon className="w-4 h-4" /> تعديل
                  </button>
                  <button onClick={() => handleDelete(slide.id)} className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold font-cairo">{editingId ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <ImageUpload 
                  label="صورة الشريحة (خلفية)" 
                  value={formData.image} 
                  onChange={(url) => setFormData({...formData, image: url})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">العنوان الرئيسي</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">العنوان الفرعي الملون</label>
                  <input required type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
                <textarea required value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50 h-20"></textarea>
              </div>

              <hr className="my-4"/>
              <h3 className="font-bold text-primary text-sm mb-4">تفاصيل كارت المشروع العائم</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">اسم المشروع (EN)</label>
                  <input required type="text" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">المنطقة (EN)</label>
                  <input required type="text" value={formData.projectLocation} onChange={(e) => setFormData({...formData, projectLocation: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">المنطقة (AR)</label>
                  <input required type="text" value={formData.projectLocationAr} onChange={(e) => setFormData({...formData, projectLocationAr: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">نوع العقار</label>
                  <input required type="text" value={formData.projectType} onChange={(e) => setFormData({...formData, projectType: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">المساحة</label>
                  <input required type="text" value={formData.projectArea} onChange={(e) => setFormData({...formData, projectArea: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" placeholder="مثال: 80 م²" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">السعر</label>
                  <input required type="text" value={formData.projectPrice} onChange={(e) => setFormData({...formData, projectPrice: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" placeholder="مثال: 6,500,000 ج.م" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">رابط المشروع (الزر)</label>
                  <input required type="text" value={formData.projectLink} onChange={(e) => setFormData({...formData, projectLink: e.target.value})} className="w-full p-2 border rounded-xl bg-gray-50" dir="ltr" placeholder="/projects/the-grove" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الترتيب</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="w-full p-2 border rounded-xl bg-gray-50" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-primary rounded" />
                    <span className="font-bold">مفعل (يعرض للزوار)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t mt-6">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90">
                  {editingId ? 'حفظ التعديلات' : 'إضافة الشريحة'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

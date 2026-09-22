import { useState, useEffect } from 'react';
import { api } from '../api/client';
import ImageUpload from '../components/ImageUpload';

const EGYPT_GOVERNORATES = [
  'البحر الأحمر',
  'القاهرة',
  'الجيزة',
  'مطروح',
  'الإسكندرية',
  'السويس',
  'جنوب سيناء',
  'شمال سيناء',
  'البحيرة',
  'الدقهلية',
];

export default function Locations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingLoc, setEditingLoc] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [governorate, setGovernorate] = useState('البحر الأحمر');
  const [imageUrl, setImageUrl] = useState('');
  const [customGovernorate, setCustomGovernorate] = useState('');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');

  const fetchLocations = async () => {
    try {
      const data = await api.locations.getAll();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const resetForm = () => {
    setName('');
    setGovernorate('البحر الأحمر');
    setImageUrl('');
    setCustomGovernorate('');
    setEditingLoc(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const selectedGov = governorate === 'أخرى' ? customGovernorate : governorate;
    const payload = {
      name: name.trim(),
      governorate: selectedGov.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };

    try {
      if (editingLoc) {
        await api.locations.update(editingLoc.id, payload);
      } else {
        await api.locations.create(payload);
      }
      resetForm();
      fetchLocations();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (loc: any) => {
    setEditingLoc(loc);
    setName(loc.name || '');
    if (loc.governorate && EGYPT_GOVERNORATES.includes(loc.governorate)) {
      setGovernorate(loc.governorate);
      setCustomGovernorate('');
    } else if (loc.governorate) {
      setGovernorate('أخرى');
      setCustomGovernorate(loc.governorate);
    } else {
      setGovernorate('البحر الأحمر');
      setCustomGovernorate('');
    }
    setImageUrl(loc.imageUrl || '');
  };

  const handleDelete = async (id: string, locName: string) => {
    if (!confirm(`هل أنت تأكد من مسح منطقة "${locName}"؟`)) return;
    try {
      await api.locations.remove(id);
      fetchLocations();
    } catch (err: any) {
      alert(err.message || 'فشل المسح. قد تكون المنطقة مرتبطة بعقارات.');
    }
  };

  return (
    <div className="space-y-6 font-arabic max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المناطق والمحافظات</h1>
          <p className="text-sm text-gray-500">إضافة وتحديث صور ومحافظات المناطق العقارية</p>
        </div>
      </div>
      
      {/* Form Section */}
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
          {editingLoc ? `تعديل منطقة: ${editingLoc.name}` : 'إضافة منطقة جديدة'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">اسم المنطقة *</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الغردقة، سهل حشيش، الجونة..."
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">المحافظة التابعة لها</label>
            <select 
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary bg-white"
            >
              {EGYPT_GOVERNORATES.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
              <option value="أخرى">أخرى (كتابة يدوي)</option>
            </select>
          </div>

          {governorate === 'أخرى' && (
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">اسم المحافظة الأخرى</label>
              <input 
                value={customGovernorate}
                onChange={(e) => setCustomGovernorate(e.target.value)}
                placeholder="أدخل اسم المحافظة"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          )}

          {/* Image Upload Option */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-600">صورة المنطقة</label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2 py-1 rounded ${uploadMode === 'upload' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  رفع ملف من الجهاز
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-1 rounded ${uploadMode === 'url' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  إدخال رابط URL
                </button>
              </div>
            </div>

            {uploadMode === 'upload' ? (
              <ImageUpload 
                value={imageUrl} 
                onChange={(url) => setImageUrl(url)} 
                label="اختر صورة المنطقة من جهازك" 
              />
            ) : (
              <input 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary"
              />
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          {editingLoc && (
            <button 
              type="button" 
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              إلغاء التعديل
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'جاري الحفظ...' : editingLoc ? 'حفظ التعديلات' : 'إضافة المنطقة'}
          </button>
        </div>
      </form>

      {/* Locations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">الصورة</th>
              <th className="px-4 py-3">اسم المنطقة</th>
              <th className="px-4 py-3">المحافظة</th>
              <th className="px-4 py-3 w-32 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {locations.map(loc => (
              <tr key={loc.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {loc.imageUrl || loc.image ? (
                      <img src={loc.imageUrl || loc.image} alt={loc.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">لا صورة</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">{loc.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-block bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full text-xs">
                    {loc.governorate || 'غير محددة'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2 space-x-reverse">
                  <button 
                    onClick={() => startEdit(loc)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50"
                  >
                    تعديل
                  </button>
                  <button 
                    onClick={() => handleDelete(loc.id, loc.name)}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {locations.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">لا توجد مناطق مضافة بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

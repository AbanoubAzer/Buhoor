import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

export default function Admins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const toast = useToast();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await api.admins.getAll();
      setAdmins(data);
    } catch (error) {
      toast.error('فشل في جلب المديرين');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admins.create(formData);
      toast.success('تمت إضافة المدير بنجاح');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
      loadAdmins();
    } catch (error) {
      toast.error('فشل في إضافة المدير. تأكد أن البريد غير مكرر.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المدير؟')) {
      try {
        await api.admins.remove(id);
        toast.success('تم حذف المدير بنجاح');
        loadAdmins();
      } catch (error) {
        toast.error('فشل في حذف المدير');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-arabic">المديرين والمشرفين</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse font-arabic"
        >
          <PlusIcon className="w-5 h-5" />
          <span>إضافة مدير</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-right font-arabic">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">الاسم</th>
              <th className="p-4 font-semibold text-gray-600">البريد الإلكتروني</th>
              <th className="p-4 font-semibold text-gray-600">تاريخ الإضافة</th>
              <th className="p-4 font-semibold text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="p-4">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">{new Date(admin.createdAt).toLocaleDateString('ar-EG')}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  لا يوجد مديرين مضافين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" dir="rtl">
            <h2 className="text-xl font-bold font-arabic mb-4">إضافة مدير جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4 font-arabic">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none text-left"
                  dir="ltr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none text-left"
                  dir="ltr"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="flex space-x-3 space-x-reverse mt-6">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex-1"
                >
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex-1"
                >
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

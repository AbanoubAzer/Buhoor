import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function UnitTypes() {
  const [types, setTypes] = useState<any[]>([]);
  const [name, setName] = useState('');

  const fetchTypes = async () => {
    try {
      const data = await api.unitTypes.getAll();
      setTypes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.unitTypes.create({ name });
      setName('');
      fetchTypes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-arabic max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">إدارة أنواع الوحدات</h1>
      
      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: شاليه، فيلا مستقلة..."
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary"
        />
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">إضافة</button>
      </form>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">نوع الوحدة</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 w-24">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {types.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{t.name}</td>
                <td className="px-6 py-4">
                  <button className="text-red-500 hover:text-red-700 text-sm">حذف</button>
                </td>
              </tr>
            ))}
            {types.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">لا يوجد أنواع مضافة بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

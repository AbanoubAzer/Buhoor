import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MultipleImageUploadProps {
  value: string;
  onChange: (urls: string) => void;
  label?: string;
}

export default function MultipleImageUpload({ value, onChange, label = 'اختر صور إضافية' }: MultipleImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const urls = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);
    const newUrls = [...urls];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`حجم الصورة ${file.name} أكبر من 5 ميجابايت`);
        continue;
      }
      const formData = new FormData();
      formData.append('file', file);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
        const res = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'فشل رفع الصورة');
        newUrls.push(data.url);
      } catch (err: any) {
        toast.error(err.message || 'فشل رفع الصورة');
      }
    }

    onChange(newUrls.join(', '));
    setLoading(false);
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    onChange(newUrls.join(', '));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {urls.map((url, i) => (
          <div key={i} className="relative h-24 bg-gray-100 rounded-xl overflow-hidden group border border-gray-200">
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => removeUrl(i)} 
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <label className="flex flex-col items-center justify-center h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-indigo-400 transition">
          {loading ? (
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          ) : (
            <>
              <PhotoIcon className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 font-medium">أضف صور</span>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            multiple
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'اختر صورة' }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setLoading(true);
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
      
      onChange(data.url);
      toast.success('تم رفع الصورة بنجاح');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'فشل رفع الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      {value ? (
        <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden group border border-gray-200">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button 
            type="button" 
            onClick={() => onChange('')} 
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-indigo-400 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
            {loading ? (
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm font-medium">اضغط لرفع صورة</p>
                <p className="text-xs mt-1">PNG, JPG, WEBP (Max 5MB)</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      )}
    </div>
  );
}

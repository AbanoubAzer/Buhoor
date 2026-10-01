import { useForm } from 'react-hook-form';
import ImageUpload from './ImageUpload';

type DeveloperFormData = {
  name: string;
  nameEn?: string;
  slug: string;
  logoUrl: string;
  bio: string;
  bioEn?: string;
  phone: string;
  isActive?: boolean;
};

export default function DeveloperForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Partial<DeveloperFormData> | null;
  onSubmit: (data: DeveloperFormData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DeveloperFormData>({
    defaultValues: {
      isActive: true,
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-arabic bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{initialData ? 'تعديل بيانات المطور' : 'إضافة مطور جديد'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المطور (بالعربية) *</label>
          <input
            {...register('name', { required: 'الاسم مطلوب' })}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            placeholder="مثال: بحور العقارية"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المطور ( بالإنجليزي ) - English Name</label>
          <input
            {...register('nameEn')}
            dir="ltr"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
            placeholder="e.g. Bohoor Realty"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الرابط اللطيف (Slug)</label>
          <input
            {...register('slug', { required: 'الرابط مطلوب' })}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
            placeholder="buhoor-realty"
            dir="ltr"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <ImageUpload 
            label="شعار المطور (Logo)" 
            value={watch('logoUrl') || ''} 
            onChange={(url) => setValue('logoUrl', url)} 
          />
          {errors.logoUrl && <p className="text-red-500 text-xs mt-1">{errors.logoUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <input
            {...register('phone')}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
            placeholder="+201..."
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نبذة عن المطور (بالعربية)</label>
          <textarea
            {...register('bio')}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="نبذة تعريفية بالعربية..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نبذة عن المطور (بالإنجليزي) - English Bio</label>
          <textarea
            {...register('bioEn')}
            dir="ltr"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
            rows={3}
            placeholder="Developer bio in English..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="isActiveDev"
          {...register('isActive')}
          className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
        />
        <label htmlFor="isActiveDev" className="text-sm font-semibold text-gray-700 cursor-pointer">
          عرض المطور بالموقع والتطبيق (نشط)
        </label>
      </div>

      <div className="flex justify-end space-x-2 space-x-reverse mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          حفظ المطور
        </button>
      </div>
    </form>
  );
}

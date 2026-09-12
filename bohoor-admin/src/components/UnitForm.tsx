import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import ImageUpload from './ImageUpload';
import MultipleImageUpload from './MultipleImageUpload';

type UnitFormData = {
  title: string;
  sellerType: 'DEVELOPER' | 'INDIVIDUAL';
  developerId?: string;
  projectId?: string;
  locationId: string;
  unitTypeId: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  totalPrice?: number;
  installmentsCount?: number;
  installmentFrequency?: string;
  originalContractPrice: number;
  cashPaidToSeller: number;
  remainingInstallments: number;
  monthlyEquivalentInstallment: number;
  contractYear: number;
  deliveryStatus: 'READY' | 'UNDER_CONSTRUCTION';
  deliveryYear: number;
  isCashOnly?: boolean;
  cashDiscountPercentage?: number;
  coverImage?: string;
  images?: string;
  videos?: string;
  status?: 'APPROVED' | 'SOLD' | 'HIDDEN' | 'PENDING_REVIEW' | 'REJECTED';
};

export default function UnitForm({ 
  onSubmit, 
  onCancel, 
  developers = [], 
  projects = [],
  locations = [], 
  unitTypes = [],
  initialData = null
}: { 
  onSubmit: (data: UnitFormData) => void, 
  onCancel: () => void, 
  developers?: any[], 
  projects?: any[],
  locations?: any[], 
  unitTypes?: any[],
  initialData?: any
}) {
  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm<UnitFormData>({
    defaultValues: {
      sellerType: 'INDIVIDUAL',
      deliveryStatus: 'READY',
      status: 'APPROVED',
      projectId: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      let status = initialData.status || 'APPROVED';
      if (status === 'PENDING_REVIEW' || status === 'REJECTED') {
        status = 'HIDDEN';
      }
      reset({
        ...initialData,
        status,
        projectId: initialData.projectId || '',
        developerId: initialData.developerId || '',
        images: initialData.images?.join(', '),
        videos: initialData.videos?.join(', ')
      });
    }
  }, [initialData, reset]);

  const sellerType = watch('sellerType');
  const selectedDeveloperId = watch('developerId');
  const selectedProjectId = watch('projectId');

  // Filter projects for the selected developer
  const developerProjects = useMemo(() => {
    if (!selectedDeveloperId) return [];
    return projects.filter((p: any) => p.developerId === selectedDeveloperId);
  }, [projects, selectedDeveloperId]);

  // When developerId changes, reset projectId if it does not belong to the newly selected developer
  useEffect(() => {
    if (selectedDeveloperId && selectedProjectId) {
      const exists = developerProjects.some((p: any) => p.id === selectedProjectId);
      if (!exists && selectedProjectId !== initialData?.projectId) {
        setValue('projectId', '');
      }
    }
  }, [selectedDeveloperId, developerProjects, selectedProjectId, setValue, initialData]);

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold text-indigo-600">جاري حفظ البيانات...</p>
        </div>
      )}
      
    <form onSubmit={handleSubmit(async (data) => {
      const processedData = {
        ...data,
        images: typeof data.images === 'string' 
          ? data.images.split(',').map(s => s.trim()).filter(Boolean) 
          : data.images,
        videos: typeof data.videos === 'string' 
          ? data.videos.split(',').map(s => s.trim()).filter(Boolean) 
          : data.videos
      };
      await onSubmit(processedData as any);
    })} className="space-y-6 font-arabic bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{initialData ? 'تعديل العقار' : 'إضافة عقار جديد'}</h2>
        
        <div className="flex items-center space-x-2 space-x-reverse bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-200">
          <label className="text-sm font-semibold text-gray-700">حالة العقار:</label>
          <select
            {...register('status')}
            className="border-none bg-transparent focus:ring-0 text-sm font-bold text-indigo-700 outline-none cursor-pointer"
          >
            <option value="APPROVED">متاح</option>
            <option value="SOLD">تم البيع</option>
            <option value="HIDDEN">إخفاء</option>
          </select>
        </div>
      </div>
      
      {/* القسم الأول: المعلومات الأساسية */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">المعلومات الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان</label>
            <input
              {...register('title', { required: 'العنوان مطلوب' })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع المالك</label>
            <select
              {...register('sellerType')}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            >
              <option value="INDIVIDUAL">فرد (إعادة بيع)</option>
              <option value="DEVELOPER">مطور عقاري</option>
            </select>
          </div>

          {sellerType === 'DEVELOPER' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اختر المطور *</label>
                <select
                  {...register('developerId', {
                    required: sellerType === 'DEVELOPER' ? 'يرجى اختيار المطور' : false,
                  })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">-- اختر المطور --</option>
                  {developers.map(dev => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
                {errors.developerId && <p className="text-red-500 text-xs mt-1">{errors.developerId.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">مشروع المطور</label>
                  {selectedDeveloperId && (
                    <span className="text-xs text-gray-400 font-normal">
                      ({developerProjects.length} مشروع متاح)
                    </span>
                  )}
                </div>
                <select
                  {...register('projectId')}
                  disabled={!selectedDeveloperId || developerProjects.length === 0}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedDeveloperId
                      ? '-- اختر المطور أولاً --'
                      : developerProjects.length === 0
                      ? '-- لا توجد مشاريع مسجلة لهذا المطور --'
                      : '-- اختر مشروع الوحدة (اختياري) --'}
                  </option>
                  {developerProjects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.location})
                    </option>
                  ))}
                </select>
                {selectedDeveloperId && developerProjects.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    المطور المختار لا يملك أي مشاريع بعد. يمكنك إضافة العقار بدون مشروع أو إضافة مشروع للمطور من صفحة المشاريع.
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة / الموقع</label>
            <select
              {...register('locationId', { required: 'الموقع مطلوب' })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            >
              <option value="">-- اختر المنطقة --</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع الوحدة</label>
            <select
              {...register('unitTypeId', { required: 'النوع مطلوب' })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            >
              <option value="">-- اختر النوع --</option>
              {unitTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* القسم الثاني: المواصفات */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">المواصفات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المساحة (م²)</label>
            <input
              type="number"
              {...register('area', { valueAsNumber: true, required: true })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">غرف النوم</label>
            <input
              type="number"
              {...register('bedrooms', { valueAsNumber: true, required: true })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحمامات</label>
            <input
              type="number"
              {...register('bathrooms', { valueAsNumber: true, required: true })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">حالة الاستلام</label>
            <select
              {...register('deliveryStatus')}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            >
              <option value="READY">جاهزة</option>
              <option value="UNDER_CONSTRUCTION">تحت الإنشاء</option>
            </select>
          </div>
        </div>
      </div>

      {/* القسم الثالث: الأرقام */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-primary mb-3 border-b border-blue-200 pb-2">التفاصيل المالية</h3>
        
        {sellerType === 'INDIVIDUAL' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر المطلوب (كاش)</label>
              <input
                type="number"
                {...register('cashPaidToSeller', { valueAsNumber: true, required: true })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left font-bold text-accent"
                dir="ltr"
              />
            </div>
            <input type="hidden" {...register('isCashOnly', { value: true })} />
            <input type="hidden" {...register('originalContractPrice', { valueAsNumber: true, value: 0 })} />
            <input type="hidden" {...register('remainingInstallments', { valueAsNumber: true, value: 0 })} />
            <input type="hidden" {...register('monthlyEquivalentInstallment', { valueAsNumber: true, value: 0 })} />
            <input type="hidden" {...register('contractYear', { valueAsNumber: true, value: new Date().getFullYear() })} />
            <input type="hidden" {...register('deliveryYear', { valueAsNumber: true, value: new Date().getFullYear() })} />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم في حالة الكاش (%)</label>
              <input
                type="number"
                {...register('cashDiscountPercentage', { valueAsNumber: true })}
                className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر الإجمالي</label>
                <input
                  type="number"
                  {...register('totalPrice', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left font-bold"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأقساط</label>
                <input
                  type="number"
                  {...register('installmentsCount', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">دورية الأقساط</label>
                <select
                  {...register('installmentFrequency')}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">-- اختر --</option>
                  <option value="MONTHLY">شهري</option>
                  <option value="QUARTERLY">ربع سنوي</option>
                  <option value="SEMI_ANNUAL">نصف سنوي</option>
                  <option value="ANNUAL">سنوي</option>
                </select>
              </div>
              <input type="hidden" {...register('originalContractPrice', { valueAsNumber: true, value: 0 })} />
              <input type="hidden" {...register('contractYear', { valueAsNumber: true, value: new Date().getFullYear() })} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المقدم (Down Payment)</label>
                <input
                  type="number"
                  {...register('cashPaidToSeller', { valueAsNumber: true, required: true })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left font-bold text-accent"
                  dir="ltr"
                />
              </div>
              <input type="hidden" {...register('remainingInstallments', { valueAsNumber: true, value: 0 })} />
              <input type="hidden" {...register('monthlyEquivalentInstallment', { valueAsNumber: true, value: 0 })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">سنة الاستلام</label>
                <input
                  type="number"
                  {...register('deliveryYear', { valueAsNumber: true, required: true })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-center"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* القسم الرابع: الوسائط */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">الوسائط والصور</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <ImageUpload 
              label="صورة الغلاف الأساسية" 
              value={watch('coverImage') || ''} 
              onChange={(url) => setValue('coverImage', url)} 
            />
          </div>
          <div className="col-span-full">
            <MultipleImageUpload 
              label="باقي الصور (اختياري)"
              value={watch('images') || ''}
              onChange={(urls) => setValue('images', urls)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">روابط فيديوهات (مفصولة بفاصلة)</label>
            <textarea
              {...register('videos')}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
              rows={3}
              dir="ltr"
            />
          </div>
        </div>
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
          {initialData ? 'حفظ التعديلات' : 'حفظ العقار'}
        </button>
      </div>
    </form>
    </>
  );
}

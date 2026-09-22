import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
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
  description?: string;
  isSeaView?: boolean;
  expectedRentalRoi?: number;
  coverImage?: string;
  images?: string;
  videos?: string;
  status?: 'APPROVED' | 'SOLD' | 'HIDDEN' | 'PENDING_REVIEW' | 'REJECTED';
  displayOrder?: number | null | string;
  isVerified?: boolean;
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
        displayOrder: initialData.displayOrder ?? '',
        isVerified: Boolean(initialData.isVerified),
        images: initialData.images?.join(', '),
        videos: initialData.videos?.join(', ')
      });

      const price = [
        initialData.isCashOnly ? initialData.cashPaidToSeller : null,
        initialData.totalPrice,
        initialData.cashPaidToSeller,
        initialData.originalContractPrice
      ].map(v => Number(v)).find(v => v && v > 0) || 0;
      const roi = Number(initialData.expectedRentalRoi || 0);
      if (roi > 0 && price > 0) {
        const annual = price * (roi / 100);
        const nightly = Math.round(annual / 270);
        if (nightly > 0) {
          setCalcNightlyRate(String(nightly));
        }
      } else {
        setCalcNightlyRate('');
      }
    } else {
      setCalcNightlyRate('');
    }
  }, [initialData, reset]);

  const sellerType = watch('sellerType');
  const selectedDeveloperId = watch('developerId');
  const selectedProjectId = watch('projectId');
  const selectedLocationId = watch('locationId');

  const [selectedGov, setSelectedGov] = useState<string>('');
  const [calcNightlyRate, setCalcNightlyRate] = useState<string>('');

  const isCashOnly = watch('isCashOnly');
  const cashPaid = watch('cashPaidToSeller');
  const contractPrice = watch('originalContractPrice');
  const isSea = watch('isSeaView');

  const currentPrice = [isCashOnly ? cashPaid : null, contractPrice, cashPaid].map(v => Number(v)).find(v => v && v > 0) || 0;
  const nightlyNum = parseFloat(calcNightlyRate || '0');
  const annualRentCalc = nightlyNum > 0 ? nightlyNum * 270 : 0;
  const yieldCalc = currentPrice > 0 && annualRentCalc > 0 ? Number(((annualRentCalc / currentPrice) * 100).toFixed(1)) : 0;
  const appreciationRate = isSea ? 30 : 10;
  const totalRoiCalc = yieldCalc > 0 ? Number((yieldCalc + appreciationRate).toFixed(1)) : appreciationRate;
  const paybackCalc = annualRentCalc > 0 && currentPrice > 0 ? (currentPrice / annualRentCalc).toFixed(1) : null;
  const totalPaybackCalc = totalRoiCalc > 0 ? (100 / totalRoiCalc).toFixed(1) : null;

  // Extract unique governorates from locations
  const governorates = useMemo(() => {
    const set = new Set<string>();
    locations.forEach(loc => {
      if (loc.governorate) set.add(loc.governorate);
    });
    return Array.from(set);
  }, [locations]);

  // Auto-sync selectedGov if location is pre-selected or initialData is provided
  useEffect(() => {
    if (selectedLocationId) {
      const loc = locations.find(l => l.id === selectedLocationId);
      if (loc?.governorate) {
        setSelectedGov(loc.governorate);
      }
    }
  }, [selectedLocationId, locations]);

  const filteredLocations = useMemo(() => {
    if (!selectedGov) return locations;
    return locations.filter(loc => loc.governorate === selectedGov);
  }, [locations, selectedGov]);

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
        isSeaView: Boolean(data.isSeaView),
        isVerified: Boolean(data.isVerified),
        displayOrder: (data.displayOrder !== undefined && data.displayOrder !== null && data.displayOrder !== '' && !isNaN(Number(data.displayOrder)) && Number(data.displayOrder) > 0)
          ? Number(data.displayOrder)
          : null,
        expectedRentalRoi: (data.expectedRentalRoi && !isNaN(Number(data.expectedRentalRoi))) ? Number(data.expectedRentalRoi) : undefined,
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
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 space-x-reverse bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <span className="text-sm">⭐</span>
            <label className="text-xs font-bold text-amber-900 cursor-pointer flex items-center gap-1.5">
              <input
                type="checkbox"
                {...register('isVerified')}
                className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
              />
              عقار موثق (Verified)
            </label>
          </div>

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
      </div>

      {/* شريط أولوية ترتيب الظهور */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-slate-50 p-4 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📌</span>
            <span className="text-sm font-bold text-indigo-950">أولوية ترتيب الظهور في الموقع (Display Order)</span>
          </div>
          <p className="text-xs text-indigo-700/80 mt-0.5">
            الرقم الأصغر يظهر أولاً (مثلاً: 1 يظهر بالقمة كأول عقار، ثم 2، وهكذا). اتركه فارغاً ليظهر بترتيب الموقع الافتراضي.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-gray-600">رقم الترتيب:</span>
          <input
            type="number"
            min="1"
            placeholder="تلقائي"
            {...register('displayOrder')}
            className="w-24 text-center font-bold text-indigo-900 border border-indigo-200 rounded-lg py-1.5 px-2 bg-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
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

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف وتفاصيل العقار الكاملة</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="اكتب وصفاً شاملاً عن العقار (الموقع، التجهيزات، المميزات، الخدمات المتاحة، طريقة السداد...)"
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-primary focus:border-primary text-sm leading-relaxed"
            />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
            <select
              value={selectedGov}
              onChange={(e) => {
                const gov = e.target.value;
                setSelectedGov(gov);
                if (gov) {
                  const currentLoc = locations.find(l => l.id === selectedLocationId);
                  if (currentLoc && currentLoc.governorate !== gov) {
                    setValue('locationId', '');
                  }
                }
              }}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            >
              <option value="">-- كل المحافظات --</option>
              {governorates.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة / الموقع *</label>
            <select
              {...register('locationId', { required: 'الموقع مطلوب' })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            >
              <option value="">-- اختر المنطقة --</option>
              {filteredLocations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.governorate ? `(${loc.governorate})` : ''}
                </option>
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
              min="1"
              {...register('area', { valueAsNumber: true, required: true, min: 1 })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">غرف النوم</label>
            <input
              type="number"
              min="0"
              {...register('bedrooms', { valueAsNumber: true, required: true, min: 0 })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحمامات</label>
            <input
              type="number"
              min="0"
              {...register('bathrooms', { valueAsNumber: true, required: true, min: 0 })}
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

        <div className="mt-4 p-3 bg-cyan-50/60 rounded-lg border border-cyan-100 flex items-center gap-3">
          <input
            type="checkbox"
            id="isSeaView"
            {...register('isSeaView')}
            className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 border-gray-300 cursor-pointer"
          />
          <label htmlFor="isSeaView" className="text-sm font-bold text-cyan-900 cursor-pointer flex items-center gap-1.5">
            <span>🌊</span>
            <span>إطلالة بحرية / على البحر مباشرة</span>
          </label>
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
                min="0"
                {...register('cashPaidToSeller', { valueAsNumber: true, required: true, min: 0 })}
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
                min="0"
                max="100"
                {...register('cashDiscountPercentage', { valueAsNumber: true, min: 0, max: 100 })}
                className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر الإجمالي</label>
                <input
                  type="number"
                  min="0"
                  {...register('totalPrice', { valueAsNumber: true, min: 0 })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-left font-bold"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأقساط</label>
                <input
                  type="number"
                  min="0"
                  {...register('installmentsCount', { valueAsNumber: true, min: 0 })}
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
                  min="0"
                  {...register('cashPaidToSeller', { valueAsNumber: true, required: true, min: 0 })}
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
                  min="1900"
                  {...register('deliveryYear', { valueAsNumber: true, required: true, min: 1900 })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary text-center"
                />
              </div>
            </div>
          </>
        )}

        <div className="mt-4 border-t border-emerald-200/60 pt-4 bg-emerald-50/50 p-4 rounded-xl space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <label className="block text-sm font-bold text-emerald-950">
                💰 حاسبة العائد الاستثماري ونمو رأس المال
              </label>
              <p className="text-xs text-emerald-700">
                محسوبة على إشغال 270 يوم (75%) + الارتفاع السنوي في قيمة العقار
              </p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
              isSea ? 'bg-cyan-100 text-cyan-900 border-cyan-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {isSea ? '🌊 إطلالة بحرية (+30% نمو سنوي)' : '🏢 مشروع عادي (+10% نمو سنوي)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                سعر الليلة المتوقع (ج.م) [لحساب العائد تلقائياً]
              </label>
              <input
                type="number"
                min="0"
                placeholder="مثال: 3500"
                value={calcNightlyRate}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val !== '' && Number(val) < 0) {
                    val = '0';
                  }
                  setCalcNightlyRate(val);
                  const n = parseFloat(val || '0');
                  if (n > 0 && currentPrice > 0) {
                    const y = Number((((n * 270) / currentPrice) * 100).toFixed(1));
                    setValue('expectedRentalRoi', y);
                  }
                }}
                className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white font-bold text-emerald-900 focus:ring-emerald-500 focus:border-emerald-500"
                dir="ltr"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  نسبة العائد الإيجاري (ROI %) المعتمدة
                </label>
                {yieldCalc > 0 && (
                  <button
                    type="button"
                    onClick={() => setValue('expectedRentalRoi', yieldCalc)}
                    className="text-[11px] text-emerald-800 bg-emerald-200/70 hover:bg-emerald-200 px-2 py-0.5 rounded font-bold transition"
                  >
                    تطبيق المحسوب ({yieldCalc}%)
                  </button>
                )}
              </div>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="مثال: 15.5"
                {...register('expectedRentalRoi', { valueAsNumber: true, min: 0 })}
                className="w-full border border-gray-300 rounded-md p-2 font-bold text-emerald-700 bg-white focus:ring-emerald-500 focus:border-emerald-500"
                dir="ltr"
              />
            </div>
          </div>

          {nightlyNum > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 block mb-0.5">🏡 الإيجار السنوي (270 يوم)</span>
                <span className="font-extrabold text-emerald-800 text-sm block">{annualRentCalc.toLocaleString('ar-EG')} ج</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{yieldCalc}% من السعر</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 block mb-0.5">📈 نمو قيمة العقار</span>
                <span className="font-extrabold text-blue-800 text-sm block">+{appreciationRate}% سنوياً</span>
                <span className="text-[10px] text-blue-600 font-semibold">{isSea ? 'سياحي بحري' : 'سكني عادي'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 block mb-0.5">🚀 إجمالي العائد (Total ROI)</span>
                <span className="font-extrabold text-emerald-700 text-sm block">{totalRoiCalc}%</span>
                <span className="text-[10px] text-gray-500 font-semibold">إيجار + نمو أصل</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs flex flex-col justify-between">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] font-bold text-amber-900">⏳ استرداد ثمن الوحدة</span>
                  <span className="text-[8px] font-extrabold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">رؤيتان</span>
                </div>
                <div className="space-y-0.5 my-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-500 font-semibold">إيجار كاش:</span>
                    <span className="font-extrabold text-amber-800">{paybackCalc ? `${paybackCalc} سنة` : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-emerald-700 font-semibold">إجمالي العائد:</span>
                    <span className="font-extrabold text-emerald-700">{totalPaybackCalc ? `${totalPaybackCalc} سنة` : '-'}</span>
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 font-medium">كاش أو أصل+إيجار</span>
              </div>
            </div>
          )}

          {currentPrice > 0 && (() => {
            const rate = appreciationRate / 100;
            const year1Value = Math.round(currentPrice * Math.pow(1 + rate, 1));
            const year3Value = Math.round(currentPrice * Math.pow(1 + rate, 3));
            const year5Value = Math.round(currentPrice * Math.pow(1 + rate, 5));
            const year1Gain = Math.round((Math.pow(1 + rate, 1) - 1) * 100);
            const year3Gain = Math.round((Math.pow(1 + rate, 3) - 1) * 100);
            const year5Gain = Math.round((Math.pow(1 + rate, 5) - 1) * 100);

            return (
              <div className="mt-3 pt-3 border-t border-emerald-200/80">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>📈</span>
                    <span>توقعات نمو القيمة الرأسمالية التراكمية (عائد مركب +{appreciationRate}% سنوياً)</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                    يحسب تراكمياً على قيمة كل عام
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-emerald-100 shadow-2xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-bold text-gray-500">بعد سنة (Year 1)</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">+{year1Gain}%</span>
                    </div>
                    <span className="font-extrabold text-gray-900 block text-xs">{year1Value.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-bold text-blue-900">بعد 3 سنوات (Year 3)</span>
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">+{year3Gain}%</span>
                    </div>
                    <span className="font-extrabold text-blue-950 block text-xs">{year3Value.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-2 rounded-lg shadow-2xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-bold text-emerald-100">بعد 5 سنوات (Year 5)</span>
                      <span className="text-[10px] font-extrabold text-white bg-white/20 px-1.5 py-0.5 rounded">+{year5Gain}%</span>
                    </div>
                    <span className="font-extrabold text-white block text-xs">{year5Value.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
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

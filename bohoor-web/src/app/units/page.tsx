import { api } from "@/api/client";
import Link from "next/link";
import { MapPinIcon, HomeModernIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const revalidate = 0; // Dynamic page due to searchParams

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const locationId = typeof resolvedParams.locationId === 'string' ? resolvedParams.locationId : undefined;
  const unitTypeId = typeof resolvedParams.unitTypeId === 'string' ? resolvedParams.unitTypeId : undefined;
  const developerId = typeof resolvedParams.developerId === 'string' ? resolvedParams.developerId : undefined;
  const projectId = typeof resolvedParams.projectId === 'string' ? resolvedParams.projectId : undefined;
  const maxCashRequired = typeof resolvedParams.maxCashRequired === 'string' ? resolvedParams.maxCashRequired : undefined;
  const maxMonthlyInstallment = typeof resolvedParams.maxMonthlyInstallment === 'string' ? resolvedParams.maxMonthlyInstallment : undefined;

  // Fetch all metadata for filters in parallel
  const [locationsData, unitTypesData, developersData, projectsData] = await Promise.all([
    api.locations.getAll().catch(() => []),
    api.unitTypes.getAll().catch(() => []),
    api.developers.getAll().catch(() => []),
    api.projects.getAll().catch(() => []),
  ]);

  const locations = Array.isArray(locationsData) ? locationsData : (locationsData?.data || []);
  const unitTypes = Array.isArray(unitTypesData) ? unitTypesData : (unitTypesData?.data || []);
  const developers = Array.isArray(developersData) ? developersData : (developersData?.data || []);
  const projects = Array.isArray(projectsData) ? projectsData : (projectsData?.data || []);

  // Fetch units
  const res = await api.units.getAll({
    page,
    limit: 12,
    search: query,
    status: 'APPROVED',
    locationId,
    unitTypeId,
    developerId,
    projectId,
    maxCashRequired,
    maxMonthlyInstallment,
  }).catch(() => ({ data: [], totalPages: 1 }));

  const units = res.data || [];
  const totalPages = res.totalPages || 1;

  // Helper for pagination links
  const buildQuery = (pageToLoad: number) => {
    const p = new URLSearchParams();
    p.set('page', pageToLoad.toString());
    if (query) p.set('q', query);
    if (locationId) p.set('locationId', locationId);
    if (unitTypeId) p.set('unitTypeId', unitTypeId);
    if (developerId) p.set('developerId', developerId);
    if (projectId) p.set('projectId', projectId);
    if (maxCashRequired) p.set('maxCashRequired', maxCashRequired);
    if (maxMonthlyInstallment) p.set('maxMonthlyInstallment', maxMonthlyInstallment);
    return `/units?${p.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">البحث المتقدم</h2>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة البحث</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="q"
                  defaultValue={query}
                  placeholder="رقم الوحدة، الكود، إلخ..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 pl-10 focus:ring-2 focus:ring-primary outline-none"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">نوع العقار</label>
              <select name="unitTypeId" defaultValue={unitTypeId || ""} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none appearance-none">
                <option value="">كل الأنواع</option>
                {unitTypes.map((type: any) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">المنطقة</label>
              <select name="locationId" defaultValue={locationId || ""} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none appearance-none">
                <option value="">كل المناطق</option>
                {locations.map((loc: any) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">المطور العقاري</label>
              <select name="developerId" defaultValue={developerId || ""} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none appearance-none">
                <option value="">جميع المطورين</option>
                {developers.map((dev: any) => (
                  <option key={dev.id} value={dev.id}>{dev.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">المشروع</label>
              <select name="projectId" defaultValue={projectId || ""} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none appearance-none">
                <option value="">جميع المشاريع</option>
                {projects.map((proj: any) => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">أقصى كاش متاح (ج.م)</label>
              <input 
                type="number" 
                name="maxCashRequired"
                defaultValue={maxCashRequired}
                placeholder="مثال: 500000" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">أقصى قسط شهري (ج.م)</label>
              <input 
                type="number" 
                name="maxMonthlyInstallment"
                defaultValue={maxMonthlyInstallment}
                placeholder="مثال: 15000" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none"
                dir="ltr"
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-xl transition shadow-md shadow-primary/30">
                تطبيق الفلاتر
              </button>
              
              <Link href="/units" className="block text-center mt-3 text-sm text-gray-500 hover:text-gray-700 underline">
                إعادة ضبط الفلاتر
              </Link>
            </div>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-end">
          <h1 className="text-2xl font-bold text-gray-900">العقارات المتاحة</h1>
          <span className="text-gray-500 font-medium">صفحة {page} من {totalPages}</span>
        </div>

        {units.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">لم نجد أي نتائج</h3>
            <p className="text-gray-500">حاول تغيير كلمات البحث أو إزالة بعض الفلاتر.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {units.map((unit: any) => {
                const cover = unit.coverImage || (unit.images?.[0]?.includes(',') ? unit.images[0].split(',')[0].trim() : unit.images?.[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
                return (
                <Link href={`/units/${unit.id}`} key={unit.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group block">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={cover} 
                      alt={unit.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-accent flex items-center gap-2 shadow-sm">
                      <span>{Number(unit.totalPrice || unit.originalContractPrice || unit.cashPaidToSeller || 0).toLocaleString()} ج.م</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${(unit.remainingInstallments > 0 || unit.installmentsCount > 0 || (unit.sellerType === 'DEVELOPER' && !unit.isCashOnly)) ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'}`}>
                        {(unit.remainingInstallments > 0 || unit.installmentsCount > 0 || (unit.sellerType === 'DEVELOPER' && !unit.isCashOnly)) ? 'تقسيط' : 'كاش'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{unit.title}</h3>
                    <div className="flex items-center text-gray-500 mb-4 text-sm gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {unit.location?.name || 'غير محدد'}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <HomeModernIcon className="w-4 h-4 text-gray-400" />
                        {unit.area} م²
                      </span>
                      <span className="text-primary font-medium group-hover:text-primary/90 transition">
                        التفاصيل
                      </span>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {page > 1 && (
                  <Link href={buildQuery(page - 1)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                    السابق
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={buildQuery(page + 1)} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-accent shadow-md">
                    التالي
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

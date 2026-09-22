import { api } from "@/api/client";
import Link from "next/link";
import UnitSortSelector from "@/components/UnitSortSelector";
import UnitFilterSidebar from "@/components/UnitFilterSidebar";
import { 
  MapPinIcon, 
  HomeModernIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export const revalidate = 0;

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const sellerType = typeof resolvedParams.sellerType === 'string' ? resolvedParams.sellerType : undefined;
  const isCashOnly = typeof resolvedParams.isCashOnly === 'string' ? resolvedParams.isCashOnly : undefined;
  const governorate = typeof resolvedParams.governorate === 'string' ? resolvedParams.governorate : undefined;
  const locationId = typeof resolvedParams.locationId === 'string' ? resolvedParams.locationId : undefined;
  const unitTypeId = typeof resolvedParams.unitTypeId === 'string' ? resolvedParams.unitTypeId : undefined;
  const developerId = typeof resolvedParams.developerId === 'string' ? resolvedParams.developerId : undefined;
  const projectId = typeof resolvedParams.projectId === 'string' ? resolvedParams.projectId : undefined;
  
  const minCashRequired = typeof resolvedParams.minCashRequired === 'string' ? resolvedParams.minCashRequired : undefined;
  const maxCashRequired = typeof resolvedParams.maxCashRequired === 'string' ? resolvedParams.maxCashRequired : undefined;
  const minMonthlyInstallment = typeof resolvedParams.minMonthlyInstallment === 'string' ? resolvedParams.minMonthlyInstallment : undefined;
  const maxMonthlyInstallment = typeof resolvedParams.maxMonthlyInstallment === 'string' ? resolvedParams.maxMonthlyInstallment : undefined;
  const minArea = typeof resolvedParams.minArea === 'string' ? resolvedParams.minArea : undefined;
  const maxArea = typeof resolvedParams.maxArea === 'string' ? resolvedParams.maxArea : undefined;
  const bedrooms = typeof resolvedParams.bedrooms === 'string' ? resolvedParams.bedrooms : undefined;
  const bathrooms = typeof resolvedParams.bathrooms === 'string' ? resolvedParams.bathrooms : undefined;
  const seaView = typeof resolvedParams.seaView === 'string' ? resolvedParams.seaView : undefined;
  const sortBy = typeof resolvedParams.sortBy === 'string' && resolvedParams.sortBy !== 'default' ? resolvedParams.sortBy : undefined;

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

  // Extract unique governorates
  const governorates = Array.from(
    new Set(locations.map((loc: any) => loc.governorate).filter(Boolean))
  ) as string[];

  // Filter locations by selected governorate if chosen
  const filteredLocations = governorate
    ? locations.filter((loc: any) => loc.governorate === governorate)
    : locations;

  // Fetch units with full filters
  const res = await api.units.getAll({
    page,
    limit: 12,
    search: query,
    status: 'APPROVED',
    sellerType,
    isCashOnly,
    governorate,
    locationId,
    unitTypeId,
    developerId,
    projectId,
    minCashRequired,
    maxCashRequired,
    minMonthlyInstallment,
    maxMonthlyInstallment,
    minArea,
    maxArea,
    bedrooms,
    bathrooms,
    seaView,
    sortBy,
  }).catch(() => ({ data: [], total: 0, totalPages: 1 }));

  const units = res.data || [];
  const totalUnits = res.total || units.length;
  const totalPages = res.totalPages || 1;

  // Helper for pagination & search URL building
  const buildQuery = (pageToLoad: number, newSort?: string) => {
    const p = new URLSearchParams();
    p.set('page', pageToLoad.toString());
    if (query) p.set('q', query);
    if (sellerType) p.set('sellerType', sellerType);
    if (isCashOnly) p.set('isCashOnly', isCashOnly);
    if (governorate) p.set('governorate', governorate);
    if (locationId) p.set('locationId', locationId);
    if (unitTypeId) p.set('unitTypeId', unitTypeId);
    if (developerId) p.set('developerId', developerId);
    if (projectId) p.set('projectId', projectId);
    if (minCashRequired) p.set('minCashRequired', minCashRequired);
    if (maxCashRequired) p.set('maxCashRequired', maxCashRequired);
    if (minMonthlyInstallment) p.set('minMonthlyInstallment', minMonthlyInstallment);
    if (maxMonthlyInstallment) p.set('maxMonthlyInstallment', maxMonthlyInstallment);
    if (minArea) p.set('minArea', minArea);
    if (maxArea) p.set('maxArea', maxArea);
    if (bedrooms) p.set('bedrooms', bedrooms);
    if (bathrooms) p.set('bathrooms', bathrooms);
    const targetSort = newSort || sortBy;
    if (targetSort) p.set('sortBy', targetSort);
    return `/units?${p.toString()}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BuildingOfficeIcon className="w-8 h-8 text-primary" />
              تصفح العقارات المتاحة
            </h1>
            <p className="text-gray-500 text-sm mt-1">تم العثور على {totalUnits} عقار معتمد مطابق لبحثك</p>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">ترتيب حسب:</label>
            <div className="flex-1 md:w-60">
              <UnitSortSelector currentSort={sortBy || 'default'} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <UnitFilterSidebar 
              locations={locations}
              unitTypes={unitTypes}
              developers={developers}
              projects={projects}
              governorates={governorates}
              currentParams={{
                q: query,
                sellerType,
                isCashOnly,
                governorate,
                locationId,
                unitTypeId,
                developerId,
                projectId,
                minCashRequired,
                maxCashRequired,
                minMonthlyInstallment,
                maxMonthlyInstallment,
                minArea,
                maxArea,
                bedrooms,
                bathrooms,
                seaView,
                sortBy,
              }}
            />
          </aside>

          {/* Main Units Content */}
          <div className="flex-1">
            {units.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">لم نجد عقارات مطابقة</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                  جرب توسيع نطاق البحث، تغيير تفضيلات الكاش/القسط، أو اختيار محافظة أخرى.
                </p>
                <Link href="/units" className="inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-accent transition">
                  تصفح جميع العقارات
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {units.map((unit: any) => {
                    const cover = unit.coverImage || (unit.images?.[0]?.includes(',') ? unit.images[0].split(',')[0].trim() : unit.images?.[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
                    const isDev = unit.sellerType === 'DEVELOPER';
                    const displayCash = Number(unit.cashPaidToSeller || 0);
                    const displayTotal = Number(unit.originalContractPrice || unit.totalPrice || 0);
                    const isTotalSort = sortBy === 'total_price_asc' || sortBy === 'total_price_desc';

                    return (
                      <Link href={`/units/${unit.id}`} key={unit.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group block flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                          <img 
                            src={cover} 
                            alt={unit.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            {unit.isVerified && (
                              <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                                ⭐ موثق
                              </span>
                            )}
                            {unit.isSeaView && (
                              <span className="bg-cyan-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                                🌊 إطلالة بحرية
                              </span>
                            )}
                            {unit.expectedRentalRoi > 0 && (
                              <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                                💰 عائد {Number(unit.expectedRentalRoi)}%
                              </span>
                            )}
                            <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                              {isTotalSort && displayTotal > 0
                                ? `إجمالي: ${displayTotal.toLocaleString()} ج.م`
                                : `${unit.isCashOnly ? 'كاش: ' : 'مقدم: '}${displayCash.toLocaleString()} ج.م`}
                            </span>
                            {!isTotalSort && displayTotal > 0 && displayTotal !== displayCash && (
                              <span className="bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm">
                                إجمالي: {displayTotal.toLocaleString()} ج.م
                              </span>
                            )}
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${isDev ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}`}>
                              {isDev ? '🏢 مطور' : '👤 أفراد'}
                            </span>
                          </div>

                          {unit.location?.governorate && (
                            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                              📍 {unit.location.governorate}
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">{unit.title}</h3>
                            <div className="flex items-center text-gray-500 text-xs mb-3 gap-1">
                              <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
                              <span className="truncate">{unit.location?.name || 'غير محدد'}</span>
                            </div>
                          </div>

                          {/* Pricing breakdown */}
                          <div className="bg-gray-50 p-3 rounded-2xl mb-4 space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-gray-700">
                              <span>{unit.isCashOnly ? 'السعر الكاش المطلوب:' : 'المقدم / الكاش المطلوب:'}</span>
                              <span className="text-primary font-bold">{displayCash.toLocaleString()} ج.م</span>
                            </div>
                            {!unit.isCashOnly && displayTotal > 0 && (
                              <div className="flex justify-between text-gray-600 text-[11px]">
                                <span>إجمالي العقد / العقار:</span>
                                <span className="font-bold">{displayTotal.toLocaleString()} ج.م</span>
                              </div>
                            )}
                            {unit.monthlyEquivalentInstallment > 0 && (
                              <div className="flex justify-between text-gray-500">
                                <span>القسط الشهري:</span>
                                <span className="font-semibold text-gray-900">{Number(unit.monthlyEquivalentInstallment).toLocaleString()} ج.م/شهر</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-gray-600 text-xs pt-3 border-t border-gray-100 font-semibold">
                            <span className="flex items-center gap-1"><HomeModernIcon className="w-4 h-4 text-gray-400" /> {unit.area} م²</span>
                            <span>{unit.bedrooms || 3} غرف</span>
                            <span>{unit.bathrooms || 2} حمام</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2 items-center">
                    {page > 1 && (
                      <Link href={buildQuery(page - 1)} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-50 shadow-sm text-sm">
                        السابق
                      </Link>
                    )}
                    <span className="text-xs font-bold text-gray-500 px-3">
                      صفحة {page} من {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link href={buildQuery(page + 1)} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-accent shadow-md transition text-sm">
                        التالي
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

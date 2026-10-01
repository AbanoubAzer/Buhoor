import { api } from "@/api/client";
import UnitsClientView from "@/components/UnitsClientView";
import { redirect } from "next/navigation";
import Link from "next/link";
import UnitSortSelector from "@/components/UnitSortSelector";
import UnitFilterSidebar from "@/components/UnitFilterSidebar";
import ShareButton from "@/components/ShareButton";
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
  const locationNameParam = typeof resolvedParams.location === 'string' ? resolvedParams.location : undefined;
  const rawLocationId = typeof resolvedParams.locationId === 'string' ? resolvedParams.locationId : undefined;
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

  // Redirect raw UUID locationId to clean SEO location name
  const isUuidLoc = rawLocationId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawLocationId);
  if (isUuidLoc) {
    const matchedLoc = locations.find((l: any) => l.id === rawLocationId);
    if (matchedLoc) {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(resolvedParams)) {
        if (k !== 'locationId' && typeof v === 'string') p.set(k, v);
      }
      p.set('location', matchedLoc.nameAr || matchedLoc.name);
      redirect(`/units?${p.toString()}`);
    }
  }

  // Extract unique governorates
  const governorates = Array.from(
    new Set(locations.map((loc: any) => loc.governorate).filter(Boolean))
  ) as string[];

  // Find effective location
  const matchedLocation = locationNameParam
    ? locations.find((l: any) => 
        l.name === locationNameParam || 
        l.nameAr === locationNameParam || 
        (l.nameEn && l.nameEn.toLowerCase() === locationNameParam.toLowerCase())
      )
    : undefined;

  const effectiveLocationId = matchedLocation?.id || (!isUuidLoc ? rawLocationId : undefined);

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
    locationId: effectiveLocationId,
    location: locationNameParam,
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

  return (
    <UnitsClientView
      units={units}
      totalUnits={totalUnits}
      totalPages={totalPages}
      page={page}
      sortBy={sortBy}
      query={query}
      sellerType={sellerType}
      isCashOnly={isCashOnly}
      governorate={governorate}
      locationNameParam={locationNameParam}
      effectiveLocationId={effectiveLocationId}
      unitTypeId={unitTypeId}
      developerId={developerId}
      projectId={projectId}
      minCashRequired={minCashRequired}
      maxCashRequired={maxCashRequired}
      minMonthlyInstallment={minMonthlyInstallment}
      maxMonthlyInstallment={maxMonthlyInstallment}
      minArea={minArea}
      maxArea={maxArea}
      bedrooms={bedrooms}
      bathrooms={bathrooms}
      seaView={seaView}
      locations={locations}
      unitTypes={unitTypes}
      developers={developers}
      projects={projects}
      governorates={governorates}
    />
  );
}

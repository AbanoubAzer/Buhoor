import { api } from "@/api/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPinIcon, HomeModernIcon } from "@heroicons/react/24/outline";

export const revalidate = 30;

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let project: any;
  let unitsRes: any;
  try {
    project = await api.projects.getOne(id);
    unitsRes = await api.units.getAll({ projectId: id, status: 'APPROVED', limit: 50 });
  } catch (error) {
    notFound();
  }

  if (!project) notFound();

  const units = unitsRes.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <nav className="flex mb-8 text-sm text-gray-500 font-medium">
        <Link href="/" className="hover:text-primary transition">الرئيسية</Link>
        <span className="mx-2">/</span>
        <Link href={`/developers/${project.developerId}`} className="hover:text-primary transition">
          {project.developer?.name || 'المطور'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{project.name}</span>
      </nav>

      {/* Project Hero */}
      <div className="relative rounded-[3rem] overflow-hidden mb-12 shadow-md">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src={project.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'} 
          alt={project.name} 
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">{project.name}</h1>
          <div className="flex items-center gap-2 text-lg text-gray-200 mb-6">
            <MapPinIcon className="w-6 h-6" />
            {project.location || 'موقع غير محدد'}
          </div>
          <p className="max-w-3xl text-gray-100 text-lg leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>

      {/* Project Units */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-900">الوحدات المتاحة في المشروع</h2>
          <span className="bg-primary/20 text-primary/90 px-4 py-1.5 rounded-full font-bold text-sm">
            {units.length} وحدة
          </span>
        </div>

        {units.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center text-gray-500 border border-gray-100">
            لا توجد وحدات متاحة للبيع في هذا المشروع حالياً.
          </div>
        ) : (
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
                    {unit.location?.name || project.location || 'غير محدد'}
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
        )}
      </div>

    </div>
  );
}

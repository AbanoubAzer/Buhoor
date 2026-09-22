import { api } from "@/api/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BuildingOfficeIcon, MapPinIcon } from "@heroicons/react/24/outline";

export const revalidate = 60;

export default async function DeveloperDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let developer: any;
  let projects: any[] = [];
  try {
    developer = await api.developers.getOne(id);
    projects = await api.projects.getAll(id);
  } catch (error) {
    notFound();
  }

  if (!developer) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <nav className="flex mb-8 text-sm text-gray-500 font-medium">
        <Link href="/" className="hover:text-primary transition">الرئيسية</Link>
        <span className="mx-2">/</span>
        <Link href="/developers" className="hover:text-primary transition">المطورين</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{developer.name}</span>
      </nav>

      {/* Developer Header */}
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
          <BuildingOfficeIcon className="w-16 h-16" />
        </div>
        <div className="text-center md:text-right flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{developer.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            {developer.bio || 'لا يوجد وصف متاح.'}
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">مشاريع المطور</h2>
        
        {projects.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center text-gray-500">
            لا توجد مشاريع مضافة حالياً لهذا المطور.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj: any) => (
              <Link href={`/projects/${proj.id}`} key={proj.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={proj.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'} 
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 right-4 text-white font-bold text-xl">{proj.name}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-gray-500 mb-3 text-sm gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {proj.location || 'موقع غير محدد'}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {proj.description || 'لا يوجد وصف للمشروع.'}
                    </p>
                  </div>
                  <span className="text-primary font-medium group-hover:text-primary/90 transition">
                    عرض وحدات المشروع &larr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

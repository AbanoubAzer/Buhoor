import { api } from "@/api/client";
import Link from "next/link";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DevelopersPage() {
  const developers = await api.developers.getAll().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">شركاء النجاح في منصة بحور</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          نفتخر بتعاوننا مع أفضل الأسماء في عالم التطوير العقاري لنضمن لك استثماراً آمناً ومشاريع ترقى لتطلعاتك.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {developers.map((dev: any) => (
          <div key={dev.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300">
            <div className="h-40 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <BuildingOfficeIcon className="w-12 h-12" />
              </div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{dev.name}</h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {dev.bio || 'مطور عقاري معتمد في منصة بحور.'}
              </p>
              <Link href={`/developers/${dev.id}`} className="inline-block bg-primary/10 text-accent hover:bg-primary hover:text-white font-medium px-6 py-2 rounded-xl transition w-full">
                عرض المشاريع
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

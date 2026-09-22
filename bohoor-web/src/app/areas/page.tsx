import { api } from "@/api/client";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function AreasPage() {
  const locations = await api.locations.getAll().catch(() => []);

  // Fallback images
  const fallbackImages = [
    "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1572913017567-02f06497ceea?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1534068590799-09895a709e86?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
  ];

  // Group locations by governorate
  const groupedLocations = (locations || []).reduce((acc: Record<string, any[]>, loc: any) => {
    const gov = loc.governorate || "مناطق أخرى";
    if (!acc[gov]) acc[gov] = [];
    acc[gov].push(loc);
    return acc;
  }, {});

  const governorates = Object.keys(groupedLocations);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo text-gray-900 mb-4 tracking-tight">
            استكشف <span className="text-primary">المناطق والمحافظات</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-cairo">
            تصفح العقارات والمشاريع المتاحة حسب المحافظات وأجمل المناطق الساحلية والسكنية.
          </p>
        </div>

        {governorates.length > 0 ? (
          <div className="space-y-16">
            {governorates.map((govName) => (
              <section key={govName} className="space-y-6">
                <div className="flex items-center gap-3 border-r-4 border-primary pr-4">
                  <h2 className="text-2xl md:text-3xl font-bold font-cairo text-gray-900">
                    {govName.startsWith("محافظة") ? govName : `محافظة ${govName}`}
                  </h2>
                  <span className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">
                    {groupedLocations[govName].length} مناطق
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedLocations[govName].map((loc: any, i: number) => (
                    <Link 
                      href={`/units?locationId=${loc.id}`} 
                      key={loc.id || i} 
                      className="relative h-72 rounded-3xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 block"
                    >
                      <img 
                        src={loc.imageUrl || loc.image || fallbackImages[i % fallbackImages.length]} 
                        alt={loc.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
                      
                      {loc.governorate && (
                        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          {loc.governorate}
                        </span>
                      )}

                      <div className="absolute bottom-6 right-6 left-6 text-white z-10 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPinIcon className="w-6 h-6 text-primary shrink-0" />
                          <h3 className="text-2xl font-bold font-cairo leading-tight">{loc.name}</h3>
                        </div>
                        <p className="text-gray-300 font-medium text-sm mr-8 group-hover:text-white transition-colors">
                          استكشف العقارات المتاحة &larr;
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-500 text-lg">لا توجد مناطق متاحة حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
}

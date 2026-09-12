import { api } from "@/api/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPinIcon, HomeModernIcon, BuildingOffice2Icon, PhoneIcon } from "@heroicons/react/24/outline";
import UnitLeadForm from "@/components/UnitLeadForm";
import UnitGallery from "@/components/UnitGallery";

export const revalidate = 30; // Revalidate every 30 seconds

export default async function UnitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let unit: any;
  try {
    unit = await api.units.getOne(id);
  } catch (error) {
    notFound();
  }

  if (!unit) notFound();

  // Helper to get direct image URLs (e.g., from Google Drive)
  const getDirectImageUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('drive.google.com/file/d/')) {
      const id = url.split('/file/d/')[1]?.split('/')[0];
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-gray-500 font-medium">
        <Link href="/" className="hover:text-primary transition">الرئيسية</Link>
        <span className="mx-2">/</span>
        <Link href="/units" className="hover:text-primary transition">العقارات</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{unit.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Details (Right side in RTL) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Images Gallery */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative h-96 bg-gray-50 flex items-center justify-center">
              <img 
                src={getDirectImageUrl(unit.coverImage || unit.images?.[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
                alt={unit.title}
                className="w-full h-full object-contain"
              />
            </div>
            {unit.images && unit.images.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-3">باقي الصور</h4>
                <div className="pt-2">
                  <UnitGallery images={unit.images.flatMap((img: string) => img.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean)).map(getDirectImageUrl)} />
                </div>
              </div>
            )}
            
            {/* Videos Section */}
            {unit.videos && unit.videos.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-700 mb-3">الفيديوهات</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unit.videos.flatMap((vid: string) => vid.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean)).map((vid: string, i: number) => {
                    // Extract YouTube video ID
                    let embedUrl = vid;
                    if (vid.includes('youtube.com/watch?v=')) {
                      const videoId = vid.split('v=')[1]?.split('&')[0];
                      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
                    } else if (vid.includes('youtu.be/')) {
                      const videoId = vid.split('youtu.be/')[1]?.split('?')[0];
                      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
                    }
                    
                    return (
                      <div key={i} className="rounded-2xl overflow-hidden shadow-sm aspect-video bg-black">
                        <iframe 
                          src={embedUrl} 
                          title="Video" 
                          className="w-full h-full border-0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{unit.title}</h1>
                <div className="flex items-center text-gray-500 gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  {unit.location?.name || 'موقع غير محدد'}
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="text-left bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
                  <p className="text-primary text-sm font-semibold mb-1">السعر الإجمالي</p>
                  <p className="text-2xl font-bold text-accent">
                    {Number(unit.totalPrice || unit.originalContractPrice || unit.cashPaidToSeller || 0).toLocaleString()} ج.م
                  </p>
                </div>
                {unit.cashPaidToSeller && Number(unit.cashPaidToSeller) > 0 && (
                  <div className="text-left bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm font-semibold mb-1">
                      {unit.sellerType === 'DEVELOPER' ? 'المقدم' : 'الكاش المطلوب الآن'}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {Number(unit.cashPaidToSeller).toLocaleString()} ج.م
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Details for Installments */}
            {unit.remainingInstallments && Number(unit.remainingInstallments) > 0 && (
              <div className="bg-blue-50/50 p-6 rounded-2xl mb-8 border border-blue-100">
                <h3 className="text-lg font-bold text-blue-900 mb-4">تفاصيل الأقساط المتبقية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-50">
                    <span className="text-gray-500 text-sm block mb-1">المتبقي أقساط</span>
                    <span className="font-bold text-gray-900">{Number(unit.remainingInstallments).toLocaleString()} ج.م</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-50">
                    <span className="text-gray-500 text-sm block mb-1">القسط الشهري (تقريبياً)</span>
                    <span className="font-bold text-gray-900">{Number(unit.monthlyEquivalentInstallment || 0).toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <HomeModernIcon className="w-6 h-6 text-primary mb-2" />
                <span className="text-gray-500 text-sm">المساحة</span>
                <span className="font-bold text-gray-900">{unit.area} م²</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <BuildingOffice2Icon className="w-6 h-6 text-primary mb-2" />
                <span className="text-gray-500 text-sm">النوع</span>
                <span className="font-bold text-gray-900">{unit.unitType?.name || '-'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="w-6 h-6 flex items-center justify-center text-primary mb-2 text-xl">🛏️</span>
                <span className="text-gray-500 text-sm">الغرف</span>
                <span className="font-bold text-gray-900">{unit.bedrooms || '-'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="w-6 h-6 flex items-center justify-center text-primary mb-2 text-xl">🚿</span>
                <span className="text-gray-500 text-sm">الحمامات</span>
                <span className="font-bold text-gray-900">{unit.bathrooms || '-'}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">الوصف</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {unit.description || 'لا يوجد وصف متاح لهذه الوحدة.'}
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar (Left side in RTL) */}
        <div className="space-y-6">
          
          {/* Lead Form */}
          <UnitLeadForm unitPrice={Number(unit.totalPrice || unit.originalContractPrice || unit.cashPaidToSeller || 0)} unitId={unit.id} />

        </div>
      </div>
    </div>
  );
}

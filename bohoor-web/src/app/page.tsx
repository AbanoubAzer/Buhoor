import { api } from "@/api/client";
import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPinIcon, 
  HomeModernIcon, 
  BuildingOfficeIcon, 
  ChatBubbleLeftRightIcon,
  BuildingOffice2Icon,
  KeyIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  HeartIcon
} from "@heroicons/react/24/outline";

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function Home() {
  const [unitsData, projectsData, devsData, heroSlides, locationsData] = await Promise.all([
    api.units.getAll({ limit: 6, status: 'APPROVED' }),
    api.projects.getAll(),
    api.developers.getAll(),
    api.heroSlides.getAll().catch(() => []), // Fallback to empty array if fails
    api.locations.getAll().catch(() => []),
  ]);

  const units = unitsData.data || unitsData || [];
  const projects = projectsData.slice(0, 6) || [];
  const developers = devsData.slice(0, 8) || [];
  const locations = (Array.isArray(locationsData) ? locationsData : locationsData?.data || []).slice(0, 6);

  const fallbackAreaImages = [
    "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1572913017567-02f06497ceea?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1534068590799-09895a709e86?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
  ];

  return (
    <div className="flex flex-col gap-20 pb-16">
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/201000000000" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          تحدث مع خبير
        </span>
        <ChatBubbleLeftRightIcon className="w-8 h-8" />
      </a>

      <HeroSlider initialSlides={heroSlides} allProjects={projectsData} />

      {/* 1. Browse by Type */}
      <section className="max-w-[98%] mx-auto w-full pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-cairo text-gray-900">تصفح حسب <span className="text-primary">النوع</span> &larr;</h2>
            <Link href="/projects" className="text-gray-500 hover:text-accent font-bold transition text-sm">جميع المشاريع &larr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "شقق", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", icon: BuildingOfficeIcon },
              { name: "فلل", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", icon: HomeModernIcon },
              { name: "شاليهات", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2", icon: HomeModernIcon },
              { name: "تجاري", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", icon: BuildingOffice2Icon },
              { name: "أراضي", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", icon: MapPinIcon },
            ].map((type, i) => (
              <Link href={`/units?type=${type.name}`} key={i} className="bg-white rounded-[2rem] p-2 flex items-center justify-between shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all group overflow-hidden h-24">
                <div className="flex-1 text-center font-bold text-gray-800">
                  <type.icon className="w-6 h-6 mx-auto text-primary mb-1 group-hover:scale-110 transition-transform" />
                  {type.name}
                </div>
                <div className="w-1/2 h-full rounded-2xl overflow-hidden relative">
                  <Image src={type.img} fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt={type.name} sizes="(max-width: 768px) 50vw, 20vw" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Latest Projects */}
      <section className="max-w-[98%] mx-auto w-full pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold font-cairo text-gray-900 border-r-4 border-accent pr-4">أحدث المشاريع</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Promotional Vertical Banner */}
            <div className="lg:w-1/4 bg-[#0f2142] rounded-3xl overflow-hidden relative p-8 text-white flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <Image src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800" fill className="object-cover opacity-40 mix-blend-overlay" alt="Promo" sizes="(max-width: 1024px) 100vw, 25vw" />
              
              <div className="relative z-20">
                <div className="flex items-center gap-2 mb-8">
                  <img src="/logo.jpg" className="h-8 rounded" alt="Buhoor" />
                  <span className="font-bold">بحور العقارية</span>
                </div>
                <h3 className="text-3xl font-bold font-cairo leading-snug mb-4">
                  مشاريع مختارة <br/>
                  <span className="text-accent">الأفضل استثمار في مصر</span>
                </h3>
              </div>
              <div className="relative z-20 mt-auto">
                <Link href="/projects" className="inline-flex items-center gap-2 border border-white/40 hover:bg-white hover:text-[#0f2142] px-6 py-3 rounded-xl font-bold transition text-sm">
                  استكشف المشاريع &larr;
                </Link>
              </div>
            </div>

            {/* Project Cards */}
            <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj: any) => (
                <Link href={`/projects/${proj.id}`} key={proj.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    <Image src={proj.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'} alt={proj.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
                      <MapPinIcon className="w-4 h-4 text-gray-500" /> {proj.location || 'القاهرة الجديدة'}
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm">
                      <HeartIcon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between text-center bg-white">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{proj.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">شقق سكنية - {proj.location || 'القاهرة الجديدة'}</p>
                      
                      <div className="mb-4">
                        <p className="text-xs text-gray-400">من</p>
                        <p className="text-lg font-bold text-accent font-cairo">4,200,000 ج.م</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1"><BuildingOfficeIcon className="w-4 h-4 text-gray-400"/> شقق</div>
                      <div className="flex items-center gap-1"><HomeModernIcon className="w-4 h-4 text-gray-400"/> 3-5 غرف</div>
                      <div className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-gray-400"/> 120-200 م²</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Top Developers */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold font-cairo text-gray-900">أشهر <span className="text-primary">المطورين</span></h2>
            <Link href="/developers" className="text-primary hover:text-accent font-bold transition">عرض الكل &larr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {developers.map((dev: any) => (
              <Link href={`/developers/${dev.id}`} key={dev.id} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all group flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                  <BuildingOfficeIcon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{dev.name}</h3>
                <p className="text-sm text-gray-500">{Math.floor(Math.random() * 20) + 1} مشروع | {Math.floor(Math.random() * 500) + 50} عقار</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold font-cairo text-gray-900">المناطق <span className="text-primary">الأكثر طلباً</span></h2>
          <Link href="/areas" className="text-primary hover:text-accent font-bold transition">جميع المناطق &larr;</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc: any, i: number) => (
            <Link href={`/units?locationId=${loc.id}`} key={loc.id || i} className="relative h-64 rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all block">
              <Image 
                src={loc.imageUrl || loc.image || fallbackAreaImages[i % fallbackAreaImages.length]} 
                alt={loc.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
              
              {loc.governorate && (
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {loc.governorate}
                </span>
              )}

              <div className="absolute bottom-6 right-6 text-white">
                <h3 className="text-2xl font-bold font-cairo mb-1">{loc.name}</h3>
                <p className="text-sm text-gray-300">استكشف العقارات المتاحة &larr;</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Units */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold font-cairo text-gray-900">عقارات <span className="text-primary">مختارة ومميزة</span></h2>
          <Link href="/units" className="text-primary hover:text-accent font-bold transition">عرض الكل &larr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit: any) => (
            <div key={unit.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <Image 
                  src={unit.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} 
                  alt={unit.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                  {unit.isVerified && (
                    <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                      ⭐ موثق
                    </span>
                  )}
                  {unit.expectedRentalRoi > 0 && (
                    <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                      💰 عائد {Number(unit.expectedRentalRoi)}%
                    </span>
                  )}
                  <div className="bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full font-bold text-xs text-primary shadow-sm">
                    {Number(unit.cashPaidToSeller || unit.originalContractPrice || unit.price || 0).toLocaleString()} ج.م
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{unit.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPinIcon className="w-4 h-4 ml-1" />
                    {unit.location?.name || 'موقع مميز'}
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-600 text-sm pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1"><HomeModernIcon className="w-4 h-4" /> {unit.area} م²</span>
                  <span className="flex items-center gap-1 font-bold">{unit.bedrooms || 3} غرف</span>
                  <span className="flex items-center gap-1 font-bold">{unit.bathrooms || 2} حمام</span>
                </div>
                <Link href={`/units/${unit.id}`} className="mt-4 block text-center bg-primary/5 hover:bg-primary text-primary hover:text-white font-bold py-3 rounded-xl transition">
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. How it works */}
      <section className="bg-primary text-white py-20 mt-10 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h2 className="text-3xl font-bold font-cairo mb-12">كيف تعمل <span className="text-accent">منصة بحور؟</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">1</span>
                <MagnifyingGlassIcon className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">تبحث عن شراء؟</h3>
              <p className="text-gray-300">تصفح آلاف الإعلانات وقارن بين المشروعات في جميع أنحاء مصر بكل سهولة.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">2</span>
                <BuildingOfficeIcon className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">تريد بيع أو عرض عقارك؟</h3>
              <p className="text-gray-300">اعرض عقارك مجاناً وتواصل مع مشترين جادين مع مستشار مخصص لخدمتك.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

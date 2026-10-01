'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, HomeModernIcon, MagnifyingGlassIcon, CurrencyDollarIcon, BuildingOfficeIcon, ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

const defaultSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920",
    title: "استمتع بأسلوب حياة مختلف في",
    titleEn: "Enjoy a unique lifestyle at",
    subtitle: "ذا جروف - الساحل الشمالي",
    subtitleEn: "The Grove - North Coast",
    desc: "شاليهات فاخرة بإطلالة مباشرة على البحر.. استثمار مضمون في قلب وجهات مصر تميزاً.",
    descEn: "Luxury chalets with direct sea views. A guaranteed investment in Egypt's top destination.",
    project: {
      name: "THE GROVE",
      location: "North Coast",
      locationAr: "الساحل الشمالي",
      type: "شاليهات",
      typeEn: "Chalets",
      area: "80 m²",
      price: "6,500,000 ج.م",
      priceEn: "6,500,000 EGP",
      link: "/projects/the-grove"
    }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920",
    title: "اكتشف الرفاهية الحقيقية في",
    titleEn: "Discover true luxury at",
    subtitle: "كايرو جيت - الشيخ زايد",
    subtitleEn: "Cairo Gate - Sheikh Zayed",
    desc: "موقع استراتيجي، تصميمات عصرية، ومساحات خضراء شاسعة تضمن لك ولعائلتك أسلوب حياة فريد.",
    descEn: "Strategic location, modern design, and vast green areas for a unique lifestyle.",
    project: {
      name: "CAIRO GATE",
      location: "Sheikh Zayed",
      locationAr: "الشيخ زايد",
      type: "فلل",
      typeEn: "Villas",
      area: "350 m²",
      price: "12,000,000 ج.م",
      priceEn: "12,000,000 EGP",
      link: "/projects/cairo-gate"
    }
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920",
    title: "استثمارك المضمون يبدأ من",
    titleEn: "Your secure investment starts at",
    subtitle: "أبراج العلمين الجديدة",
    subtitleEn: "New Alamein Towers",
    desc: "أيقونة الساحل الجديد.. وحدات فندقية وسكنية تطل مباشرة على أروع شواطئ البحر الأبيض المتوسط.",
    descEn: "The icon of the new coast. Serviced units overlooking the Mediterranean Sea.",
    project: {
      name: "ALAMEIN TOWERS",
      location: "New Alamein",
      locationAr: "العلمين الجديدة",
      type: "شقق فندقية",
      typeEn: "Serviced Apartments",
      area: "120 m²",
      price: "8,200,000 ج.م",
      priceEn: "8,200,000 EGP",
      link: "/projects/maspero"
    }
  }
];

export default function HeroSlider({ initialSlides = [], allProjects = [] }: { initialSlides?: any[], allProjects?: any[] }) {
  const { t, language, isRTL } = useLanguage();
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);
  
  const [searchLocation, setSearchLocation] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  const [searchPrice, setSearchPrice] = useState("");
  const [searchType, setSearchType] = useState("");

  const filteredProjects = allProjects.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  // Extract unique locations from allProjects
  const allLocations = Array.from(new Set(allProjects.map(p => p.location).filter(Boolean))) as string[];
  const filteredLocations = allLocations.filter(loc => 
    loc.toLowerCase().includes(searchLocation.toLowerCase())
  ).slice(0, 5);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (searchLocation) params.append("location", searchLocation);
    if (searchPrice) params.append("price", searchPrice);
    if (searchType) params.append("type", searchType);
    
    router.push(`/units?${params.toString()}`);
  };

  // Map API slides to the format expected by the UI, or fallback to defaultSlides
  const slides: any[] = initialSlides.length > 0 && initialSlides.some(s => s.isActive)
    ? initialSlides.filter(s => s.isActive).map(s => ({
        id: s.id,
        image: s.image,
        title: s.title,
        titleEn: s.titleEn,
        subtitle: s.subtitle,
        subtitleEn: s.subtitleEn,
        desc: s.desc,
        descEn: s.descEn,
        project: {
          name: s.projectName,
          location: s.projectLocation,
          locationAr: s.projectLocationAr,
          type: s.projectType,
          typeEn: s.projectTypeEn,
          area: s.projectArea,
          price: s.projectPrice,
          priceEn: s.projectPriceEn,
          link: s.projectLink || '/projects'
        }
      }))
    : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full max-w-[98%] mx-auto mt-2 mb-16 sm:mb-20">
      {/* Background Slider Container */}
      <div className="relative min-h-[480px] sm:h-[600px] w-full rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl flex items-center">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image 
              src={slide.image} 
              alt="Hero Background"
              fill
              priority={index === 0}
              className="object-cover" 
            />
            <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l from-[#0f2142]/95 via-[#0f2142]/70 to-[#0f2142]/30' : 'bg-gradient-to-r from-[#0f2142]/95 via-[#0f2142]/70 to-[#0f2142]/30'}`} />
          </div>
        ))}
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center py-12">
          {/* Prev control */}
          <button 
            type="button"
            onClick={prevSlide} 
            className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition z-30 cursor-pointer shadow-lg ${
              isRTL ? 'right-2 sm:right-4 lg:right-8' : 'right-2 sm:right-4 lg:right-8'
            }`}
            aria-label={isRTL ? 'الشريحة السابقة' : 'Previous slide'}
          >
            {isRTL ? <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Next control */}
          <button 
            type="button"
            onClick={nextSlide} 
            className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition z-30 cursor-pointer shadow-lg ${
              isRTL ? 'left-2 sm:left-4 lg:left-8' : 'left-2 sm:left-4 lg:left-8'
            }`}
            aria-label={isRTL ? 'الشريحة التالية' : 'Next slide'}
          >
            {isRTL ? <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
          
          <div className={`text-white max-w-xl px-12 sm:px-16 lg:px-20 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full border border-white/30 text-xs sm:text-sm mb-4 sm:mb-6 bg-white/10 backdrop-blur-md">
              <span className="text-accent">★</span> {t('featuredProjectBadge')}
            </div>
            
            <div key={current} className="animate-fade-in-up">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-cairo mb-3 sm:mb-4 leading-snug sm:leading-tight">
                {language === 'en' ? (slides[current].titleEn || slides[current].title) : slides[current].title} <br/> <span className="text-accent">{language === 'en' ? (slides[current].subtitleEn || slides[current].subtitle) : slides[current].subtitle}</span>
              </h1>
              <p className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg line-clamp-3 sm:line-clamp-none">
                {language === 'en' ? (slides[current].descEn || slides[current].desc) : slides[current].desc}
              </p>
            </div>
            
            <Link href={slides[current].project?.link || "/projects"} className={`bg-accent hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold transition inline-flex items-center gap-2 shadow-lg shadow-accent/20 text-sm sm:text-base ${isRTL ? 'hover:-translate-x-2' : 'hover:translate-x-2'}`}>
              {t('exploreProjectBtn')} {isRTL ? '←' : '→'}
            </Link>

            {/* Pagination Dots */}
            <div className="flex gap-2 mt-8 sm:mt-12">
              {slides.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-accent' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          <div className={`hidden lg:block bg-white/95 backdrop-blur-md p-6 rounded-3xl w-80 text-gray-900 shadow-2xl transform transition-all duration-500 hover:scale-105 ${isRTL ? 'ml-16' : 'mr-16'}`} key={`card-${current}`}>
            <div className="text-center border-b border-gray-200 pb-4 mb-4">
              <h3 className="font-bold text-xl tracking-widest text-gray-800">{slides[current].project.name}</h3>
              <p className="text-xs text-gray-500 uppercase">{slides[current].project.location}</p>
            </div>
            <div className="flex justify-center items-center gap-2 text-gray-600 mb-6 text-sm font-bold bg-gray-100 py-2 rounded-xl">
              <MapPinIcon className="w-5 h-5 text-gray-500" /> {language === 'en' ? slides[current].project.location : (slides[current].project.locationAr || slides[current].project.location)}
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-2xl">
                <HomeModernIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-bold">{language === 'en' ? (slides[current].project.typeEn || slides[current].project.type) : slides[current].project.type}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl flex flex-col justify-center">
                <p className="text-xs text-gray-500">{t('startingAreaFrom')}</p>
                <p className="font-bold mt-1" dir="ltr">{slides[current].project.area}</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">{t('startingPriceFrom')}</p>
              <p className="text-2xl font-bold text-accent font-cairo mt-1" dir="ltr">{language === 'en' ? (slides[current].project.priceEn || slides[current].project.price) : slides[current].project.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="relative lg:absolute lg:-bottom-8 left-0 right-0 max-w-5xl mx-auto px-4 z-30 mt-4 lg:mt-0">
        <div className="bg-white p-2.5 lg:p-2 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-gray-100 relative">
          
          {/* Mobile AI Search Quick Action */}
          <div className="md:hidden w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-ai-search'));
                }
              }}
              className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-primary text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-98 transition-all border border-indigo-400/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-base animate-pulse">✨</span>
                <span>{t('aiSearchQuickBtn')}</span>
              </div>
              <span className="bg-white/20 text-white text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                {t('instantMatch')} &larr;
              </span>
            </button>
          </div>

          <div className="w-full flex-[1.5] flex items-center border-b md:border-b-0 md:border-l border-gray-100 px-4 py-3 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder={t('searchPropertyPlaceholder')} 
              className="w-full bg-transparent outline-none text-gray-600 text-sm" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowProjectSuggestions(true);
              }}
              onFocus={() => setShowProjectSuggestions(true)}
              onBlur={() => setTimeout(() => setShowProjectSuggestions(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {/* Project Autocomplete Dropdown */}
            {showProjectSuggestions && searchQuery.trim() !== '' && filteredProjects.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {filteredProjects.map((proj) => (
                  <div 
                    key={proj.id} 
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
                    onClick={() => {
                      setSearchQuery(proj.name);
                      setShowProjectSuggestions(false);
                    }}
                  >
                    <span className="font-bold">{proj.name}</span>
                    {proj.location && <span className="text-gray-400 text-xs mr-2">- {proj.location}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full flex-1 flex items-center border-b md:border-b-0 md:border-l border-gray-100 px-4 py-3 relative">
            <MapPinIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder={t('searchAreaPlaceholder')} 
              className="w-full bg-transparent outline-none text-gray-600 text-sm" 
              value={searchLocation}
              onChange={(e) => {
                setSearchLocation(e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {/* Location Autocomplete Dropdown */}
            {showLocationSuggestions && searchLocation.trim() !== '' && filteredLocations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {filteredLocations.map((loc, i) => (
                  <div 
                    key={i} 
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 flex items-center gap-2"
                    onClick={() => {
                      setSearchLocation(loc);
                      setShowLocationSuggestions(false);
                    }}
                  >
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-bold">{loc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full flex-1 flex items-center border-b md:border-b-0 md:border-l border-gray-100 px-4 py-3">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
            <select 
              className="w-full bg-transparent outline-none text-gray-600 text-sm font-medium"
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
            >
              <option value="">{t('allPrices')}</option>
              <option value="under_5m">{t('under5m')}</option>
              <option value="5m_to_10m">{t('5mTo10m')}</option>
              <option value="over_10m">{t('over10m')}</option>
            </select>
          </div>
          <div className="w-full flex-1 flex items-center px-4 py-3">
            <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-2" />
            <select 
              className="w-full bg-transparent outline-none text-gray-600 text-sm font-medium"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">{t('allTypes')}</option>
              <option value="شقة">{t('apartmentsCategory')}</option>
              <option value="فيلا">{t('villasCategory')}</option>
              <option value="شاليه">{t('chaletsCategory')}</option>
              <option value="تجاري">{t('commercialCategory')}</option>
            </select>
          </div>
          <button 
            onClick={handleSearch}
            className="bg-accent hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition w-full md:w-auto shadow-md shadow-accent/30 flex items-center gap-2 justify-center ml-1"
          >
            <MagnifyingGlassIcon className="w-5 h-5" /> {isRTL ? 'بحث' : 'Search'}
          </button>
        </div>
      </div>
    </section>
  );
}

import { api } from "@/api/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPinIcon, HomeModernIcon, BuildingOffice2Icon, PhoneIcon } from "@heroicons/react/24/outline";
import UnitLeadForm from "@/components/UnitLeadForm";
import UnitGallery from "@/components/UnitGallery";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{unit.title}</h1>
                <div className="flex items-center text-gray-600 font-medium gap-2 text-base">
                  <MapPinIcon className="w-5 h-5 text-primary shrink-0" />
                  <span>
                    {unit.location?.governorate 
                      ? `${unit.location.governorate}، ${unit.location.name}` 
                      : (unit.location?.name || 'موقع غير محدد')}
                  </span>
                </div>

                {/* Feature Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {(unit.isSeaView || (unit.location?.name?.includes('جونة') || unit.location?.name?.includes('ساحل') || unit.location?.name?.includes('بحر'))) && (
                    <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      🌊 إطلالة بحرية مباشرة
                    </span>
                  )}
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    📈 عائد إيجاري متوقع {Number(unit.expectedRentalRoi) > 0 ? Number(unit.expectedRentalRoi) : ((unit.isSeaView || unit.location?.name?.includes('جونة')) ? 16.5 : 12)}% سنوياً
                  </span>
                  {unit.sellerType && (
                    <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
                      {unit.sellerType === 'DEVELOPER' ? '🏢 عرض من مطور عقاري' : '👤 بيع أفراد (إعادة بيع)'}
                    </span>
                  )}
                  {unit.deliveryStatus && (
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
                      {unit.deliveryStatus === 'READY' ? '✅ جاهز للتسليم' : `🏗️ استلام ${unit.deliveryYear || 'تحت الإنشاء'}`}
                    </span>
                  )}
                  {unit.isCashOnly && (
                    <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold px-3 py-1 rounded-full">
                      💵 كاش فقط
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[220px] w-full md:w-auto">
                <div className="text-left bg-primary/10 px-6 py-3.5 rounded-2xl border border-primary/20">
                  <p className="text-primary text-sm font-semibold mb-1">
                    {unit.sellerType === 'DEVELOPER' && unit.cashPaidToSeller ? 'المقدم المطلوب' : 'السعر الكلي'}
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0).toLocaleString()} ج.م
                  </p>
                </div>
                {unit.totalPrice && Number(unit.totalPrice) > 0 && unit.cashPaidToSeller && Number(unit.cashPaidToSeller) !== Number(unit.totalPrice) && (
                  <div className="text-left bg-gray-50 px-6 py-2.5 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 text-xs font-semibold mb-0.5">إجمالي سعر العقار</p>
                    <p className="text-lg font-bold text-gray-800">
                      {Number(unit.totalPrice).toLocaleString()} ج.م
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Developer & Project Info Card */}
            {(unit.developer || unit.project) && (
              <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-5 rounded-2xl border border-indigo-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  {unit.developer && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">المطور العقاري:</span>
                      <Link href={`/developers/${unit.developer.id}`} className="text-base font-bold text-indigo-950 hover:text-primary transition underline decoration-indigo-300">
                        🏢 {unit.developer.name}
                      </Link>
                    </div>
                  )}
                  {unit.project && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">المشروع السكني:</span>
                      <Link href={`/projects/${unit.project.id}`} className="font-bold text-gray-900 hover:text-primary transition underline decoration-purple-300">
                        📁 {unit.project.name}
                      </Link>
                    </div>
                  )}
                </div>
                {unit.developer?.id && (
                  <Link 
                    href={`/developers/${unit.developer.id}`}
                    className="bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl border border-indigo-200 transition shadow-2xs"
                  >
                    عرض مشاريع المطور ←
                  </Link>
                )}
              </div>
            )}

            {/* ROI & Investment Calculator Card */}
            {(() => {
              const uPrice = [
                unit.isCashOnly ? unit.cashPaidToSeller : null,
                unit.totalPrice,
                unit.cashPaidToSeller,
                unit.originalContractPrice
              ].map(v => Number(v)).find(v => v && v > 0) || 0;
              const isSea = Boolean(
                unit.isSeaView ||
                unit.location?.name?.includes('جونة') ||
                unit.location?.name?.includes('ساحل') ||
                unit.location?.name?.includes('بحر') ||
                unit.location?.name?.includes('غردقة') ||
                unit.title?.includes('بحر') ||
                unit.title?.includes('شاليه')
              );
              const rentalYield = Number(unit.expectedRentalRoi) > 0 
                ? Number(unit.expectedRentalRoi) 
                : (isSea ? 16.5 : 12.0);
              const annualRent = Math.round(uPrice * (rentalYield / 100));
              const nightlyRate = Math.round(annualRent / 270);
              const appreciation = isSea ? 30 : 10;
              const annualAppreciationEgp = Math.round(uPrice * (appreciation / 100));
              const totalRoi = Number((rentalYield + appreciation).toFixed(1));
              const totalAnnualEgp = annualRent + annualAppreciationEgp;
              const paybackYears = annualRent > 0 ? (uPrice / annualRent).toFixed(1) : null;
              const totalPaybackYears = totalRoi > 0 ? (100 / totalRoi).toFixed(1) : null;

              return (
                <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-50/90 p-6 md:p-7 rounded-3xl border border-emerald-200/90 mb-8 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center text-xl">
                        📈
                      </span>
                      <div>
                        <h3 className="text-lg font-extrabold text-emerald-950 font-cairo">
                          الجدوى والعائد على الاستثمار (ROI Breakdown)
                        </h3>
                        <p className="text-xs text-emerald-800/80 font-medium">
                          تقدير الأرباح الإيجارية (270 ليلة - إشغال 75%) مع معدل ارتفاع قيمة العقار السنوي
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs flex items-center gap-1 ${
                      isSea ? 'bg-cyan-100/90 text-cyan-900 border-cyan-300' : 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                    }`}>
                      {isSea ? '🌊 مشروع سياحي بحري (+30% نمو سنوي)' : '🏢 مشروع سكني (+10% نمو سنوي)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-right">
                    {/* 1. الإيجار السنوي */}
                    <div className="bg-white/95 backdrop-blur p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                      <span className="text-[11px] font-bold text-gray-500 block mb-1">
                        🏡 العائد الإيجاري السنوي
                      </span>
                      <span className="text-xl font-black text-emerald-800 block">
                        {annualRent.toLocaleString('ar-EG')} ج.م/سنة
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                        عائد {rentalYield}% (~{nightlyRate.toLocaleString('ar-EG')} ج/ليلة)
                      </span>
                    </div>

                    {/* 2. نمو ثمن العقار */}
                    <div className="bg-white/95 backdrop-blur p-4 rounded-2xl border border-blue-100 shadow-2xs">
                      <span className="text-[11px] font-bold text-gray-500 block mb-1">
                        📈 نمو قيمة العقار السنوي
                      </span>
                      <span className="text-xl font-black text-blue-800 block">
                        +{appreciation}% سنوياً
                      </span>
                      <span className="text-[11px] font-bold text-blue-600 block mt-1">
                        +{annualAppreciationEgp.toLocaleString('ar-EG')} ج.م زيادة متوقعة
                      </span>
                    </div>

                    {/* 3. إجمالي العائد */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm">
                      <span className="text-[11px] font-bold text-emerald-100 block mb-1">
                        🚀 إجمالي العائد (Total ROI)
                      </span>
                      <span className="text-2xl font-black block">
                        {totalRoi}%
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-100 block mt-1">
                        ~{totalAnnualEgp.toLocaleString('ar-EG')} ج.م أرباح سنوية
                      </span>
                    </div>

                    {/* 4. استرداد كامل قيمة الوحدة (الطريقتان معاً) */}
                    <div className="bg-white/95 backdrop-blur p-4 rounded-2xl border border-amber-200/90 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold text-amber-900 block">
                            ⏳ استرداد ثمن العقار
                          </span>
                          <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            رؤيتان
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center bg-amber-50/90 px-2 py-1 rounded-lg border border-amber-200/60">
                            <span className="text-[10px] font-bold text-amber-900">💵 إيجار كاش فقط:</span>
                            <span className="text-xs font-black text-amber-800">{paybackYears ? `${paybackYears} سنة` : '-'}</span>
                          </div>
                          <div className="flex justify-between items-center bg-emerald-50/90 px-2 py-1 rounded-lg border border-emerald-200/60">
                            <span className="text-[10px] font-bold text-emerald-950">🚀 إجمالي العائد (أصل+إيجار):</span>
                            <span className="text-xs font-black text-emerald-700">{totalPaybackYears ? `${totalPaybackYears} سنة` : '-'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold block mt-1.5 text-right">
                        استرداد كاش صافٍ أو مضاعفة الثروة
                      </span>
                    </div>
                  </div>

                  {/* Compound Capital Appreciation Breakdown (العائد التراكمي لنمو القيمة) */}
                  {uPrice > 0 && (() => {
                    const rate = appreciation / 100;
                    const year1Value = Math.round(uPrice * Math.pow(1 + rate, 1));
                    const year3Value = Math.round(uPrice * Math.pow(1 + rate, 3));
                    const year5Value = Math.round(uPrice * Math.pow(1 + rate, 5));
                    const year1GainPercent = Math.round((Math.pow(1 + rate, 1) - 1) * 100);
                    const year3GainPercent = Math.round((Math.pow(1 + rate, 3) - 1) * 100);
                    const year5GainPercent = Math.round((Math.pow(1 + rate, 5) - 1) * 100);
                    const year3TotalRent = annualRent * 3;
                    const year5TotalRent = annualRent * 5;

                    return (
                      <div className="mt-5 pt-5 border-t border-emerald-200/80 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📈</span>
                            <h4 className="text-sm font-extrabold text-emerald-950 font-cairo">
                              توقعات نمو القيمة الرأسمالية التراكمية (العائد المركّب)
                            </h4>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                            نمو تراكمي سنوي: {appreciation}% (يُحسب كل عام على القيمة الجديدة)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-right">
                          {/* السنة الأولى */}
                          <div className="bg-white/95 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-gray-500">بعد سنة (Year 1)</span>
                              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">+{year1GainPercent}%</span>
                            </div>
                            <span className="text-base font-black text-gray-900 block">
                              {year1Value.toLocaleString('ar-EG')} ج.م
                            </span>
                            <span className="text-[11px] text-gray-500 block">
                              + أرباح إيجارية: {annualRent.toLocaleString('ar-EG')} ج
                            </span>
                          </div>

                          {/* بعد 3 سنوات */}
                          <div className="bg-white/95 p-3.5 rounded-2xl border border-blue-200 shadow-2xs space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-blue-900">بعد 3 سنوات (Year 3)</span>
                              <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">+{year3GainPercent}%</span>
                            </div>
                            <span className="text-base font-black text-blue-950 block">
                              {year3Value.toLocaleString('ar-EG')} ج.م
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold block">
                              + إجمالي إيجار مجمع: {year3TotalRent.toLocaleString('ar-EG')} ج
                            </span>
                          </div>

                          {/* بعد 5 سنوات */}
                          <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-3.5 rounded-2xl shadow-sm space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-emerald-100">بعد 5 سنوات (Year 5)</span>
                              <span className="text-[11px] font-extrabold text-white bg-white/20 px-2 py-0.5 rounded-md">+{year5GainPercent}%</span>
                            </div>
                            <span className="text-base font-black text-white block">
                              {year5Value.toLocaleString('ar-EG')} ج.م
                            </span>
                            <span className="text-[11px] text-emerald-200 block">
                              + إجمالي إيجار مجمع: {year5TotalRent.toLocaleString('ar-EG')} ج
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {paybackYears && (
                    <div className="mt-4 bg-emerald-100/70 border border-emerald-200/90 text-emerald-950 p-4 rounded-2xl text-xs space-y-2.5">
                      <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                        <span className="text-base">💡</span>
                        <span>رؤيتان لاسترداد رأس المال:</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/95 p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                          <span className="font-extrabold text-amber-900 flex items-center gap-1">
                            <span>💵</span> 1. استرداد نقدي بحت (Pure Rental Cash):
                          </span>
                          <p className="text-gray-600 leading-relaxed text-[11px]">
                            تسترد كامل ثمن الوحدة <strong>سيولة نقدية في جيبك</strong> خلال <strong>{paybackYears} سنوات</strong> من أرباح الإيجار اليومي فقط، ويبقى أصل العقار ملكاً حراً لك مجاناً.
                          </p>
                        </div>
                        <div className="bg-white/95 p-3 rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                          <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                            <span>🚀</span> 2. استرداد القيمة الشاملة (Total ROI):
                          </span>
                          <p className="text-gray-600 leading-relaxed text-[11px]">
                            بدمج إيرادات الإيجار مع نمو قيمة العقار السنوي (+{appreciation}% سنوياً)، يتجاوز إجمالي ما حققه استثمارك 100% من ثمن الشراء في غضون <strong>{totalPaybackYears} سنة فقط</strong>!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Financial Details for Installments or Cash */}
            {unit.remainingInstallments && Number(unit.remainingInstallments) > 0 ? (
              <div className="bg-blue-50/60 p-6 rounded-2xl mb-8 border border-blue-100">
                <h3 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2">
                  <span>💳</span> تفاصيل نظام السداد والأقساط
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-gray-500 text-xs block mb-1">المقدم / الدفعة الأولى</span>
                    <span className="font-bold text-indigo-900 text-base">{Number(unit.cashPaidToSeller || 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-gray-500 text-xs block mb-1">إجمالي الأقساط المتبقية</span>
                    <span className="font-bold text-gray-900 text-base">{Number(unit.remainingInstallments).toLocaleString()} ج.م</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-gray-500 text-xs block mb-1">القسط الشهري (تقريبياً)</span>
                    <span className="font-bold text-accent text-base">{Number(unit.monthlyEquivalentInstallment || 0).toLocaleString()} ج.م/شهر</span>
                  </div>
                  {unit.installmentsCount && (
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                      <span className="text-gray-500 text-xs block mb-1">عدد الأقساط</span>
                      <span className="font-bold text-gray-900 text-base">{unit.installmentsCount} قسط</span>
                    </div>
                  )}
                  {unit.installmentFrequency && (
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                      <span className="text-gray-500 text-xs block mb-1">دورية السداد</span>
                      <span className="font-bold text-gray-900 text-base">
                        {unit.installmentFrequency === 'MONTHLY' ? 'شهري' :
                         unit.installmentFrequency === 'QUARTERLY' ? 'ربع سنوي' :
                         unit.installmentFrequency === 'SEMI_ANNUAL' ? 'نصف سنوي' : 'سنوي'}
                      </span>
                    </div>
                  )}
                  {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-2xs">
                      <span className="text-emerald-700 text-xs block mb-1">خصم الدفع الكاش</span>
                      <span className="font-extrabold text-emerald-800 text-base">{unit.cashDiscountPercentage}% خصم</span>
                    </div>
                  )}
                </div>
              </div>
            ) : unit.isCashOnly ? (
              <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-200/80 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-900">نظام الدفع: كاش فقط</h3>
                  <p className="text-xs text-gray-500 mt-0.5">هذا العقار معروض للبيع السريع نظام كاش بدون أقساط طويلة الأجل</p>
                </div>
                {unit.cashDiscountPercentage && Number(unit.cashDiscountPercentage) > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-sm font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200">
                    خصم كاش {unit.cashDiscountPercentage}%
                  </span>
                )}
              </div>
            ) : null}

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                <HomeModernIcon className="w-6 h-6 text-primary mb-2" />
                <span className="text-gray-500 text-xs mb-0.5">المساحة الكلية</span>
                <span className="font-bold text-gray-900 text-base">{unit.area} م²</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                <BuildingOffice2Icon className="w-6 h-6 text-primary mb-2" />
                <span className="text-gray-500 text-xs mb-0.5">نوع الوحدة</span>
                <span className="font-bold text-gray-900 text-base">{unit.unitType?.name || '-'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                <span className="w-6 h-6 flex items-center justify-center text-primary mb-2 text-xl">🛏️</span>
                <span className="text-gray-500 text-xs mb-0.5">غرف النوم</span>
                <span className="font-bold text-gray-900 text-base">{unit.bedrooms || '-'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                <span className="w-6 h-6 flex items-center justify-center text-primary mb-2 text-xl">🚿</span>
                <span className="text-gray-500 text-xs mb-0.5">الحمامات</span>
                <span className="font-bold text-gray-900 text-base">{unit.bathrooms || '-'}</span>
              </div>
              {unit.isSeaView && (
                <div className="bg-cyan-50/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-cyan-200/60">
                  <span className="w-6 h-6 flex items-center justify-center text-cyan-600 mb-2 text-xl">🌊</span>
                  <span className="text-cyan-800 text-xs mb-0.5 font-semibold">الإطلالة</span>
                  <span className="font-bold text-cyan-950 text-sm">على البحر مباشرة</span>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                <span className="w-6 h-6 flex items-center justify-center text-amber-600 mb-2 text-xl">🔑</span>
                <span className="text-gray-500 text-xs mb-0.5">التسليم</span>
                <span className="font-bold text-gray-900 text-sm">
                  {unit.deliveryStatus === 'READY' ? 'جاهز فوراً' : `سنة ${unit.deliveryYear || ''}`}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                <span className="w-6 h-6 flex items-center justify-center text-indigo-600 mb-2 text-xl">🏛️</span>
                <span className="text-gray-500 text-xs mb-0.5">المحافظة</span>
                <span className="font-bold text-gray-900 text-sm">{unit.location?.governorate || '-'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                <span className="w-6 h-6 flex items-center justify-center text-emerald-600 mb-2 text-xl">📈</span>
                <span className="text-gray-500 text-xs mb-0.5">العائد الاستثماري</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {Number(unit.expectedRentalRoi) > 0 ? `${unit.expectedRentalRoi}%` : ((unit.isSeaView || unit.location?.name?.includes('جونة')) ? '16.5%' : '12%')}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">الوصف والتفاصيل</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                {unit.description || (unit.location?.name?.includes('جونة') || unit.isSeaView
                  ? 'استوديو فاخر ومميز في الجونة بمحافظة البحر الأحمر، يقع في موقع استراتيجي راقٍ بالقرب من الخدمات والمارينا. الوحدة مشطبة بأعلى المعايير وجاهزة تماماً للاستثمار العقاري والإيجار الفندقي عبر منصات Airbnb و Booking بعائد إيجاري مرتفع ومضمون طوال العام.'
                  : 'وحدة مميزة بموقع استراتيجي متكامل الخدمات وتشطيب راقٍ، مناسبة جداً للسكن والاستثمار العقاري.')
                }
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar (Left side in RTL) */}
        <div className="space-y-6">
          
          {/* Lead Form */}
          <UnitLeadForm 
            unitPrice={[
              unit.isCashOnly ? unit.cashPaidToSeller : null,
              unit.totalPrice,
              unit.cashPaidToSeller,
              unit.originalContractPrice
            ].map(v => Number(v)).find(v => v && v > 0) || 0} 
            unitId={unit.id} 
          />

        </div>
      </div>
    </div>
  );
}

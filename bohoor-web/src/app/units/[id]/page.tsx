import { api } from "@/api/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import UnitDetailsView from "@/components/UnitDetailsView";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const unit = await api.units.getOne(id);
    if (!unit) {
      return {
        title: 'عقار غير موجود | Property Not Found | منصة بُحور',
        description: 'لم يتم العثور على العقار المطلوب على منصة بُحور العقارية.',
      };
    }

    const title = unit.titleAr || unit.title || unit.titleEn;
    const price = Number(unit.cashPaidToSeller || unit.totalPrice || unit.originalContractPrice || 0);
    const formattedPrice = price > 0 ? `${price.toLocaleString()} ج.م` : 'السعر عند الطلب';
    const locationName = unit.location?.name 
      ? `${unit.location.governorate ? unit.location.governorate + '، ' : ''}${unit.location.name}` 
      : (unit.location?.governorate || 'موقع متميز');
    const bedroomsText = unit.bedrooms ? `${unit.bedrooms} غرف نوم` : '';
    const areaText = unit.area ? `${unit.area} م²` : '';

    const ogTitle = `${title} - ${formattedPrice} | منصة بُحور`;
    const ogDescription = [
      locationName,
      unit.isCashOnly ? 'نظام الدفع: كاش' : 'تقسيط متاح',
      bedroomsText,
      areaText,
      unit.expectedRentalRoi ? `عائد إيجاري متوقع ${unit.expectedRentalRoi}%` : '',
      'تصفح تفاصيل العقار والصور والعائد الاستثماري كاملة على منصة بُحور.'
    ].filter(Boolean).join(' • ');

    const rawCover = unit.coverImage || (unit.images && unit.images[0]) || '';
    let coverImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
    if (rawCover) {
      if (rawCover.includes('drive.google.com/file/d/')) {
        const fileId = rawCover.split('/file/d/')[1]?.split('/')[0];
        if (fileId) coverImage = `https://drive.google.com/uc?export=view&id=${fileId}`;
      } else {
        coverImage = rawCover;
      }
    }

    const canonicalUrl = `https://buhoor-web.vercel.app/units/${id}`;

    return {
      title: `${title} - ${formattedPrice} | بُحور`,
      description: ogDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: 'منصة بُحور العقارية | Bohoor',
        images: [
          {
            url: coverImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: 'ar_EG',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        images: [coverImage],
      },
      other: {
        'al:ios:url': `bohoor://units/${id}`,
        'al:ios:app_store_id': '123456789',
        'al:ios:app_name': 'Bohoor',
        'al:android:url': `bohoor://units/${id}`,
        'al:android:package': 'com.bohoor.app',
        'al:android:app_name': 'Bohoor',
      }
    };
  } catch {
    return {
      title: 'تفاصيل العقار | Property Details | منصة بُحور',
      description: 'اكتشف أفضل العقارات والوحدات الاستثمارية في مصر عبر منصة بُحور.',
    };
  }
}

export default async function UnitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let unit: any;
  try {
    unit = await api.units.getOne(id);
  } catch (error) {
    notFound();
  }

  if (!unit) notFound();

  return <UnitDetailsView unit={unit} />;
}

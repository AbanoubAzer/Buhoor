import { api } from "@/api/client";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailsView from "@/components/ProjectDetailsView";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await api.projects.getOne(id);
    if (!project) {
      return {
        title: 'مشروع غير موجود | Project Not Found | منصة بُحور',
        description: 'لم يتم العثور على المشروع المطلوب.',
      };
    }

    const title = project.nameAr || project.name || project.nameEn;
    const description = project.descriptionAr || project.description || project.descriptionEn || `اكتشف مشروع ${title} في ${project.location || 'مصر'}. تفاصيل الوحدات والأسعار ومخططات المشروع على منصة بُحور.`;

    const coverImage = project.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200';
    const canonicalSlug = project.slug || id;
    const canonicalUrl = `https://buhoor-web.vercel.app/projects/${canonicalSlug}`;

    return {
      title: `مشروع ${title} | ${project.developer?.name || 'بُحور'}`,
      description: description.slice(0, 160),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `مشروع ${title} | منصة بُحور`,
        description: description.slice(0, 160),
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
        title: `مشروع ${title} | Bohoor`,
        description: description.slice(0, 160),
        images: [coverImage],
      },
      other: {
        'al:ios:url': `bohoor://projects/${canonicalSlug}`,
        'al:ios:app_store_id': '123456789',
        'al:ios:app_name': 'Bohoor',
        'al:android:url': `bohoor://projects/${canonicalSlug}`,
        'al:android:package': 'com.bohoor.app',
        'al:android:app_name': 'Bohoor',
      }
    };
  } catch {
    return {
      title: 'تفاصيل المشروع | Project Details | منصة بُحور',
      description: 'اكتشف أفضل المشاريع العقارية على منصة بُحور.',
    };
  }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let project: any;
  try {
    project = await api.projects.getOne(id);
  } catch {
    notFound();
  }

  if (!project) notFound();

  // If accessed by raw UUID and project has a clean slug, redirect to clean URL
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (isUuid && project.slug) {
    redirect(`/projects/${project.slug}`);
  }

  let unitsRes: any = { data: [] };
  try {
    unitsRes = await api.units.getAll({ projectId: project.id, status: 'APPROVED', limit: 50 });
  } catch {
    unitsRes = { data: [] };
  }

  const units = unitsRes?.data || [];

  return <ProjectDetailsView project={project} units={units} />;
}

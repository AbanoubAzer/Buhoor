import { api } from "@/api/client";
import { notFound, redirect } from "next/navigation";
import DeveloperDetailsClientView from "@/components/DeveloperDetailsClientView";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DeveloperDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let developer: any;
  let projects: any[] = [];
  try {
    developer = await api.developers.getOne(id);
    if (!developer) notFound();

    // Redirect UUID or uncanonical slug to clean slug early (before fetching projects)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const decodedId = decodeURIComponent(id).trim();
    if ((isUuid || decodedId !== developer.slug) && developer.slug) {
      redirect(`/developers/${encodeURIComponent(developer.slug)}`);
    }

    const projRes = await api.projects.getAll(developer.id).catch(() => []);
    projects = Array.isArray(projRes) ? projRes : (projRes?.data || []);
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
    notFound();
  }

  return <DeveloperDetailsClientView developer={developer} projects={projects} />;
}

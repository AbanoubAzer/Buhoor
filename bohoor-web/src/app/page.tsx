import { api } from "@/api/client";
import HomeClientView from "@/components/HomeClientView";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [unitsData, projectsData, devsData, heroSlides, locationsData] = await Promise.all([
    api.units.getAll({ limit: 6, status: 'APPROVED' }).catch((err) => {
      console.error('Home: units fetch error:', err?.message || err);
      return { data: [] };
    }),
    api.projects.getAll().catch((err) => {
      console.error('Home: projects fetch error:', err?.message || err);
      return [];
    }),
    api.developers.getAll().catch((err) => {
      console.error('Home: developers fetch error:', err?.message || err);
      return [];
    }),
    api.heroSlides.getAll().catch(() => []),
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
    <HomeClientView
      heroSlides={heroSlides}
      projectsData={projectsData}
      projects={projects}
      developers={developers}
      locations={locations}
      units={units}
      fallbackAreaImages={fallbackAreaImages}
    />
  );
}

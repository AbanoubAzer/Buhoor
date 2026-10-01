import { api } from "@/api/client";
import ProjectsClientView from "@/components/ProjectsClientView";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectsPage() {
  const res = await api.getProjects().catch(() => ({ data: [] }));
  const projects = Array.isArray(res) ? res : (res?.data || []);

  return <ProjectsClientView projects={projects} />;
}

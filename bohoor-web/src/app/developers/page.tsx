import { api } from "@/api/client";
import DevelopersClientView from "@/components/DevelopersClientView";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DevelopersPage() {
  const res = await api.getDevelopers().catch(() => ({ data: [] }));
  const developers = Array.isArray(res) ? res : (res?.data || []);

  return <DevelopersClientView developers={developers} />;
}

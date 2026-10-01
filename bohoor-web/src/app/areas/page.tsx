import { api } from "@/api/client";
import AreasClientView from "@/components/AreasClientView";

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function AreasPage() {
  const res = await api.getLocations().catch(() => ({ data: [] }));
  const locations = Array.isArray(res) ? res : (res?.data || []);

  return <AreasClientView locations={locations} />;
}

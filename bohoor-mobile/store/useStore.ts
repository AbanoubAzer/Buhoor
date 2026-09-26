import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://buhoor.vercel.app';

interface AppState {
  projects: any[];
  units: any[];
  heroSlides: any[];
  locations: any[];
  unitTypes: any[];
  developers: any[];
  favorites: string[]; // store unit/project IDs
  loadingProjects: boolean;
  loadingUnits: boolean;
  loadingHeroSlides: boolean;
  loadingMetadata: boolean;
  fetchProjects: () => Promise<void>;
  fetchUnits: (params?: any) => Promise<void>;
  fetchHeroSlides: () => Promise<void>;
  fetchMetadata: () => Promise<void>;
  refreshAll: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      units: [],
      heroSlides: [],
      locations: [],
      unitTypes: [],
      developers: [],
      favorites: [],
      loadingProjects: false,
      loadingUnits: false,
      loadingHeroSlides: false,
      loadingMetadata: false,

      fetchProjects: async () => {
        set({ loadingProjects: true });
        try {
          const response = await axios.get(`${API_URL}/projects`);
          const raw = response.data;
          const list = Array.isArray(raw) ? raw : (raw?.data || []);
          set({ projects: list });
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          set({ loadingProjects: false });
        }
      },

      fetchUnits: async (params?: any) => {
        set({ loadingUnits: true });
        try {
          const response = await axios.get(`${API_URL}/units`, {
            params: { status: 'APPROVED', limit: 50, ...params },
          });
          const raw = response.data;
          const list = Array.isArray(raw) ? raw : (raw?.data || []);
          const approved = list.filter((u: any) => !u.status || u.status === 'APPROVED');
          set({ units: approved });
        } catch (error) {
          console.error('Error fetching units:', error);
        } finally {
          set({ loadingUnits: false });
        }
      },

      fetchHeroSlides: async () => {
        set({ loadingHeroSlides: true });
        try {
          const response = await axios.get(`${API_URL}/hero-slides`);
          const raw = response.data;
          const list = Array.isArray(raw) ? raw : (raw?.data || []);
          const active = list.filter((s: any) => s.isActive !== false);
          set({ heroSlides: active });
        } catch (error) {
          console.error('Error fetching hero slides:', error);
        } finally {
          set({ loadingHeroSlides: false });
        }
      },

      fetchMetadata: async () => {
        set({ loadingMetadata: true });
        try {
          const [locRes, typeRes, devRes] = await Promise.allSettled([
            axios.get(`${API_URL}/locations`),
            axios.get(`${API_URL}/unit-types`),
            axios.get(`${API_URL}/developers`),
          ]);
          const locations = locRes.status === 'fulfilled'
            ? (Array.isArray(locRes.value.data) ? locRes.value.data : locRes.value.data?.data || [])
            : [];
          const unitTypes = typeRes.status === 'fulfilled'
            ? (Array.isArray(typeRes.value.data) ? typeRes.value.data : typeRes.value.data?.data || [])
            : [];
          const developers = devRes.status === 'fulfilled'
            ? (Array.isArray(devRes.value.data) ? devRes.value.data : devRes.value.data?.data || [])
            : [];
          set({ locations, unitTypes, developers });
        } catch (error) {
          console.error('Error fetching metadata:', error);
        } finally {
          set({ loadingMetadata: false });
        }
      },

      refreshAll: async () => {
        const { fetchProjects, fetchUnits, fetchHeroSlides, fetchMetadata } = get();
        await Promise.allSettled([
          fetchProjects(),
          fetchUnits(),
          fetchHeroSlides(),
          fetchMetadata(),
        ]);
      },

      toggleFavorite: (id: string) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter(favId => favId !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },

      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      }
    }),
    {
      name: 'bohoor-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

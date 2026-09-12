import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

interface AppState {
  projects: any[];
  units: any[];
  heroSlides: any[];
  favorites: string[]; // store unit/project IDs
  loadingProjects: boolean;
  loadingUnits: boolean;
  loadingHeroSlides: boolean;
  fetchProjects: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchHeroSlides: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      units: [],
      heroSlides: [],
      favorites: [],
      loadingProjects: false,
      loadingUnits: false,
      loadingHeroSlides: false,

      fetchProjects: async () => {
        set({ loadingProjects: true });
        try {
          const response = await axios.get(`${API_URL}/projects`);
          set({ projects: response.data });
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          set({ loadingProjects: false });
        }
      },

      fetchUnits: async () => {
        set({ loadingUnits: true });
        try {
          const response = await axios.get(`${API_URL}/units`);
          const approved = response.data.filter((u: any) => u.status === 'APPROVED');
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
          set({ heroSlides: response.data });
        } catch (error) {
          console.error('Error fetching hero slides:', error);
        } finally {
          set({ loadingHeroSlides: false });
        }
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
      partialize: (state) => ({ favorites: state.favorites }), // only persist favorites
    }
  )
);

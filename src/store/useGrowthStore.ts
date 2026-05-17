import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HeightEntry {
  id: string;
  height: number; // cm
  date: string;   // ISO string
  note?: string;
}

interface GrowthStore {
  entries: HeightEntry[];
  isLoading: boolean;
  addEntry: (height: number, note?: string) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loadEntries: () => Promise<void>;
  getLatestHeight: () => number | null;
  getGrowthVelocity: () => number; // cm per month
  getTotalGrowth: () => number;
  clearEntries: () => Promise<void>;
}

const STORAGE_KEY = '@taller_growth_entries';

const generateId = () =>
  `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useGrowthStore = create<GrowthStore>((set, get) => ({
  entries: [],
  isLoading: true,

  addEntry: async (height: number, note?: string) => {
    const newEntry: HeightEntry = {
      id: generateId(),
      height,
      date: new Date().toISOString(),
      note,
    };
    const updated = [...get().entries, newEntry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ entries: updated });
    } catch (error) {
      console.error('Error saving growth entry:', error);
    }
  },

  removeEntry: async (id: string) => {
    const updated = get().entries.filter((e) => e.id !== id);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ entries: updated });
    } catch (error) {
      console.error('Error removing growth entry:', error);
    }
  },

  loadEntries: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const entries = JSON.parse(stored);
        set({ entries, isLoading: false });
      } else {
        set({ entries: [], isLoading: false });
      }
    } catch (error) {
      console.error('Error loading growth entries:', error);
      set({ isLoading: false });
    }
  },

  getLatestHeight: () => {
    const { entries } = get();
    if (entries.length === 0) return null;
    return entries[entries.length - 1].height;
  },

  getGrowthVelocity: () => {
    const { entries } = get();
    if (entries.length < 2) return 0;
    const latest = entries[entries.length - 1];
    const oldest = entries[0];
    const heightDiff = latest.height - oldest.height;
    const daysDiff =
      (new Date(latest.date).getTime() - new Date(oldest.date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysDiff === 0) return 0;
    return (heightDiff / daysDiff) * 30; // cm per month
  },

  getTotalGrowth: () => {
    const { entries } = get();
    if (entries.length < 2) return 0;
    return entries[entries.length - 1].height - entries[0].height;
  },

  clearEntries: async () => {
  try {
    await AsyncStorage.removeItem('@taller_growth_entries');
    set({ entries: [], currentStreak: 0 });
  } catch (error) {
    console.error('Error clearing growth entries:', error);
  }
},
}));
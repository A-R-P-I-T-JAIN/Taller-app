import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, differenceInMinutes } from 'date-fns';

export interface SleepEntry {
  id: string;
  date: string;        // YYYY-MM-DD
  bedTime: string;     // ISO string
  wakeTime: string;    // ISO string
  duration: number;    // minutes
  quality: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

interface SleepStore {
  entries: SleepEntry[];
  isLoading: boolean;
  addEntry: (entry: Omit<SleepEntry, 'id' | 'duration'>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loadEntries: () => Promise<void>;
  getAverageSleep: () => number; // minutes
  getAverageQuality: () => number;
  getLastNightSleep: () => SleepEntry | null;
  getWeeklyData: () => SleepEntry[];
  getTodayEntry: () => SleepEntry | null;
  clearEntries: () => Promise<void>;
}

const STORAGE_KEY = '@taller_sleep_entries';

const generateId = () =>
  `sleep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useSleepStore = create<SleepStore>((set, get) => ({
  entries: [],
  isLoading: true,

  addEntry: async (entry) => {
    const duration = differenceInMinutes(
      new Date(entry.wakeTime),
      new Date(entry.bedTime)
    );
    const newEntry: SleepEntry = {
      id: generateId(),
      ...entry,
      duration: duration < 0 ? duration + 24 * 60 : duration,
    };
    const updated = [...get().entries, newEntry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ entries: updated });
    } catch (error) {
      console.error('Error saving sleep entry:', error);
    }
  },

  removeEntry: async (id: string) => {
    const updated = get().entries.filter((e) => e.id !== id);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ entries: updated });
    } catch (error) {
      console.error('Error removing sleep entry:', error);
    }
  },

  loadEntries: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ entries: JSON.parse(stored), isLoading: false });
      } else {
        set({ entries: [], isLoading: false });
      }
    } catch (error) {
      console.error('Error loading sleep entries:', error);
      set({ isLoading: false });
    }
  },

  getAverageSleep: () => {
    const { entries } = get();
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, e) => sum + e.duration, 0);
    return total / entries.length;
  },

  getAverageQuality: () => {
    const { entries } = get();
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, e) => sum + e.quality, 0);
    return total / entries.length;
  },

  getLastNightSleep: () => {
    const { entries } = get();
    if (entries.length === 0) return null;
    return entries[entries.length - 1];
  },

  getWeeklyData: () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    return get().entries.filter(
      (e) => new Date(e.date) >= weekStart
    );
  },

  getTodayEntry: () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get().entries.find((e) => e.date === today) || null;
  },

  clearEntries: async () => {
  try {
    await AsyncStorage.removeItem('@taller_sleep_entries');
    set({ entries: [] });
  } catch (error) {
    console.error('Error clearing sleep entries:', error);
  }
},
}));
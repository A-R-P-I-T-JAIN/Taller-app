import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface NutritionLog {
  id: string;
  date: string; // YYYY-MM-DD
  completedItems: string[]; // nutrient item IDs
  waterGlasses: number;
  completedAt: string;
}

interface NutritionStore {
  logs: NutritionLog[];
  isLoading: boolean;
  todayLog: NutritionLog | null;
  toggleNutrientItem: (itemId: string) => Promise<void>;
  setWaterGlasses: (glasses: number) => Promise<void>;
  loadLogs: () => Promise<void>;
  getTodayCompletion: () => number; // percentage 0-100
  getWeeklyCompletion: () => number[];
  clearLogs: () => Promise<void>;
}

const STORAGE_KEY = '@taller_nutrition_logs';

const generateId = () =>
  `nutrition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createTodayLog = (): NutritionLog => ({
  id: generateId(),
  date: format(new Date(), 'yyyy-MM-dd'),
  completedItems: [],
  waterGlasses: 0,
  completedAt: new Date().toISOString(),
});

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  logs: [],
  isLoading: true,
  todayLog: null,

  toggleNutrientItem: async (itemId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let todayLog = get().todayLog;
    let logs = [...get().logs];

    if (!todayLog) {
      todayLog = createTodayLog();
      logs.push(todayLog);
    }

    const isCompleted = todayLog.completedItems.includes(itemId);
    const updatedItems = isCompleted
      ? todayLog.completedItems.filter((id) => id !== itemId)
      : [...todayLog.completedItems, itemId];

    const updatedLog = {
      ...todayLog,
      completedItems: updatedItems,
      completedAt: new Date().toISOString(),
    };

    const updatedLogs = logs.map((l) =>
      l.date === today ? updatedLog : l
    );

    if (!logs.find((l) => l.date === today)) {
      updatedLogs.push(updatedLog);
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
      set({ logs: updatedLogs, todayLog: updatedLog });
    } catch (error) {
      console.error('Error toggling nutrient:', error);
    }
  },

  setWaterGlasses: async (glasses: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let todayLog = get().todayLog;
    let logs = [...get().logs];

    if (!todayLog) {
      todayLog = createTodayLog();
      logs.push(todayLog);
    }

    const updatedLog = { ...todayLog, waterGlasses: glasses };
    const updatedLogs = logs.map((l) =>
      l.date === today ? updatedLog : l
    );

    if (!logs.find((l) => l.date === today)) {
      updatedLogs.push(updatedLog);
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
      set({ logs: updatedLogs, todayLog: updatedLog });
    } catch (error) {
      console.error('Error setting water:', error);
    }
  },

  loadLogs: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const today = format(new Date(), 'yyyy-MM-dd');

      if (stored) {
        const logs: NutritionLog[] = JSON.parse(stored);
        const todayLog = logs.find((l) => l.date === today) || null;
        set({ logs, todayLog, isLoading: false });
      } else {
        set({ logs: [], todayLog: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error loading nutrition logs:', error);
      set({ isLoading: false });
    }
  },

  getTodayCompletion: () => {
    const todayLog = get().todayLog;
    if (!todayLog) return 0;
    const totalItems = 8; // total nutrient items in checklist
    const completed = todayLog.completedItems.length;
    return Math.round((completed / totalItems) * 100);
  },

  getWeeklyCompletion: () => {
    const totalItems = 8;
    const result: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = get().logs.find((l) => l.date === dateStr);
      if (log) {
        result.push(Math.round((log.completedItems.length / totalItems) * 100));
      } else {
        result.push(0);
      }
    }
    return result;
  },

  clearLogs: async () => {
  try {
    await AsyncStorage.removeItem('@taller_nutrition_logs');
    set({ logs: [], todayLog: null });
  } catch (error) {
    console.error('Error clearing nutrition logs:', error);
  }
},
}));
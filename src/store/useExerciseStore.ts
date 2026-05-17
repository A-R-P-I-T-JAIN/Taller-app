import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface CompletedWorkout {
  id: string;
  date: string; // YYYY-MM-DD
  exerciseIds: string[];
  duration: number; // seconds
  completedAt: string; // ISO
}

interface ExerciseStore {
  completedWorkouts: CompletedWorkout[];
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
  addCompletedWorkout: (workout: Omit<CompletedWorkout, 'id'>) => Promise<void>;
  loadWorkouts: () => Promise<void>;
  isCompletedToday: () => boolean;
  getStreakDates: () => string[];
  calculateStreak: (workouts: CompletedWorkout[]) => number;
  getThisWeekWorkouts: () => CompletedWorkout[];
  clearWorkouts: () => Promise<void>;
}

const STORAGE_KEY = '@taller_workouts';

const generateId = () =>
  `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  completedWorkouts: [],
  currentStreak: 0,
  longestStreak: 0,
  isLoading: true,

  addCompletedWorkout: async (workout) => {
    const newWorkout: CompletedWorkout = {
      id: generateId(),
      ...workout,
    };
    const updated = [...get().completedWorkouts, newWorkout];
    const streak = get().calculateStreak(updated);
    const longest = Math.max(streak, get().longestStreak);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        workouts: updated,
        longestStreak: longest,
      }));
      set({
        completedWorkouts: updated,
        currentStreak: streak,
        longestStreak: longest,
      });
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  },

  loadWorkouts: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { workouts, longestStreak } = JSON.parse(stored);
        const streak = get().calculateStreak(workouts);
        set({
          completedWorkouts: workouts,
          currentStreak: streak,
          longestStreak: longestStreak || streak,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
      set({ isLoading: false });
    }
  },

  isCompletedToday: () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get().completedWorkouts.some((w) => w.date === today);
  },

  getStreakDates: () => {
    return get().completedWorkouts.map((w) => w.date);
  },

  calculateStreak: (workouts: CompletedWorkout[]) => {
    if (workouts.length === 0) return 0;
    const dates = [...new Set(workouts.map((w) => w.date))].sort().reverse();
    let streak = 0;
    let checkDate = new Date();

    for (const date of dates) {
      const formatted = format(checkDate, 'yyyy-MM-dd');
      if (date === formatted) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  getThisWeekWorkouts: () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    return get().completedWorkouts.filter(
      (w) => new Date(w.completedAt) >= weekStart
    );
  },

  clearWorkouts: async () => {
  try {
    await AsyncStorage.removeItem('@taller_workouts');
    set({ completedWorkouts: [], currentStreak: 0, longestStreak: 0 });
  } catch (error) {
    console.error('Error clearing workouts:', error);
  }
},
}));
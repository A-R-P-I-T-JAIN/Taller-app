import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Gender = 'male' | 'female';
export type HeightUnit = 'cm' | 'ft';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  currentHeight: number; // always stored in cm
  currentWeight: number; // always stored in kg
  fatherHeight: number | null; // cm
  motherHeight: number | null; // cm
  heightUnit: HeightUnit;
  goal: string;
  onboardingComplete: boolean;
  createdAt: string;
}

interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
  isOnboardingComplete: () => boolean;
}

const STORAGE_KEY = '@taller_user_profile';

const defaultProfile: UserProfile = {
  name: '',
  age: 16,
  gender: 'male',
  currentHeight: 170,
  currentWeight: 60,
  fatherHeight: null,
  motherHeight: null,
  heightUnit: 'cm',
  goal: '',
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
};

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  isLoading: true,

  setProfile: async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      set({ profile });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const current = get().profile;
    if (!current) return;
    const updated = { ...current, ...updates };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ profile: updated });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  },

  loadProfile: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ profile: JSON.parse(stored), isLoading: false });
      } else {
        set({ profile: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      set({ isLoading: false });
    }
  },

  clearProfile: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ profile: null });
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  },

  isOnboardingComplete: () => {
    const profile = get().profile;
    return profile?.onboardingComplete ?? false;
  },
}));
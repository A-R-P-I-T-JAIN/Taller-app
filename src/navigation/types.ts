import { NavigatorScreenParams } from '@react-navigation/native';

// ─── Tab Navigator ───────────────────────────────────────────
export type TabParamList = {
  Dashboard: undefined;
  Growth: undefined;
  Exercise: undefined;
  Sleep: undefined;
  Nutrition: undefined;
};

// ─── Dashboard Stack ─────────────────────────────────────────
export type DashboardStackParamList = {
  DashboardHome: undefined;
  Profile: undefined;
};

// ─── Growth Stack ─────────────────────────────────────────────
export type GrowthStackParamList = {
  GrowthHome: undefined;
  AddMeasurement: undefined;
  GrowthProjection: undefined;
};

// ─── Exercise Stack ───────────────────────────────────────────
export type ExerciseStackParamList = {
  ExerciseHome: undefined;
  WorkoutSession: {
    exerciseIds: string[];
  };
  ExerciseDetail: {
    exerciseId: string;
  };
  ExerciseLibrary: undefined;
};

// ─── Sleep Stack ──────────────────────────────────────────────
export type SleepStackParamList = {
  SleepHome: undefined;
  LogSleep: undefined;
  SleepTips: undefined;
};

// ─── Nutrition Stack ──────────────────────────────────────────
export type NutritionStackParamList = {
  NutritionHome: undefined;
  NutrientDetail: {
    nutrientId: string;
  };
  MealSuggestions: undefined;
};

// ─── Root Navigator ───────────────────────────────────────────
export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: NavigatorScreenParams<TabParamList>;
};

// ─── Onboarding Stack ─────────────────────────────────────────
export type OnboardingStackParamList = {
  Welcome: undefined;
  OnboardingSlides: undefined;
  ProfileSetup: undefined;
};
import { useSleepStore } from '../store/useSleepStore';
import { useExerciseStore } from '../store/useExerciseStore';
import { useNutritionStore } from '../store/useNutritionStore';
import {
  calculateHealthScore,
  HealthScoreBreakdown,
} from '../utils/healthScore';

export const useHealthScore = (): HealthScoreBreakdown => {
  const entries = useSleepStore((s) => s.entries);
  const isCompletedToday = useExerciseStore((s) => s.isCompletedToday);
  const currentStreak = useExerciseStore((s) => s.currentStreak);
  const todayLog = useNutritionStore((s) => s.todayLog);
  const logs = useNutritionStore((s) => s.logs);

  // Get last sleep entry
  const lastSleep =
    entries.length > 0 ? entries[entries.length - 1] : null;
  const sleepHours = lastSleep ? lastSleep.duration / 60 : 0;
  const sleepQuality = lastSleep ? lastSleep.quality : 0;

  // Get today completion
  const totalItems = 8;
  const completedItems = todayLog?.completedItems.length || 0;
  const nutritionPercent = Math.round(
    (completedItems / totalItems) * 100
  );

  return calculateHealthScore({
    sleepHours,
    sleepQuality,
    exerciseCompleted: isCompletedToday(),
    nutritionPercent,
    exerciseStreak: currentStreak,
    waterGlasses: todayLog?.waterGlasses || 0,
  });
};
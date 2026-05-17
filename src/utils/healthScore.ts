export interface HealthScoreBreakdown {
  total: number;
  sleep: number;
  exercise: number;
  nutrition: number;
  consistency: number;
  label: string;
  color: string;
}

export const calculateHealthScore = (params: {
  sleepHours: number;
  sleepQuality: number; // 1-5
  exerciseCompleted: boolean;
  nutritionPercent: number; // 0-100
  exerciseStreak: number;
  waterGlasses: number;
}): HealthScoreBreakdown => {
  const {
    sleepHours,
    sleepQuality,
    exerciseCompleted,
    nutritionPercent,
    exerciseStreak,
    waterGlasses,
  } = params;

  // Sleep score (0-25 points)
  const idealSleep = 9; // for teens
  const sleepHourScore = Math.min(25, Math.round(
    (sleepHours / idealSleep) * 15 +
    (sleepQuality / 5) * 10
  ));

  // Exercise score (0-30 points)
  const exerciseScore = exerciseCompleted ? 25 : 0;
  const streakBonus = Math.min(5, exerciseStreak);
  const exerciseTotal = exerciseScore + streakBonus;

  // Nutrition score (0-30 points)
  const nutritionScore = Math.round((nutritionPercent / 100) * 25);
  const waterBonus = Math.min(5, Math.round((waterGlasses / 8) * 5));
  const nutritionTotal = nutritionScore + waterBonus;

  // Consistency score (0-15 points)
  const consistencyScore = Math.min(15, exerciseStreak * 2);

  const total = Math.min(
    100,
    sleepHourScore + exerciseTotal + nutritionTotal + consistencyScore
  );

  const getLabel = (score: number): string => {
    if (score >= 90) return 'Excellent! 🔥';
    if (score >= 75) return 'Great Job! 💪';
    if (score >= 60) return 'Good Progress 👍';
    if (score >= 40) return 'Keep Going 🌱';
    return 'Just Starting 🌟';
  };

  const getColor = (score: number): string => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#6C63FF';
    if (score >= 60) return '#00D4AA';
    if (score >= 40) return '#F59E0B';
    return '#FF6B6B';
  };

  return {
    total,
    sleep: sleepHourScore,
    exercise: exerciseTotal,
    nutrition: nutritionTotal,
    consistency: consistencyScore,
    label: getLabel(total),
    color: getColor(total),
  };
};
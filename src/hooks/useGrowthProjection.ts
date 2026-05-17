import { useUserStore } from '../store/useUserStore';
import { useGrowthStore } from '../store/useGrowthStore';
import {
  calculateGrowthProjection,
  GrowthProjection,
} from '../utils/growthCalculations';

export const useGrowthProjection = (): GrowthProjection | null => {
  const profile = useUserStore((s) => s.profile);
  const entries = useGrowthStore((s) => s.entries);

  if (!profile) return null;

  // Calculate velocity from entries
  let velocity = 0;
  if (entries.length >= 2) {
    const latest = entries[entries.length - 1];
    const oldest = entries[0];
    const heightDiff = latest.height - oldest.height;
    const daysDiff =
      (new Date(latest.date).getTime() -
        new Date(oldest.date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysDiff > 0) {
      velocity = (heightDiff / daysDiff) * 30;
    }
  }

  return calculateGrowthProjection(
    profile.currentHeight,
    profile.age,
    profile.gender,
    profile.fatherHeight,
    profile.motherHeight,
    velocity
  );
};
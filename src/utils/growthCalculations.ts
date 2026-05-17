import { malePercentiles, femalePercentiles } from '../data/whoPercentiles';

export interface GrowthProjection {
  midParentalHeight: number | null;
  projectedMinHeight: number;
  projectedMaxHeight: number;
  projectedHeight: number;
  growthRemaining: number;
  percentComplete: number;
  growthPotential: 'low' | 'moderate' | 'high';
}

export const calculateMidParentalHeight = (
  fatherHeight: number | null,
  motherHeight: number | null,
  gender: 'male' | 'female'
): number | null => {
  if (!fatherHeight || !motherHeight) return null;
  if (gender === 'male') {
    return (fatherHeight + motherHeight + 13) / 2;
  } else {
    return (fatherHeight + motherHeight - 13) / 2;
  }
};

export const getAdultHeightAtPercentile = (
  gender: 'male' | 'female',
  percentile: 'p5' | 'p25' | 'p50' | 'p75' | 'p95'
): number => {
  const data = gender === 'male' ? malePercentiles : femalePercentiles;
  const adult = data[data.length - 1]; // age 20
  return adult[percentile];
};

export const calculateGrowthProjection = (
  currentHeight: number,
  age: number,
  gender: 'male' | 'female',
  fatherHeight: number | null,
  motherHeight: number | null,
  growthVelocity: number // cm per month
): GrowthProjection => {
  const maxGrowthAge = gender === 'male' ? 21 : 18;
  const yearsRemaining = Math.max(0, maxGrowthAge - age);
  const monthsRemaining = yearsRemaining * 12;

  const midParentalHeight = calculateMidParentalHeight(
    fatherHeight,
    motherHeight,
    gender
  );

  // Estimate projected height based on velocity + remaining time
  const velocityBased = currentHeight + growthVelocity * Math.min(monthsRemaining, 24);

  // Blend mid-parental and velocity-based
  let projectedHeight: number;
  if (midParentalHeight) {
    projectedHeight = (velocityBased * 0.4 + midParentalHeight * 0.6);
  } else {
    projectedHeight = velocityBased;
  }

  const projectedMinHeight = projectedHeight - 8.5;
  const projectedMaxHeight = projectedHeight + 8.5;

  const adultHeight = getAdultHeightAtPercentile(gender, 'p50');
  const growthRemaining = Math.max(0, projectedHeight - currentHeight);

  const percentComplete = Math.min(
    100,
    Math.round((currentHeight / projectedMaxHeight) * 100)
  );

  const growthPotential: 'low' | 'moderate' | 'high' =
    growthRemaining < 2 ? 'low' :
    growthRemaining < 8 ? 'moderate' : 'high';

  return {
    midParentalHeight,
    projectedMinHeight: Math.round(projectedMinHeight * 10) / 10,
    projectedMaxHeight: Math.round(projectedMaxHeight * 10) / 10,
    projectedHeight: Math.round(projectedHeight * 10) / 10,
    growthRemaining: Math.round(growthRemaining * 10) / 10,
    percentComplete,
    growthPotential,
  };
};

export const cmToFeetInches = (cm: number): string => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
};

export const feetInchesToCm = (feet: number, inches: number): number => {
  return Math.round((feet * 12 + inches) * 2.54 * 10) / 10;
};

export const formatHeight = (
  cm: number,
  unit: 'cm' | 'ft'
): string => {
  if (unit === 'cm') return `${cm} cm`;
  return cmToFeetInches(cm);
};
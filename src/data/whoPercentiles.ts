// WHO Growth Reference Data (simplified)
// Height in cm, Age in years

export interface PercentileData {
  age: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

export const malePercentiles: PercentileData[] = [
  { age: 10, p5: 129.7, p25: 133.4, p50: 137.5, p75: 141.6, p95: 145.3 },
  { age: 11, p5: 134.2, p25: 138.3, p50: 143.1, p75: 147.8, p95: 152.1 },
  { age: 12, p5: 138.5, p25: 143.5, p50: 149.1, p75: 154.5, p95: 159.5 },
  { age: 13, p5: 143.0, p25: 149.8, p50: 156.4, p75: 162.3, p95: 168.0 },
  { age: 14, p5: 149.3, p25: 156.2, p50: 163.8, p75: 170.0, p95: 175.8 },
  { age: 15, p5: 155.3, p25: 162.2, p50: 169.0, p75: 175.2, p95: 181.2 },
  { age: 16, p5: 159.4, p25: 165.7, p50: 173.0, p75: 178.8, p95: 184.4 },
  { age: 17, p5: 161.8, p25: 167.8, p50: 175.2, p75: 181.6, p95: 186.6 },
  { age: 18, p5: 163.2, p25: 168.8, p50: 176.0, p75: 182.5, p95: 187.6 },
  { age: 19, p5: 163.7, p25: 169.4, p50: 176.5, p75: 183.0, p95: 188.0 },
  { age: 20, p5: 163.9, p25: 169.6, p50: 176.8, p75: 183.3, p95: 188.3 },
];

export const femalePercentiles: PercentileData[] = [
  { age: 10, p5: 129.3, p25: 133.0, p50: 138.6, p75: 143.0, p95: 148.0 },
  { age: 11, p5: 134.7, p25: 139.4, p50: 144.8, p75: 149.5, p95: 154.5 },
  { age: 12, p5: 139.8, p25: 144.8, p50: 150.0, p75: 154.8, p95: 160.0 },
  { age: 13, p5: 143.5, p25: 148.3, p50: 153.5, p75: 158.0, p95: 162.8 },
  { age: 14, p5: 146.0, p25: 150.8, p50: 156.0, p75: 160.3, p95: 164.8 },
  { age: 15, p5: 147.5, p25: 152.3, p50: 157.5, p75: 161.5, p95: 166.0 },
  { age: 16, p5: 148.3, p25: 153.0, p50: 158.3, p75: 162.3, p95: 166.7 },
  { age: 17, p5: 148.6, p25: 153.3, p50: 158.6, p75: 162.6, p95: 167.0 },
  { age: 18, p5: 148.8, p25: 153.5, p50: 158.8, p75: 162.8, p95: 167.2 },
  { age: 19, p5: 148.9, p25: 153.6, p50: 158.9, p75: 162.9, p95: 167.3 },
  { age: 20, p5: 149.0, p25: 153.7, p50: 159.0, p75: 163.0, p95: 167.4 },
];

export const getPercentileForHeight = (
  height: number,
  age: number,
  gender: 'male' | 'female'
): number => {
  const data = gender === 'male' ? malePercentiles : femalePercentiles;
  const ageData = data.find((d) => d.age === Math.round(age));
  if (!ageData) return 50;

  if (height <= ageData.p5) return 5;
  if (height <= ageData.p25) {
    const ratio = (height - ageData.p5) / (ageData.p25 - ageData.p5);
    return Math.round(5 + ratio * 20);
  }
  if (height <= ageData.p50) {
    const ratio = (height - ageData.p25) / (ageData.p50 - ageData.p25);
    return Math.round(25 + ratio * 25);
  }
  if (height <= ageData.p75) {
    const ratio = (height - ageData.p50) / (ageData.p75 - ageData.p50);
    return Math.round(50 + ratio * 25);
  }
  if (height <= ageData.p95) {
    const ratio = (height - ageData.p75) / (ageData.p95 - ageData.p75);
    return Math.round(75 + ratio * 20);
  }
  return 95;
};
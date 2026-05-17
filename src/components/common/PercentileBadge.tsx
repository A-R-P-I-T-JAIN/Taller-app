import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { getPercentileForHeight } from '../../data/whoPercentiles';

interface PercentileBadgeProps {
  height: number;
  age: number;
  gender: 'male' | 'female';
  size?: 'sm' | 'md' | 'lg';
}

export default function PercentileBadge({
  height,
  age,
  gender,
  size = 'md',
}: PercentileBadgeProps) {
  const percentile = getPercentileForHeight(height, age, gender);

  const getColor = () => {
    if (percentile >= 75) return colors.success;
    if (percentile >= 50) return colors.primary;
    if (percentile >= 25) return colors.warning;
    return colors.accent;
  };

  const getLabel = () => {
    if (percentile >= 90) return 'Very Tall';
    if (percentile >= 75) return 'Tall';
    if (percentile >= 50) return 'Above Average';
    if (percentile >= 25) return 'Average';
    if (percentile >= 10) return 'Below Average';
    return 'Short';
  };

  const color = getColor();

  const sizes = {
    sm: { number: 18, label: 10, padding: 8 },
    md: { number: 24, label: 12, padding: 12 },
    lg: { number: 32, label: 14, padding: 16 },
  };

  const s = sizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color + '15',
          borderColor: color + '30',
          padding: s.padding,
        },
      ]}
    >
      <Text style={[styles.percentileNumber, { fontSize: s.number, color }]}>
        {percentile}
        <Text style={[styles.percentileSuffix, { fontSize: s.number * 0.5 }]}>
          th
        </Text>
      </Text>
      <Text style={[styles.percentileLabel, { fontSize: s.label, color }]}>
        {getLabel()}
      </Text>
      <Text style={[styles.percentileSub, { fontSize: s.label - 2 }]}>
        WHO Percentile
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 2,
  },
  percentileNumber: {
    fontWeight: '800',
    lineHeight: 36,
  },
  percentileSuffix: {
    fontWeight: '600',
  },
  percentileLabel: {
    fontWeight: '700',
  },
  percentileSub: {
    color: '#94A3B8',
    fontWeight: '500',
  },
});
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadow, spacing } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  variant?: 'default' | 'elevated' | 'outlined' | 'colored';
  color?: string;
}

export default function Card({
  children,
  style,
  padding = spacing.base,
  variant = 'default',
  color,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding },
        color && { backgroundColor: color },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  default: {
    ...shadow.md,
  },
  elevated: {
    ...shadow.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  colored: {
    ...shadow.md,
  },
});
import { StyleSheet } from 'react-native';

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
};

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const typography = StyleSheet.create({
  h1: {
    fontSize: fontSize['4xl'],
    fontFamily: fontFamily.extraBold,
    lineHeight: fontSize['4xl'] * 1.2,
    color: '#1A1B2E',
  },
  h2: {
    fontSize: fontSize['3xl'],
    fontFamily: fontFamily.bold,
    lineHeight: fontSize['3xl'] * 1.2,
    color: '#1A1B2E',
  },
  h3: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.bold,
    lineHeight: fontSize['2xl'] * 1.3,
    color: '#1A1B2E',
  },
  h4: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.semiBold,
    lineHeight: fontSize.xl * 1.3,
    color: '#1A1B2E',
  },
  h5: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.semiBold,
    lineHeight: fontSize.lg * 1.4,
    color: '#1A1B2E',
  },
  bodyLarge: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.md * 1.5,
    color: '#1A1B2E',
  },
  body: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.base * 1.5,
    color: '#1A1B2E',
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.sm * 1.5,
    color: '#64748B',
  },
  caption: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.xs * 1.5,
    color: '#94A3B8',
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semiBold,
    lineHeight: fontSize.sm * 1.4,
    color: '#1A1B2E',
  },
  number: {
    fontSize: fontSize['5xl'],
    fontFamily: fontFamily.extraBold,
    color: '#1A1B2E',
  },
});
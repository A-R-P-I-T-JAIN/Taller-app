export const colors = {
  // Primary
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#5048E5',
  primaryBg: '#F0EFFF',

  // Secondary
  secondary: '#00D4AA',
  secondaryLight: '#33DDBB',
  secondaryDark: '#00B894',
  secondaryBg: '#E6FAF7',

  // Accent
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',
  accentDark: '#FF4848',
  accentBg: '#FFF0F0',

  // Neutral
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',

  // Text
  textPrimary: '#1A1B2E',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // Status
  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  info: '#3B82F6',
  infoBg: '#EFF6FF',

  // Chart colors
  chart1: '#6C63FF',
  chart2: '#00D4AA',
  chart3: '#FF6B6B',
  chart4: '#F59E0B',
  chart5: '#3B82F6',

  // Border
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',

  // Gradients (used as array)
  gradientPrimary: ['#6C63FF', '#8B85FF'],
  gradientSecondary: ['#00D4AA', '#33DDBB'],
  gradientAccent: ['#FF6B6B', '#FF8E8E'],
  gradientDark: ['#1A1B2E', '#2D2E4E'],
};

export type ColorKeys = keyof typeof colors;
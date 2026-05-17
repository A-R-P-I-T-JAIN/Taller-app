import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Expo: import { Ionicons } from '@expo/vector-icons';

import { ExerciseStackParamList } from '../../navigation/types';
import { getExerciseById, categoryInfo, ExerciseCategory } from '../../data/exercises';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

type RouteType = RouteProp<ExerciseStackParamList, 'ExerciseDetail'>;

const categoryIcons: Record<ExerciseCategory, string> = {
  spinal: 'body-outline',
  hanging: 'move-outline',
  posture: 'accessibility-outline',
  yoga: 'leaf-outline',
  strength: 'barbell-outline',
};

const categoryColors: Record<ExerciseCategory, string> = {
  spinal: colors.primary,
  hanging: colors.secondary,
  posture: colors.accent,
  yoga: colors.warning,
  strength: colors.info,
};

const stats = (exercise: ReturnType<typeof getExerciseById>) => [
  { value: `${exercise!.duration}s`, label: 'Duration' },
  { value: exercise!.sets ? `${exercise!.sets}` : '—', label: 'Sets' },
  { value: exercise!.reps ? `${exercise!.reps}` : '—', label: 'Reps' },
  { value: `${exercise!.caloriesBurn}`, label: 'Calories' },
];

export default function ExerciseDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const exercise = getExerciseById(route.params.exerciseId);

  if (!exercise) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notFound}>Exercise not found</Text>
      </View>
    );
  }

  const catInfo = categoryInfo[exercise.category];
  const catColor = categoryColors[exercise.category];
  const catIcon = categoryIcons[exercise.category];

  const difficultyColor =
    exercise.difficulty === 'beginner'
      ? colors.success
      : exercise.difficulty === 'intermediate'
      ? colors.warning
      : colors.accent;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View
            style={[
              styles.categoryIconWrap,
              { backgroundColor: catColor + '14' },
            ]}
          >
            <Ionicons name={catIcon} size={20} color={catColor} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            (navigation as any).navigate('WorkoutSession', {
              exerciseIds: [exercise.id],
            })
          }
          activeOpacity={0.7}
        >
          <Ionicons name="play" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title block */}
        <View style={styles.titleBlock}>
          <View style={styles.badgesRow}>
            <View
              style={[
                styles.pill,
                { backgroundColor: catColor + '12' },
              ]}
            >
              <Ionicons name={catIcon} size={11} color={catColor} />
              <Text style={[styles.pillText, { color: catColor }]}>
                {catInfo.label}
              </Text>
            </View>

            <View
              style={[
                styles.pill,
                { backgroundColor: difficultyColor + '12' },
              ]}
            >
              <Text
                style={[styles.pillText, { color: difficultyColor }]}
              >
                {exercise.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.description}>{exercise.description}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats(exercise).map((s, i) => (
            <View key={i} style={styles.statChip}>
              <Text style={[styles.statValue, { color: catColor }]}>
                {s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.card}>
            {exercise.benefits.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <View
                  style={[
                    styles.benefitAccent,
                    { backgroundColor: catColor },
                  ]}
                />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to do it</Text>
          <View style={styles.card}>
            {exercise.instructions.map((inst, i) => (
              <View key={i} style={styles.instructionRow}>
                <View
                  style={[
                    styles.stepNum,
                    { backgroundColor: catColor + '14' },
                  ]}
                >
                  <Text style={[styles.stepNumText, { color: catColor }]}>
                    {i + 1}
                  </Text>
                </View>
                <Text style={styles.instructionText}>{inst}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Start CTA */}
        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: catColor }]}
          onPress={() =>
            (navigation as any).navigate('WorkoutSession', {
              exerciseIds: [exercise.id],
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.startBtnInner}>
            <Ionicons name="play" size={18} color="#FFFFFF" />
            <Text style={styles.startBtnText}>Start Exercise</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="rgba(255,255,255,0.8)"
          />
        </TouchableOpacity>

        <View style={{ height: insets.bottom + spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    fontSize: 16,
    color: colors.textTertiary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    padding: spacing.base,
    gap: spacing.lg,
  },

  // Title
  titleBlock: {
    gap: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Sections
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Benefits
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitAccent: {
    width: 3,
    height: '100%',
    minHeight: 18,
    borderRadius: 2,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    fontWeight: '500',
  },

  // Instructions
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 21,
    fontWeight: '400',
  },

  // CTA
  startBtn: {
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
    marginBottom: spacing.xl,
  },
  startBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
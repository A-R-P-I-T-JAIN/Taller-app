import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Expo: import { Ionicons } from '@expo/vector-icons';

import { ExerciseStackParamList } from '../../navigation/types';
import { useExerciseStore } from '../../store/useExerciseStore';
import {
  getDailyRoutine,
  dailyRoutineIds,
  exercises,
  categoryInfo,
  ExerciseCategory,
} from '../../data/exercises';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import ExerciseCard from '../../components/exercise/ExerciseCard';
import StreakCalendar from '../../components/charts/StreakCalendar';
import { BOTTOM_PADDING } from '../../utils/layout';

type Nav = NativeStackNavigationProp<ExerciseStackParamList, 'ExerciseHome'>;

function StatBlock({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <View style={statStyles.block}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
});

const categoryMeta: Record<
  ExerciseCategory,
  { icon: string; color: string }
> = {
  spinal: {
    icon: 'body-outline',
    color: colors.primary,
  },
  hanging: {
    icon: 'move-outline',
    color: colors.secondary,
  },
  posture: {
    icon: 'accessibility-outline',
    color: colors.accent,
  },
  yoga: {
    icon: 'leaf-outline',
    color: colors.warning,
  },
  strength: {
    icon: 'barbell-outline',
    color: colors.info,
  },
};

export default function ExerciseScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const {
    completedWorkouts,
    currentStreak,
    longestStreak,
    isCompletedToday,
    getStreakDates,
    getThisWeekWorkouts,
  } = useExerciseStore();

  const [refreshing, setRefreshing] = useState(false);

  const dailyRoutine = getDailyRoutine();
  const todayDone = isCompletedToday();
  const streakDates = getStreakDates();
  const weekWorkouts = getThisWeekWorkouts();

  const totalMinutes = completedWorkouts.reduce(
    (sum, w) => sum + Math.floor(w.duration / 60),
    0
  );

  const routineMinutes = Math.round(
    dailyRoutine.reduce((sum, e) => sum + e.duration, 0) / 60
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const categories = Object.entries(categoryInfo) as [
    ExerciseCategory,
    (typeof categoryInfo)[ExerciseCategory]
  ][];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Exercise</Text>
          <Text style={styles.headerSub}>
            {todayDone ? 'Completed today' : 'Ready for today'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ExerciseLibrary')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="library-outline"
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <View
            style={[
              styles.statusPill,
              todayDone ? styles.statusPillDone : styles.statusPillPending,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: todayDone ? colors.success : colors.primary },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: todayDone ? colors.success : colors.primary },
              ]}
            >
              {todayDone ? 'Workout completed' : 'Workout pending'}
            </Text>
          </View>

          <Text style={styles.heroTitle}>Today&apos;s routine</Text>
          <Text style={styles.heroMeta}>
            {dailyRoutine.length} exercises • {routineMinutes} min
          </Text>

          {!todayDone ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate('WorkoutSession', {
                  exerciseIds: dailyRoutineIds,
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.primaryButtonLeft}>
                <Ionicons name="play" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Start workout</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255,255,255,0.9)"
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.completedCard}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.completedTitle}>Done for today</Text>
                <Text style={styles.completedSub}>
                  Nice work. Your next routine will be ready tomorrow.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <StatBlock value={currentStreak} label="Current streak" />
          <View style={styles.statsDivider} />
          <StatBlock value={longestStreak} label="Best streak" />
          <View style={styles.statsDivider} />
          <StatBlock value={weekWorkouts.length} label="This week" />
          <View style={styles.statsDivider} />
          <StatBlock value={`${totalMinutes}m`} label="Total time" />
        </View>

        {/* Routine preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Routine</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ExerciseLibrary')}
            >
              <Text style={styles.sectionAction}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            {dailyRoutine.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                compact
                index={index}
                onPress={() =>
                  navigation.navigate('ExerciseDetail', {
                    exerciseId: exercise.id,
                  })
                }
              />
            ))}
          </View>
        </View>

        {/* Streak calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consistency</Text>
          <View style={styles.card}>
            <StreakCalendar completedDates={streakDates} days={35} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>

          <View style={styles.categoryGrid}>
            {categories.map(([key, info]) => {
              const count = exercises.filter((e) => e.category === key).length;
              const meta = categoryMeta[key];

              return (
                <TouchableOpacity
                  key={key}
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('ExerciseLibrary')}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.categoryIconWrap,
                      { backgroundColor: meta.color + '14' },
                    ]}
                  >
                    <Ionicons
                      name={meta.icon}
                      size={18}
                      color={meta.color}
                    />
                  </View>

                  <Text style={styles.categoryName}>{info.label}</Text>
                  <Text style={styles.categoryCount}>{count} exercises</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why this routine works</Text>
          <Text style={styles.infoText}>
            These exercises are designed to support posture, mobility,
            decompression, and strength. Together they help improve alignment
            and reduce spinal compression, which can make your posture and
            height potential more consistent over time.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    padding: spacing.base,
    paddingBottom: BOTTOM_PADDING + spacing.xl,
    gap: spacing.lg,
  },

  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillDone: {
    backgroundColor: colors.successBg,
  },
  statusPillPending: {
    backgroundColor: colors.primaryBg,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  heroMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  primaryButton: {
    marginTop: 4,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  completedCard: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.successBg,
    borderRadius: 16,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.success + '25',
  },
  completedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  completedSub: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: colors.success,
    opacity: 0.85,
  },

  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statsDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },

  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  listCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textTertiary,
  },
});
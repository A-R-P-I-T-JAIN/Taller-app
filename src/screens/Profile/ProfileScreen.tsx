import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../store/useUserStore';
import { useGrowthStore } from '../../store/useGrowthStore';
import { useExerciseStore } from '../../store/useExerciseStore';
import { useSleepStore } from '../../store/useSleepStore';
import { useNutritionStore } from '../../store/useNutritionStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import { formatHeight } from '../../utils/growthCalculations';
import { BOTTOM_PADDING } from '../../utils/layout';
import Header from '../../components/common/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

// ─── Info Row ─────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  emoji,
  isLast = false,
}: {
  label: string;
  value: string;
  emoji: string;
  isLast?: boolean;
}) {
  return (
    <View
      style={[
        rowStyles.container,
        isLast && { borderBottomWidth: 0 },
      ]}
    >
      <Text style={rowStyles.emoji}>{emoji}</Text>
      <View style={rowStyles.content}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  emoji: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  content: { flex: 1 },
  label: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
});

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <View
      style={[statStyles.card, { borderColor: color + '25' }]}
    >
      <Text style={statStyles.emoji}>{emoji}</Text>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    ...shadow.sm,
  },
  emoji: { fontSize: 24 },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// ─── Main Screen ──────────────────────────────────────────────
export default function ProfileScreen() {
  const navigation = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();

  // Stores
  const { profile, clearProfile } = useUserStore();
  const { entries, clearEntries } = useGrowthStore();
  const {
    completedWorkouts,
    currentStreak,
    clearWorkouts,
  } = useExerciseStore();
  const { entries: sleepEntries, clearEntries: clearSleep } =
    useSleepStore();
  const { logs, clearLogs } = useNutritionStore();

  // ─── Reset Handler ──────────────────────────────────────────
  const handleReset = () => {
    Alert.alert(
      '🗑️ Reset All Data',
      'This will permanently delete ALL your data:\n\n• Profile & settings\n• Height measurements\n• Workout history\n• Sleep logs\n• Nutrition logs\n\nThis cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear ALL stores in parallel
              await Promise.all([
                clearProfile(),
                clearEntries(),
                clearWorkouts(),
                clearSleep(),
                clearLogs(),
              ]);

              // Navigate back to onboarding
              navigation.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to reset data. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  if (!profile) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top , paddingBottom: insets.bottom }]}>
      <Header title="Profile" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: BOTTOM_PADDING },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.gender === 'male' ? <Ionicons name="man-outline" size={48} /> : <Ionicons name="woman-outline" size={48} />}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.sub}>
            {profile.age} years old ·{' '}
            {profile.gender.charAt(0).toUpperCase() +
              profile.gender.slice(1)}
          </Text>
        </View>

        {/* Personal info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.card}>
            <InfoRow
              emoji="📏"
              label="Current Height"
              value={formatHeight(
                profile.currentHeight,
                profile.heightUnit
              )}
            />
            <InfoRow
              emoji="⚖️"
              label="Weight"
              value={`${profile.currentWeight} kg`}
            />
            <InfoRow
              emoji="🎂"
              label="Age"
              value={`${profile.age} years`}
            />
            <InfoRow
              emoji="⚤"
              label="Gender"
              value={
                profile.gender.charAt(0).toUpperCase() +
                profile.gender.slice(1)
              }
            />
            {profile.fatherHeight && (
              <InfoRow
                emoji="👨"
                label="Father's Height"
                value={`${profile.fatherHeight} cm`}
              />
            )}
            {profile.motherHeight ? (
              <InfoRow
                emoji="👩"
                label="Mother's Height"
                value={`${profile.motherHeight} cm`}
                isLast
              />
            ) : (
              <InfoRow
                emoji="📅"
                label="Member Since"
                value={new Date(profile.createdAt).toLocaleDateString(
                  'en-US',
                  { month: 'long', year: 'numeric' }
                )}
                isLast
              />
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            <StatCard
              emoji="📏"
              value={entries.length}
              label="Measurements"
              color={colors.primary}
            />
            <StatCard
              emoji="💪"
              value={completedWorkouts.length}
              label="Workouts"
              color={colors.secondary}
            />
            <StatCard
              emoji="😴"
              value={sleepEntries.length}
              label="Sleep Logs"
              color="#8B5CF6"
            />
            <StatCard
              emoji="🔥"
              value={currentStreak}
              label="Day Streak"
              color={colors.accent}
            />
          </View>
        </View>

        {/* App info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.card}>
            <InfoRow
              emoji="📱"
              label="Version"
              value="Taller v1.0.0"
            />
            <InfoRow
              emoji="🔒"
              label="Data Storage"
              value="On-device only"
            />
            <InfoRow
              emoji="📅"
              label="Member Since"
              value={new Date(profile.createdAt).toLocaleDateString(
                'en-US',
                { month: 'long', year: 'numeric' }
              )}
              isLast
            />
          </View>
        </View>

        {/* Data summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Summary</Text>
          <View style={styles.dataSummaryCard}>
            {[
              {
                label: 'Height entries',
                value: entries.length,
                emoji: '📏',
              },
              {
                label: 'Workout sessions',
                value: completedWorkouts.length,
                emoji: '🏋️',
              },
              {
                label: 'Sleep records',
                value: sleepEntries.length,
                emoji: '😴',
              },
              {
                label: 'Nutrition logs',
                value: logs.length,
                emoji: '🥗',
              },
            ].map((item, i) => (
              <View
                key={i}
                style={[
                  styles.dataRow,
                  i === 3 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.dataEmoji}>{item.emoji}</Text>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.dangerSection}>
          <View style={styles.dangerHeader}>
            <Text style={styles.dangerTitle}>⚠️ Danger Zone</Text>
            <Text style={styles.dangerSub}>
              Irreversible actions
            </Text>
          </View>

          <View style={styles.dangerCard}>
            <View style={styles.dangerInfo}>
              <Text style={styles.dangerInfoTitle}>
                Reset All Data
              </Text>
              <Text style={styles.dangerInfoText}>
                Permanently deletes your profile, all measurements,
                workouts, sleep logs, and nutrition data.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.resetBtnText}>
                🗑️ Reset Everything
              </Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: spacing.base,
    gap: spacing.base,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary + '30',
  },
  avatarText: { fontSize: 56 },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: { gap: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    ...shadow.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dataSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    ...shadow.sm,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  dataEmoji: { fontSize: 18 },
  dataLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dangerSection: { gap: 10 },
  dangerHeader: { gap: 2 },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.error,
  },
  dangerSub: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  dangerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.error + '30',
    ...shadow.sm,
  },
  dangerInfo: { gap: 4 },
  dangerInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dangerInfoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  resetBtn: {
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.error + '50',
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.error,
  },
});
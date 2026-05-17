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

import { SleepStackParamList } from '../../navigation/types';
import { useSleepStore } from '../../store/useSleepStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { format, subDays, isToday } from 'date-fns';
import SleepChart from '../../components/charts/SleepChart';
import { BOTTOM_PADDING } from '../../utils/layout';

type Nav = NativeStackNavigationProp<SleepStackParamList>;

function StatBlock({
  value,
  label,
}: {
  value: string;
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
    fontSize: 19,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

export default function SleepScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const {
    entries,
    getAverageSleep,
    getAverageQuality,
    getLastNightSleep,
    getWeeklyData,
  } = useSleepStore();

  const [refreshing, setRefreshing] = useState(false);
  const lastNight = getLastNightSleep();
  const avgSleep = getAverageSleep();
  const avgQuality = getAverageQuality();
  const weekly = getWeeklyData();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const formatHours = (minutes: number) =>
    `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  const qualityIcon = avgQuality >= 4.5
    ? 'happy'
    : avgQuality >= 3.5
    ? 'smiley'
    : avgQuality >= 2.5
    ? 'neutral'
    : 'mood-very-sad';

  const hasEntries = entries.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sleep</Text>
          <Text style={styles.headerSub}>
            {entries.length} night{entries.length !== 1 ? 's' : ''} tracked
          </Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('SleepTips')}
          activeOpacity={0.7}
        >
          <Ionicons name="bulb-outline" size={20} color={colors.textPrimary} />
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
        {/* Last Night Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Last Night</Text>
            {!hasEntries && (
              <TouchableOpacity
                onPress={() => navigation.navigate('LogSleep')}
              >
                <Text style={styles.sectionAction}>Log now</Text>
              </TouchableOpacity>
            )}
          </View>

          {lastNight ? (
            <View style={styles.lastNightCard}>
              <View style={styles.cardTop}>
                <Text style={styles.lastNightDate}>
                  {format(new Date(lastNight.date), 'EEEE, MMM d')}
                </Text>
                <View style={styles.qualityBadge}>
                  {/* <Ionicons
                    name={qualityIcon as any}
                    size={14}
                    color={avgQuality >= 3.5 ? colors.success : colors.warning}
                  /> */}
                  <Text
                    style={[
                      styles.qualityText,
                      { color: avgQuality >= 3.5 ? colors.success : colors.warning },
                    ]}
                  >
                  {avgQuality.toFixed(1)}/5
                  </Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <StatBlock
                  value={formatHours(lastNight.duration)}
                  label="Duration"
                />
                <View style={styles.divider} />
                <StatBlock
                  value={format(new Date(lastNight.bedTime), 'h:mm a')}
                  label="Bed time"
                />
                <View style={styles.divider} />
                <StatBlock
                  value={format(new Date(lastNight.wakeTime), 'h:mm a')}
                  label="Wake time"
                />
              </View>

              {lastNight.note && (
                <View style={styles.noteRow}>
                  <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.noteText}>{lastNight.note}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="moon-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No sleep logged yet</Text>
              <Text style={styles.emptyText}>
                Tap "Log Sleep" to record last night's rest
              </Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsCard}>
          <StatBlock
            value={avgSleep > 0 ? formatHours(avgSleep) : '—'}
            label="Avg sleep"
          />
          <View style={styles.divider} />
          <StatBlock
            value={avgQuality > 0 ? avgQuality.toFixed(1) : '—'}
            label="Avg quality"
          />
          <View style={styles.divider} />
          <StatBlock
            value={entries.length.toString()}
            label="Nights"
          />
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
          </View>
          <View style={styles.chartCard}>
            <SleepChart entries={weekly} />
          </View>
        </View>

        {/* Log Button */}
        <TouchableOpacity
          style={[styles.logBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('LogSleep')}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.logBtnText}>Log Sleep</Text>
        </TouchableOpacity>

        {/* Recent Entries */}
        {hasEntries && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SleepHistory')}>
                <Text style={styles.sectionAction}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.entriesCard}>
              {[...entries].reverse().slice(0, 5).map((entry, index) => (
                <View
                  key={entry.id}
                  style={[
                    styles.entryRow,
                    index < 4 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
                  ]}
                >
                  <View style={styles.entryLeft}>
                    <Text style={styles.entryDate}>
                      {format(new Date(entry.date), 'MMM d')}
                    </Text>
                    <Text style={styles.entryDuration}>
                      {formatHours(entry.duration)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.qualityPill,
                      entry.quality >= 3.5 ? styles.qualityPillGood : styles.qualityPillNeutral,
                    ]}
                  >
                    <Text
                      style={[
                        styles.qualityPillText,
                        { color: entry.quality >= 3.5 ? colors.success : colors.textSecondary },
                      ]}
                    >
                      {entry.quality}/5
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why sleep matters</Text>
          <Text style={styles.infoText}>
            During deep sleep (especially between 10 PM - 2 AM), your body
            releases most of its daily growth hormone. Quality sleep supports
            growth, recovery, and overall health.
          </Text>
        </View>

        <View style={{ height: insets.bottom + BOTTOM_PADDING }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
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
    gap: spacing.lg,
  },

  // Sections
  section: {
    gap: 10,
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

  // Last Night
  lastNightCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.base,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastNightDate: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceSecondary,
  },
  qualityText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: spacing.sm,
    backgroundColor: colors.primaryBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
  },

  // Empty State
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl * 2,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Chart
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Log Button
  logBtn: {
    height: 52,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
  logBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Entries
  entriesCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  entryLeft: {
    gap: 4,
  },
  entryDate: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  entryDuration: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  qualityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  qualityPillGood: {
    backgroundColor: colors.successBg,
  },
  qualityPillNeutral: {
    backgroundColor: colors.surfaceSecondary,
  },
  qualityPillText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Info Card
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
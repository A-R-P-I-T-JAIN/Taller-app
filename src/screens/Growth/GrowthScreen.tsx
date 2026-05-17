import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Expo: import { Ionicons } from '@expo/vector-icons';

import { GrowthStackParamList } from '../../navigation/types';
import { useGrowthStore } from '../../store/useGrowthStore';
import { useUserStore } from '../../store/useUserStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  formatHeight,
  cmToFeetInches,
} from '../../utils/growthCalculations';
import { formatDate } from '../../utils/dateHelpers';
import GrowthChart from '../../components/charts/GrowthChart';
import PercentileBadge from '../../components/common/PercentileBadge';
import { BOTTOM_PADDING } from '../../utils/layout';

type Nav = NativeStackNavigationProp<GrowthStackParamList, 'GrowthHome'>;

// Entry row component
function EntryRow({
  entry,
  onDelete,
  unit,
  isLatest,
}: {
  entry: any;
  onDelete: (id: string) => void;
  unit: 'cm' | 'ft';
  isLatest: boolean;
}) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      `Remove the ${entry.height} cm measurement?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(entry.id),
        },
      ]
    );
  };

  return (
    <View style={entryStyles.container}>
      <View style={entryStyles.left}>
        <View style={[entryStyles.indicator, isLatest && entryStyles.indicatorActive]} />
        <View>
          <Text style={[entryStyles.height, isLatest && entryStyles.heightActive]}>
            {formatHeight(entry.height, unit)}
          </Text>
          <Text style={entryStyles.date}>
            {isLatest ? 'Today • ' : ''}{formatDate(entry.date)}
          </Text>
          {entry.note && (
            <Text style={entryStyles.note}>{entry.note}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        onPress={handleDelete}
        style={entryStyles.deleteBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const entryStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  height: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  heightActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
    fontWeight: '400',
  },
  note: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  deleteBtn: {
    padding: 8,
    opacity: 0.6,
  },
});

// ─── Main Screen ──────────────────────────────────────────────
export default function GrowthScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const profile = useUserStore((s) => s.profile);
  const {
    entries,
    removeEntry,
    getLatestHeight,
    getGrowthVelocity,
    getTotalGrowth,
  } = useGrowthStore();

  const [refreshing, setRefreshing] = useState(false);

  const latestHeight = getLatestHeight() || profile?.currentHeight || 0;
  const velocity = getGrowthVelocity();
  const totalGrowth = getTotalGrowth();
  const unit = profile?.heightUnit || 'cm';
  const gender = profile?.gender || 'male';
  const age = profile?.age || 16;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const hasEntries = entries.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Growth</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('GrowthProjection')}
          activeOpacity={0.7}
        >
          <Ionicons name="trending-up-outline" size={22} color={colors.textPrimary} />
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
        {/* Primary Stat - Big Typography */}
        <View style={styles.hero}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
          <Text style={styles.heroValue}>{formatHeight(latestHeight, unit)}</Text>
          <PercentileBadge
            height={latestHeight}
            age={age}
            gender={gender}
            size="sm"
          />
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroLabel}>Current Height</Text>
            {unit === 'cm' && (
              <Text style={styles.heroAlt}>{cmToFeetInches(latestHeight)}</Text>
            )}
          </View>
          
        </View>

        {/* Clean Stats Row */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {velocity > 0 ? `+${velocity.toFixed(1)}` : '0'}
            </Text>
            <Text style={styles.statUnit}>cm/mo</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {totalGrowth > 0 ? `+${totalGrowth.toFixed(1)}` : '—'}
            </Text>
            <Text style={styles.statUnit}>cm total</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statUnit}>entries</Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress</Text>
          </View>
          <View style={styles.chartCard}>
            <GrowthChart
              entries={entries}
              gender={gender}
              age={age}
              heightUnit={unit}
            />
          </View>
        </View>

        {/* Add Button - Minimal */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMeasurement')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Log Measurement</Text>
        </TouchableOpacity>

        {/* History */}
        {hasEntries && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <View style={styles.historyCard}>
              {[...entries].reverse().slice(0, 5).map((entry, index) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onDelete={removeEntry}
                  unit={unit}
                  isLatest={index === 0}
                />
              ))}
              {entries.length > 5 && (
                <TouchableOpacity style={styles.viewAllBtn}>
                  <Text style={styles.viewAllText}>
                    View all {entries.length} entries
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Empty State */}
        {!hasEntries && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No measurements yet</Text>
            <Text style={styles.emptyText}>
              Start tracking your growth by adding your first measurement.
            </Text>
          </View>
        )}

        {/* Tips - Minimal */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for accuracy</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>Measure at the same time each morning</Text>
            <Text style={styles.tipItem}>Stand straight with heels against the wall</Text>
            <Text style={styles.tipItem}>Log weekly for best tracking results</Text>
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: BOTTOM_PADDING + spacing.xl,
    gap: spacing.lg,
  },
  // Hero Section
  hero: {
    gap: 8,
  },
  heroValue: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 56,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  heroAlt: {
    fontSize: 15,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  // Stats
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderLight,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'lowercase',
  },
  // Sections
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
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.lg,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // History
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Tips
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: colors.textTertiary,
    lineHeight: 20,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
});
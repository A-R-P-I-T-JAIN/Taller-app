import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Expo: import { Ionicons } from '@expo/vector-icons';

import { ExerciseStackParamList } from '../../navigation/types';
import {
  exercises,
  ExerciseCategory,
  categoryInfo,
} from '../../data/exercises';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import ExerciseCard from '../../components/exercise/ExerciseCard';
import Header from '../../components/common/Header';

type Nav = NativeStackNavigationProp<ExerciseStackParamList>;

const ALL = 'all';
type FilterType = ExerciseCategory | typeof ALL;

const categoryMeta: Record<
  FilterType,
  { icon: string; color: string; label: string }
> = {
  all: {
    icon: 'grid-outline',
    color: colors.textSecondary,
    label: 'All',
  },
  spinal: {
    icon: 'body-outline',
    color: colors.primary,
    label: categoryInfo.spinal.label,
  },
  hanging: {
    icon: 'move-outline',
    color: colors.secondary,
    label: categoryInfo.hanging.label,
  },
  posture: {
    icon: 'accessibility-outline',
    color: colors.accent,
    label: categoryInfo.posture.label,
  },
  yoga: {
    icon: 'leaf-outline',
    color: colors.warning,
    label: categoryInfo.yoga.label,
  },
  strength: {
    icon: 'barbell-outline',
    color: colors.info,
    label: categoryInfo.strength.label,
  },
};

export default function ExerciseLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>(ALL);

  const categories: FilterType[] = [
    ALL,
    'spinal',
    'hanging',
    'posture',
    'yoga',
    'strength',
  ];

  const filtered =
    filter === ALL
      ? exercises
      : exercises.filter((e) => e.category === filter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Exercise Library" showBack />

      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {categories.map((cat) => {
            const isActive = filter === cat;
            const meta = categoryMeta[cat];

            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setFilter(cat)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.filterIconWrap,
                    { backgroundColor: isActive ? meta.color + '16' : colors.background },
                  ]}
                >
                  <Ionicons
                    name={meta.icon}
                    size={15}
                    color={isActive ? meta.color : colors.textTertiary}
                  />
                </View>

                <Text
                  style={[
                    styles.filterChipText,
                    isActive && { color: meta.color },
                  ]}
                >
                  {meta.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultCount}>
          {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
        </Text>

        {filtered.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onPress={() =>
              navigation.navigate('ExerciseDetail', {
                exerciseId: exercise.id,
              })
            }
          />
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptyText}>
              Try selecting a different category.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  filterSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.sm,
  },

  filterRow: {
    paddingHorizontal: spacing.base,
    gap: 10,
  },

  filterChip: {
    height: 42,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  filterChipActive: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  filterIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  list: {
    padding: spacing.base,
    paddingBottom: 100,
    gap: spacing.sm,
  },

  resultCount: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500',
    marginBottom: 4,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
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
  },
});
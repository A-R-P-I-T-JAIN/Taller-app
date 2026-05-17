import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mealSuggestions, nutrientChecklist } from '../../data/nutrition';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import Header from '../../components/common/Header';

type MealTime = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';

const mealMeta: Record<
  MealTime,
  { emoji: string; color: string; label: string }
> = {
  all: {
    emoji: '🍽️',
    color: colors.textSecondary,
    label: 'All',
  },
  breakfast: {
    emoji: '🌅',
    color: colors.warning,
    label: 'Breakfast',
  },
  lunch: {
    emoji: '☀️',
    color: colors.success,
    label: 'Lunch',
  },
  dinner: {
    emoji: '🌙',
    color: colors.primary,
    label: 'Dinner',
  },
  snack: {
    emoji: '🍎',
    color: colors.accent,
    label: 'Snack',
  },
};

export default function MealSuggestionsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<MealTime>('all');

  const mealTimes: MealTime[] = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];

  const filtered =
    filter === 'all'
      ? mealSuggestions
      : mealSuggestions.filter((m) => m.mealTime === filter);

  const getNutrient = (id: string) =>
    nutrientChecklist.find((n) => n.id === id);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Meal Suggestions" showBack />

      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {mealTimes.map((mt) => {
            const isActive = filter === mt;
            const meta = mealMeta[mt];

            return (
              <TouchableOpacity
                key={mt}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilter(mt)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.filterIconWrap,
                    {
                      backgroundColor: isActive
                        ? meta.color + '16'
                        : colors.background,
                    },
                  ]}
                >
                  <Text style={styles.filterEmoji}>{meta.emoji}</Text>
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
          {filtered.length} meal{filtered.length !== 1 ? 's' : ''}
        </Text>

        {filtered.map((meal) => {
          const meta = mealMeta[meal.mealTime as MealTime];

          return (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View
                  style={[
                    styles.mealEmojiWrap,
                    { backgroundColor: meta.color + '12' },
                  ]}
                >
                  <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                </View>

                <View style={styles.mealTitleWrap}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View
                    style={[
                      styles.timeBadge,
                      { backgroundColor: meta.color + '12' },
                    ]}
                  >
                    <Text style={[styles.timeText, { color: meta.color }]}>
                      {meta.label}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.mealDesc}>{meal.description}</Text>

              <View style={styles.nutrientsSection}>
                <Text style={styles.nutrientsLabel}>Nutrients</Text>
                <View style={styles.nutrientChips}>
                  {meal.nutrients.map((nId) => {
                    const nutrient = getNutrient(nId);
                    const nutrientColor = nutrient?.color || colors.primary;

                    return (
                      <View
                        key={nId}
                        style={[
                          styles.nutrientChip,
                          { backgroundColor: nutrientColor + '10' },
                        ]}
                      >
                        {!!nutrient?.emoji && (
                          <Text style={styles.nutrientChipEmoji}>
                            {nutrient.emoji}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.nutrientChipText,
                            { color: nutrientColor },
                          ]}
                        >
                          {nutrient?.name || nId}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No meals found</Text>
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },

  filterIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterEmoji: {
    fontSize: 13,
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

  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.base,
    gap: 12,
  },

  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  mealEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mealEmoji: {
    fontSize: 22,
  },

  mealTitleWrap: {
    flex: 1,
    gap: 6,
  },

  mealName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  timeBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  timeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  mealDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },

  nutrientsSection: {
    gap: 8,
  },

  nutrientsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  nutrientChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  nutrientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  nutrientChipEmoji: {
    fontSize: 12,
  },

  nutrientChipText: {
    fontSize: 12,
    fontWeight: '600',
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
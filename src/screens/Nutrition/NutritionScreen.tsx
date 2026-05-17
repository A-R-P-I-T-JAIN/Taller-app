import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NutritionStackParamList } from '../../navigation/types';
import { useNutritionStore } from '../../store/useNutritionStore';
import { nutrientChecklist, mealSuggestions } from '../../data/nutrition';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import ProgressBar from '../../components/common/ProgressBar';
import { BOTTOM_PADDING } from '../../utils/layout';

type Nav = NativeStackNavigationProp<NutritionStackParamList>;

// ─── Water Tracker ────────────────────────────────────────────
function WaterTracker({
  glasses,
  onSet,
}: {
  glasses: number;
  onSet: (n: number) => void;
}) {
  const target = 8;
  const percent = Math.min(100, (glasses / target) * 100);

  return (
    <View style={waterStyles.container}>
      <View style={waterStyles.header}>
        <Text style={waterStyles.title}>💧 Water Intake</Text>
        <Text style={waterStyles.count}>
          {glasses}/{target} glasses
        </Text>
      </View>
      <ProgressBar
        progress={percent}
        color={colors.info}
        height={8}
        style={{ marginVertical: spacing.sm }}
      />
      <View style={waterStyles.glassRow}>
        {Array.from({ length: target }).map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onSet(i + 1 === glasses ? i : i + 1)}
            activeOpacity={0.7}
            style={[
              waterStyles.glass,
              i < glasses && waterStyles.glassFilled,
            ]}
          >
            <Text style={waterStyles.glassEmoji}>
              {i < glasses ? '💧' : '🫙'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={waterStyles.tip}>
        {glasses >= target
          ? '✅ Daily goal reached!'
          : `${target - glasses} more glasses to reach your goal`}
      </Text>
    </View>
  );
}

const waterStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 4,
    ...shadow.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.info,
  },
  glassRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: spacing.sm,
  },
  glass: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  glassFilled: {
    backgroundColor: colors.infoBg,
    borderColor: colors.info,
  },
  glassEmoji: { fontSize: 18 },
  tip: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
});

// ─── Nutrient Item ────────────────────────────────────────────
function NutrientItem({
  item,
  checked,
  onToggle,
  onPress,
}: {
  item: (typeof nutrientChecklist)[0];
  checked: boolean;
  onToggle: () => void;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        nutrientStyles.container,
        checked && nutrientStyles.containerChecked,
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {/* Checkbox */}
      <TouchableOpacity
        style={[
          nutrientStyles.checkbox,
          checked && { backgroundColor: item.color, borderColor: item.color },
        ]}
        onPress={onToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {checked && (
          <Text style={nutrientStyles.checkmark}>✓</Text>
        )}
      </TouchableOpacity>

      {/* Emoji */}
      <View
        style={[
          nutrientStyles.emojiContainer,
          { backgroundColor: item.color + '15' },
        ]}
      >
        <Text style={nutrientStyles.emoji}>{item.emoji}</Text>
      </View>

      {/* Text */}
      <View style={nutrientStyles.textContainer}>
        <Text
          style={[
            nutrientStyles.name,
            checked && nutrientStyles.nameChecked,
          ]}
        >
          {item.name}
        </Text>
        <Text style={nutrientStyles.description} numberOfLines={1}>
          {item.description}
        </Text>
      </View>

      {/* Detail arrow */}
      <TouchableOpacity
        onPress={onPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={nutrientStyles.arrow}>ⓘ</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const nutrientStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  containerChecked: {
    backgroundColor: colors.successBg,
    borderColor: colors.success + '50',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 20 },
  textContainer: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  description: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: colors.textTertiary,
  },
});

// ─── Main Screen ──────────────────────────────────────────────
export default function NutritionScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const {
    todayLog,
    toggleNutrientItem,
    setWaterGlasses,
    getTodayCompletion,
  } = useNutritionStore();

  const [refreshing, setRefreshing] = useState(false);
  const completionPercent = getTodayCompletion();
  const completedCount = todayLog?.completedItems.length || 0;
  const waterGlasses = todayLog?.waterGlasses || 0;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  // Today's meal suggestions (rotate by day)
  const dayIndex = new Date().getDay();
  const todayMeals = mealSuggestions.filter((_, i) => i % 7 === dayIndex % 7)
    .slice(0, 3);
  const fallbackMeals = mealSuggestions.slice(0, 3);
  const displayMeals = todayMeals.length > 0 ? todayMeals : fallbackMeals;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Nutrition</Text>
          <Text style={styles.headerSub}>
            {completedCount}/{nutrientChecklist.length} nutrients today
          </Text>
        </View>
        <TouchableOpacity
          style={styles.mealBtn}
          onPress={() => navigation.navigate('MealSuggestions')}
          activeOpacity={0.8}
        >
          <Text style={styles.mealBtnText}>🍽️ Meals</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Daily Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>TODAY'S NUTRITION</Text>
            <Text style={styles.scorePercent}>{completionPercent}%</Text>
            <Text style={styles.scoreStatus}>
              {completionPercent >= 80
                ? '🔥 Excellent!'
                : completionPercent >= 60
                ? '👍 Good job!'
                : completionPercent >= 40
                ? '💪 Keep going!'
                : '🌱 Just starting'}
            </Text>
          </View>
          <View style={styles.scoreRight}>
            <View style={styles.scoreRing}>
              <Text style={styles.scoreRingText}>
                {completedCount}
              </Text>
              <Text style={styles.scoreRingLabel}>
                /{nutrientChecklist.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress bar */}
        <ProgressBar
          progress={completionPercent}
          color={
            completionPercent >= 80
              ? colors.success
              : completionPercent >= 50
              ? colors.warning
              : colors.accent
          }
          height={10}
          style={{ borderRadius: 8 }}
        />

        {/* Water tracker */}
        <WaterTracker
          glasses={waterGlasses}
          onSet={setWaterGlasses}
        />

        {/* Nutrient checklist */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Nutrients</Text>
            <Text style={styles.sectionSub}>Tap to mark as consumed</Text>
          </View>
          <View style={styles.checklistContainer}>
            {nutrientChecklist.map((item) => {
              const checked =
                todayLog?.completedItems.includes(item.id) || false;
              return (
                <NutrientItem
                  key={item.id}
                  item={item}
                  checked={checked}
                  onToggle={() => toggleNutrientItem(item.id)}
                  onPress={() =>
                    navigation.navigate('NutrientDetail', {
                      nutrientId: item.id,
                    })
                  }
                />
              );
            })}
          </View>
        </View>

        {/* Today's meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meal Ideas</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MealSuggestions')}
            >
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mealsRow}>
            {displayMeals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDesc} numberOfLines={2}>
                  {meal.description}
                </Text>
                <View
                  style={[
                    styles.mealTimeBadge,
                    {
                      backgroundColor:
                        meal.mealTime === 'breakfast'
                          ? colors.warning + '20'
                          : meal.mealTime === 'lunch'
                          ? colors.success + '20'
                          : meal.mealTime === 'dinner'
                          ? colors.primary + '20'
                          : colors.accent + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.mealTimeText,
                      {
                        color:
                          meal.mealTime === 'breakfast'
                            ? colors.warning
                            : meal.mealTime === 'lunch'
                            ? colors.success
                            : meal.mealTime === 'dinner'
                            ? colors.primary
                            : colors.accent,
                      },
                    ]}
                  >
                    {meal.mealTime}
                  </Text>
                </View>
              </View>
            ))}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
    fontWeight: '500',
  },
  mealBtn: {
    backgroundColor: colors.successBg,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.success + '40',
  },
  mealBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: BOTTOM_PADDING,
    gap: spacing.base,
  },
  scoreCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow.colored(colors.secondary),
  },
  scoreLeft: { gap: 4 },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
  },
  scorePercent: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 56,
  },
  scoreStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  scoreRight: { alignItems: 'center' },
  scoreRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  scoreRingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  scoreRingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  checklistContainer: {
    gap: 8,
  },
  mealsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 6,
    ...shadow.sm,
  },
  mealEmoji: { fontSize: 28 },
  mealName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mealDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  mealTimeBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  mealTimeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  infoCard: {
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.secondary + '25',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
  },
  infoText: {
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 20,
    opacity: 0.9,
  },
});
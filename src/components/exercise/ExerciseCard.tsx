import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Expo: import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { Exercise, categoryInfo, ExerciseCategory } from '../../data/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
  completed?: boolean;
  compact?: boolean;
  showCategory?: boolean;
  index?: number;
}

const categoryIcons: Record<ExerciseCategory, string> = {
  spinal: 'body-outline',
  hanging: 'move-outline',
  posture: 'accessibility-outline',
  yoga: 'leaf-outline',
  strength: 'barbell-outline',
};

export default function ExerciseCard({
  exercise,
  onPress,
  completed = false,
  compact = false,
  showCategory = true,
  index,
}: ExerciseCardProps) {
  const catInfo = categoryInfo[exercise.category];
  const categoryIcon = categoryIcons[exercise.category];

  const difficultyColor =
    exercise.difficulty === 'beginner'
      ? colors.success
      : exercise.difficulty === 'intermediate'
      ? colors.warning
      : colors.accent;

  const metaText = [
    `${exercise.duration}s`,
    exercise.sets ? `${exercise.sets} sets` : null,
    exercise.reps ? `${exercise.reps} reps` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, completed && styles.compactCardCompleted]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {index !== undefined && (
          <View
            style={[
              styles.indexBadge,
              {
                backgroundColor: completed ? colors.success : colors.primaryBg,
              },
            ]}
          >
            {completed ? (
              <Ionicons name="checkmark" size={14} color={colors.success} />
            ) : (
              <Text style={styles.indexText}>{index + 1}</Text>
            )}
          </View>
        )}

        <View
          style={[
            styles.compactIconWrap,
            { backgroundColor: catInfo.color + '14' },
          ]}
        >
          <Ionicons name={categoryIcon} size={18} color={catInfo.color} />
        </View>

        <View style={styles.compactInfo}>
          <Text
            style={[
              styles.compactName,
              completed && styles.compactNameCompleted,
            ]}
            numberOfLines={1}
          >
            {exercise.name}
          </Text>
          <Text style={styles.compactMeta} numberOfLines={1}>
            {metaText}
          </Text>
        </View>

        <Ionicons
          name={completed ? 'checkmark-circle' : 'chevron-forward'}
          size={18}
          color={completed ? colors.success : colors.textTertiary}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: catInfo.color + '14' },
          ]}
        >
          <Ionicons name={categoryIcon} size={20} color={catInfo.color} />
        </View>

        <View style={styles.badges}>
          {showCategory && (
            <View
              style={[
                styles.badge,
                { backgroundColor: catInfo.color + '12' },
              ]}
            >
              <Ionicons
                name={categoryIcon}
                size={12}
                color={catInfo.color}
              />
              <Text style={[styles.badgeText, { color: catInfo.color }]}>
                {catInfo.label}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.badge,
              { backgroundColor: difficultyColor + '12' },
            ]}
          >
            <Text style={[styles.badgeText, { color: difficultyColor }]}>
              {exercise.difficulty}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {exercise.description}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statValue}>{exercise.duration}s</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>

        {exercise.sets ? (
          <View style={styles.statChip}>
            <Text style={styles.statValue}>{exercise.sets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
        ) : null}

        {exercise.reps ? (
          <View style={styles.statChip}>
            <Text style={styles.statValue}>{exercise.reps}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
        ) : null}

        <View style={styles.statChip}>
          <Text style={styles.statValue}>{exercise.caloriesBurn}</Text>
          <Text style={styles.statLabel}>Cal</Text>
        </View>
      </View>

      {completed && (
        <View style={styles.completedPill}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.completedPillText}>Completed</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  cardCompleted: {
    backgroundColor: colors.successBg,
    borderColor: colors.success + '25',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  content: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statChip: {
    minWidth: 68,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '500',
    color: colors.textTertiary,
  },

  completedPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  completedPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },

  compactCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  compactCardCompleted: {
    backgroundColor: colors.successBg,
    borderColor: colors.success + '25',
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  compactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  compactNameCompleted: {
    color: colors.textSecondary,
  },
  compactMeta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});
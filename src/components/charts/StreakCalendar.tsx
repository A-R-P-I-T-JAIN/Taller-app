import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { format, subDays, isToday } from 'date-fns';

const { width } = Dimensions.get('window');

interface StreakCalendarProps {
  completedDates: string[]; // YYYY-MM-DD
  days?: number;
}

export default function StreakCalendar({
  completedDates,
  days = 35,
}: StreakCalendarProps) {
  // Build last N days grid
  const grid = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const completed = completedDates.includes(dateStr);
    const today = isToday(date);
    return { date, dateStr, completed, today };
  });

  // Split into weeks
  const weeks: typeof grid[] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.container}>
      {/* Day labels */}
      <View style={styles.labelsRow}>
        {dayLabels.map((d, i) => (
          <View key={i} style={styles.labelCell}>
            <Text style={styles.labelText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => (
            <View
              key={di}
              style={[
                styles.dayCell,
                day.completed && styles.dayCellCompleted,
                day.today && styles.dayCellToday,
                day.today && day.completed && styles.dayCellTodayCompleted,
              ]}
            >
              {day.today && !day.completed && (
                <View style={styles.todayDot} />
              )}
            </View>
          ))}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.border }]} />
          <Text style={styles.legendText}>Missed</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendBox,
              { backgroundColor: colors.secondary },
            ]}
          />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendBox, { borderWidth: 2, borderColor: colors.primary }]}
          />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>
    </View>
  );
}

const CELL_SIZE = Math.floor((width - spacing.base * 2 - 32 - 6 * 4) / 7);

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  labelCell: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellCompleted: {
    backgroundColor: colors.secondary,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  dayCellTodayCompleted: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondaryDark,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.base,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
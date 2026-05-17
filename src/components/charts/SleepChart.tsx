import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { SleepEntry } from '../../store/useSleepStore';
import { format, subDays } from 'date-fns';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.base * 2 - 32;
const CHART_HEIGHT = 180;
const PADDING_LEFT = 40;
const PADDING_RIGHT = 8;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 28;
const BAR_RADIUS = 6;
const TARGET_HOURS = 9;

interface SleepChartProps {
  entries: SleepEntry[];
  showQuality?: boolean;
}

export default function SleepChart({
  entries,
  showQuality = true,
}: SleepChartProps) {
  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🌙</Text>
        <Text style={styles.emptyTitle}>No sleep data yet</Text>
        <Text style={styles.emptyText}>
          Start logging your sleep to see patterns
        </Text>
      </View>
    );
  }

  // Build last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find((e) => e.date === dateStr);
    return {
      date,
      dateStr,
      dayLabel: format(date, 'EEE'),
      hours: entry ? entry.duration / 60 : 0,
      quality: entry?.quality || 0,
      hasData: !!entry,
    };
  });

  const chartW = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartH = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const maxHours = 12;
  const barW = Math.floor(chartW / 7) - 6;

  const getQualityColor = (quality: number) => {
    if (!quality) return colors.borderLight;
    if (quality >= 4.5) return colors.success;
    if (quality >= 3.5) return colors.secondary;
    if (quality >= 2.5) return colors.warning;
    return colors.accent;
  };

  const toBarH = (hours: number) =>
    Math.max(4, (hours / maxHours) * chartH);

  // Target line Y position
  const targetY =
    PADDING_TOP + chartH - (TARGET_HOURS / maxHours) * chartH;

  // Averages
  const validEntries = last7Days.filter((d) => d.hasData);
  const avgHours =
    validEntries.length > 0
      ? validEntries.reduce((s, d) => s + d.hours, 0) / validEntries.length
      : 0;
  const avgQuality =
    validEntries.length > 0
      ? validEntries.reduce((s, d) => s + d.quality, 0) /
        validEntries.length
      : 0;

  // Y-axis labels
  const yLabels = [0, 3, 6, 9, 12];

  return (
    <View style={styles.container}>
      {/* Summary row */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Avg Sleep</Text>
          <Text style={styles.summaryValue}>
            {avgHours > 0 ? `${avgHours.toFixed(1)}h` : '—'}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Avg Quality</Text>
          <Text style={styles.summaryValue}>
            {avgQuality > 0 ? `${avgQuality.toFixed(1)}/5` : '—'}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Nights Logged</Text>
          <Text style={styles.summaryValue}>{validEntries.length}/7</Text>
        </View>
      </View>

      {/* Chart */}
      <View
        style={[
          styles.chartArea,
          { width: CHART_WIDTH, height: CHART_HEIGHT },
        ]}
      >
        {/* Y-axis labels + grid lines */}
        {yLabels.map((val, i) => {
          const y =
            PADDING_TOP + chartH - (val / maxHours) * chartH;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                top: y - 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  styles.yLabel,
                  val === TARGET_HOURS && { color: colors.secondary },
                ]}
              >
                {val}h
              </Text>
              <View
                style={[
                  styles.gridLine,
                  {
                    left: PADDING_LEFT,
                    width: chartW,
                    top: 8,
                    borderColor:
                      val === TARGET_HOURS
                        ? colors.secondary + '40'
                        : colors.borderLight,
                    borderStyle:
                      val === TARGET_HOURS ? 'dashed' : 'solid',
                  },
                ]}
              />
            </View>
          );
        })}

        {/* Target label */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: targetY - 18,
          }}
        >
          <Text style={styles.targetLabel}>Goal</Text>
        </View>

        {/* Bars */}
        {last7Days.map((day, i) => {
          const barH = toBarH(day.hours);
          const barX =
            PADDING_LEFT + i * (chartW / 7) + (chartW / 7 - barW) / 2;
          const barY = PADDING_TOP + chartH - barH;
          const barColor = showQuality
            ? getQualityColor(day.quality)
            : colors.secondary;

          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: barX,
                top: barY,
                width: barW,
                height: barH,
                backgroundColor: day.hasData
                  ? barColor
                  : colors.borderLight,
                borderRadius: BAR_RADIUS,
                opacity: day.hasData ? 0.85 : 0.4,
              }}
            />
          );
        })}

        {/* X-axis labels */}
        {last7Days.map((day, i) => {
          const x =
            PADDING_LEFT +
            i * (chartW / 7) +
            chartW / 14 -
            12;
          return (
            <View
              key={`xlabel-${i}`}
              style={{
                position: 'absolute',
                left: x,
                top: PADDING_TOP + chartH + 4,
                width: 24,
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  styles.xLabel,
                  !day.hasData && { opacity: 0.4 },
                ]}
              >
                {day.dayLabel}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {showQuality ? (
          <View style={styles.qualityLegend}>
            {[
              { color: colors.success, label: 'Excellent' },
              { color: colors.secondary, label: 'Good' },
              { color: colors.warning, label: 'Okay' },
              { color: colors.accent, label: 'Poor' },
            ].map((item, i) => (
              <View key={i} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.secondary },
              ]}
            />
            <Text style={styles.legendText}>Sleep Hours</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: spacing.sm,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  chartArea: {
    position: 'relative',
  },
  yLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '500',
    width: PADDING_LEFT - 4,
    textAlign: 'right',
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
  },
  targetLabel: {
    fontSize: 9,
    color: colors.secondary,
    fontWeight: '700',
  },
  xLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '600',
    textAlign: 'center',
  },
  legend: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  qualityLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    gap: 8,
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 19,
  },
});
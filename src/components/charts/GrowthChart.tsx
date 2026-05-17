import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { HeightEntry } from '../../store/useGrowthStore';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.base * 2 - 32;
const CHART_HEIGHT = 200;
const PADDING_LEFT = 48;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;

type ViewMode = '3M' | '6M' | '1Y' | 'ALL';

interface GrowthChartProps {
  entries: HeightEntry[];
  gender: 'male' | 'female';
  age: number;
  heightUnit: 'cm' | 'ft';
}

export default function GrowthChart({
  entries,
  gender,
  age,
  heightUnit,
}: GrowthChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('ALL');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const viewModes: ViewMode[] = ['3M', '6M', '1Y', 'ALL'];

  // Filter entries by view mode
  const getFilteredEntries = (): HeightEntry[] => {
    if (viewMode === 'ALL' || entries.length === 0) return entries;
    const now = new Date();
    const months =
      viewMode === '3M' ? 3 : viewMode === '6M' ? 6 : 12;
    const cutoff = new Date(
      now.getFullYear(),
      now.getMonth() - months,
      now.getDate()
    );
    const filtered = entries.filter((e) => new Date(e.date) >= cutoff);
    return filtered.length > 0 ? filtered : entries;
  };

  const filteredEntries = getFilteredEntries();

  if (filteredEntries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📏</Text>
        <Text style={styles.emptyTitle}>No measurements yet</Text>
        <Text style={styles.emptyText}>
          Add your first height measurement to see your growth chart
        </Text>
      </View>
    );
  }

  // Chart dimensions
  const chartW = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartH = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  // Get min/max
  const heights = filteredEntries.map((e) => e.height);
  const minH = Math.min(...heights) - 3;
  const maxH = Math.max(...heights) + 3;
  const range = maxH - minH || 10;

  // Convert value to Y coordinate
  const toY = (h: number) =>
    PADDING_TOP + chartH - ((h - minH) / range) * chartH;

  // Convert index to X coordinate
  const toX = (i: number) =>
    PADDING_LEFT +
    (filteredEntries.length === 1
      ? chartW / 2
      : (i / (filteredEntries.length - 1)) * chartW);

  // Build points
  const points = filteredEntries.map((e, i) => ({
    x: toX(i),
    y: toY(e.height),
    height: e.height,
    date: e.date,
  }));

  // Build SVG-like path using View positions
  const totalGrowth =
    filteredEntries.length >= 2
      ? filteredEntries[filteredEntries.length - 1].height -
        filteredEntries[0].height
      : 0;

  // Y-axis labels
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map((t) =>
    Math.round(minH + t * range)
  );

  // X-axis labels (max 5)
  const xStep = Math.max(1, Math.floor(filteredEntries.length / 5));
  const xLabels = filteredEntries
    .filter((_, i) => i % xStep === 0)
    .map((e, i) => ({
      label: format(new Date(e.date), 'MMM d'),
      x: toX(filteredEntries.indexOf(e)),
    }));

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.viewModeRow}>
          {viewModes.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewModeBtn,
                viewMode === mode && styles.viewModeBtnActive,
              ]}
              onPress={() => {
                setViewMode(mode);
                setSelectedIndex(null);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.viewModeText,
                  viewMode === mode && styles.viewModeTextActive,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected point info */}
      {selectedIndex !== null && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipHeight}>
            {filteredEntries[selectedIndex].height} cm
          </Text>
          <Text style={styles.tooltipDate}>
            {format(
              new Date(filteredEntries[selectedIndex].date),
              'MMM d, yyyy'
            )}
          </Text>
        </View>
      )}

      {/* Chart area */}
      <View
        style={[
          styles.chartArea,
          { width: CHART_WIDTH, height: CHART_HEIGHT },
        ]}
      >
        {/* Y-axis labels */}
        {yLabels.map((val, i) => {
          const y =
            PADDING_TOP + chartH - ((val - minH) / range) * chartH;
          return (
            <View
              key={i}
              style={[styles.yLabel, { top: y - 8 }]}
            >
              <Text style={styles.yLabelText}>{val}</Text>
              {/* Grid line */}
              <View
                style={[
                  styles.gridLine,
                  {
                    left: PADDING_LEFT,
                    top: 8,
                    width: chartW,
                  },
                ]}
              />
            </View>
          );
        })}

        {/* Area fill (gradient effect using opacity layers) */}
        {points.length >= 2 &&
          points.slice(0, -1).map((pt, i) => {
            const next = points[i + 1];
            const segW = next.x - pt.x;
            const segH = Math.abs(next.y - pt.y);
            const topY = Math.min(pt.y, next.y);
            const bottomY = PADDING_TOP + chartH;
            const fillH = bottomY - topY;

            return (
              <View
                key={`fill-${i}`}
                style={{
                  position: 'absolute',
                  left: pt.x,
                  top: topY,
                  width: segW,
                  height: fillH,
                  backgroundColor: colors.primary + '08',
                }}
              />
            );
          })}

        {/* Line segments */}
        {points.length >= 2 &&
          points.slice(0, -1).map((pt, i) => {
            const next = points[i + 1];
            const dx = next.x - pt.x;
            const dy = next.y - pt.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

            return (
              <View
                key={`line-${i}`}
                style={{
                  position: 'absolute',
                  left: pt.x,
                  top: pt.y - 1.5,
                  width: length,
                  height: 3,
                  backgroundColor: colors.primary,
                  borderRadius: 2,
                  transformOrigin: 'left center',
                  transform: [{ rotate: `${angle}deg` }],
                }}
              />
            );
          })}

        {/* Data points */}
        {points.map((pt, i) => (
          <TouchableOpacity
            key={`dot-${i}`}
            style={[
              styles.dot,
              {
                left: pt.x - 7,
                top: pt.y - 7,
              },
              selectedIndex === i && styles.dotSelected,
            ]}
            onPress={() =>
              setSelectedIndex(selectedIndex === i ? null : i)
            }
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View
              style={[
                styles.dotInner,
                selectedIndex === i && styles.dotInnerSelected,
              ]}
            />
          </TouchableOpacity>
        ))}

        {/* X-axis labels */}
        {xLabels.map((item, i) => (
          <View
            key={`xlabel-${i}`}
            style={[
              styles.xLabel,
              {
                left: item.x - 20,
                top: PADDING_TOP + chartH + 4,
              },
            ]}
          >
            <Text style={styles.xLabelText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.primary },
            ]}
          />
          <Text style={styles.legendText}>Your Height</Text>
        </View>
        {filteredEntries.length >= 2 && (
          <Text style={styles.trendText}>
            {totalGrowth > 0 ? '📈' : totalGrowth < 0 ? '📉' : '➡️'}{' '}
            {totalGrowth > 0 ? '+' : ''}
            {totalGrowth.toFixed(1)} cm total
          </Text>
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
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  viewModeRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  viewModeBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  viewModeBtnActive: {
    backgroundColor: colors.primary,
  },
  viewModeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  tooltip: {
    backgroundColor: colors.textPrimary,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tooltipHeight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tooltipDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  chartArea: {
    position: 'relative',
    marginLeft: -spacing.xs,
  },
  yLabel: {
    position: 'absolute',
    left: 0,
    width: PADDING_LEFT - 4,
    alignItems: 'flex-end',
  },
  yLabelText: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  dotSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    left: undefined,
    top: undefined,
    borderWidth: 3,
    transform: [{ scale: 1 }],
  },
  dotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  dotInnerSelected: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  xLabel: {
    position: 'absolute',
    width: 40,
    alignItems: 'center',
  },
  xLabelText: {
    fontSize: 9,
    color: colors.textTertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  trendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
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
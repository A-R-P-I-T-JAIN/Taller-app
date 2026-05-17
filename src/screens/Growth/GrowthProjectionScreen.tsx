import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/useUserStore';
import { useGrowthProjection } from '../../hooks/useGrowthProjection';
import { useGrowthStore } from '../../store/useGrowthStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import { formatHeight, cmToFeetInches } from '../../utils/growthCalculations';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/common/ProgressBar';

const { width } = Dimensions.get('window');

function ProjectionCard({
  label,
  value,
  sub,
  color,
  emoji,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  emoji: string;
}) {
  return (
    <View style={[projStyles.card, { borderColor: color + '30' }]}>
      <Text style={projStyles.cardEmoji}>{emoji}</Text>
      <Text style={[projStyles.cardValue, { color }]}>{value}</Text>
      <Text style={projStyles.cardLabel}>{label}</Text>
      {sub && <Text style={projStyles.cardSub}>{sub}</Text>}
    </View>
  );
}

const projStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 4,
    ...shadow.sm,
  },
  cardEmoji: { fontSize: 24, marginBottom: 4 },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  cardLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

function FactorRow({
  label,
  impact,
  description,
  color,
}: {
  label: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  color: string;
}) {
  const impactWidth = impact === 'High' ? 85 : impact === 'Medium' ? 55 : 30;
  return (
    <View style={factorStyles.container}>
      <View style={factorStyles.top}>
        <Text style={factorStyles.label}>{label}</Text>
        <View style={[factorStyles.badge, { backgroundColor: color + '20' }]}>
          <Text style={[factorStyles.badgeText, { color }]}>{impact} Impact</Text>
        </View>
      </View>
      <ProgressBar
        progress={impactWidth}
        color={color}
        height={6}
        style={{ marginVertical: 6 }}
      />
      <Text style={factorStyles.desc}>{description}</Text>
    </View>
  );
}

const factorStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
});

export default function GrowthProjectionScreen() {
  const insets = useSafeAreaInsets();
  const profile = useUserStore((s) => s.profile);
  const projection = useGrowthProjection();
  const getLatestHeight = useGrowthStore((s) => s.getLatestHeight);
  const getGrowthVelocity = useGrowthStore((s) => s.getGrowthVelocity);

  if (!profile || !projection) {
    return (
      <View style={styles.container}>
        <Header title="Growth Projection" showBack />
        <View style={styles.centered}>
          <Text style={styles.noDataText}>
            Add measurements to see your projection
          </Text>
        </View>
      </View>
    );
  }

  const latestHeight = getLatestHeight() || profile.currentHeight;
  const velocity = getGrowthVelocity();
  const unit = profile.heightUnit;

  const potentialColor =
    projection.growthPotential === 'high'
      ? colors.success
      : projection.growthPotential === 'moderate'
      ? colors.warning
      : colors.accent;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Growth Projection" showBack />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroLabel}>PROJECTED ADULT HEIGHT</Text>
          <Text style={styles.heroHeight}>
            {formatHeight(projection.projectedHeight, unit)}
          </Text>
          <Text style={styles.heroRange}>
            Range: {formatHeight(projection.projectedMinHeight, unit)} —{' '}
            {formatHeight(projection.projectedMaxHeight, unit)}
          </Text>

          {/* Growth completion */}
          <View style={styles.completionSection}>
            <View style={styles.completionRow}>
              <Text style={styles.completionLabel}>Growth Journey</Text>
              <Text style={styles.completionPercent}>
                {projection.percentComplete}% complete
              </Text>
            </View>
            <ProgressBar
              progress={projection.percentComplete}
              color={colors.secondary}
              backgroundColor="rgba(255,255,255,0.2)"
              height={10}
            />
            <View style={styles.completionLabels}>
              <Text style={styles.completionSub}>
                Current: {formatHeight(latestHeight, unit)}
              </Text>
              <Text style={styles.completionSub}>
                Projected: {formatHeight(projection.projectedHeight, unit)}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <ProjectionCard
            emoji="📈"
            label="Growth Remaining"
            value={`${projection.growthRemaining} cm`}
            sub={cmToFeetInches(projection.growthRemaining)}
            color={colors.primary}
          />
          <ProjectionCard
            emoji="⚡"
            label="Growth Potential"
            value={projection.growthPotential.charAt(0).toUpperCase() +
              projection.growthPotential.slice(1)}
            color={potentialColor}
          />
        </View>

        <View style={styles.statsGrid}>
          <ProjectionCard
            emoji="🚀"
            label="Growth Rate"
            value={
              velocity > 0
                ? `${velocity.toFixed(2)} cm/mo`
                : 'No data yet'
            }
            sub="Based on your logs"
            color={colors.secondary}
          />
          {projection.midParentalHeight && (
            <ProjectionCard
              emoji="🧬"
              label="Genetic Potential"
              value={formatHeight(projection.midParentalHeight, unit)}
              sub="Mid-parental ±8.5cm"
              color="#8B5CF6"
            />
          )}
        </View>

        {/* Factors affecting growth */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Factors</Text>
          <View style={styles.card}>
            <FactorRow
              label="🧬 Genetics"
              impact="High"
              description="60-80% of your height is determined by genetics. Mid-parental height gives the best estimate."
              color={colors.primary}
            />
            <FactorRow
              label="😴 Sleep Quality"
              impact="High"
              description="80% of growth hormone (HGH) is released during deep sleep. Aim for 8-10 hours nightly."
              color="#8B5CF6"
            />
            <FactorRow
              label="🥗 Nutrition"
              impact="Medium"
              description="Adequate protein, calcium, vitamin D and zinc are essential for bone growth."
              color={colors.secondary}
            />
            <FactorRow
              label="🏋️ Exercise"
              impact="Medium"
              description="Spinal decompression and posture exercises can add 1-3 cm through improved posture."
              color={colors.accent}
            />
            <FactorRow
              label="⏰ Age"
              impact="High"
              description={`Growth plates typically close at ${
                profile.gender === 'male' ? '16-21' : '14-18'
              } for ${profile.gender}s. Act early for best results.`}
              color={colors.warning}
            />
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ These projections are estimates based on scientific formulas
            (mid-parental height method + WHO growth charts). Actual adult
            height may vary. Consult a doctor for medical advice.
          </Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 100,
    gap: spacing.base,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadow.colored(colors.primary),
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroHeight: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroRange: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: spacing.xl,
  },
  completionSection: {
    gap: 8,
  },
  completionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  completionPercent: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  completionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    ...shadow.md,
  },
  disclaimer: {
    backgroundColor: colors.warningBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.warning,
    lineHeight: 18,
    fontWeight: '500',
  },
});
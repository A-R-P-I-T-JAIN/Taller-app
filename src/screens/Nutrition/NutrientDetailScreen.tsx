import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NutritionStackParamList } from '../../navigation/types';
import { nutrientChecklist } from '../../data/nutrition';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import Header from '../../components/common/Header';

type RouteType = RouteProp<NutritionStackParamList, 'NutrientDetail'>;

export default function NutrientDetailScreen() {
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const nutrient = nutrientChecklist.find(
    (n) => n.id === route.params.nutrientId
  );

  if (!nutrient) {
    return (
      <View style={styles.container}>
        <Header title="Nutrient" showBack />
        <View style={styles.centered}>
          <Text>Nutrient not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={nutrient.name} showBack />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: nutrient.color + '15' },
          ]}
        >
          <Text style={styles.heroEmoji}>{nutrient.emoji}</Text>
          <Text style={[styles.heroName, { color: nutrient.color }]}>
            {nutrient.name}
          </Text>
          <Text style={styles.heroDesc}>{nutrient.description}</Text>
          <View
            style={[
              styles.targetBadge,
              { backgroundColor: nutrient.color + '20' },
            ]}
          >
            <Text style={[styles.targetText, { color: nutrient.color }]}>
              🎯 Daily Target: {nutrient.dailyTarget}
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why It Matters</Text>
          <View style={styles.card}>
            <Text style={styles.benefitsText}>{nutrient.benefits}</Text>
          </View>
        </View>

        {/* Best Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Food Sources</Text>
          <View style={styles.sourcesGrid}>
            {nutrient.sources.map((source, i) => (
              <View
                key={i}
                style={[
                  styles.sourceChip,
                  { backgroundColor: nutrient.color + '12' },
                ]}
              >
                <Text
                  style={[styles.sourceText, { color: nutrient.color }]}
                >
                  {source}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Growth connection */}
        <View
          style={[
            styles.growthCard,
            { backgroundColor: colors.primaryBg, borderColor: colors.primary + '25' },
          ]}
        >
          <Text style={styles.growthTitle}>🌱 Growth Connection</Text>
          <Text style={styles.growthText}>
            {nutrient.id === 'protein' &&
              'Protein provides amino acids needed to build and repair tissues, including the growth plates in bones. Adequate protein is essential during growth spurts.'}
            {nutrient.id === 'calcium' &&
              'Calcium is the primary mineral in bones. Getting enough calcium during teen years helps maximize peak bone mass, which directly impacts adult height.'}
            {nutrient.id === 'vitamin-d' &&
              'Without Vitamin D, your body cannot absorb calcium properly. Even with adequate calcium intake, a Vitamin D deficiency can severely limit bone growth.'}
            {nutrient.id === 'zinc' &&
              'Zinc is essential for growth hormone production and bone cell development. Studies show zinc deficiency leads to stunted growth in teens.'}
            {nutrient.id === 'vitamin-a' &&
              'Vitamin A regulates bone remodeling — the process where old bone is broken down and new bone is formed. This is crucial for proper bone growth.'}
            {nutrient.id === 'magnesium' &&
              'Magnesium works alongside calcium for bone formation and is needed for Vitamin D activation. It also promotes deep sleep, which is critical for growth hormone release.'}
            {nutrient.id === 'iron' &&
              'Iron carries oxygen in blood to growing tissues and muscles. Iron deficiency can lead to fatigue that prevents exercise, which is important for bone density.'}
            {nutrient.id === 'water' &&
              'The spinal discs between vertebrae are mostly water. Staying hydrated keeps them plump and at full height. Dehydration can temporarily reduce your height by up to 1 cm!'}
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
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 100,
    gap: spacing.base,
  },
  heroCard: {
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  heroEmoji: { fontSize: 56 },
  heroName: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  targetBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  targetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: { gap: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadow.sm,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    fontWeight: '500',
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sourceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  growthCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 8,
    borderWidth: 1,
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  growthText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 21,
    opacity: 0.9,
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import Header from '../../components/common/Header';

const tips = [
  {
    emoji: '🛏️',
    title: 'Consistent Schedule',
    desc: 'Go to bed and wake up at the same time every day, even on weekends. This regulates your circadian rhythm.',
  },
  {
    emoji: '📱',
    title: 'No Screens Before Bed',
    desc: 'Blue light from phones suppresses melatonin. Avoid screens 1-2 hours before bedtime.',
  },
  {
    emoji: '☕',
    title: 'Limit Caffeine',
    desc: 'Caffeine has a half-life of 6 hours. Avoid it after 2 PM to prevent sleep disruption.',
  },
  {
    emoji: '🌡️',
    title: 'Cool Bedroom',
    desc: 'Optimal sleep temperature is 60-67°F (15-19°C). A cool room helps your body temperature drop, signaling sleep time.',
  },
  {
    emoji: '🧘',
    title: 'Relaxation Techniques',
    desc: 'Practice deep breathing, meditation, or light stretching to calm your nervous system before bed.',
  },
  {
    emoji: '🍒',
    title: 'Natural Sleep Aids',
    desc: 'Tart cherry juice, kiwi fruit, and almonds contain natural melatonin or tryptophan.',
  },
  {
    emoji: '🌙',
    title: 'Dark Environment',
    desc: 'Use blackout curtains and avoid night lights. Darkness triggers melatonin production.',
  },
  {
    emoji: '🔇',
    title: 'Quiet Space',
    desc: 'Use earplugs or white noise machines if you live in a noisy area.',
  },
];

export default function SleepTipsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Sleep Tips" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Why Sleep Matters</Text>
          <Text style={styles.introText}>
            During deep sleep (especially between 10 PM - 2 AM), your body
            releases 80% of its daily growth hormone — essential for height
            optimization in teens and young adults.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Best Practices</Text>

        {tips.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <Text style={styles.tipEmoji}>{tip.emoji}</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDesc}>{tip.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.finalCard}>
          <Text style={styles.finalTitle}>Your Goal</Text>
          <Text style={styles.finalText}>
            Aim for <Text style={styles.highlight}>8-10 hours</Text> of quality
            sleep every night. This is the #1 most powerful thing you can do
            for height optimization.
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
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 100,
    gap: spacing.base,
  },
  intro: {
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  introText: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 21,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 12,
  },
  tipEmoji: { fontSize: 28 },
  tipContent: { flex: 1, gap: 4 },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tipDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  finalCard: {
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.secondary + '25',
  },
  finalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
  },
  finalText: {
    fontSize: 14,
    color: colors.secondary,
    lineHeight: 21,
  },
  highlight: {
    fontWeight: '900',
    fontSize: 16,
  },
});
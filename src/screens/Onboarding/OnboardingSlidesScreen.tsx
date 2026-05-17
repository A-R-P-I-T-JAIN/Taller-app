import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingSlides'>;

interface Slide {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  facts: string[];
}

const slides: Slide[] = [
  {
    id: '1',
    emoji: '📏',
    title: 'Track Your Growth',
    subtitle: 'Every centimeter counts',
    description:
      'Log your height measurements and watch your progress on beautiful charts. Compare with WHO growth percentiles.',
    color: colors.primary,
    facts: [
      'Visual growth charts',
      'WHO percentile curves',
      'Growth projections',
    ],
  },
  {
    id: '2',
    emoji: '🏋️',
    title: 'Exercise & Stretch',
    subtitle: 'Optimize every day',
    description:
      'Follow science-backed routines with spinal decompression, posture correction, and flexibility exercises.',
    color: colors.secondary,
    facts: [
      '12+ guided exercises',
      'Daily routine builder',
      'Streak tracking',
    ],
  },
  {
    id: '3',
    emoji: '😴',
    title: 'Sleep = Growth',
    subtitle: 'Growth hormone releases during deep sleep',
    description:
      '80% of growth hormone is released during sleep. Track your sleep quality and optimize for maximum growth.',
    color: '#8B5CF6',
    facts: [
      'Sleep quality tracker',
      'Weekly sleep patterns',
      'Personalized tips',
    ],
  },
  {
    id: '4',
    emoji: '🥗',
    title: 'Fuel Your Growth',
    subtitle: 'Nutrition is your foundation',
    description:
      'Track key growth nutrients — calcium, protein, vitamin D, zinc and more. Get personalized meal suggestions.',
    color: colors.accent,
    facts: [
      'Nutrient checklist',
      'Meal suggestions',
      'Water tracker',
    ],
  },
];

function SlideItem({ item }: { item: Slide }) {
  return (
    <View style={[styles.slide, { width }]}>
      {/* Emoji area */}
      <View
        style={[styles.emojiWrap, { backgroundColor: item.color + '10' }]}
      >
        <Text style={styles.slideEmoji}>{item.emoji}</Text>
      </View>

      {/* Text */}
      <View style={styles.textWrap}>
        <View
          style={[styles.subtitleBadge, { backgroundColor: item.color + '12' }]}
        >
          <Text style={[styles.subtitleText, { color: item.color }]}>
            {item.subtitle}
          </Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* Facts */}
        <View style={styles.factsCard}>
          {item.facts.map((fact, i) => (
            <View key={i} style={styles.factRow}>
              <View
                style={[styles.factDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.factText}>{fact}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function OnboardingSlidesScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  );

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('ProfileSetup');
    }
  };

  const skip = () => navigation.navigate('ProfileSetup');

  const currentSlide = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={skip}
          style={styles.skipBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        scrollEventThrottle={16}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [6, 20, 6],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.25, 1, 0.25],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: currentSlide.color,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Next button */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: currentSlide.color }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? "Let's Start" : 'Continue'}
          </Text>
        </TouchableOpacity>

        {/* Counter */}
        <Text style={styles.counter}>
          {currentIndex + 1} / {slides.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    paddingHorizontal: spacing.base,
    alignItems: 'flex-end',
  },

  skipBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },

  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Slide
  slide: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: 28,
  },

  emojiWrap: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  slideEmoji: {
    fontSize: 56,
  },

  textWrap: {
    gap: 12,
  },

  subtitleBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    lineHeight: 32,
  },

  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 23,
  },

  factsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: spacing.base,
    gap: 10,
    marginTop: 4,
  },

  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  factDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  factText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  // Bottom controls
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    gap: 14,
  },

  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  dot: {
    height: 6,
    borderRadius: 3,
  },

  nextBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  counter: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
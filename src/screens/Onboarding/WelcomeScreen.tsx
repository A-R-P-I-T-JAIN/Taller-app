import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

// Floating particle component
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      anim.setValue(0);
      opacity.setValue(0);
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2500 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: x,
          bottom: 80,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslate = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Title slides up
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslate, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Button
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslate, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const particles = [
    { x: width * 0.1, size: 8, delay: 0 },
    { x: width * 0.25, size: 12, delay: 500 },
    { x: width * 0.45, size: 6, delay: 1000 },
    { x: width * 0.65, size: 10, delay: 300 },
    { x: width * 0.8, size: 8, delay: 800 },
    { x: width * 0.9, size: 6, delay: 200 },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Background gradient circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <Particle key={i} x={p.x} size={p.size} delay={p.delay} />
      ))}

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        {/* <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoInner}>
            <Text style={styles.logoEmoji}>🌱</Text>
          </View>
          <View style={styles.logoRing} />
        </Animated.View> */}
        <View>
        <Image source={require('../../../assets/images/Taller.png')} style={{ width: 100, height: 100, borderRadius: 10 }} />
        </View>

        {/* App name */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslate }],
          }}
        >
          <Text style={styles.appName}>Taller</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineDot} />
            <Text style={styles.tagline}>Maximize Your Height</Text>
            <View style={styles.taglineDot} />
          </View>
        </Animated.View>

        {/* Feature pills */}
        
      </View>

      {/* Bottom CTA */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslate }],
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('OnboardingSlides')}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Get Started</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Free • No account needed • Data stays on your device
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B2E',
    overflow: 'hidden',
  },

  // Background circles
  bgCircle1: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: colors.primary,
    opacity: 0.15,
    top: -width * 0.3,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: colors.secondary,
    opacity: 0.1,
    bottom: height * 0.2,
    left: -width * 0.2,
  },
  bgCircle3: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: colors.accent,
    opacity: 0.08,
    bottom: height * 0.1,
    right: -width * 0.1,
  },

  // Particle
  particle: {
    position: 'absolute',
    backgroundColor: colors.primaryLight,
  },

  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
    position: 'relative',
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(108, 99, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(108, 99, 255, 0.5)',
  },
  logoRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  logoEmoji: {
    fontSize: 48,
  },

  // App name
  appName: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1,
    fontFamily: 'System',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  taglineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    letterSpacing: 1,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing['2xl'],
    gap: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    fontWeight: '500',
  },

  // Pills
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.xl,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pillText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '500',
  },

  // Bottom
  bottomSection: {
    paddingHorizontal: spacing.xl,
    gap: 16,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  disclaimer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
});
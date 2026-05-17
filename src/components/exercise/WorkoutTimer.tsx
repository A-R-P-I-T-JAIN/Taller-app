import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface WorkoutTimerProps {
  duration: number; // seconds
  isRunning: boolean;
  onComplete: () => void;
  color?: string;
}

export default function WorkoutTimer({
  duration,
  isRunning,
  onComplete,
  color = colors.primary,
}: WorkoutTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout>();
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Reset when duration changes
  useEffect(() => {
    setTimeLeft(duration);
    progressAnim.setValue(1);
  }, [duration]);

  // Countdown logic
  useEffect(() => {
    if (isRunning) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Animate progress ring
  useEffect(() => {
    const progress = timeLeft / duration;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((timeLeft / duration) * 100);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circleContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {/* Background SVG-like circle using border */}
        <View style={styles.trackCircle} />

        {/* Progress indicator using rotation trick */}
        <View style={styles.progressContainer}>
          {/* We use a simpler approach with a View-based progress */}
          <View
            style={[
              styles.progressArc,
              {
                borderColor: color,
                borderTopColor: progressPercent < 25 ? 'transparent' : color,
                borderRightColor: progressPercent < 50 ? 'transparent' : color,
                borderBottomColor: progressPercent < 75 ? 'transparent' : color,
                borderLeftColor: color,
              },
            ]}
          />
        </View>

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={[styles.timeText, { color }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.progressText}>{progressPercent}%</Text>
          <Text style={styles.statusText}>
            {isRunning ? '● Active' : '⏸ Paused'}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  trackCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: STROKE_WIDTH,
    borderColor: colors.borderLight,
  },
  progressContainer: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressArc: {
    width: CIRCLE_SIZE - STROKE_WIDTH,
    height: CIRCLE_SIZE - STROKE_WIDTH,
    borderRadius: (CIRCLE_SIZE - STROKE_WIDTH) / 2,
    borderWidth: STROKE_WIDTH,
    borderColor: 'transparent',
  },
  centerContent: {
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statusText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});
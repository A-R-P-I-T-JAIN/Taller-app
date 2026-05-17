import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExerciseStackParamList } from '../../navigation/types';
import { useExerciseStore } from '../../store/useExerciseStore';
import { exercises, getExerciseById, Exercise } from '../../data/exercises';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import { format } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BOTTOM_PADDING } from '../../utils/layout';

type RouteType = RouteProp<ExerciseStackParamList, 'WorkoutSession'>;

const { width } = Dimensions.get('window');

// Simple circular progress
function CircularTimer({
  timeLeft,
  total,
  color,
  isRunning,
}: {
  timeLeft: number;
  total: number;
  color: string;
  isRunning: boolean;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseRef = useRef<Animated.CompositeAnimation>();

  useEffect(() => {
    if (isRunning) {
      pulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      pulseRef.current.start();
    } else {
      pulseRef.current?.stop();
      pulseAnim.setValue(1);
    }
    return () => pulseRef.current?.stop();
  }, [isRunning]);

  const percent = total > 0 ? timeLeft / total : 0;
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <Animated.View
      style={[timerStyles.container, { transform: [{ scale: pulseAnim }] }]}
    >
      {/* Outer ring */}
      <View style={timerStyles.outerRing}>
        {/* Progress ring (visual using border trick) */}
        <View
          style={[
            timerStyles.progressRing,
            {
              borderColor: color,
              opacity: percent,
            },
          ]}
        />
        {/* Track */}
        <View style={timerStyles.trackRing} />
        {/* Center */}
        <View style={timerStyles.center}>
          <Text style={[timerStyles.time, { color }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={timerStyles.percent}>
            {Math.round(percent * 100)}%
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const timerStyles = StyleSheet.create({
  container: { alignItems: 'center' },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  trackRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: colors.borderLight,
  },
  progressRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
  },
  center: {
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  percent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

// Exercise step indicator
function ExerciseSteps({
  exerciseList,
  currentIndex,
  completedIndexes,
}: {
  exerciseList: Exercise[];
  currentIndex: number;
  completedIndexes: number[];
}) {
  return (
    <View style={stepStyles.container}>
      {exerciseList.map((ex, i) => (
        <View
          key={ex.id}
          style={[
            stepStyles.step,
            completedIndexes.includes(i) && stepStyles.stepDone,
            i === currentIndex && stepStyles.stepActive,
          ]}
        >
          {completedIndexes.includes(i) ? (
            <Text style={stepStyles.stepCheck}>✓</Text>
          ) : (
            <Text
              style={[
                stepStyles.stepNum,
                i === currentIndex && stepStyles.stepNumActive,
              ]}
            >
              {i + 1}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  stepActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  stepDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
  },
  stepNumActive: { color: colors.primary },
  stepCheck: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default function WorkoutSessionScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const addCompletedWorkout = useExerciseStore((s) => s.addCompletedWorkout);

  const { exerciseIds } = route.params;
  const exerciseList = exerciseIds
    .map((id) => getExerciseById(id))
    .filter(Boolean) as Exercise[];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exerciseList[0]?.duration || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [completedIndexes, setCompletedIndexes] = useState<number[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(15);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [workoutDone, setWorkoutDone] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();
  const elapsedRef = useRef<NodeJS.Timeout>();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentExercise = exerciseList[currentIndex];
  const catColor = currentExercise
    ? {
        spinal: colors.primary,
        hanging: colors.secondary,
        posture: colors.accent,
        yoga: colors.warning,
        strength: colors.info,
      }[currentExercise.category]
    : colors.primary;

  // Elapsed timer
  useEffect(() => {
    if (isRunning && !workoutDone) {
      elapsedRef.current = setInterval(() => {
        setTotalElapsed((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(elapsedRef.current);
    }
    return () => clearInterval(elapsedRef.current);
  }, [isRunning, workoutDone]);

  // Countdown
  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentIndex, isResting]);

  const handleTimerComplete = useCallback(() => {
    if (isResting) {
      // Rest done, move to next exercise
      setIsResting(false);
      const nextIndex = currentIndex + 1;
      if (nextIndex < exerciseList.length) {
        animateSlide();
        setCurrentIndex(nextIndex);
        setTimeLeft(exerciseList[nextIndex].duration);
        setIsRunning(true);
      }
    } else {
      // Exercise done
      setCompletedIndexes((prev) => [...prev, currentIndex]);
      const nextIndex = currentIndex + 1;

      if (nextIndex >= exerciseList.length) {
        // Workout complete!
        setIsRunning(false);
        setWorkoutDone(true);
        saveWorkout();
      } else {
        // Start rest
        setIsResting(true);
        setRestTime(15);
        setTimeLeft(15);
        setIsRunning(true);
      }
    }
  }, [isResting, currentIndex, exerciseList]);

  const animateSlide = () => {
    slideAnim.setValue(50);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 80,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const saveWorkout = async () => {
    await addCompletedWorkout({
      date: format(new Date(), 'yyyy-MM-dd'),
      exerciseIds,
      duration: totalElapsed,
      completedAt: new Date().toISOString(),
    });
  };

  const handleSkip = () => {
    clearInterval(intervalRef.current);
    setCompletedIndexes((prev) => [...prev, currentIndex]);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= exerciseList.length) {
      setIsRunning(false);
      setWorkoutDone(true);
      saveWorkout();
    } else {
      animateSlide();
      setCurrentIndex(nextIndex);
      setTimeLeft(exerciseList[nextIndex].duration);
      setIsResting(false);
      setIsRunning(true);
    }
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Workout?',
      'Your progress will be lost.',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Quit',
          style: 'destructive',
          onPress: () => {
            clearInterval(intervalRef.current);
            clearInterval(elapsedRef.current);
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Workout complete screen
  if (workoutDone) {
    const totalCalories = exerciseList.reduce(
      (sum, ex) => sum + ex.caloriesBurn,
      0
    );
    return (
    <View style={[doneStyles.container, { paddingTop: insets.top }]}>
      <View style={doneStyles.content}>
        <View style={doneStyles.iconWrap}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        </View>

        <Text style={doneStyles.title}>Workout Complete</Text>
        <Text style={doneStyles.subtitle}>
          Great session. Consistency is what drives real results.
        </Text>

        <View style={doneStyles.statsCard}>
          <View style={doneStyles.statItem}>
            <Text style={doneStyles.statValue}>{exerciseList.length}</Text>
            <Text style={doneStyles.statLabel}>Exercises</Text>
          </View>
          <View style={doneStyles.statDivider} />
          <View style={doneStyles.statItem}>
            <Text style={doneStyles.statValue}>
              {Math.floor(totalElapsed / 60)}:{(totalElapsed % 60)
                .toString()
                .padStart(2, '0')}
            </Text>
            <Text style={doneStyles.statLabel}>Duration</Text>
          </View>
          <View style={doneStyles.statDivider} />
          <View style={doneStyles.statItem}>
            <Text style={doneStyles.statValue}>{totalCalories}</Text>
            <Text style={doneStyles.statLabel}>Calories</Text>
          </View>
        </View>

        <View style={doneStyles.tipCard}>
          <Text style={doneStyles.tipTitle}>Keep it up</Text>
          <Text style={doneStyles.tipText}>
            Daily stretching and posture exercises can improve alignment
            over time. Come back tomorrow to continue your streak.
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.base, paddingBottom: BOTTOM_PADDING + spacing.base }}>
        <TouchableOpacity
          style={doneStyles.btn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={doneStyles.btnText}>Back to Exercises</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        { backgroundColor: catColor + '08' },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.quitBtn}>
          <Text style={styles.quitText}>✕ Quit</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentIndex + 1} / {exerciseList.length}
        </Text>
        <Text style={styles.elapsed}>⏱ {formatTime(totalElapsed)}</Text>
      </View>

      {/* Step indicators */}
      <View style={styles.stepsContainer}>
        <ExerciseSteps
          exerciseList={exerciseList}
          currentIndex={currentIndex}
          completedIndexes={completedIndexes}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rest screen */}
        {isResting ? (
          <View style={styles.restContainer}>
            <Text style={styles.restEmoji}>😮‍💨</Text>
            <Text style={styles.restTitle}>Rest Time</Text>
            <Text style={[styles.restTimer, { color: colors.secondary }]}>
              {timeLeft}s
            </Text>
            <Text style={styles.restSub}>
              Next: {exerciseList[currentIndex + 1]?.name}
            </Text>
            <TouchableOpacity
              style={styles.skipRestBtn}
              onPress={() => {
                clearInterval(intervalRef.current);
                handleTimerComplete();
              }}
            >
              <Text style={styles.skipRestText}>Skip Rest →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.exerciseContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Exercise emoji */}
            <View
              style={[
                styles.exerciseEmoji,
                { backgroundColor: catColor + '20' },
              ]}
            >
              <Text style={styles.exerciseEmojiText}>
                {currentExercise?.emoji}
              </Text>
            </View>

            {/* Exercise name */}
            <Text style={styles.exerciseName}>{currentExercise?.name}</Text>
            <Text style={styles.exerciseDesc}>
              {currentExercise?.description}
            </Text>

            {/* Timer */}
            <CircularTimer
              timeLeft={timeLeft}
              total={currentExercise?.duration || 30}
              color={catColor}
              isRunning={isRunning}
            />

            {/* Sets/reps info */}
            {(currentExercise?.sets || currentExercise?.reps) && (
              <View style={styles.setsRow}>
                {currentExercise.sets && (
                  <View style={styles.setsBadge}>
                    <Text style={styles.setsValue}>
                      {currentExercise.sets}
                    </Text>
                    <Text style={styles.setsLabel}>Sets</Text>
                  </View>
                )}
                {currentExercise.reps && (
                  <View style={styles.setsBadge}>
                    <Text style={styles.setsValue}>
                      {currentExercise.reps}
                    </Text>
                    <Text style={styles.setsLabel}>Reps</Text>
                  </View>
                )}
              </View>
            )}

            {/* Instructions */}
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>Instructions</Text>
              {currentExercise?.instructions.map((inst, i) => (
                <View key={i} style={styles.instructionRow}>
                  <View
                    style={[
                      styles.instructionNum,
                      { backgroundColor: catColor },
                    ]}
                  >
                    <Text style={styles.instructionNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{inst}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Controls */}
      {!isResting && (
        <View
          style={[
            styles.controls,
            { paddingBottom: insets.bottom + 16 },
          ]}
        >
          {/* Play/Pause */}
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: catColor }]}
            onPress={() => setIsRunning(!isRunning)}
            activeOpacity={0.9}
          >
            <Text style={styles.playBtnText}>
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.skipBtnText}>Skip →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  quitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.errorBg,
    borderRadius: 10,
  },
  quitText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  elapsed: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  stepsContainer: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 120,
    gap: spacing.base,
  },

  // Rest
  restContainer: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.base,
  },
  restEmoji: { fontSize: 64 },
  restTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  restTimer: {
    fontSize: 72,
    fontWeight: '800',
  },
  restSub: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  skipRestBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.secondaryBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    marginTop: 8,
  },
  skipRestText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },

  // Exercise
  exerciseContainer: {
    alignItems: 'center',
    gap: spacing.base,
  },
  exerciseEmoji: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseEmojiText: { fontSize: 40 },
  exerciseName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  exerciseDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  setsRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  setsBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 2,
  },
  setsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  setsLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    width: '100%',
    gap: 10,
    ...shadow.sm,
    marginBottom: spacing['4xl'],
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  instructionNum: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  instructionNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
    fontWeight: '500',
  },

  // Controls
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 10,
  },
  playBtn: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    ...shadow.md,
    marginBottom: spacing.md,
  },
  playBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  skipBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  skipBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});

const doneStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 6,
    width: '100%',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 14,
    color: colors.textTertiary,
    lineHeight: 20,
  },
  btn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: colors.primary,
    //     shadowOffset: { width: 0, height: 6 },
    //     shadowOpacity: 0.18,
    //     shadowRadius: 12,
    //   },
    //   android: {
    //     elevation: 4,
    // //   },
    // }),
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
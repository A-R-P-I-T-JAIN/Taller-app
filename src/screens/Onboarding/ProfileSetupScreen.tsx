import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingStackParamList, RootStackParamList } from '../../navigation/types';
import { useUserStore, Gender, UserProfile } from '../../store/useUserStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import { feetInchesToCm } from '../../utils/growthCalculations';
import Button from '../../components/common/Button';
import { useGrowthStore } from '../../store/useGrowthStore';
import { useExerciseStore } from '../../store/useExerciseStore';
import { useSleepStore } from '../../store/useSleepStore';
import { useNutritionStore } from '../../store/useNutritionStore';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'ProfileSetup'>;
type RootNav = NativeStackNavigationProp<RootStackParamList>;

// ─── Step Indicator ───────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={stepStyles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.step,
            i < current
              ? stepStyles.completed
              : i === current
              ? stepStyles.active
              : stepStyles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  step: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  active: { backgroundColor: colors.primary },
  completed: { backgroundColor: colors.secondary },
  inactive: { backgroundColor: colors.border },
});

// ─── Input Field ──────────────────────────────────────────────
function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  suffix,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  suffix?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <View
        style={[
          inputStyles.inputRow,
          focused && inputStyles.focused,
          !!error && inputStyles.errorBorder,
        ]}
      >
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix && <Text style={inputStyles.suffix}>{suffix}</Text>}
      </View>
      {error ? <Text style={inputStyles.error}>{error}</Text> : null}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  container: { marginBottom: spacing.base },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  focused: { borderColor: colors.primary },
  errorBorder: { borderColor: colors.error },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  suffix: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});

// ─── Gender Selector ──────────────────────────────────────────
function GenderSelector({
  value,
  onChange,
}: {
  value: Gender;
  onChange: (g: Gender) => void;
}) {
  return (
    <View style={genderStyles.container}>
      <Text style={genderStyles.label}>GENDER</Text>
      <View style={genderStyles.row}>
        {(['male', 'female'] as Gender[]).map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              genderStyles.option,
              value === g && genderStyles.selected,
            ]}
            onPress={() => onChange(g)}
            activeOpacity={0.8}
          >
            <Text style={genderStyles.emoji}>
              {g === 'male' ? '👦' : '👧'}
            </Text>
            <Text
              style={[
                genderStyles.optionText,
                value === g && genderStyles.selectedText,
              ]}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const genderStyles = StyleSheet.create({
  container: { marginBottom: spacing.base },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', gap: 12 },
  option: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 6,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  emoji: { fontSize: 28 },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedText: { color: colors.primary },
});

// ─── Unit Toggle ──────────────────────────────────────────────
function UnitToggle({
  value,
  onChange,
}: {
  value: 'cm' | 'ft';
  onChange: (u: 'cm' | 'ft') => void;
}) {
  return (
    <View style={unitStyles.container}>
      {(['cm', 'ft'] as const).map((u) => (
        <TouchableOpacity
          key={u}
          style={[unitStyles.option, value === u && unitStyles.selected]}
          onPress={() => onChange(u)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              unitStyles.text,
              value === u && unitStyles.selectedText,
            ]}
          >
            {u === 'cm' ? 'Centimeters (cm)' : 'Feet & Inches (ft)'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const unitStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.base,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  selected: { backgroundColor: colors.primary },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedText: { color: '#FFFFFF' },
});

// ─── Main Component ───────────────────────────────────────────
export default function ProfileSetupScreen() {
  const navigation = useNavigation<Nav>();
  const rootNavigation = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();
  const setProfile = useUserStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const clearGrowth = useGrowthStore((s) => s.clearEntries);
const clearExercise = useExerciseStore((s) => s.clearWorkouts);
const clearSleep = useSleepStore((s) => s.clearEntries);
const clearNutrition = useNutritionStore((s) => s.clearLogs);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [fatherHeightCm, setFatherHeightCm] = useState('');
  const [motherHeightCm, setMotherHeightCm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  const animateStep = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!name.trim()) newErrors.name = 'Please enter your name';
      const ageNum = parseInt(age);
      if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 25) {
        newErrors.age = 'Please enter a valid age (10–25)';
      }
    }

    if (step === 1) {
      if (heightUnit === 'cm') {
        const h = parseFloat(heightCm);
        if (!heightCm || isNaN(h) || h < 100 || h > 250) {
          newErrors.height = 'Enter a valid height (100–250 cm)';
        }
      } else {
        const ft = parseFloat(heightFt);
        const ins = parseFloat(heightIn || '0');
        if (!heightFt || isNaN(ft) || ft < 3 || ft > 8) {
          newErrors.height = 'Enter valid feet (3–8)';
        }
        if (isNaN(ins) || ins < 0 || ins > 11) {
          newErrors.heightIn = 'Enter valid inches (0–11)';
        }
      }
      const w = parseFloat(weight);
      if (!weight || isNaN(w) || w < 20 || w > 200) {
        newErrors.weight = 'Enter a valid weight (20–200 kg)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < totalSteps - 1) {
      animateStep();
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (step > 0) {
      animateStep();
      setStep((s) => s - 1);
    } else {
      navigation.goBack();
    }
  };

  const getHeightInCm = (): number => {
    if (heightUnit === 'cm') return parseFloat(heightCm);
    return feetInchesToCm(
      parseFloat(heightFt),
      parseFloat(heightIn || '0')
    );
  };

  const handleSubmit = async () => {
  setLoading(true);
  try {

    await Promise.all([
      clearGrowth(),
      clearExercise(),
      clearSleep(),
      clearNutrition(),
    ]);

    const profile: UserProfile = {
      name: name.trim(),
      age: parseInt(age),
      gender,
      currentHeight: getHeightInCm(),
      currentWeight: parseFloat(weight),
      fatherHeight: fatherHeightCm
        ? parseFloat(fatherHeightCm)
        : null,
      motherHeight: motherHeightCm
        ? parseFloat(motherHeightCm)
        : null,
      heightUnit,
      goal: '',
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    };

    // Save profile
    await setProfile(profile);

    // Navigate to main app with fresh state
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
  } catch {
    Alert.alert(
      'Error',
      'Failed to save profile. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  // ─── Step Content ─────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <Text style={styles.stepTitle}>About You 👋</Text>
            <Text style={styles.stepSubtitle}>
              Let's personalize your experience
            </Text>
            <InputField
              label="Your Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              error={errors.name}
            />
            <InputField
              label="Your Age"
              value={age}
              onChangeText={setAge}
              placeholder="e.g. 16"
              keyboardType="numeric"
              suffix="years"
              error={errors.age}
            />
            <GenderSelector value={gender} onChange={setGender} />
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>💡</Text>
              <Text style={styles.infoText}>
                Growth happens mostly between ages 10–21. The earlier you
                start optimizing, the better your results!
              </Text>
            </View>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <Text style={styles.stepTitle}>Your Stats 📏</Text>
            <Text style={styles.stepSubtitle}>
              Current measurements for accurate tracking
            </Text>
            <Text style={inputStyles.label}>HEIGHT UNIT</Text>
            <UnitToggle value={heightUnit} onChange={setHeightUnit} />

            {heightUnit === 'cm' ? (
              <InputField
                label="Current Height"
                value={heightCm}
                onChangeText={setHeightCm}
                placeholder="e.g. 170"
                keyboardType="decimal-pad"
                suffix="cm"
                error={errors.height}
              />
            ) : (
              <View style={{ marginBottom: spacing.base }}>
                <Text style={inputStyles.label}>CURRENT HEIGHT</Text>
                <View style={styles.ftRow}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={[
                        inputStyles.inputRow,
                        !!errors.height && inputStyles.errorBorder,
                      ]}
                    >
                      <TextInput
                        style={inputStyles.input}
                        value={heightFt}
                        onChangeText={setHeightFt}
                        placeholder="5"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                      <Text style={inputStyles.suffix}>ft</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={[
                        inputStyles.inputRow,
                        !!errors.heightIn && inputStyles.errorBorder,
                      ]}
                    >
                      <TextInput
                        style={inputStyles.input}
                        value={heightIn}
                        onChangeText={setHeightIn}
                        placeholder="8"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                      <Text style={inputStyles.suffix}>in</Text>
                    </View>
                  </View>
                </View>
                {errors.height ? (
                  <Text style={inputStyles.error}>{errors.height}</Text>
                ) : null}
              </View>
            )}

            <InputField
              label="Current Weight"
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g. 60"
              keyboardType="decimal-pad"
              suffix="kg"
              error={errors.weight}
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <Text style={styles.stepTitle}>Parent Heights 🧬</Text>
            <Text style={styles.stepSubtitle}>
              Optional — improves prediction accuracy by 60%
            </Text>
            <InputField
              label="Father's Height"
              value={fatherHeightCm}
              onChangeText={setFatherHeightCm}
              placeholder="e.g. 178"
              keyboardType="decimal-pad"
              suffix="cm"
            />
            <InputField
              label="Mother's Height"
              value={motherHeightCm}
              onChangeText={setMotherHeightCm}
              placeholder="e.g. 165"
              keyboardType="decimal-pad"
              suffix="cm"
            />

            {fatherHeightCm && motherHeightCm && (
              <View style={styles.predictionCard}>
                <Text style={styles.predictionLabel}>
                  🧬 Genetic Height Potential
                </Text>
                <Text style={styles.predictionValue}>
                  {gender === 'male'
                    ? Math.round(
                        (parseFloat(fatherHeightCm) +
                          parseFloat(motherHeightCm) +
                          13) /
                          2
                      )
                    : Math.round(
                        (parseFloat(fatherHeightCm) +
                          parseFloat(motherHeightCm) -
                          13) /
                          2
                      )}{' '}
                  cm
                </Text>
                <Text style={styles.predictionSub}>
                  Mid-parental height estimate ± 8.5 cm
                </Text>
              </View>
            )}

            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>🔒</Text>
              <Text style={styles.infoText}>
                All data stays on your device. We never collect or share your
                personal information.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.skipParents}
            >
              <Text style={styles.skipParentsText}>
                Skip — I'll add this later
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <StepIndicator current={step} total={totalSteps} />
          <Text style={styles.stepCounter}>
            {step + 1}/{totalSteps}
          </Text>
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>

        {/* Bottom button */}
        <View style={styles.bottomSection}>
          <Button
            title={
              step === totalSteps - 1
                ? loading
                  ? 'Setting up...'
                  : "Let's Go! 🚀"
                : 'Continue →'
            }
            onPress={goNext}
            loading={loading}
            size="lg"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 20,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    minWidth: 30,
    textAlign: 'right',
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
    lineHeight: 22,
  },
  ftRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: 10,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  infoEmoji: { fontSize: 20 },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 19,
    fontWeight: '500',
  },
  predictionCard: {
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  predictionLabel: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  predictionSub: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  skipParents: {
    alignItems: 'center',
    paddingVertical: spacing.base,
    marginTop: spacing.sm,
  },
  skipParentsText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  bottomSection: {
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
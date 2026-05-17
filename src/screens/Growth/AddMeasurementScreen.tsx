import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGrowthStore } from '../../store/useGrowthStore';
import { useUserStore } from '../../store/useUserStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import { cmToFeetInches } from '../../utils/growthCalculations';
import Button from '../../components/common/Button';
import PercentileBadge from '../../components/common/PercentileBadge';

// ─── Height Input ─────────────────────────────────────────────
function HeightInput({
  value,
  onChange,
  unit,
  gender,
  age,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: 'cm' | 'ft';
  gender: 'male' | 'female';
  age: number;
}) {
  const [focused, setFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const heightInCm = value ? parseFloat(value) : 0;
  const showBadge = heightInCm >= 100 && heightInCm <= 250;

  return (
    <View style={heightStyles.container}>
      <Text style={heightStyles.label}>HEIGHT MEASUREMENT</Text>
      <Animated.View
        style={[
          heightStyles.inputCard,
          focused && heightStyles.inputCardFocused,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={heightStyles.inputRow}>
          <TextInput
            style={heightStyles.input}
            value={value}
            onChangeText={onChange}
            placeholder="170"
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus
          />
          <Text style={heightStyles.unit}>cm</Text>
        </View>
        {unit === 'ft' && heightInCm > 0 && (
          <Text style={heightStyles.converted}>
            ≈ {cmToFeetInches(heightInCm)}
          </Text>
        )}
      </Animated.View>

      {/* {showBadge && (
        <View style={heightStyles.badgeRow}>
          <PercentileBadge
            height={heightInCm}
            age={age}
            gender={gender}
            size="sm"
          />
          <Text style={heightStyles.badgeInfo}>vs WHO growth standards</Text>
        </View>
      )} */}
    </View>
  );
}

const heightStyles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadow.md,
  },
  inputCardFocused: {
    borderColor: colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    minWidth: 160,
    padding: 0,
  },
  unit: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  converted: {
    fontSize: 16,
    color: colors.textTertiary,
    fontWeight: '500',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.base,
    justifyContent: 'center',
  },
  badgeInfo: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});

// ─── Quick Adjust ─────────────────────────────────────────────
function QuickAdjust({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const adjust = (delta: number) => {
    const current = parseFloat(value) || 0;
    const newVal = Math.max(100, Math.min(250, current + delta));
    onChange(newVal.toFixed(1));
  };

  return (
    <View style={qaStyles.container}>
      <Text style={qaStyles.label}>QUICK ADJUST</Text>
      <View style={qaStyles.row}>
        {([-1, -0.5, 0.5, 1] as number[]).map((delta) => (
          <TouchableOpacity
            key={delta}
            style={qaStyles.btn}
            onPress={() => adjust(delta)}
            activeOpacity={0.7}
          >
            <Text style={qaStyles.btnText}>
              {delta > 0 ? `+${delta}` : `${delta}`} cm
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const qaStyles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

// ─── Measurement Tips ─────────────────────────────────────────
function MeasurementTips() {
  const tips = [
    { emoji: '🌅', tip: 'Measure in the morning' },
    { emoji: '🧱', tip: 'Stand against a wall' },
    { emoji: '👟', tip: 'No shoes, feet flat' },
    { emoji: '📐', tip: 'Use a flat object on head' },
  ];

  return (
    <View style={tipStyles.container}>
      <Text style={tipStyles.title}>Tips for accurate measurement</Text>
      <View style={tipStyles.grid}>
        {tips.map((t, i) => (
          <View key={i} style={tipStyles.tip}>
            <Text style={tipStyles.tipEmoji}>{t.emoji}</Text>
            <Text style={tipStyles.tipText}>{t.tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const tipStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tip: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 8,
  },
  tipEmoji: { fontSize: 16 },
  tipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
});

// ─── Main Screen ──────────────────────────────────────────────
export default function AddMeasurementScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const addEntry = useGrowthStore((s) => s.addEntry);
  const profile = useUserStore((s) => s.profile);
  const entries = useGrowthStore((s) => s.entries);

  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (entries.length > 0) {
      const last = entries[entries.length - 1];
      setHeight(last.height.toString());
    } else if (profile?.currentHeight) {
      setHeight(profile.currentHeight.toString());
    }
  }, []);

  const handleSave = async () => {
    const heightNum = parseFloat(height);
    if (!height || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      Alert.alert(
        'Invalid Height',
        'Please enter a valid height between 100 and 250 cm.'
      );
      return;
    }
    setLoading(true);
    try {
      await addEntry(heightNum, note.trim() || undefined);
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1200);
    } catch {
      Alert.alert('Error', 'Failed to save measurement.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Saved!</Text>
          <Text style={styles.successText}>
            {parseFloat(height).toFixed(1)} cm logged successfully
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Height</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Date badge */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <HeightInput
            value={height}
            onChange={setHeight}
            unit={profile?.heightUnit || 'cm'}
            gender={profile?.gender || 'male'}
            age={profile?.age || 16}
          />

          <QuickAdjust value={height} onChange={setHeight} />

          {/* Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>NOTE (OPTIONAL)</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Measured in the morning..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={2}
            />
          </View>

          <MeasurementTips />
        </ScrollView>

        {/* Save button */}
        <View
          style={[
            styles.bottomSection,
            { paddingBottom: insets.bottom + 100 },
          ]}
        >
          <Button
            title={loading ? 'Saving...' : 'Save Measurement 📏'}
            onPress={handleSave}
            loading={loading}
            disabled={!height}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 24,
  },
  dateBadge: {
    // backgroundColor: colors.primaryBg,
    borderRadius: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  dateBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.info,
  },
  noteContainer: {
    marginBottom: spacing.xl,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.base,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  bottomSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    alignItems: 'center',
    gap: 12,
  },
  successEmoji: { fontSize: 64 },
  successTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.success,
  },
  successText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
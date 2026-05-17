  import React, { useState, useEffect } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
  } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';
  import { useSleepStore } from '../../store/useSleepStore';
  import { colors } from '../../theme/colors';
  import { spacing, borderRadius, shadow } from '../../theme/spacing';
  import { format } from 'date-fns';
  import Button from '../../components/common/Button';

  const QUALITY_LEVELS = [
    { value: 1 as const, emoji: '😴', label: 'Very Poor', color: colors.error },
    { value: 2 as const, emoji: '😔', label: 'Poor', color: colors.accent },
    { value: 3 as const, emoji: '😐', label: 'Okay', color: colors.warning },
    { value: 4 as const, emoji: '😌', label: 'Good', color: colors.secondary },
    { value: 5 as const, emoji: '😊', label: 'Excellent', color: colors.success },
  ];

  // ─── Time Picker ──────────────────────────────────────────────
  function TimePicker({
    label,
    hour,
    minute,
    onHourChange,
    onMinuteChange,
    period,
    onPeriodChange,
  }: {
    label: string;
    hour: string;
    minute: string;
    onHourChange: (v: string) => void;
    onMinuteChange: (v: string) => void;
    period: 'AM' | 'PM';
    onPeriodChange: (v: 'AM' | 'PM') => void;
  }) {
    return (
      <View style={timeStyles.container}>
        <Text style={timeStyles.label}>{label}</Text>
        <View style={timeStyles.row}>
          {/* Hour */}
          <View style={timeStyles.inputWrapper}>
            <TextInput
              style={timeStyles.input}
              value={hour}
              onChangeText={(v) => {
                const num = parseInt(v);
                if (v === '' || (num >= 1 && num <= 12)) onHourChange(v);
              }}
              keyboardType="numeric"
              maxLength={2}
              placeholder="10"
              placeholderTextColor={colors.textTertiary}
              textAlign="center"
            />
          </View>
          <Text style={timeStyles.colon}>:</Text>
          {/* Minute */}
          <View style={timeStyles.inputWrapper}>
            <TextInput
              style={timeStyles.input}
              value={minute}
              onChangeText={(v) => {
                const num = parseInt(v);
                if (v === '' || (num >= 0 && num <= 59)) onMinuteChange(v);
              }}
              keyboardType="numeric"
              maxLength={2}
              placeholder="30"
              placeholderTextColor={colors.textTertiary}
              textAlign="center"
            />
          </View>
          {/* AM/PM */}
          <View style={timeStyles.periodContainer}>
            {(['AM', 'PM'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  timeStyles.periodBtn,
                  period === p && timeStyles.periodBtnActive,
                ]}
                onPress={() => onPeriodChange(p)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    timeStyles.periodText,
                    period === p && timeStyles.periodTextActive,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  const timeStyles = StyleSheet.create({
    container: {
      gap: 8,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textTertiary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    inputWrapper: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      width: 64,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
      width: '100%',
      textAlign: 'center',
    },
    colon: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    periodContainer: {
      flexDirection: 'column',
      gap: 4,
      marginLeft: 4,
    },
    periodBtn: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    periodBtnActive: {
      backgroundColor: colors.primaryBg,
      borderColor: colors.primary,
    },
    periodText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textTertiary,
    },
    periodTextActive: {
      color: colors.primary,
    },
  });

  // ─── Quality Selector ─────────────────────────────────────────
  function QualitySelector({
    selected,
    onSelect,
  }: {
    selected: number;
    onSelect: (v: number) => void;
  }) {
    return (
      <View style={qualityStyles.container}>
        <Text style={qualityStyles.label}>HOW WAS YOUR SLEEP?</Text>
        <View style={qualityStyles.grid}>
          {QUALITY_LEVELS.map((level) => {
            const isSelected = selected === level.value;
            return (
              <TouchableOpacity
                key={level.value}
                style={[
                  qualityStyles.card,
                  isSelected && {
                    borderColor: level.color,
                    backgroundColor: level.color + '12',
                  },
                ]}
                onPress={() => onSelect(level.value)}
                activeOpacity={0.8}
              >
                <Text style={qualityStyles.emoji}>{level.emoji}</Text>
                <Text
                  style={[
                    qualityStyles.cardLabel,
                    isSelected && { color: level.color },
                  ]}
                >
                  {level.label}
                </Text>
                {isSelected && (
                  <View
                    style={[
                      qualityStyles.check,
                      { backgroundColor: level.color },
                    ]}
                  >
                    <Text style={qualityStyles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  const qualityStyles = StyleSheet.create({
    container: {
      gap: 12,
      marginBottom: spacing.xl,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textTertiary,
      letterSpacing: 1,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    card: {
      width: '47%',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      alignItems: 'center',
      gap: 6,
      borderWidth: 2,
      borderColor: colors.border,
      ...shadow.sm,
    },
    emoji: { fontSize: 32 },
    cardLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    check: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
    },
  });

  // ─── Duration Badge ───────────────────────────────────────────
  function DurationBadge({ hours, minutes }: { hours: number; minutes: number }) {
    const total = hours * 60 + minutes;
    const getColor = () => {
      if (total >= 9 * 60) return colors.success;
      if (total >= 7 * 60) return colors.warning;
      return colors.error;
    };
    const getMessage = () => {
      if (total >= 9 * 60) return 'Excellent for growth! 🌱';
      if (total >= 8 * 60) return 'Good sleep duration ✓';
      if (total >= 7 * 60) return 'Could be better 😐';
      return 'Too little for growth ⚠️';
    };
    const color = getColor();

    return (
      <View
        style={[
          durStyles.container,
          { backgroundColor: color + '12', borderColor: color + '30' },
        ]}
      >
        <Text style={[durStyles.duration, { color }]}>
          {hours}h {minutes}m
        </Text>
        <Text style={[durStyles.message, { color }]}>{getMessage()}</Text>
      </View>
    );
  }

  const durStyles = StyleSheet.create({
    container: {
      borderRadius: borderRadius.lg,
      borderWidth: 1.5,
      padding: spacing.base,
      alignItems: 'center',
      gap: 4,
      marginBottom: spacing.xl,
    },
    duration: {
      fontSize: 32,
      fontWeight: '800',
    },
    message: {
      fontSize: 13,
      fontWeight: '600',
    },
  });

  // ─── Main Screen ──────────────────────────────────────────────
  export default function LogSleepScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const addEntry = useSleepStore((s) => s.addEntry);
    const getTodayEntry = useSleepStore((s) => s.getTodayEntry);
    const entries = useSleepStore((s) => s.entries);

    // Bed time state
    const [bedHour, setBedHour] = useState('10');
    const [bedMinute, setBedMinute] = useState('30');
    const [bedPeriod, setBedPeriod] = useState<'AM' | 'PM'>('PM');

    // Wake time state
    const [wakeHour, setWakeHour] = useState('6');
    const [wakeMinute, setWakeMinute] = useState('30');
    const [wakePeriod, setWakePeriod] = useState<'AM' | 'PM'>('AM');

    const [selectedQuality, setSelectedQuality] = useState<number>(3);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Pre-fill if already logged
    useEffect(() => {
      const today = getTodayEntry();
      if (today) {
        setSelectedQuality(today.quality);
        setNote(today.note || '');
      }
    }, []);

    // Convert to 24h and calculate duration
    const to24Hour = (
      h: string,
      m: string,
      period: 'AM' | 'PM'
    ): { hour: number; minute: number } => {
      let hour = parseInt(h) || 0;
      const minute = parseInt(m) || 0;
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return { hour, minute };
    };

    const calculateDuration = (): { hours: number; minutes: number } => {
      const bed = to24Hour(bedHour, bedMinute, bedPeriod);
      const wake = to24Hour(wakeHour, wakeMinute, wakePeriod);

      let bedMinutes = bed.hour * 60 + bed.minute;
      let wakeMinutes = wake.hour * 60 + wake.minute;

      // If wake is before bed (next day)
      if (wakeMinutes <= bedMinutes) {
        wakeMinutes += 24 * 60;
      }

      const totalMinutes = wakeMinutes - bedMinutes;
      return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
      };
    };

    const duration = calculateDuration();

    const buildDateTime = (
      h: string,
      m: string,
      period: 'AM' | 'PM',
      isWake: boolean
    ): Date => {
      const { hour, minute } = to24Hour(h, m, period);
      const now = new Date();
      const date = new Date(now);
      date.setHours(hour, minute, 0, 0);

      // If wake time is after bed in same day, bed is yesterday
      if (isWake) {
        const bedH = to24Hour(bedHour, bedMinute, bedPeriod);
        const bedTotalMin = bedH.hour * 60 + bedH.minute;
        const wakeTotalMin = hour * 60 + minute;
        if (wakeTotalMin <= bedTotalMin) {
          // wake is next day, bed is today → already correct
        }
      } else {
        // bed time — check if it should be yesterday
        date.setDate(now.getDate() - 1);
      }
      return date;
    };

    const handleSave = async () => {
      const existingEntry = getTodayEntry();
      if (existingEntry) {
        Alert.alert(
          'Already Logged',
          'You have already logged sleep for today. Delete the existing entry first.',
          [{ text: 'OK' }]
        );
        return;
      }

      const totalMinutes = duration.hours * 60 + duration.minutes;
      if (totalMinutes < 30 || totalMinutes > 720) {
        Alert.alert(
          'Invalid Duration',
          'Please enter a valid sleep duration (30 minutes to 12 hours).'
        );
        return;
      }

      setLoading(true);
      try {
        const bedDate = buildDateTime(bedHour, bedMinute, bedPeriod, false);
        const wakeDate = buildDateTime(wakeHour, wakeMinute, wakePeriod, true);

        await addEntry({
          date: format(new Date(), 'yyyy-MM-dd'),
          bedTime: bedDate.toISOString(),
          wakeTime: wakeDate.toISOString(),
          quality: selectedQuality as 1 | 2 | 3 | 4 | 5,
          note: note.trim() || undefined,
        });

        setSuccess(true);
        setTimeout(() => navigation.goBack(), 1200);
      } catch (err) {
        Alert.alert('Error', 'Failed to save sleep log.');
      } finally {
        setLoading(false);
      }
    };

    // ─── Success Screen ───────────────────────────────────────
    if (success) {
      return (
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Sleep Logged!</Text>
          <Text style={styles.successText}>
            {duration.hours}h {duration.minutes}m recorded
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Sleep</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Date */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              {'📅 '}
              {format(new Date(), 'EEEE, MMMM d')}
            </Text>
          </View>

          {/* Time section */}
          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>Sleep Times</Text>
            <View style={styles.timePickers}>
              <TimePicker
                label="BED TIME"
                hour={bedHour}
                minute={bedMinute}
                period={bedPeriod}
                onHourChange={setBedHour}
                onMinuteChange={setBedMinute}
                onPeriodChange={setBedPeriod}
              />
              <View style={styles.timeArrow}>
                <Text style={styles.timeArrowText}>↓</Text>
              </View>
              <TimePicker
                label="WAKE TIME"
                hour={wakeHour}
                minute={wakeMinute}
                period={wakePeriod}
                onHourChange={setWakeHour}
                onMinuteChange={setWakeMinute}
                onPeriodChange={setWakePeriod}
              />
            </View>
          </View>

          {/* Duration */}
          <DurationBadge
            hours={duration.hours}
            minutes={duration.minutes}
          />

          {/* Quality */}
          <QualitySelector
            selected={selectedQuality}
            onSelect={setSelectedQuality}
          />

          {/* Note */}
          <View style={styles.noteSection}>
            <Text style={styles.noteSectionLabel}>NOTE (OPTIONAL)</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Woke up feeling refreshed..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>

          {/* GH Info card */}
          <View style={styles.ghCard}>
            <Text style={styles.ghTitle}>🧬 Growth Hormone Tip</Text>
            <Text style={styles.ghText}>
              80% of daily growth hormone is released during the first few hours
              of deep sleep. Going to bed before 11 PM maximizes this window
              for teens and young adults.
            </Text>
          </View>
        </ScrollView>

        {/* Save */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 100 }]}>
          <Button
            title={loading ? 'Saving...' : 'Save Sleep Log 🌙'}
            onPress={handleSave}
            loading={loading}
            size="lg"
          />
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    scrollContent: {
      padding: spacing.base,
      paddingBottom: 120,
    },
    dateBadge: {
      backgroundColor: colors.primaryBg,
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 14,
      alignSelf: 'flex-start',
      marginBottom: spacing.xl,
    },
    dateBadgeText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
    },
    timeSection: {
      marginBottom: spacing.xl,
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    timePickers: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeArrow: {
      alignItems: 'center',
      paddingVertical: 4,
    },
    timeArrowText: {
      fontSize: 20,
      color: colors.textTertiary,
      fontWeight: '600',
    },
    noteSection: {
      marginBottom: spacing.xl,
      gap: 8,
    },
    noteSectionLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textTertiary,
      letterSpacing: 1,
    },
    noteInput: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: spacing.base,
      fontSize: 14,
      color: colors.textPrimary,
      minHeight: 70,
      textAlignVertical: 'top',
    },
    ghCard: {
      backgroundColor: '#F5F3FF',
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      gap: 8,
      borderWidth: 1,
      borderColor: '#8B5CF620',
      marginBottom: spacing.base,
    },
    ghTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: '#8B5CF6',
    },
    ghText: {
      fontSize: 13,
      color: '#8B5CF6',
      lineHeight: 19,
      opacity: 0.9,
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
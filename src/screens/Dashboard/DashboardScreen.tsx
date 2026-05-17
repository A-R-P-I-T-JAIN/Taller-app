import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/useUserStore';
import { useGrowthStore } from '../../store/useGrowthStore';
import { useExerciseStore } from '../../store/useExerciseStore';
import { useSleepStore } from '../../store/useSleepStore';
import { useNutritionStore } from '../../store/useNutritionStore';
import { useHealthScore } from '../../hooks/useHealthScore';
import { useGrowthProjection } from '../../hooks/useGrowthProjection';
import { TabParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadow } from '../../theme/spacing';
import { formatHeight } from '../../utils/growthCalculations';
import { formatDate } from '../../utils/dateHelpers';
import { BOTTOM_PADDING } from '../../utils/layout';
import ProgressBar from '../../components/common/ProgressBar';
import { Ionicons } from '@expo/vector-icons';

type Nav = BottomTabNavigationProp<TabParamList>;

// ─── Health Score Ring ────────────────────────────────────────
function HealthScoreRing({
    score,
    color,
    label,
}: {
    score: number;
    color: string;
    label: string;
}) {
    return (
        <View style={ringStyles.container}>
            <View style={[ringStyles.ring, { borderColor: color + '40' }]}>
                <View
                    style={[
                        ringStyles.innerRing,
                        { backgroundColor: color + '15' },
                    ]}
                >
                    <Text style={[ringStyles.score, { color }]}>{score}</Text>
                    <Text style={ringStyles.outOf}>/100</Text>
                </View>
            </View>
            <Text style={[ringStyles.label, { color }]}>{label}</Text>
        </View>
    );
}

const ringStyles = StyleSheet.create({
    container: { alignItems: 'center', gap: 8 },
    ring: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    score: {
        fontSize: 34,
        fontWeight: '800',
        lineHeight: 38,
    },
    outOf: {
        fontSize: 12,
        color: colors.textTertiary,
        fontWeight: '600',
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
    },
});

// ─── Quick Action Card ────────────────────────────────────────
function QuickAction({
    emoji,
    title,
    sub,
    done,
    color,
    onPress,
}: {
    emoji: string;
    title: string;
    sub: string;
    done: boolean;
    color: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={[
                qaStyles.card,
                done && {
                    backgroundColor: colors.successBg,
                    borderColor: colors.success + '40',
                },
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View
                style={[
                    qaStyles.emojiBox,
                    {
                        backgroundColor: done
                            ? colors.successBg
                            : color + '15',
                    },
                ]}
            >
                <Text style={qaStyles.emoji}>{done ? '✅' : emoji}</Text>
            </View>
            <View style={qaStyles.textBox}>
                <Text
                    style={[
                        qaStyles.title,
                        done && { color: colors.success },
                    ]}
                >
                    {title}
                </Text>
                <Text style={qaStyles.sub}>{sub}</Text>
            </View>
            <Text style={qaStyles.arrow}>›</Text>
        </TouchableOpacity>
    );
}

const qaStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1.5,
        borderColor: colors.border,
        ...shadow.sm,
    },
    emojiBox: {
        width: 44,
        height: 44,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: { fontSize: 22 },
    textBox: { flex: 1 },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    sub: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 2,
        fontWeight: '500',
    },
    arrow: {
        fontSize: 22,
        color: colors.textTertiary,
    },
});

// ─── Score Breakdown ──────────────────────────────────────────
function ScoreBreakdown({
    label,
    score,
    max,
    color,
    emoji,
}: {
    label: string;
    score: number;
    max: number;
    color: string;
    emoji: string;
}) {
    return (
        <View style={breakdownStyles.container}>
            <View style={breakdownStyles.row}>
                <Text style={breakdownStyles.emoji}>{emoji}</Text>
                <Text style={breakdownStyles.label}>{label}</Text>
                <Text style={[breakdownStyles.score, { color }]}>
                    {score}/{max}
                </Text>
            </View>
            <ProgressBar
                progress={(score / max) * 100}
                color={color}
                height={6}
            />
        </View>
    );
}

const breakdownStyles = StyleSheet.create({
    container: { gap: 6 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emoji: { fontSize: 14, width: 20 },
    label: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    score: {
        fontSize: 12,
        fontWeight: '800',
    },
});

// ─── Main Dashboard ───────────────────────────────────────────
export default function DashboardScreen() {
    const navigation = useNavigation<Nav>();
    const insets = useSafeAreaInsets();
    const profile = useUserStore((s) => s.profile);
    const healthScore = useHealthScore();
    const projection = useGrowthProjection();

    const entries = useGrowthStore((s) => s.entries);
    const isCompletedToday = useExerciseStore((s) => s.isCompletedToday);
    const currentStreak = useExerciseStore((s) => s.currentStreak);
    const sleepEntries = useSleepStore((s) => s.entries);
    const todayLog = useNutritionStore((s) => s.todayLog);
    const getTodayCompletion = useNutritionStore(
        (s) => s.getTodayCompletion
    );

    const [refreshing, setRefreshing] = React.useState(false);

    const latestHeight =
        entries.length > 0
            ? entries[entries.length - 1].height
            : profile?.currentHeight || 0;

    const lastSleep =
        sleepEntries.length > 0
            ? sleepEntries[sleepEntries.length - 1]
            : null;

    const exerciseDone = isCompletedToday();
    const nutritionPercent = getTodayCompletion();
    const hasSleepToday = !!lastSleep;

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const formatSleep = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    const dailyTips = [
        'Sleep before 10 PM to maximize growth hormone release during the prime window (10 PM - 2 AM).',
        'Dead hangs from a pull-up bar for 30 seconds helps decompress the spine.',
        'Calcium absorption is enhanced by Vitamin D. Get 15 minutes of morning sunlight daily.',
        'Posture exercises can add 1-3 cm of functional height over time.',
        'Drink water consistently — your spinal discs need hydration to stay at full height.',
        'Zinc deficiency is one of the most common nutritional causes of growth delays in teens.',
        'Consistency is key — 30 days of daily routines is when you start seeing real improvements.',
    ];

    if (!profile) return null;

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.greeting}>
                        {getGreeting()},{' '}
                        <Text style={styles.greetingName}>
                            {profile.name.split(' ')[0]}
                        </Text>{' '}
                        👋
                    </Text>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() => {
                        const parent = navigation.getParent();
                        if (parent) {
                            parent.navigate('Dashboard', { screen: 'Profile' });
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.profileEmoji}>
                        <Ionicons name="person-outline" size={24} />
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: BOTTOM_PADDING },
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Health Score Card */}
                <View style={styles.scoreCard}>
                    <View style={styles.scoreCardTop}>
                        <View style={styles.scoreCardLeft}>
                            <Text style={styles.scoreCardLabel}>
                                DAILY HEALTH SCORE
                            </Text>
                            <Text style={styles.scoreCardSub}>
                                {healthScore.label}
                            </Text>
                            <View style={styles.streakBadge}>
                                <Text style={styles.streakText}>
                                    🔥 {currentStreak} day streak
                                </Text>
                            </View>
                        </View>
                        <HealthScoreRing
                            score={healthScore.total}
                            color={healthScore.color}
                            label={
                                healthScore.total >= 75 ? 'Excellent' : 'Keep going'
                            }
                        />
                    </View>

                    {/* Score breakdown */}
                    <View style={styles.scoreBreakdown}>
                        <ScoreBreakdown
                            emoji="😴"
                            label="Sleep"
                            score={healthScore.sleep}
                            max={25}
                            color="#8B5CF6"
                        />
                        <ScoreBreakdown
                            emoji="🏋️"
                            label="Exercise"
                            score={healthScore.exercise}
                            max={30}
                            color={colors.secondary}
                        />
                        <ScoreBreakdown
                            emoji="🥗"
                            label="Nutrition"
                            score={healthScore.nutrition}
                            max={30}
                            color={colors.success}
                        />
                        <ScoreBreakdown
                            emoji="🔥"
                            label="Consistency"
                            score={healthScore.consistency}
                            max={15}
                            color={colors.accent}
                        />
                    </View>
                </View>

                {/* Height card */}
                <View style={styles.heightCard}>
                    <View style={styles.heightLeft}>
                        <Text style={styles.heightLabel}>CURRENT HEIGHT</Text>
                        <Text style={styles.heightValue}>
                            {formatHeight(latestHeight, profile.heightUnit)}
                        </Text>
                        {projection && (
                            <Text style={styles.heightProjection}>
                                🔮 Projected:{' '}
                                {formatHeight(
                                    projection.projectedHeight,
                                    profile.heightUnit
                                )}
                            </Text>
                        )}
                    </View>
                    <View style={styles.heightRight}>
                        <Text style={styles.heightEmoji}>📏</Text>
                        <Text style={styles.heightEntries}>
                            {entries.length} log
                            {entries.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                </View>

                {/* Today's tasks */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Today's Tasks</Text>
                    <View style={styles.taskList}>
                        <QuickAction
                            emoji="🏋️"
                            title="Daily Workout"
                            sub={
                                exerciseDone ? 'Completed!' : 'Start your routine'
                            }
                            done={exerciseDone}
                            color={colors.secondary}
                            onPress={() =>
                                navigation.navigate('Exercise')
                            }
                        />
                        <QuickAction
                            emoji="😴"
                            title="Log Sleep"
                            sub={
                                hasSleepToday
                                    ? `${formatSleep(lastSleep!.duration)} logged`
                                    : "Log last night's sleep"
                            }
                            done={hasSleepToday}
                            color="#8B5CF6"
                            onPress={() => navigation.navigate('Sleep')}
                        />
                        <QuickAction
                            emoji="🥗"
                            title="Nutrition Check"
                            sub={`${nutritionPercent}% of daily nutrients`}
                            done={nutritionPercent >= 80}
                            color={colors.success}
                            onPress={() => navigation.navigate('Nutrition')}
                        />
                        <QuickAction
                            emoji="📏"
                            title="Log Height"
                            sub={
                                entries.length > 0
                                    ? `Last: ${formatDate(
                                        entries[entries.length - 1].date
                                    )}`
                                    : 'No measurements yet'
                            }
                            done={false}
                            color={colors.primary}
                            onPress={() => navigation.navigate('Growth')}
                        />
                    </View>
                </View>

                {/* Quick stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Stats</Text>
                    <View style={styles.quickStatsGrid}>
                        {[
                            {
                                emoji: '📏',
                                value: formatHeight(
                                    latestHeight,
                                    profile.heightUnit
                                ),
                                label: 'Height',
                                color: colors.primary,
                            },
                            {
                                emoji: '😴',
                                value: lastSleep
                                    ? formatSleep(lastSleep.duration)
                                    : '—',
                                label: 'Last Sleep',
                                color: '#8B5CF6',
                            },
                            {
                                emoji: '🔥',
                                value: `${currentStreak}d`,
                                label: 'Streak',
                                color: colors.accent,
                            },
                            {
                                emoji: '💧',
                                value: `${todayLog?.waterGlasses || 0}/8`,
                                label: 'Water',
                                color: colors.info,
                            },
                        ].map((s, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.quickStatCard,
                                    { borderColor: s.color + '20' },
                                ]}
                            >
                                <Text style={styles.quickStatEmoji}>
                                    {s.emoji}
                                </Text>
                                <Text
                                    style={[
                                        styles.quickStatValue,
                                        { color: s.color },
                                    ]}
                                >
                                    {s.value}
                                </Text>
                                <Text style={styles.quickStatLabel}>
                                    {s.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Tip of the day */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipTitle}>💡 Tip of the Day</Text>
                    <Text style={styles.tipText}>
                        {dailyTips[new Date().getDay()]}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        backgroundColor: colors.background,
    },
    headerLeft: { flex: 1 },
    greeting: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    greetingName: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primary,
    },
    date: {
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 2,
        fontWeight: '500',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary + '30',
    },
    profileEmoji: { fontSize: 24 },
    scrollContent: {
        padding: spacing.base,
        gap: spacing.base,
    },
    scoreCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: spacing.xl,
        gap: spacing.xl,
        ...shadow.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    scoreCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scoreCardLeft: {
        flex: 1,
        gap: 8,
        marginRight: spacing.base,
    },
    scoreCardLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textTertiary,
        letterSpacing: 1.5,
    },
    scoreCardSub: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    streakBadge: {
        backgroundColor: colors.accentBg,
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    streakText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.accent,
    },
    scoreBreakdown: {
        gap: 12,
        paddingTop: spacing.base,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    heightCard: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: spacing.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shadow.colored(colors.primary),
    },
    heightLeft: { gap: 4, flex: 1 },
    heightLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1.5,
    },
    heightValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    heightProjection: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '500',
    },
    heightRight: {
        alignItems: 'center',
        gap: 4,
    },
    heightEmoji: { fontSize: 36 },
    heightEntries: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    section: { gap: 12 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    taskList: { gap: 8 },
    quickStatsGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    quickStatCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        alignItems: 'center',
        gap: 4,
        borderWidth: 1.5,
        ...shadow.sm,
    },
    quickStatEmoji: { fontSize: 18 },
    quickStatValue: {
        fontSize: 13,
        fontWeight: '800',
    },
    quickStatLabel: {
        fontSize: 10,
        color: colors.textTertiary,
        fontWeight: '600',
        textAlign: 'center',
    },
    tipCard: {
        backgroundColor: colors.primaryBg,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.primary + '25',
    },
    tipTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.primary,
    },
    tipText: {
        fontSize: 13,
        color: colors.primary,
        lineHeight: 21,
        opacity: 0.9,
    },
});
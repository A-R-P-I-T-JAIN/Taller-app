import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Pressable,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

import { TabParamList } from './types';
import DashboardNavigator from './DashboardNavigator';
import GrowthNavigator from './GrowthNavigator';
import ExerciseNavigator from './ExerciseNavigator';
import SleepNavigator from './SleepNavigator';
import NutritionNavigator from './NutritionNavigator';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_CONFIG = [
  { name: 'Dashboard' as const, component: DashboardNavigator, icon: 'home', label: 'Home' },
  { name: 'Growth' as const, component: GrowthNavigator, icon: 'stats-chart', label: 'Growth' },
  { name: 'Exercise' as const, component: ExerciseNavigator, icon: 'barbell', label: 'Exercise' },
  { name: 'Sleep' as const, component: SleepNavigator, icon: 'moon', label: 'Sleep' },
  { name: 'Nutrition' as const, component: NutritionNavigator, icon: 'nutrition', label: 'Nutrition' },
];

const TAB_COUNT = TAB_CONFIG.length;
const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_BAR_H_PADDING = 16;
const TAB_BAR_INNER_PADDING = 8;
const INDICATOR_HEIGHT = 48;
const INDICATOR_H_MARGIN = 4;

// ─── Animated Tab Icon ────────────────────────────────────────
interface AnimatedTabIconProps {
  icon: string;
  label: string;
  focused: boolean;
  color: string;
}

function AnimatedTabIcon({ icon, label, focused, color }: AnimatedTabIconProps) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.15 : 1)).current;
  const translateY = useRef(new Animated.Value(focused ? -3 : 0)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.15 : 1,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -3 : 0,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.timing(labelOpacity, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  const iconName = focused ? icon : `${icon}-outline`;

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateY }],
        }}
      >
        <Ionicons name={iconName} size={21} color={color} />
      </Animated.View>

      <Animated.Text
        style={[
          styles.tabLabel,
          { color, opacity: labelOpacity },
          focused && styles.tabLabelActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
    </View>
  );
}

// ─── Animated Tab Button ──────────────────────────────────────
interface AnimatedTabButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  accessibilityState?: { selected?: boolean };
  style?: any;
}

function AnimatedTabButton({
  children,
  onPress,
  onLongPress,
  accessibilityLabel,
  accessibilityState,
  style,
  ...rest
}: AnimatedTabButtonProps) {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.9,
      friction: 5,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 3,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      style={[style, styles.tabButton]}
      {...rest}
    >
      <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── Custom Tab Bar with Sliding Indicator ────────────────────
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const indicatorScaleX = useRef(new Animated.Value(1)).current;

  const tabWidth = tabBarWidth > 0
    ? (tabBarWidth - TAB_BAR_INNER_PADDING * 2) / TAB_COUNT
    : 0;

  const indicatorWidth = tabWidth - INDICATOR_H_MARGIN * 2;

  // Slide indicator when active tab changes
  useEffect(() => {
    if (tabWidth <= 0) return;

    const toValue =
      TAB_BAR_INNER_PADDING +
      state.index * tabWidth +
      INDICATOR_H_MARGIN;

    // Stretch effect while sliding
    Animated.sequence([
      Animated.timing(indicatorScaleX, {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue,
          friction: 7,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorScaleX, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [state.index, tabWidth]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setTabBarWidth(width);

    // Set initial position immediately
    if (width > 0) {
      const tw = (width - TAB_BAR_INNER_PADDING * 2) / TAB_COUNT;
      slideAnim.setValue(
        TAB_BAR_INNER_PADDING + state.index * tw + INDICATOR_H_MARGIN
      );
    }
  }, []);

  return (
    <View
      style={[
        styles.tabBar,
        { bottom: Math.max(insets.bottom - 6, 12) },
      ]}
      onLayout={handleLayout}
    >
      {/* ── Sliding Indicator ── */}
      {tabBarWidth > 0 && (
        <Animated.View
          style={[
            styles.slidingIndicator,
            {
              width: indicatorWidth,
              height: INDICATOR_HEIGHT,
              transform: [
                { translateX: slideAnim },
                { scaleX: indicatorScaleX },
              ],
            },
          ]}
        />
      )}

      {/* ── Tab Buttons ── */}
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = TAB_CONFIG[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <AnimatedTabButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityLabel={config.label}
            accessibilityState={{ selected: isFocused }}
          >
            <AnimatedTabIcon
              icon={config.icon}
              label={config.label}
              focused={isFocused}
              color={isFocused ? colors.primary : colors.textTertiary}
            />
          </AnimatedTabButton>
        );
      })}
    </View>
  );
}

// ─── Main Navigator ──────────────────────────────────────────
export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {TAB_CONFIG.map(({ name, component, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarAccessibilityLabel: label,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: TAB_BAR_H_PADDING,
    right: TAB_BAR_H_PADDING,
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: TAB_BAR_INNER_PADDING,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.1,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      },
      android: {
        elevation: 12,
      },
    }),
  },

  slidingIndicator: {
    position: 'absolute',
    top: (78 - INDICATOR_HEIGHT) / 2,
    left: 0,
    borderRadius: 16,
    backgroundColor: colors.primaryBg,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
    }),
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    height: 54,
  },

  tabLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  tabLabelActive: {
    fontWeight: '700',
  },
});
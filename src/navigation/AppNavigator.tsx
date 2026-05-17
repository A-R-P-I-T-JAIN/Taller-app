import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import OnboardingNavigator from './OnboardingNavigator';
import TabNavigator from './TabNavigator';
import { useUserStore } from '../store/useUserStore';
import { useGrowthStore } from '../store/useGrowthStore';
import { useExerciseStore } from '../store/useExerciseStore';
import { useSleepStore } from '../store/useSleepStore';
import { useNutritionStore } from '../store/useNutritionStore';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { profile, isLoading, loadProfile } = useUserStore();
  const { loadEntries } = useGrowthStore();
  const { loadWorkouts } = useExerciseStore();
  const { loadEntries: loadSleep } = useSleepStore();
  const { loadLogs } = useNutritionStore();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await loadProfile();
    await loadEntries();
    await loadWorkouts();
    await loadSleep();
    await loadLogs();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const showOnboarding =
    !profile || !profile.onboardingComplete;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showOnboarding ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingNavigator}
          options={{ animation: 'fade' }}
        />
      ) : (
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{ animation: 'fade' }}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
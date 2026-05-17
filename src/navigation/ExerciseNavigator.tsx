import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExerciseStackParamList } from './types';
import ExerciseScreen from '../screens/Exercise/ExerciseScreen';
import WorkoutSessionScreen from '../screens/Exercise/WorkoutSessionScreen';
import ExerciseDetailScreen from '../screens/Exercise/ExerciseDetailScreen';
import ExerciseLibraryScreen from '../screens/Exercise/ExerciseLibraryScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<ExerciseStackParamList>();

export default function ExerciseNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ExerciseHome" component={ExerciseScreen} />
      <Stack.Screen
        name="WorkoutSession"
        component={WorkoutSessionScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
      />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
    </Stack.Navigator>
  );
}
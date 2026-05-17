import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SleepStackParamList } from './types';
import SleepScreen from '../screens/Sleep/SleepScreen';
import LogSleepScreen from '../screens/Sleep/LogSleepScreen';
import SleepTipsScreen from '../screens/Sleep/SleepTipsScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<SleepStackParamList>();

export default function SleepNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="SleepHome" component={SleepScreen} />
      <Stack.Screen
        name="LogSleep"
        component={LogSleepScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="SleepTips" component={SleepTipsScreen} />
    </Stack.Navigator>
  );
}
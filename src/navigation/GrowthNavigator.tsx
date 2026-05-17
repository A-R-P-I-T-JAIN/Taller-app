import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GrowthStackParamList } from './types';
import GrowthScreen from '../screens/Growth/GrowthScreen';
import AddMeasurementScreen from '../screens/Growth/AddMeasurementScreen';
import GrowthProjectionScreen from '../screens/Growth/GrowthProjectionScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<GrowthStackParamList>();

export default function GrowthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="GrowthHome" component={GrowthScreen} />
      <Stack.Screen
        name="AddMeasurement"
        component={AddMeasurementScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="GrowthProjection" component={GrowthProjectionScreen} />
    </Stack.Navigator>
  );
}
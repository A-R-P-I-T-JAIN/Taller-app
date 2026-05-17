import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NutritionStackParamList } from './types';
import NutritionScreen from '../screens/Nutrition/NutritionScreen';
import NutrientDetailScreen from '../screens/Nutrition/NutrientDetailScreen';
import MealSuggestionsScreen from '../screens/Nutrition/MealSuggestionsScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<NutritionStackParamList>();

export default function NutritionNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="NutritionHome" component={NutritionScreen} />
      <Stack.Screen name="NutrientDetail" component={NutrientDetailScreen} />
      <Stack.Screen name="MealSuggestions" component={MealSuggestionsScreen} />
    </Stack.Navigator>
  );
}
export interface NutrientItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  benefits: string;
  sources: string[];
  dailyTarget: string;
  color: string;
}

export interface MealSuggestion {
  id: string;
  name: string;
  emoji: string;
  nutrients: string[];
  description: string;
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export const nutrientChecklist: NutrientItem[] = [
  {
    id: 'protein',
    name: 'Protein',
    emoji: '🥩',
    description: 'Essential for muscle and tissue growth',
    benefits: 'Builds and repairs muscle tissue, supports growth hormone production',
    sources: ['Chicken', 'Fish', 'Eggs', 'Greek yogurt', 'Lentils'],
    dailyTarget: '0.8-1.2g per kg body weight',
    color: '#FF6B6B',
  },
  {
    id: 'calcium',
    name: 'Calcium',
    emoji: '🥛',
    description: 'Primary mineral for bone growth',
    benefits: 'Builds strong bones and teeth, essential for bone density',
    sources: ['Milk', 'Cheese', 'Yogurt', 'Kale', 'Almonds'],
    dailyTarget: '1000-1300mg per day',
    color: '#3B82F6',
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D',
    emoji: '☀️',
    description: 'Helps absorb calcium for bone growth',
    benefits: 'Enhances calcium absorption, supports immune system',
    sources: ['Sunlight', 'Salmon', 'Egg yolks', 'Fortified milk'],
    dailyTarget: '600-1000 IU per day',
    color: '#F59E0B',
  },
  {
    id: 'zinc',
    name: 'Zinc',
    emoji: '⚡',
    description: 'Supports growth hormone production',
    benefits: 'Stimulates growth hormone, immune function, cell growth',
    sources: ['Pumpkin seeds', 'Beef', 'Chickpeas', 'Cashews'],
    dailyTarget: '8-11mg per day',
    color: '#8B5CF6',
  },
  {
    id: 'vitamin-a',
    name: 'Vitamin A',
    emoji: '🥕',
    description: 'Supports bone cell growth',
    benefits: 'Bone remodeling, immune support, vision health',
    sources: ['Carrots', 'Sweet potato', 'Spinach', 'Mango'],
    dailyTarget: '700-900mcg per day',
    color: '#F97316',
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    emoji: '🌿',
    description: 'Works with calcium for bone strength',
    benefits: 'Bone mineralization, muscle recovery, better sleep',
    sources: ['Dark chocolate', 'Avocado', 'Nuts', 'Legumes'],
    dailyTarget: '240-420mg per day',
    color: '#10B981',
  },
  {
    id: 'iron',
    name: 'Iron',
    emoji: '🫁',
    description: 'Oxygen delivery to growing tissues',
    benefits: 'Carries oxygen to muscles, energy production, growth support',
    sources: ['Red meat', 'Spinach', 'Lentils', 'Fortified cereals'],
    dailyTarget: '8-18mg per day',
    color: '#EF4444',
  },
  {
    id: 'water',
    name: 'Hydration',
    emoji: '💧',
    description: 'Essential for all bodily functions',
    benefits: 'Cushions joints, transports nutrients, supports height maximization',
    sources: ['Water', 'Coconut water', 'Fruits', 'Vegetables'],
    dailyTarget: '8-10 glasses per day',
    color: '#06B6D4',
  },
];

export const mealSuggestions: MealSuggestion[] = [
  {
    id: 'breakfast-1',
    name: 'Height Booster Bowl',
    emoji: '🥣',
    nutrients: ['protein', 'calcium', 'vitamin-d'],
    description: 'Greek yogurt with berries, almonds, and honey',
    mealTime: 'breakfast',
  },
  {
    id: 'breakfast-2',
    name: 'Power Eggs',
    emoji: '🍳',
    nutrients: ['protein', 'vitamin-d', 'iron'],
    description: 'Scrambled eggs with spinach and whole grain toast',
    mealTime: 'breakfast',
  },
  {
    id: 'lunch-1',
    name: 'Growth Plate',
    emoji: '🥗',
    nutrients: ['protein', 'zinc', 'magnesium'],
    description: 'Grilled chicken salad with pumpkin seeds and avocado',
    mealTime: 'lunch',
  },
  {
    id: 'lunch-2',
    name: 'Bone Builder Bowl',
    emoji: '🍱',
    nutrients: ['calcium', 'vitamin-a', 'protein'],
    description: 'Salmon rice bowl with steamed broccoli and carrots',
    mealTime: 'lunch',
  },
  {
    id: 'dinner-1',
    name: 'Recovery Dinner',
    emoji: '🍽️',
    nutrients: ['protein', 'magnesium', 'zinc'],
    description: 'Lean beef stir-fry with vegetables over brown rice',
    mealTime: 'dinner',
  },
  {
    id: 'snack-1',
    name: 'Growth Snack',
    emoji: '🥜',
    nutrients: ['zinc', 'magnesium', 'protein'],
    description: 'Mixed nuts with a glass of warm milk',
    mealTime: 'snack',
  },
];

export const sleepFoods = [
  { name: 'Tart Cherry Juice', benefit: 'Natural melatonin source', emoji: '🍒' },
  { name: 'Warm Milk', benefit: 'Tryptophan for sleepiness', emoji: '🥛' },
  { name: 'Banana', benefit: 'Magnesium and potassium relax muscles', emoji: '🍌' },
  { name: 'Almonds', benefit: 'Melatonin and magnesium rich', emoji: '🌰' },
  { name: 'Chamomile Tea', benefit: 'Calms nervous system', emoji: '🍵' },
];
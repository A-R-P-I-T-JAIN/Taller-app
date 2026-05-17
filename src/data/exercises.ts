export type ExerciseCategory =
  | 'spinal'
  | 'hanging'
  | 'posture'
  | 'yoga'
  | 'strength';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  duration: number; // seconds
  reps?: number;
  sets?: number;
  description: string;
  benefits: string[];
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  emoji: string;
  caloriesBurn: number;
}

export const exercises: Exercise[] = [
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    category: 'spinal',
    duration: 60,
    reps: 10,
    sets: 2,
    description: 'A gentle spinal stretch that decompresses vertebrae and improves flexibility.',
    benefits: [
      'Decompresses spinal discs',
      'Improves posture',
      'Increases spinal flexibility',
    ],
    instructions: [
      'Start on hands and knees in tabletop position',
      'Inhale: drop belly, lift head and tailbone (Cow)',
      'Exhale: round spine toward ceiling, tuck chin (Cat)',
      'Repeat smoothly for 10 reps',
    ],
    difficulty: 'beginner',
    emoji: '🐱',
    caloriesBurn: 5,
  },
  {
    id: 'cobra-stretch',
    name: 'Cobra Stretch',
    category: 'spinal',
    duration: 45,
    reps: 8,
    sets: 2,
    description: 'Elongates the spine and strengthens back muscles.',
    benefits: [
      'Lengthens spine',
      'Strengthens back muscles',
      'Opens chest for better posture',
    ],
    instructions: [
      'Lie face down with palms under shoulders',
      'Press into hands and lift chest off floor',
      'Keep hips on the ground',
      'Hold for 5 seconds, lower slowly',
    ],
    difficulty: 'beginner',
    emoji: '🐍',
    caloriesBurn: 6,
  },
  {
    id: 'dead-hang',
    name: 'Dead Hang',
    category: 'hanging',
    duration: 30,
    sets: 3,
    description: 'Hanging from a bar decompresses the spine naturally using gravity.',
    benefits: [
      'Decompresses spine with gravity',
      'Stretches latissimus dorsi',
      'Increases grip strength',
    ],
    instructions: [
      'Grip a pull-up bar with both hands',
      'Let your body hang freely',
      'Relax shoulders and breathe deeply',
      'Hold for 20-30 seconds',
    ],
    difficulty: 'beginner',
    emoji: '🏋️',
    caloriesBurn: 8,
  },
  {
    id: 'childs-pose',
    name: "Child's Pose",
    category: 'yoga',
    duration: 60,
    description: 'A restful yoga pose that gently stretches the spine.',
    benefits: [
      'Gently elongates spine',
      'Relieves back tension',
      'Promotes relaxation',
    ],
    instructions: [
      'Kneel and sit back on heels',
      'Extend arms forward on the floor',
      'Rest forehead on mat',
      'Breathe deeply and hold',
    ],
    difficulty: 'beginner',
    emoji: '🧘',
    caloriesBurn: 4,
  },
  {
    id: 'wall-angels',
    name: 'Wall Angels',
    category: 'posture',
    duration: 60,
    reps: 10,
    sets: 2,
    description: 'Corrects posture by strengthening upper back and shoulder muscles.',
    benefits: [
      'Corrects forward head posture',
      'Strengthens upper back',
      'Opens tight chest muscles',
    ],
    instructions: [
      'Stand with back flat against wall',
      'Raise arms to 90 degrees (goalpost)',
      'Slide arms up while keeping contact',
      'Lower slowly and repeat',
    ],
    difficulty: 'beginner',
    emoji: '👼',
    caloriesBurn: 7,
  },
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    category: 'yoga',
    duration: 45,
    sets: 3,
    description: 'Full body stretch that lengthens the spine and hamstrings.',
    benefits: [
      'Full spinal elongation',
      'Stretches hamstrings',
      'Builds upper body strength',
    ],
    instructions: [
      'Start in tabletop position',
      'Push hips up and back forming an inverted V',
      'Press heels toward floor',
      'Hold and breathe for 30 seconds',
    ],
    difficulty: 'beginner',
    emoji: '🐕',
    caloriesBurn: 8,
  },
  {
    id: 'pelvic-tilt',
    name: 'Pelvic Tilt',
    category: 'posture',
    duration: 45,
    reps: 15,
    sets: 2,
    description: 'Strengthens core and corrects lower back curvature.',
    benefits: [
      'Corrects anterior pelvic tilt',
      'Strengthens core muscles',
      'Improves standing posture',
    ],
    instructions: [
      'Lie on back with knees bent',
      'Flatten lower back against floor',
      'Tighten abs and hold for 5 seconds',
      'Release and repeat',
    ],
    difficulty: 'beginner',
    emoji: '🦴',
    caloriesBurn: 5,
  },
  {
    id: 'spinal-twist',
    name: 'Supine Spinal Twist',
    category: 'spinal',
    duration: 60,
    description: 'Releases tension along the entire spine length.',
    benefits: [
      'Releases spinal tension',
      'Improves spinal rotation',
      'Reduces back pain',
    ],
    instructions: [
      'Lie on your back',
      'Pull one knee to chest then across body',
      'Extend that arm out to the side',
      'Hold 30 sec each side',
    ],
    difficulty: 'beginner',
    emoji: '🌀',
    caloriesBurn: 4,
  },
  {
    id: 'mountain-pose',
    name: 'Mountain Pose',
    category: 'yoga',
    duration: 30,
    sets: 3,
    description: 'The foundation of all standing yoga poses for perfect posture.',
    benefits: [
      'Perfect posture alignment',
      'Strengthens legs and core',
      'Increases body awareness',
    ],
    instructions: [
      'Stand with feet together',
      'Distribute weight evenly',
      'Lengthen spine and lift crown up',
      'Breathe and hold tall',
    ],
    difficulty: 'beginner',
    emoji: '🏔️',
    caloriesBurn: 3,
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Hip Flexor Stretch',
    category: 'posture',
    duration: 60,
    sets: 2,
    description: 'Releases tight hip flexors that compress the lower spine.',
    benefits: [
      'Decompresses lower spine',
      'Releases hip tightness',
      'Improves overall posture',
    ],
    instructions: [
      'Kneel on one knee in lunge position',
      'Push hips forward gently',
      'Keep torso upright',
      'Hold 30 sec each side',
    ],
    difficulty: 'beginner',
    emoji: '🦵',
    caloriesBurn: 6,
  },
  {
    id: 'active-hang',
    name: 'Active Hang',
    category: 'hanging',
    duration: 30,
    sets: 3,
    description: 'Hanging with engaged shoulders for deeper spinal decompression.',
    benefits: [
      'Enhanced spinal decompression',
      'Shoulder stability',
      'Upper body strengthening',
    ],
    instructions: [
      'Grip bar and hang freely',
      'Pull shoulders down and back slightly',
      'Engage core gently',
      'Hold for 20-30 seconds',
    ],
    difficulty: 'intermediate',
    emoji: '💪',
    caloriesBurn: 10,
  },
  {
    id: 'superman',
    name: 'Superman Hold',
    category: 'strength',
    duration: 45,
    reps: 12,
    sets: 3,
    description: 'Strengthens the posterior chain supporting an upright posture.',
    benefits: [
      'Strengthens lower back',
      'Improves posture',
      'Builds posterior chain',
    ],
    instructions: [
      'Lie face down arms extended',
      'Lift arms, chest, and legs simultaneously',
      'Hold for 2-3 seconds at top',
      'Lower slowly and repeat',
    ],
    difficulty: 'intermediate',
    emoji: '🦸',
    caloriesBurn: 9,
  },
];

export const dailyRoutineIds = [
  'cat-cow',
  'cobra-stretch',
  'dead-hang',
  'childs-pose',
  'wall-angels',
  'downward-dog',
  'hip-flexor-stretch',
];

export const getDailyRoutine = (): Exercise[] => {
  return dailyRoutineIds
    .map((id) => exercises.find((e) => e.id === id))
    .filter(Boolean) as Exercise[];
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find((e) => e.id === id);
};

export const getExercisesByCategory = (
  category: ExerciseCategory
): Exercise[] => {
  return exercises.filter((e) => e.category === category);
};

export const categoryInfo: Record<
  ExerciseCategory,
  { label: string; emoji: string; color: string }
> = {
  spinal: { label: 'Spinal Stretches', emoji: '🦴', color: '#6C63FF' },
  hanging: { label: 'Hanging Exercises', emoji: '🏋️', color: '#00D4AA' },
  posture: { label: 'Posture Correction', emoji: '🧍', color: '#FF6B6B' },
  yoga: { label: 'Yoga & Flexibility', emoji: '🧘', color: '#F59E0B' },
  strength: { label: 'Strength Training', emoji: '💪', color: '#3B82F6' },
};
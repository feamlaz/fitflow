// User data types
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  createdAt: Date;
  updatedAt: Date;
}

// Calculator types
export interface BMRResult {
  bmr: number;
  tdee: number;
  goalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroTargets {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  calories: number;
}

// Workout types
export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility';
  muscleGroups: string[];
  equipment: 'bodyweight' | 'dumbbells' | 'resistance_bands';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  duration: number; // seconds
  reps?: number;
  sets?: number;
  restTime: number; // seconds
  animationUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  duration: number; // total seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'home' | 'gym' | 'outdoor';
  createdAt: Date;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  restTime: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workout: Workout;
  startTime: Date;
  endTime?: Date;
  duration?: number; // seconds
  completed: boolean;
  exercises: CompletedExercise[];
  notes?: string;
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
  completed: boolean;
}

export interface CompletedSet {
  reps: number;
  weight?: number; // kg
  restTime: number; // seconds
  completed: boolean;
}

// Nutrition types
export interface Food {
  id: string;
  name: string;
  brand?: string;
  calories: number; // per 100g
  protein: number; // g per 100g
  carbs: number; // g per 100g
  fat: number; // g per 100g
  fiber?: number; // g per 100g
  sugar?: number; // g per 100g
  sodium?: number; // mg per 100g
  category: string;
  barcode?: string;
}

export interface Meal {
  id: string;
  name: string;
  foods: MealFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: Date;
}

export interface MealFood {
  foodId: string;
  food: Food;
  quantity: number; // grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionDay {
  date: Date;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntake: number; // ml
}

// Progress tracking types
export interface WeightEntry {
  id: string;
  weight: number; // kg
  bodyFat?: number; // percentage
  date: Date;
  notes?: string;
}

export interface MeasurementEntry {
  id: string;
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  arms?: number; // cm
  thighs?: number; // cm
  date: Date;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  date: Date;
  category: 'front' | 'side' | 'back';
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  type: 'workout' | 'nutrition' | 'consistency' | 'weight';
}

// App state types
export interface AppState {
  user: UserProfile | null;
  workouts: Workout[];
  workoutSessions: WorkoutSession[];
  nutritionDays: NutritionDay[];
  weightEntries: WeightEntry[];
  measurementEntries: MeasurementEntry[];
  progressPhotos: ProgressPhoto[];
  achievements: Achievement[];
  settings: AppSettings;
}

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  units: 'metric' | 'imperial';
  language: 'ru' | 'en';
  autoSync: boolean;
  reminderTime: string; // HH:MM format
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation types
export interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

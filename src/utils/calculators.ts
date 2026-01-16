import { BMRResult, MacroTargets, UserProfile } from '@/types';

/**
 * Calculate BMR using Mifflin-St Jeor equation
 */
export const calculateBMR = (profile: Pick<UserProfile, 'gender' | 'age' | 'weight' | 'height'>): number => {
  const { gender, age, weight, height } = profile;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Calculate TDEE based on activity level
 */
export const calculateTDEE = (bmr: number, activityLevel: UserProfile['activityLevel']): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  return bmr * activityMultipliers[activityLevel];
};

/**
 * Adjust calories based on goal
 */
export const adjustCaloriesForGoal = (
  tdee: number, 
  goal: UserProfile['goal']
): number => {
  switch (goal) {
    case 'lose_weight':
      return tdee * 0.85; // -15%
    case 'gain_muscle':
      return tdee * 1.15; // +15%
    case 'maintain':
    default:
      return tdee;
  }
};

/**
 * Calculate macro targets based on calories and goal
 */
export const calculateMacros = (
  calories: number,
  goal: UserProfile['goal'],
  weight: number
): MacroTargets => {
  let proteinRatio = 0.3;
  let carbsRatio = 0.4;
  let fatRatio = 0.3;

  // Adjust macros based on goal
  if (goal === 'gain_muscle') {
    proteinRatio = 0.35; // Higher protein for muscle gain
    carbsRatio = 0.45;
    fatRatio = 0.2;
  } else if (goal === 'lose_weight') {
    proteinRatio = 0.4; // Higher protein for satiety
    carbsRatio = 0.3;
    fatRatio = 0.3;
  }

  const protein = Math.round((calories * proteinRatio) / 4); // 4 calories per gram
  const carbs = Math.round((calories * carbsRatio) / 4); // 4 calories per gram
  const fat = Math.round((calories * fatRatio) / 9); // 9 calories per gram

  return {
    protein,
    carbs,
    fat,
    calories
  };
};

/**
 * Complete BMR calculation with all results
 */
export const calculateBMRComplete = (profile: UserProfile): BMRResult => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const goalCalories = adjustCaloriesForGoal(tdee, profile.goal);
  const macros = calculateMacros(goalCalories, profile.goal, profile.weight);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    goalCalories: Math.round(goalCalories),
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat
  };
};

/**
 * Calculate ideal body weight using Devine formula
 */
export const calculateIdealWeight = (height: number, gender: UserProfile['gender']): number => {
  if (gender === 'male') {
    return 50 + 2.3 * ((height / 2.54) - 60);
  } else {
    return 45.5 + 2.3 * ((height / 2.54) - 60);
  }
};

/**
 * Calculate BMI
 */
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

/**
 * Get BMI category
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Недостаточный вес';
  if (bmi < 25) return 'Нормальный вес';
  if (bmi < 30) return 'Избыточный вес';
  return 'Ожирение';
};

/**
 * Calculate water intake recommendation (ml per day)
 */
export const calculateWaterIntake = (weight: number, activityLevel: UserProfile['activityLevel']): number => {
  const baseWater = weight * 35; // 35ml per kg
  
  const activityMultipliers = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    very_active: 1.4
  };
  
  return Math.round(baseWater * activityMultipliers[activityLevel]);
};

/**
 * Calculate workout calories burned
 */
export const calculateWorkoutCalories = (
  weight: number,
  duration: number, // in minutes
  met: number // Metabolic equivalent of task
): number => {
  return Math.round(met * weight * (duration / 60));
};

/**
 * MET values for different activities
 */
export const MET_VALUES = {
  walking: 3.5,
  running: 8.0,
  cycling: 6.0,
  swimming: 7.0,
  strength_training: 5.0,
  yoga: 2.5,
  pushups: 3.8,
  squats: 5.0,
  planks: 3.5,
  burpees: 8.0
} as const;

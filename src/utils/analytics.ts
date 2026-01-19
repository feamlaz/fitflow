import { WorkoutSession, NutritionDay, WeightEntry, UserProfile } from '../types';

export interface AnalyticsData {
  date: string;
  weight: number;
  calories: number;
  workouts: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface GoalProgress {
  name: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
}

export interface AIRecommendation {
  type: 'workout' | 'nutrition' | 'recovery' | 'motivation';
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

export interface WeeklyStats {
  totalWorkouts: number;
  totalCalories: number;
  avgWeight: number;
  weightChange: number;
  proteinAvg: number;
  waterAvg: number;
  streakDays: number;
}

/**
 * Генерирует аналитические данные на основе истории
 */
export const generateAnalyticsData = (
  workoutSessions: WorkoutSession[],
  nutritionDays: NutritionDay[],
  weightEntries: WeightEntry[],
  days: number = 30
): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString('ru', { day: 'numeric', month: 'short' });

    // Получаем данные за этот день
    const dayWorkouts = workoutSessions.filter(session => 
      session.startTime.toDateString() === date.toDateString()
    );
    
    const dayNutrition = nutritionDays.find(nutrition => 
      nutrition.date.toDateString() === date.toDateString()
    );
    
    const dayWeight = weightEntries.find(entry => 
      entry.date.toDateString() === date.toDateString()
    );

    data.push({
      date: dateString,
      weight: dayWeight?.weight || 75 + Math.random() * 5 - 2.5,
      calories: dayNutrition?.totalCalories || 1800 + Math.random() * 400,
      workouts: dayWorkouts.length,
      protein: dayNutrition?.macros.protein || 120 + Math.random() * 40,
      carbs: dayNutrition?.macros.carbs || 200 + Math.random() * 60,
      fat: dayNutrition?.macros.fat || 60 + Math.random() * 20,
      water: dayNutrition?.water || 2000 + Math.random() * 1000,
    });
  }

  return data;
};

/**
 * Рассчитывает недельную статистику
 */
export const calculateWeeklyStats = (
  workoutSessions: WorkoutSession[],
  nutritionDays: NutritionDay[],
  weightEntries: WeightEntry[]
): WeeklyStats => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekWorkouts = workoutSessions.filter(session => 
    session.startTime >= weekAgo
  );
  
  const weekNutrition = nutritionDays.filter(nutrition => 
    nutrition.date >= weekAgo
  );
  
  const weekWeights = weightEntries.filter(entry => 
    entry.date >= weekAgo
  );

  const totalWorkouts = weekWorkouts.length;
  const totalCalories = weekNutrition.reduce((sum, day) => sum + day.totalCalories, 0);
  const avgWeight = weekWeights.length > 0 
    ? weekWeights.reduce((sum, entry) => sum + entry.weight, 0) / weekWeights.length
    : 75;
  
  const weightChange = weekWeights.length >= 2 
    ? weekWeights[weekWeights.length - 1].weight - weekWeights[0].weight
    : 0;
  
  const proteinAvg = weekNutrition.length > 0
    ? weekNutrition.reduce((sum, day) => sum + day.macros.protein, 0) / weekNutrition.length
    : 0;
  
  const waterAvg = weekNutrition.length > 0
    ? weekNutrition.reduce((sum, day) => sum + (day.water || 0), 0) / weekNutrition.length
    : 0;

  // Расчет дней подряд (упрощенный)
  const streakDays = calculateStreakDays(workoutSessions);

  return {
    totalWorkouts,
    totalCalories,
    avgWeight,
    weightChange,
    proteinAvg,
    waterAvg,
    streakDays
  };
};

/**
 * Генерирует AI рекомендации на основе данных
 */
export const generateAIRecommendations = (
  userProfile: UserProfile,
  weeklyStats: WeeklyStats,
  recentWorkouts: WorkoutSession[]
): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = [];

  // Анализ тренировок
  if (weeklyStats.totalWorkouts < 3) {
    recommendations.push({
      type: 'workout',
      icon: '💪',
      title: 'Увеличьте частоту тренировок',
      description: 'Рекомендуется тренироваться 3-4 раза в неделю для лучших результатов.',
      priority: 'high',
      action: 'Планировать тренировки'
    });
  }

  // Анализ питания
  if (weeklyStats.proteinAvg < userProfile.weight * 1.5) {
    recommendations.push({
      type: 'nutrition',
      icon: '🥗',
      title: 'Добавьте больше белка',
      description: `Ваше среднее потребление белка ${Math.round(weeklyStats.proteinAvg)}г. Рекомендуется ${Math.round(userProfile.weight * 1.5)}г.`,
      priority: 'medium',
      action: 'Посмотреть рецепты'
    });
  }

  // Анализ гидратации
  if (weeklyStats.waterAvg < 2500) {
    recommendations.push({
      type: 'nutrition',
      icon: '💧',
      title: 'Пейте больше воды',
      description: 'Важно пить не менее 2.5 литров воды в день для хорошего метаболизма.',
      priority: 'medium',
      action: 'Установить напоминание'
    });
  }

  // Анализ восстановления
  const recentWorkoutDays = recentWorkouts.slice(-5);
  if (recentWorkoutDays.length >= 5) {
    recommendations.push({
      type: 'recovery',
      icon: '😴',
      title: 'Время для отдыха',
      description: 'Вы тренировались 5 дней подряд. Дайте телу время на восстановление.',
      priority: 'high',
      action: 'Запланировать день отдыха'
    });
  }

  // Мотивация
  if (weeklyStats.streakDays >= 7) {
    recommendations.push({
      type: 'motivation',
      icon: '🏆',
      title: 'Отличная последовательность!',
      description: `Вы держите streak ${weeklyStats.streakDays} дней! Продолжайте в том же духе.`,
      priority: 'low',
      action: 'Поделиться достижением'
    });
  }

  return recommendations.slice(0, 3); // Возвращаем топ-3 рекомендации
};

/**
 * Рассчитывает прогресс по целям
 */
export const calculateGoalProgress = (
  userProfile: UserProfile,
  weightEntries: WeightEntry[],
  workoutSessions: WorkoutSession[]
): GoalProgress[] => {
  const goals: GoalProgress[] = [];

  // Цель по весу
  if (userProfile.goal === 'lose_weight' && weightEntries.length > 0) {
    const currentWeight = weightEntries[weightEntries.length - 1].weight;
    const startWeight = weightEntries[0].weight;
    const lostWeight = startWeight - currentWeight;
    
    goals.push({
      name: 'Потеря веса',
      current: lostWeight,
      target: 5,
      unit: 'кг',
      percentage: Math.min((lostWeight / 5) * 100, 100)
    });
  }

  // Цель по тренировкам
  const monthlyWorkouts = workoutSessions.filter(session => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return session.startTime >= monthAgo;
  }).length;

  goals.push({
    name: 'Тренировки в месяц',
    current: monthlyWorkouts,
    target: 12,
    unit: 'тренировок',
    percentage: Math.min((monthlyWorkouts / 12) * 100, 100)
  });

  // Цель по последовательности
  const streakDays = calculateStreakDays(workoutSessions);
  goals.push({
    name: 'Дней подряд',
    current: streakDays,
    target: 30,
    unit: 'дней',
    percentage: Math.min((streakDays / 30) * 100, 100)
  });

  return goals;
};

/**
 * Рассчитывает дни подряд тренировок
 */
export const calculateStreakDays = (workoutSessions: WorkoutSession[]): number => {
  if (workoutSessions.length === 0) return 0;

  const sortedSessions = workoutSessions
    .map(session => session.startTime.toDateString())
    .filter((date, index, array) => array.indexOf(date) === index) // Уникальные даты
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  
  for (let i = 0; i < sortedSessions.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (sortedSessions[i] === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Генерирует данные для графика макронутриентов
 */
export const generateMacroData = (nutritionDays: NutritionDay[]) => {
  if (nutritionDays.length === 0) {
    return [
      { name: 'Белки', value: 30, color: '#ff6b35' },
      { name: 'Углеводы', value: 45, color: '#4ecdc4' },
      { name: 'Жиры', value: 25, color: '#45b7d1' },
    ];
  }

  const latestNutrition = nutritionDays[nutritionDays.length - 1];
  const total = latestNutrition.macros.protein + latestNutrition.macros.carbs + latestNutrition.macros.fat;
  
  return [
    { 
      name: 'Белки', 
      value: Math.round((latestNutrition.macros.protein / total) * 100), 
      color: '#ff6b35' 
    },
    { 
      name: 'Углеводы', 
      value: Math.round((latestNutrition.macros.carbs / total) * 100), 
      color: '#4ecdc4' 
    },
    { 
      name: 'Жиры', 
      value: Math.round((latestNutrition.macros.fat / total) * 100), 
      color: '#45b7d1' 
    },
  ];
};

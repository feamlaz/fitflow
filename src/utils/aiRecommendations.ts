import { UserProfile, WorkoutSession, NutritionDay } from '../types';

// Расчет дневных калорий на основе профиля
const calculateDailyCalories = (userProfile: UserProfile): number => {
  // Базовый метаболизм (Mifflin-St Jeor)
  const bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + (userProfile.gender === 'male' ? 5 : -161);
  
  // Коэффициент активности
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  const tdee = bmr * activityMultipliers[userProfile.activityLevel];
  
  // Корректировка цели
  const goalAdjustments = {
    lose_weight: -500,
    maintain: 0,
    gain_muscle: 300
  };
  
  return Math.round(tdee + goalAdjustments[userProfile.goal]);
};

// AI рекомендации на основе данных пользователя
export const generateAIRecommendation = (
  userProfile: UserProfile | null,
  todayStats: any,
  _recentWorkouts: WorkoutSession[],
  _nutritionDays: NutritionDay[]
) => {
  if (!userProfile) {
    return {
      type: 'general',
      icon: '💡',
      title: 'Создайте профиль',
      description: 'Заполните ваши данные для получения персонализированных рекомендаций',
      priority: 'high' as const
    };
  }

  const dailyCalories = calculateDailyCalories(userProfile);
  const recommendations = [];

  // Анализ калорий
  if (todayStats.calories < dailyCalories * 0.5) {
    recommendations.push({
      type: 'nutrition',
      icon: '🍽️',
      title: 'Увеличьте калории',
      description: `Вам нужно еще ${Math.round(dailyCalories - todayStats.calories)} ккалорий для достижения дневной нормы`,
      priority: 'high' as const
    });
  } else if (todayStats.calories > dailyCalories * 1.2) {
    recommendations.push({
      type: 'nutrition',
      icon: '⚖️',
      title: 'Снизьте калории',
      description: `Вы превысили норму на ${Math.round(todayStats.calories - dailyCalories)} ккалорий`,
      priority: 'medium' as const
    });
  }

  // Анализ воды
  if (todayStats.water < 1500) {
    recommendations.push({
      type: 'hydration',
      icon: '💧',
      title: 'Пейте больше воды',
      description: `Выпейте еще ${2000 - todayStats.water}мл воды для хорошей гидратации`,
      priority: 'medium' as const
    });
  }

  // Анализ тренировок
  if (todayStats.workoutsCompleted === 0) {
    recommendations.push({
      type: 'workout',
      icon: '🏃‍♂️',
      title: 'Начните тренировку',
      description: 'Сегодня еще нет тренировок. Начните с легкой 15-минутной разминки',
      priority: 'high' as const
    });
  } else if (todayStats.workoutsCompleted >= 3) {
    recommendations.push({
      type: 'recovery',
      icon: '😴',
      title: 'Отличная работа!',
      description: 'Вы выполнили все тренировки на сегодня. Не забудьте про отдых',
      priority: 'low' as const
    });
  }

  // Анализ цели
  if (userProfile.goal === 'lose_weight' && todayStats.goalProgress > 80) {
    recommendations.push({
      type: 'goal',
      icon: '🎯',
      title: 'Вы на верном пути!',
      description: `${Math.round(todayStats.goalProgress)}% дневной цели выполнено. Продолжайте в том же духе!`,
      priority: 'low' as const
    });
  }

  // Если нет рекомендаций, добавляем мотивацию
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'motivation',
      icon: '⭐',
      title: 'Отличный день!',
      description: 'Вы поддерживаете хороший баланс питания и активности. Так держать!',
      priority: 'low' as const
    });
  }

  // Возвращаем самую важную рекомендацию
  const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
  return recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])[0];
};

// Предсказание на завтра
export const generateTomorrowPrediction = (
  userProfile: UserProfile | null,
  todayStats: any,
  recentWorkouts: WorkoutSession[],
  nutritionDays: NutritionDay[]
) => {
  if (!userProfile) {
    return {
      prediction: 'Заполните профиль для получения предсказаний',
      confidence: 0,
      tips: []
    };
  }

  const predictions = [];
  const tips = [];

  // Анализ последних тренировок
  if (recentWorkouts.length > 0) {
    const lastWorkout = recentWorkouts[0];
    if (lastWorkout.completed) {
      predictions.push('завтра будет хорошая тренировка');
      tips.push('Отдохните и подготовьтесь к новому достижению');
    } else {
      predictions.push('завтра нужно завершить начатую тренировку');
      tips.push('Продолжите с того места, где остановились');
    }
  }
  
  // Анализ питания
  if (nutritionDays.length > 0) {
    const lastNutrition = nutritionDays[0];
    if (lastNutrition.totalCalories > calculateDailyCalories(userProfile) * 1.2) {
      predictions.push('завтра нужно следить за калориями');
      tips.push('Планируйте меню заранее');
    }
  }

  const avgCalories = nutritionDays.length > 0 
    ? nutritionDays.reduce((sum: number, day: NutritionDay) => sum + day.totalCalories, 0) / nutritionDays.length
    : 2000;
  const dailyCalories = calculateDailyCalories(userProfile);

  if (avgCalories < dailyCalories * 0.9) {
    predictions.push('завтра будет легче придерживаться калорийной нормы');
    tips.push('Подготовьте здоровый завтрак');
  } else {
    predictions.push('завтра будет хороший день для питания');
    tips.push('Продолжайте в том же духе');
  }

  // Предсказание тренировок
  const recentWorkoutCount = recentWorkouts.length;
  if (recentWorkoutCount < 3) {
    predictions.push('завтра будет идеальный день для тренировки');
    tips.push('Планируйте тренировку с утра');
  } else {
    predictions.push('завтра можно сделать легкую тренировку');
    tips.push('Фокусируйтесь на растяжке и восстановлении');
  }

  // Предсказание настроения
  const goalProgress = todayStats.goalProgress;
  if (goalProgress > 80) {
    predictions.push('завтра будет отличное настроение');
    tips.push('Вы достигаете своих целей!');
  } else if (goalProgress < 30) {
    predictions.push('завтра может быть сложно, но вы справитесь');
    tips.push('Начните день с небольшой победы');
  }

  return {
    prediction: predictions[0] || 'завтра будет продуктивный день',
    confidence: Math.min(recentWorkoutCount * 20 + nutritionDays.length * 10, 80),
    tips: tips.slice(0, 2)
  };
};

// Мотивационные бейджи
export const generateMotivationBadges = (
  userProfile: UserProfile | null,
  todayStats: any,
  streakDays: number
) => {
  const badges = [];

  // Бейдж за калории
  if (todayStats.goalProgress >= 100) {
    badges.push({
      icon: '🔥',
      title: 'Калории выполнены',
      description: 'Дневная норма достигнута',
      earned: true
    });
  }

  // Бейдж за воду
  if (todayStats.water >= 2000) {
    badges.push({
      icon: '💧',
      title: 'Гидратация',
      description: '2 литра воды выпито',
      earned: true
    });
  }

  // Бейдж за тренировки
  if (todayStats.workoutsCompleted >= 3) {
    badges.push({
      icon: '💪',
      title: 'Атлет',
      description: 'Все тренировки выполнены',
      earned: true
    });
  }

  // Бейдж за последовательность
  if (streakDays >= 7) {
    badges.push({
      icon: '🔥',
      title: 'Неделя успеха',
      description: `${streakDays} дней подряд`,
      earned: true
    });
  }

  // Бейдж за прогресс
  if (todayStats.goalProgress >= 50) {
    badges.push({
      icon: '📈',
      title: 'Прогресс',
      description: `${todayStats.goalProgress}% цели`,
      earned: true
    });
  }

  return badges;
};

// Советы по питанию
export const generateNutritionTips = (
  userProfile: UserProfile | null,
  todayStats: any,
  nutritionDays: NutritionDay[]
) => {
  const tips = [];

  if (!userProfile) {
    tips.push({
      category: 'general',
      tip: 'Сбалансируйте питание: белки, жиры и углеводы в правильных пропорциях',
      priority: 'medium' as const
    });
    return tips;
  }

  const dailyCalories = calculateDailyCalories(userProfile);

  // Советы на основе цели
  if (userProfile.goal === 'lose_weight') {
    tips.push({
      category: 'calories',
      tip: 'Создайте дефицит 300-500 ккалорий для безопасного похудения',
      priority: 'high' as const
    });
    tips.push({
      category: 'protein',
      tip: 'Увеличьте потребление белка до 1.6-2г на кг веса',
      priority: 'high' as const
    });
  } else if (userProfile.goal === 'gain_muscle') {
    tips.push({
      category: 'calories',
      tip: 'Создайте профицит 300-500 ккалорий для набора массы',
      priority: 'high' as const
    });
    tips.push({
      category: 'protein',
      tip: 'Потребляйте 1.8-2.2г белка на кг веса для роста мышц',
      priority: 'high' as const
    });
  }

  // Советы на основе активности
  if (userProfile.activityLevel === 'very_active') {
    tips.push({
      category: 'hydration',
      tip: 'Пейте 2.5-3 литра воды в день при высокой активности',
      priority: 'medium' as const
    });
  }

  // Советы на основе текущего прогресса
  if (todayStats.calories < dailyCalories * 0.5) {
    tips.push({
      category: 'timing',
      tip: 'Распределите калории равномерно в течение дня',
      priority: 'medium' as const
    });
  }

  return tips.slice(0, 3);
};

import { useEffect } from 'react';
import { useSupabase } from './useSupabase';
import { useAppStore } from './useAppStore';

// Адаптер для конвертации между Supabase и локальными типами
const adaptSupabaseToLocal = (supabaseUser: any) => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    name: supabaseUser.name,
    age: supabaseUser.age,
    gender: supabaseUser.gender,
    height: supabaseUser.height,
    weight: supabaseUser.weight,
    activityLevel: supabaseUser.activity_level,
    goal: supabaseUser.goal,
    createdAt: new Date(supabaseUser.created_at),
    updatedAt: new Date(supabaseUser.updated_at)
  };
};

const adaptNutritionDayToLocal = (supabaseDay: any) => {
  return {
    id: supabaseDay.id,
    userId: supabaseDay.user_id,
    date: supabaseDay.date,
    totalCalories: supabaseDay.total_calories,
    protein: supabaseDay.protein,
    carbs: supabaseDay.carbs,
    fat: supabaseDay.fat,
    water: supabaseDay.water,
    meals: supabaseDay.meals,
    createdAt: new Date(supabaseDay.created_at),
    updatedAt: new Date(supabaseDay.updated_at)
  };
};

const adaptWorkoutSessionToLocal = (supabaseSession: any) => {
  return {
    id: supabaseSession.id,
    userId: supabaseSession.user_id,
    workoutId: supabaseSession.workout_id,
    startTime: new Date(supabaseSession.start_time),
    endTime: supabaseSession.end_time ? new Date(supabaseSession.end_time) : null,
    duration: supabaseSession.duration,
    completed: supabaseSession.completed,
    exercises: supabaseSession.exercises,
    notes: supabaseSession.notes,
    createdAt: new Date(supabaseSession.created_at),
    updatedAt: new Date(supabaseSession.updated_at)
  };
};

const adaptWeightEntryToLocal = (supabaseEntry: any) => {
  return {
    id: supabaseEntry.id,
    userId: supabaseEntry.user_id,
    weight: supabaseEntry.weight,
    date: supabaseEntry.date,
    notes: supabaseEntry.notes,
    createdAt: new Date(supabaseEntry.created_at),
    updatedAt: new Date(supabaseEntry.updated_at)
  };
};

export const useSupabaseStore = () => {
  const supabaseData = useSupabase();
  const appStore = useAppStore();

  // Синхронизация данных из Supabase в локальный store
  useEffect(() => {
    if (supabaseData.loading) return;

    // Синхронизация профиля
    if (supabaseData.user) {
      const localProfile = adaptSupabaseToLocal(supabaseData.user);
      appStore.setUserProfile(localProfile);
    }

    // Синхронизация дней питания
    if (supabaseData.nutritionDays.length > 0) {
      supabaseData.nutritionDays.forEach(supabaseDay => {
        const localDay = adaptNutritionDayToLocal(supabaseDay);
        appStore.setNutritionDay(localDay);
      });
    }

    // Синхронизация тренировок
    if (supabaseData.workoutSessions.length > 0) {
      supabaseData.workoutSessions.forEach(supabaseSession => {
        const localSession = adaptWorkoutSessionToLocal(supabaseSession);
        appStore.addWorkoutSession(localSession);
      });
    }

    // Синхронизация записей веса
    if (supabaseData.weightEntries.length > 0) {
      supabaseData.weightEntries.forEach(supabaseEntry => {
        const localEntry = adaptWeightEntryToLocal(supabaseEntry);
        appStore.addWeightEntry(localEntry);
      });
    }
  }, [supabaseData.loading, supabaseData.user, supabaseData.nutritionDays, supabaseData.workoutSessions, supabaseData.weightEntries, appStore]);

  // Обертки для действий с синхронизацией
  const updateUserProfile = async (updates: any) => {
    if (!supabaseData.user) return;

    try {
      await supabaseData.updateProfile(updates);
      // Данные автоматически синхронизируются через useEffect
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const saveNutritionDay = async (day: any) => {
    try {
      const supabaseDay = {
        user_id: supabaseData.user?.id,
        date: day.date,
        total_calories: day.totalCalories,
        protein: day.protein,
        carbs: day.carbs,
        fat: day.fat,
        water: day.water,
        meals: day.meals
      };

      await supabaseData.saveNutritionDay(supabaseDay);
      // Данные автоматически синхронизируются через useEffect
    } catch (error) {
      console.error('Error saving nutrition day:', error);
      throw error;
    }
  };

  const saveWorkoutSession = async (session: any) => {
    try {
      const supabaseSession = {
        user_id: supabaseData.user?.id,
        workout_id: session.workoutId,
        start_time: session.startTime.toISOString(),
        end_time: session.endTime?.toISOString() || null,
        duration: session.duration,
        completed: session.completed,
        exercises: session.exercises,
        notes: session.notes,
        workout: {
          id: session.workoutId,
          name: 'Workout',
          description: 'Workout description',
          exercises: session.exercises,
          duration: session.duration,
          difficulty: 'medium' as const,
          category: 'strength' as const,
          createdAt: session.startTime
        }
      };

      await supabaseData.saveWorkoutSession(supabaseSession);
      // Данные автоматически синхронизируются через useEffect
    } catch (error) {
      console.error('Error saving workout session:', error);
      throw error;
    }
  };

  const saveWeightEntry = async (entry: any) => {
    try {
      const supabaseEntry = {
        user_id: supabaseData.user?.id,
        weight: entry.weight,
        date: entry.date,
        notes: entry.notes
      };

      await supabaseData.saveWeightEntry(supabaseEntry);
      // Данные автоматически синхронизируются через useEffect
    } catch (error) {
      console.error('Error saving weight entry:', error);
      throw error;
    }
  };

  return {
    // Supabase данные
    ...supabaseData,
    
    // Синхронизированные действия
    updateUserProfile,
    saveNutritionDay,
    saveWorkoutSession,
    saveWeightEntry,
    
    // Статус интеграции
    isSupabaseConnected: !supabaseData.loading && !supabaseData.error,
    syncError: supabaseData.error
  };
};

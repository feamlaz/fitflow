import { useState, useEffect } from 'react';
import { supabase, SupabaseService } from '../lib/supabase';
import { Database } from '../lib/supabase';

// Types для локального состояния
export interface LocalUserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalNutritionDay {
  id: string;
  userId: string;
  date: string;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  meals: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalWorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  completed: boolean;
  exercises: any[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalWeightEntry {
  id: string;
  userId: string;
  weight: number;
  date: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalUserGoals {
  id: string;
  userId: string;
  targetWeight: number | null;
  targetCalories: number | null;
  targetWorkoutsPerWeek: number | null;
  targetWaterMl: number | null;
  deadline: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const useSupabase = () => {
  const [user, setUser] = useState<LocalUserProfile | null>(null);
  const [nutritionDays, setNutritionDays] = useState<LocalNutritionDay[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<LocalWorkoutSession[]>([]);
  const [weightEntries, setWeightEntries] = useState<LocalWeightEntry[]>([]);
  const [userGoals, setUserGoals] = useState<LocalUserGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получение текущего пользователя
  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      console.error('Error getting current user:', err);
      return null;
    }
  };

  // Загрузка данных пользователя
  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Загрузка профиля
      const profile = await SupabaseService.getProfile(userId);
      if (profile) {
        setUser({
          ...profile,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
        });
      }

      // Загрузка данных питания
      const nutrition = await SupabaseService.getNutritionDays(userId);
      setNutritionDays(nutrition.map(day => ({
        ...day,
        createdAt: new Date(day.created_at),
        updatedAt: new Date(day.updated_at)
      })));

      // Загрузка тренировок
      const workouts = await SupabaseService.getWorkoutSessions(userId);
      setWorkoutSessions(workouts.map(session => ({
        ...session,
        startTime: new Date(session.start_time),
        endTime: session.end_time ? new Date(session.end_time) : null,
        createdAt: new Date(session.created_at),
        updatedAt: new Date(session.updated_at)
      })));

      // Загрузка записей веса
      const weights = await SupabaseService.getWeightEntries(userId);
      setWeightEntries(weights.map(entry => ({
        ...entry,
        createdAt: new Date(entry.created_at),
        updatedAt: new Date(entry.updated_at)
      })));

      // Загрузка целей
      const goals = await SupabaseService.getUserGoals(userId);
      if (goals) {
        setUserGoals({
          ...goals,
          createdAt: new Date(goals.created_at),
          updatedAt: new Date(goals.updated_at)
        });
      }

    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  // Сохранение профиля
  const updateProfile = async (updates: Partial<LocalUserProfile>) => {
    if (!user) return;

    try {
      const supabaseUpdates: Database['public']['Tables']['profiles']['Update'] = {};
      
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.age) supabaseUpdates.age = updates.age;
      if (updates.gender) supabaseUpdates.gender = updates.gender;
      if (updates.height) supabaseUpdates.height = updates.height;
      if (updates.weight) supabaseUpdates.weight = updates.weight;
      if (updates.activityLevel) supabaseUpdates.activity_level = updates.activityLevel;
      if (updates.goal) supabaseUpdates.goal = updates.goal;

      const updatedProfile = await SupabaseService.updateProfile(user.id, supabaseUpdates);
      
      setUser({
        ...user,
        ...updates,
        updatedAt: new Date(updatedProfile.updated_at)
      });

      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Не удалось обновить профиль');
      throw err;
    }
  };

  // Сохранение дня питания
  const saveNutritionDay = async (nutritionDay: Omit<LocalNutritionDay, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const supabaseDay: Database['public']['Tables']['nutrition_days']['Insert'] = {
        user_id: user.id,
        date: nutritionDay.date,
        total_calories: nutritionDay.totalCalories,
        protein: nutritionDay.protein,
        carbs: nutritionDay.carbs,
        fat: nutritionDay.fat,
        water: nutritionDay.water,
        meals: nutritionDay.meals
      };

      const savedDay = await SupabaseService.saveNutritionDay(user.id, supabaseDay);
      
      const localDay: LocalNutritionDay = {
        ...nutritionDay,
        id: savedDay.id,
        userId: user.id,
        createdAt: new Date(savedDay.created_at),
        updatedAt: new Date(savedDay.updated_at)
      };

      setNutritionDays(prev => {
        const existingIndex = prev.findIndex(day => day.date === nutritionDay.date);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = localDay;
          return updated;
        }
        return [localDay, ...prev];
      });

      return localDay;
    } catch (err) {
      console.error('Error saving nutrition day:', err);
      setError('Не удалось сохранить данные питания');
      throw err;
    }
  };

  // Сохранение тренировки
  const saveWorkoutSession = async (session: Omit<LocalWorkoutSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const supabaseSession: Database['public']['Tables']['workout_sessions']['Insert'] = {
        user_id: user.id,
        workout_id: session.workoutId,
        start_time: session.startTime.toISOString(),
        end_time: session.endTime?.toISOString() || null,
        duration: session.duration,
        completed: session.completed,
        exercises: session.exercises,
        notes: session.notes
      };

      const savedSession = await SupabaseService.saveWorkoutSession(user.id, supabaseSession);
      
      const localSession: LocalWorkoutSession = {
        ...session,
        id: savedSession.id,
        userId: user.id,
        createdAt: new Date(savedSession.created_at),
        updatedAt: new Date(savedSession.updated_at)
      };

      setWorkoutSessions(prev => [localSession, ...prev]);
      return localSession;
    } catch (err) {
      console.error('Error saving workout session:', err);
      setError('Не удалось сохранить тренировку');
      throw err;
    }
  };

  // Сохранение записи веса
  const saveWeightEntry = async (entry: Omit<LocalWeightEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const supabaseEntry: Database['public']['Tables']['weight_entries']['Insert'] = {
        user_id: user.id,
        weight: entry.weight,
        date: entry.date,
        notes: entry.notes
      };

      const savedEntry = await SupabaseService.saveWeightEntry(user.id, supabaseEntry);
      
      const localEntry: LocalWeightEntry = {
        ...entry,
        id: savedEntry.id,
        userId: user.id,
        createdAt: new Date(savedEntry.created_at),
        updatedAt: new Date(savedEntry.updated_at)
      };

      setWeightEntries(prev => {
        const existingIndex = prev.findIndex(e => e.date === entry.date);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = localEntry;
          return updated;
        }
        return [localEntry, ...prev];
      });

      return localEntry;
    } catch (err) {
      console.error('Error saving weight entry:', err);
      setError('Не удалось сохранить запись веса');
      throw err;
    }
  };

  // Сохранение целей
  const saveUserGoals = async (goals: Omit<LocalUserGoals, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const supabaseGoals: Database['public']['Tables']['user_goals']['Insert'] = {
        user_id: user.id,
        target_weight: goals.targetWeight,
        target_calories: goals.targetCalories,
        target_workouts_per_week: goals.targetWorkoutsPerWeek,
        target_water_ml: goals.targetWaterMl,
        deadline: goals.deadline
      };

      const savedGoals = await SupabaseService.saveUserGoals(user.id, supabaseGoals);
      
      const localGoals: LocalUserGoals = {
        ...goals,
        id: savedGoals.id,
        userId: user.id,
        createdAt: new Date(savedGoals.created_at),
        updatedAt: new Date(savedGoals.updated_at)
      };

      setUserGoals(localGoals);
      return localGoals;
    } catch (err) {
      console.error('Error saving user goals:', err);
      setError('Не удалось сохранить цели');
      throw err;
    }
  };

  // Real-time подписки
  useEffect(() => {
    if (!user) return;

    const nutritionSubscription = SupabaseService.subscribeToNutritionDays(user.id, (payload) => {
      console.log('Nutrition days changed:', payload);
      // Обновление локального состояния
      loadUserData(user.id);
    });

    const workoutSubscription = SupabaseService.subscribeToWorkoutSessions(user.id, (payload) => {
      console.log('Workout sessions changed:', payload);
      // Обновление локального состояния
      loadUserData(user.id);
    });

    return () => {
      nutritionSubscription.unsubscribe();
      workoutSubscription.unsubscribe();
    };
  }, [user]);

  // Инициализация
  useEffect(() => {
    const initialize = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        await loadUserData(currentUser.id);
      } else {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return {
    user,
    nutritionDays,
    workoutSessions,
    weightEntries,
    userGoals,
    loading,
    error,
    updateProfile,
    saveNutritionDay,
    saveWorkoutSession,
    saveWeightEntry,
    saveUserGoals,
    refreshData: () => user ? loadUserData(user.id) : Promise.resolve()
  };
};

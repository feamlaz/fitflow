import { createClient } from '@supabase/supabase-js';

interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types для Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          age: number;
          gender: 'male' | 'female';
          height: number;
          weight: number;
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
          goal: 'lose_weight' | 'maintain' | 'gain_muscle';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      nutrition_days: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          total_calories: number;
          protein: number;
          carbs: number;
          fat: number;
          water: number;
          meals: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['nutrition_days']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['nutrition_days']['Insert']>;
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          start_time: string;
          end_time: string | null;
          duration: number | null;
          completed: boolean;
          exercises: any[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['workout_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['workout_sessions']['Insert']>;
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          weight: number;
          date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['weight_entries']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['weight_entries']['Insert']>;
      };
      user_goals: {
        Row: {
          id: string;
          user_id: string;
          target_weight: number | null;
          target_calories: number | null;
          target_workouts_per_week: number | null;
          target_water_ml: number | null;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_goals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_goals']['Insert']>;
      };
    };
  };
}

// Helper функции для работы с Supabase
export class SupabaseService {
  // Profile
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Nutrition
  static async getNutritionDays(_userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('nutrition_days')
      .select('*')
      .eq('user_id', _userId)
      .order('date', { ascending: false });
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async saveNutritionDay(_userId: string, nutritionDay: Database['public']['Tables']['nutrition_days']['Insert']) {
    const { data, error } = await supabase
      .from('nutrition_days')
      .upsert({ ...nutritionDay, user_id: _userId }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Workouts
  static async getWorkoutSessions(_userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', _userId)
      .order('start_time', { ascending: false });
    
    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    if (endDate) {
      query = query.lte('start_time', endDate);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async saveWorkoutSession(_userId: string, session: Database['public']['Tables']['workout_sessions']['Insert']) {
    const { data, error } = await supabase
      .from('workout_sessions')
      .upsert({ ...session, user_id: _userId }, {
        onConflict: 'user_id,workout_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateWorkoutSession(sessionId: string, updates: Database['public']['Tables']['workout_sessions']['Update']) {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Weight
  static async getWeightEntries(_userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', _userId)
      .order('date', { ascending: false });
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async saveWeightEntry(_userId: string, entry: Database['public']['Tables']['weight_entries']['Insert']) {
    const { data, error } = await supabase
      .from('weight_entries')
      .upsert({ ...entry, user_id: _userId }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Goals
  static async getUserGoals(_userId: string) {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', _userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async saveUserGoals(_userId: string, goals: Database['public']['Tables']['user_goals']['Insert']) {
    const { data, error } = await supabase
      .from('user_goals')
      .upsert(goals, {
        onConflict: 'user_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Real-time подписки
  static subscribeToNutritionDays(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('nutrition_days_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nutrition_days',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  static subscribeToWorkoutSessions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('workout_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_sessions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
}

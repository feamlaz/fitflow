-- Создание таблиц для FitFlow
-- Выполните этот SQL в Supabase Dashboard -> SQL Editor

-- Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')) NOT NULL,
  goal TEXT CHECK (goal IN ('lose_weight', 'maintain', 'gain_muscle')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица дневного питания
CREATE TABLE IF NOT EXISTS nutrition_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  protein DECIMAL(8,2) DEFAULT 0,
  carbs DECIMAL(8,2) DEFAULT 0,
  fat DECIMAL(8,2) DEFAULT 0,
  water INTEGER DEFAULT 0,
  meals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Таблица тренировок
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  workout_id TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  completed BOOLEAN DEFAULT false,
  exercises JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица записей веса
CREATE TABLE IF NOT EXISTS weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Таблица целей пользователя
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  target_weight DECIMAL(5,2),
  target_calories INTEGER,
  target_workouts_per_week INTEGER DEFAULT 3,
  target_water_ml INTEGER DEFAULT 2000,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- RLS политики для безопасности
-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Nutrition Days
CREATE POLICY "Users can view own nutrition days" ON nutrition_days
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own nutrition days" ON nutrition_days
  FOR ALL USING (auth.uid() = user_id);

-- Workout Sessions
CREATE POLICY "Users can view own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workout sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Weight Entries
CREATE POLICY "Users can view own weight entries" ON weight_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own weight entries" ON weight_entries
  FOR ALL USING (auth.uid() = user_id);

-- User Goals
CREATE POLICY "Users can view own goals" ON user_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" ON user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для обновления updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_days_updated_at BEFORE UPDATE ON nutrition_days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weight_entries_updated_at BEFORE UPDATE ON weight_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Real-time подписки
ALTER TABLE nutrition_days REPLICA IDENTITY FULL;
ALTER TABLE workout_sessions REPLICA IDENTITY FULL;
ALTER TABLE weight_entries REPLICA IDENTITY FULL;
ALTER TABLE user_goals REPLICA IDENTITY FULL;

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_nutrition_days_user_id ON nutrition_days(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_days_date ON nutrition_days(date);
CREATE INDEX IF NOT EXISTS idx_nutrition_days_user_date ON nutrition_days(user_id, date);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_start_time ON workout_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed ON workout_sessions(completed);

CREATE INDEX IF NOT EXISTS idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_entries_date ON weight_entries(date);
CREATE INDEX IF NOT EXISTS idx_weight_entries_user_date ON weight_entries(user_id, date);

CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);

-- Создание функции для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, age, gender, height, weight, activity_level, goal)
  VALUES (
    NEW.id,
    'New User',
    25,
    'male',
    175.0,
    70.0,
    'moderate',
    'maintain'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

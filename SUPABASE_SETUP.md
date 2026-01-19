# 🗄️ Настройка Supabase для FitFlow

## 📋 Что нужно сделать:

### 1. Создание проекта Supabase
1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Скопируйте URL и anon ключ

### 2. Настройка переменных окружения
Создайте файл `.env` в корне проекта:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Установка зависимостей
```bash
npm install @supabase/supabase-js
```

### 4. Создание таблиц в Supabase

#### Таблица profiles
```sql
CREATE TABLE profiles (
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

-- Индексы
CREATE INDEX idx_profiles_id ON profiles(id);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
```

#### Таблица nutrition_days
```sql
CREATE TABLE nutrition_days (
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

-- Индексы
CREATE INDEX idx_nutrition_days_user_id ON nutrition_days(user_id);
CREATE INDEX idx_nutrition_days_date ON nutrition_days(date);
CREATE INDEX idx_nutrition_days_user_date ON nutrition_days(user_id, date);
```

#### Таблица workout_sessions
```sql
CREATE TABLE workout_sessions (
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

-- Индексы
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_start_time ON workout_sessions(start_time);
CREATE INDEX idx_workout_sessions_completed ON workout_sessions(completed);
```

#### Таблица weight_entries
```sql
CREATE TABLE weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Индексы
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX idx_weight_entries_date ON weight_entries(date);
CREATE INDEX idx_weight_entries_user_date ON weight_entries(user_id, date);
```

#### Таблица user_goals
```sql
CREATE TABLE user_goals (
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

-- Индексы
CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
```

### 5. RLS (Row Level Security) политики

#### Включение RLS
```sql
-- Включить RLS для всех таблиц
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
```

#### Политики безопасности
```sql
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
```

### 6. Триггеры для обновления updated_at

```sql
-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры
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
```

### 7. Real-time подписки

```sql
-- Real-time для таблиц
ALTER TABLE nutrition_days REPLICA IDENTITY FULL;
ALTER TABLE workout_sessions REPLICA IDENTITY FULL;
ALTER TABLE weight_entries REPLICA IDENTITY FULL;
ALTER TABLE user_goals REPLICA IDENTITY FULL;
```

## 🚀 Запуск приложения

1. Установите зависимости: `npm install @supabase/supabase-js`
2. Настройте `.env` файл
3. Создайте таблицы в Supabase
4. Запустите приложение: `npm run dev`

## 📱 Функциональность

После настройки Supabase приложение будет:

- ✅ **Автоматически сохранять** все данные в облаке
- ✅ **Синхронизировать** между устройствами
- ✅ **Работать оффлайн** с последующей синхронизацией
- ✅ **Real-time обновления** между устройствами
- ✅ **Безопасно хранить** данные пользователя

## 🔧 Тестирование

1. Создайте аккаунт в приложении
2. Заполните профиль
3. Добавьте данные питания/тренировок
4. Проверьте сохранение в Supabase Dashboard
5. Протестируйте real-time синхронизацию

## 🐛 Возможные проблемы

### Проблема: "Connection refused"
**Решение:** Проверьте URL проекта в `.env`

### Проблема: "Invalid API key"
**Решение:** Используйте правильный anon ключ

### Проблема: "RLS policy violation"
**Решение:** Проверьте RLS политики в Supabase

### Проблема: "Type errors"
**Решение:** Установите `npm install @supabase/supabase-js`

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте консоль браузера
2. Проверьте Supabase Dashboard
3. Убедитесь что все таблицы созданы
4. Проверьте RLS политики

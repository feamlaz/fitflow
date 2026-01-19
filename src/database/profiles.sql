-- Profiles table for FitFlow users
-- Black/Orange Glass Design Database Schema v2

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  age INTEGER,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  height DECIMAL(5,2), -- in cm
  weight DECIMAL(5,2), -- in kg
  activity_level VARCHAR(20) CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal VARCHAR(20) CHECK (goal IN ('lose_weight', 'maintain', 'gain_muscle')),
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles(last_login);
CREATE INDEX IF NOT EXISTS idx_profiles_activity_level ON profiles(activity_level);
CREATE INDEX IF NOT EXISTS idx_profiles_goal ON profiles(goal);
CREATE INDEX IF NOT EXISTS idx_profiles_email_login ON profiles(email, last_login);
CREATE INDEX IF NOT EXISTS idx_profiles_failed_attempts ON profiles(failed_attempts);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, age, gender, height, weight, activity_level, goal, last_login)
  VALUES (
    NEW.id,
    NEW.email,
    'FitFlow User',
    25,
    'male',
    175.0,
    70.0,
    'moderate',
    'maintain',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update last_login on successful login
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    last_login = NOW(),
    failed_attempts = 0,
    locked_until = NULL
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update last_login on successful login
CREATE OR REPLACE TRIGGER on_successful_login
  AFTER INSERT ON auth.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_last_login();

-- Function to handle failed login attempts
CREATE OR REPLACE FUNCTION public.handle_failed_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    failed_attempts = failed_attempts + 1,
    locked_until = CASE 
      WHEN failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
      WHEN failed_attempts + 1 >= 3 THEN NOW() + INTERVAL '5 minutes'
      ELSE NULL
    END
  WHERE email = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile updates
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing (optional)
-- INSERT INTO profiles (id, email, name, age, gender, height, weight, activity_level, goal)
-- VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User', 25, 'male', 175.0, 70.0, 'moderate', 'maintain');

-- ==========================================
-- BLOOMA — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Copy and paste this script into the Supabase SQL Editor
-- ==========================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PERFILES TABLE
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  stage TEXT DEFAULT 'cycle' CHECK (stage IN ('cycle', 'pregnancy', 'menopause')),
  pin_enabled BOOLEAN DEFAULT FALSE,
  pin_code TEXT DEFAULT '',
  discrete_mode BOOLEAN DEFAULT FALSE,
  offline_mode BOOLEAN DEFAULT FALSE,
  opt_in_sync BOOLEAN DEFAULT FALSE,
  age INTEGER,
  last_period_date DATE,
  gestation_week_start DATE,
  menopause_start_year TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on perfiles
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- 2. CICLOS TABLE
CREATE TABLE IF NOT EXISTS public.ciclos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  duration INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, start_date)
);

-- Enable RLS on ciclos
ALTER TABLE public.ciclos ENABLE ROW LEVEL SECURITY;

-- 3. DAILY LOGS TABLE (Symptoms & Tracking)
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood TEXT,
  notes TEXT,
  flow TEXT,
  pain TEXT,
  temperature NUMERIC(4, 2),
  hot_flashes INTEGER DEFAULT 0,
  sleep_quality TEXT,
  anxiety_level INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, date)
);

-- Enable RLS on daily_logs
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- 4. REGISTROS EMBARAZO TABLE (Triage)
CREATE TABLE IF NOT EXISTS public.registros_embarazo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  gestation_week INTEGER NOT NULL,
  symptoms TEXT[] DEFAULT '{}'::TEXT[],
  classification TEXT DEFAULT 'normal' CHECK (classification IN ('normal', 'vigilar', 'urgente')),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, date)
);

-- Enable RLS on registros_embarazo
ALTER TABLE public.registros_embarazo ENABLE ROW LEVEL SECURITY;

-- 5. CASAS MATERNAS TABLE (Regional Lookup directory)
CREATE TABLE IF NOT EXISTS public.casas_maternas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  municipality TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on casas_maternas
ALTER TABLE public.casas_maternas ENABLE ROW LEVEL SECURITY;

-- 6. PREDICCIONES TABLE
CREATE TABLE IF NOT EXISTS public.predicciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE NOT NULL,
  prediction_date DATE NOT NULL,
  predicted_start_date DATE NOT NULL,
  confidence_level TEXT DEFAULT 'low' CHECK (confidence_level IN ('low', 'medium', 'high')),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on predicciones
ALTER TABLE public.predicciones ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- ROW LEVEL SECURITY POLICIES (Privacy protection)
-- ==========================================

-- Perfiles Policies
CREATE POLICY "Users can view own profile" 
  ON public.perfiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.perfiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.perfiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Ciclos Policies
CREATE POLICY "Users can view own cycles" 
  ON public.ciclos FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycles" 
  ON public.ciclos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycles" 
  ON public.ciclos FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycles" 
  ON public.ciclos FOR DELETE 
  USING (auth.uid() = user_id);

-- Daily Logs Policies
CREATE POLICY "Users can view own daily logs" 
  ON public.daily_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs" 
  ON public.daily_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs" 
  ON public.daily_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs" 
  ON public.daily_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Registros Embarazo Policies
CREATE POLICY "Users can view own triage records" 
  ON public.registros_embarazo FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own triage records" 
  ON public.registros_embarazo FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own triage records" 
  ON public.registros_embarazo FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own triage records" 
  ON public.registros_embarazo FOR DELETE 
  USING (auth.uid() = user_id);

-- Casas Maternas Policies (Read is public, write is restricted)
CREATE POLICY "Casas Maternas are publicly readable" 
  ON public.casas_maternas FOR SELECT 
  USING (true);

-- Predicciones Policies
CREATE POLICY "Users can view own predictions" 
  ON public.predicciones FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" 
  ON public.predicciones FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions" 
  ON public.predicciones FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions" 
  ON public.predicciones FOR DELETE 
  USING (auth.uid() = user_id);


-- ==========================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==========================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, stage, opt_in_sync, pin_enabled, discrete_mode, offline_mode, updated_at)
  VALUES (
    new.id,
    'cycle',
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute function on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- SEED DATA: CASAS MATERNAS
-- ==========================================
INSERT INTO public.casas_maternas (name, department, municipality, phone, address)
VALUES
  ('Casa Materna Gladys Marín', 'Matagalpa', 'Matagalpa', '+505 2772 2012', 'De la Catedral 2 cuadras al norte, 1 cuadra al este.'),
  ('Casa Materna Arlen Siu', 'Managua', 'Managua', '+505 2222 4589', 'Barrio Martha Quezada, del Cine Dorado 1 cuadra abajo.'),
  ('Casa Materna Mildred Abaunza', 'Estelí', 'Estelí', '+505 2713 4110', 'Costado oeste de la Clínica Médica Previsional.'),
  ('Casa Materna María Auxiliadora', 'Chinandega', 'El Viejo', '+505 2342 1102', 'Frente a la Parroquia El Calvario.'),
  ('Casa Materna Sor María Romero', 'Rivas', 'Rivas', '+505 2563 3310', 'De la rotonda de Rivas 150 metros al sur.'),
  ('Casa Materna Josefa Toledo', 'Chontales', 'Juigalpa', '+505 2512 0450', 'Frente al Hospital Regional Camilo Ortega.'),
  ('Casa Materna Concepción Palacios', 'León', 'León', '+505 2311 5014', 'Del Teatro González 2 cuadras al sur, 1/2 cuadra abajo.'),
  ('Casa Materna Aurora Ortiz', 'Masaya', 'Masaya', '+505 2522 1980', 'De las Cuatro Esquinas 1 cuadra al oeste.')
ON CONFLICT DO NOTHING;

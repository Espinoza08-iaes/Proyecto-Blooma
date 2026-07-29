-- ====================================================================
-- BLOOMA WOMEN'S HEALTH PLATFORM - OFFICIAL SUPABASE DATABASE SCHEMA
-- ====================================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE PERFILES (Vinculada a auth.users)
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    stage TEXT DEFAULT 'cycle' CHECK (stage IN ('cycle', 'pregnancy', 'menopause')),
    conception_mode BOOLEAN DEFAULT FALSE,
    age INTEGER,
    gestation_week_start INTEGER DEFAULT 18,
    menopause_start_year INTEGER,
    pin_enabled BOOLEAN DEFAULT FALSE,
    pin_code TEXT DEFAULT '',
    opt_in_sync BOOLEAN DEFAULT TRUE,
    discrete_mode BOOLEAN DEFAULT FALSE,
    offline_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE CICLOS MENSTRUALES
CREATE TABLE IF NOT EXISTS public.ciclos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    cycle_length INTEGER DEFAULT 28,
    period_length INTEGER DEFAULT 5,
    is_ovulation_confirmed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE REGISTROS DIARIOS Y BIOMARCADORES DE FERTILIDAD
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    flow_intensity TEXT CHECK (flow_intensity IN ('ninguno', 'ligero', 'moderado', 'abundante')),
    cervical_mucus TEXT,
    basal_temp NUMERIC(4, 2),
    lh_result TEXT CHECK (lh_result IN ('positivo', 'negativo', 'sin_prueba')),
    symptoms JSONB DEFAULT '[]'::jsonb,
    moods JSONB DEFAULT '[]'::jsonb,
    sex_tags JSONB DEFAULT '[]'::jsonb,
    digestion_tags JSONB DEFAULT '[]'::jsonb,
    water_ml INTEGER DEFAULT 0,
    weight_kg NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- 4. TABLA DE TELEMETRÍA BIOMÉTRICA (Wearables: Reloj, Anillo Inteligente)
CREATE TABLE IF NOT EXISTS public.biometric_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resting_heart_rate INTEGER,
    hrv_ms INTEGER,
    skin_temp_delta NUMERIC(3, 2),
    sleep_minutes INTEGER,
    source_device TEXT DEFAULT 'Wearable SDK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE TRIAJE OBSTÉTRICO MINSA (Alertas y Código Rojo Gestacional)
CREATE TABLE IF NOT EXISTS public.triage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    gestation_week INTEGER NOT NULL,
    symptoms JSONB DEFAULT '[]'::jsonb,
    classification TEXT NOT NULL CHECK (classification IN ('VERDE', 'AMARILLO', 'ROJO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA DE CASAS MATERNAS MINSA (Directorio Nacional)
CREATE TABLE IF NOT EXISTS public.maternal_houses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    municipality TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciclos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.triage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maternal_houses ENABLE ROW LEVEL SECURITY;

-- Policies for perfiles
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.perfiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.perfiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su propio perfil" ON public.perfiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for ciclos
CREATE POLICY "Usuarios administran sus propios ciclos" ON public.ciclos
    FOR ALL USING (auth.uid() = user_id);

-- Policies for daily_logs
CREATE POLICY "Usuarios administran sus registros diarios" ON public.daily_logs
    FOR ALL USING (auth.uid() = user_id);

-- Policies for biometric_logs
CREATE POLICY "Usuarios administran su telemetria biometrica" ON public.biometric_logs
    FOR ALL USING (auth.uid() = user_id);

-- Policies for triage_records
CREATE POLICY "Usuarios administran su triaje obstetrico" ON public.triage_records
    FOR ALL USING (auth.uid() = user_id);

-- Policies for maternal_houses (Public Read-Only)
CREATE POLICY "Cualquiera puede consultar la red de Casas Maternas" ON public.maternal_houses
    FOR SELECT USING (true);

-- ====================================================================
-- INITIAL SEED DATA FOR CASAS MATERNAS (MINSA)
-- ====================================================================
INSERT INTO public.maternal_houses (name, department, municipality, phone, address) VALUES
('Casa Materna Gladys Marín', 'Matagalpa', 'Matagalpa', '+505 2772 2012', 'De la Catedral 2 cuadras al norte, 1 cuadra al este.'),
('Casa Materna Arlen Siu', 'Managua', 'Managua', '+505 2222 4589', 'Barrio Martha Quezada, del Cine Dorado 1 cuadra abajo.'),
('Casa Materna Mildred Abaunza', 'Estelí', 'Estelí', '+505 2713 4110', 'Costado oeste de la Clínica Médica Previsional.'),
('Casa Materna María Auxiliadora', 'Chinandega', 'El Viejo', '+505 2342 1102', 'Frente a la Parroquia El Calvario.'),
('Casa Materna Sor María Romero', 'Rivas', 'Rivas', '+505 2563 3310', 'De la rotonda de Rivas 150 metros al sur.'),
('Casa Materna Josefa Toledo', 'Chontales', 'Juigalpa', '+505 2512 0450', 'Frente al Hospital Regional Camilo Ortega.'),
('Casa Materna Concepción Palacios', 'León', 'León', '+505 2311 5014', 'Del Teatro González 2 cuadras al sur, 1/2 cuadra abajo.'),
('Casa Materna Aurora Ortiz', 'Masaya', 'Masaya', '+505 2522 1980', 'De las Cuatro Esquinas 1 cuadra al oeste.')
ON CONFLICT DO NOTHING;

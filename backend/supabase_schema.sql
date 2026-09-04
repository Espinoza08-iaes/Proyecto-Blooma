-- ====================================================================
-- PROYECTO BLOOMA - ARQUITECTURA DE BASE DE DATOS SUPABASE / POSTGRESQL
-- Versión: 2.1.0 (Grado Médico, Georreferenciación Territorial & Red MINSA)
-- ====================================================================

-- Habilitar extensiones de criptografía y UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. TABLA DE ESTABLECIMIENTOS DE SALUD Y CASAS MATERNAS (Directorio Nacional)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.maternal_houses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    municipality TEXT NOT NULL,
    silais TEXT NOT NULL DEFAULT 'SILAIS Nacional',
    type TEXT NOT NULL DEFAULT 'casa_materna' CHECK (type IN ('casa_materna', 'hospital', 'centro_salud')),
    phone TEXT,
    address TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    has_emergency_24h BOOLEAN DEFAULT TRUE,
    has_obstetric_surgery BOOLEAN DEFAULT FALSE,
    has_ambulance BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 2. TABLA DE PERFILES DE USUARIA (Con Inclusión Lingüística y Ubicación)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    stage TEXT DEFAULT 'cycle' CHECK (stage IN ('cycle', 'pregnancy', 'menopause')),
    conception_mode BOOLEAN DEFAULT FALSE,
    language TEXT DEFAULT 'es' CHECK (language IN ('es', 'miskito', 'creole')),
    climacteric_stage TEXT DEFAULT 'early_perimenopause' CHECK (
        climacteric_stage IN ('premenopause', 'early_perimenopause', 'late_perimenopause', 'menopause_milestone', 'postmenopause')
    ),
    age INTEGER CHECK (age >= 10 AND age <= 100),
    department TEXT,
    municipality TEXT,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    assigned_facility_id INTEGER REFERENCES public.maternal_houses(id) ON DELETE SET NULL,
    gestation_week_start TIMESTAMP WITH TIME ZONE,
    menopause_start_year INTEGER,
    pin_enabled BOOLEAN DEFAULT FALSE,
    pin_code TEXT DEFAULT '',
    opt_in_sync BOOLEAN DEFAULT TRUE,
    discrete_mode BOOLEAN DEFAULT FALSE,
    offline_mode BOOLEAN DEFAULT FALSE,
    theme_color TEXT DEFAULT 'earth' CHECK (theme_color IN ('earth', 'orchid', 'forest', 'ocean')),
    theme_text_size TEXT DEFAULT 'normal' CHECK (theme_text_size IN ('normal', 'large')),
    app_icon TEXT DEFAULT 'blooma',
    logo_variant TEXT DEFAULT 'lotus' CHECK (logo_variant IN ('lotus', 'sprout', 'flower', 'butterfly', 'sun')),
    custom_avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 3. TABLA DE CICLOS MENSTRUALES Y PREDICCIONES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.ciclos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    duration INTEGER DEFAULT 28 CHECK (duration >= 15 AND duration <= 60),
    period_length INTEGER DEFAULT 5 CHECK (period_length >= 1 AND period_length <= 15),
    is_ovulation_confirmed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 4. TABLA DE REGISTROS DIARIOS Y BIOMARCADORES DE FERTILIDAD
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood TEXT CHECK (mood IN ('happy', 'calm', 'anxious', 'sad', 'irritable', 'tired')),
    flow TEXT CHECK (flow IN ('none', 'light', 'medium', 'heavy')),
    pain TEXT CHECK (pain IN ('none', 'mild', 'moderate', 'severe')),
    temperature NUMERIC(4, 2),
    hot_flashes INTEGER DEFAULT 0 CHECK (hot_flashes >= 0 AND hot_flashes <= 50),
    sleep_quality TEXT CHECK (sleep_quality IN ('good', 'fair', 'poor')),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    discharge_type TEXT CHECK (discharge_type IN ('creamy', 'watery', 'egg_white', 'spotting')),
    pregnancy_test_result TEXT CHECK (pregnancy_test_result IN ('none', 'positive', 'negative', 'faint_line')),
    ovulation_test_result TEXT CHECK (ovulation_test_result IN ('none', 'positive', 'negative')),
    water_ml INTEGER DEFAULT 0 CHECK (water_ml >= 0 AND water_ml <= 10000),
    weight_kg NUMERIC(5, 2) CHECK (weight_kg >= 25.0 AND weight_kg <= 300.0),
    contraceptive_taken BOOLEAN DEFAULT FALSE,
    notes TEXT,
    symptom_tags JSONB DEFAULT '[]'::jsonb,
    mood_tags JSONB DEFAULT '[]'::jsonb,
    sex_tags JSONB DEFAULT '[]'::jsonb,
    digestion_tags JSONB DEFAULT '[]'::jsonb,
    lifestyle_tags JSONB DEFAULT '[]'::jsonb,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_daily_log UNIQUE (user_id, date)
);

-- ====================================================================
-- 5. TABLA DE EVALUACIONES DEL CLIMATERIO (ESCALA MRS - OMS / MINSA)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.mrs_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    somatic_score INTEGER NOT NULL CHECK (somatic_score >= 0 AND somatic_score <= 16),
    psychological_score INTEGER NOT NULL CHECK (psychological_score >= 0 AND psychological_score <= 16),
    urogenital_score INTEGER NOT NULL CHECK (urogenital_score >= 0 AND urogenital_score <= 12),
    total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 44),
    severity TEXT NOT NULL CHECK (severity IN ('leve', 'moderada', 'severa')),
    climacteric_stage TEXT NOT NULL,
    answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 6. TABLA DE TELEMETRÍA BIOMÉTRICA (Wearables: Reloj, Anillo Inteligente)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.biometric_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resting_hr INTEGER CHECK (resting_hr >= 30 AND resting_hr <= 220),
    hrv_ms INTEGER CHECK (hrv_ms >= 5 AND hrv_ms <= 300),
    skin_temp NUMERIC(4, 2) CHECK (skin_temp >= 30.0 AND skin_temp <= 43.0),
    sleep_minutes INTEGER CHECK (sleep_minutes >= 0 AND sleep_minutes <= 1440),
    hot_flashes_count INTEGER DEFAULT 0,
    source_device TEXT DEFAULT 'simulator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 7. TABLA DE TRIAJE OBSTÉTRICO MINSA (Señales de Peligro)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.triage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    gestation_week INTEGER NOT NULL CHECK (gestation_week >= 1 AND gestation_week <= 44),
    symptoms JSONB DEFAULT '[]'::jsonb,
    classification TEXT NOT NULL CHECK (classification IN ('normal', 'vigilar', 'urgente')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 8. TABLA DE PLAN DE PARTO FAMILIAR COMUNITARIO (Norma MINSA)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.birth_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transfer_week INTEGER DEFAULT 34 CHECK (transfer_week >= 28 AND transfer_week <= 40),
    transport_type TEXT NOT NULL DEFAULT 'ambulancia' CHECK (
        transport_type IN ('ambulancia', 'panga', 'vehiculo', 'carreta', 'a_pie')
    ),
    companion_name TEXT NOT NULL,
    companion_phone TEXT,
    community_midwife TEXT,
    community_health_worker TEXT,
    emergency_fund_ready BOOLEAN DEFAULT FALSE,
    blood_type TEXT,
    target_facility_id INTEGER REFERENCES public.maternal_houses(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 9. TABLA DE CONTROLES PRENATALES MINSA (Citas y Signos Clínicos)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.prenatal_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    gestation_week INTEGER NOT NULL CHECK (gestation_week >= 1 AND gestation_week <= 44),
    blood_pressure_systolic INTEGER CHECK (blood_pressure_systolic >= 60 AND blood_pressure_systolic <= 250),
    blood_pressure_diastolic INTEGER CHECK (blood_pressure_diastolic >= 30 AND blood_pressure_diastolic <= 150),
    weight_kg NUMERIC(5, 2),
    uterine_height_cm NUMERIC(4, 1),
    fetal_heart_rate_bpm INTEGER CHECK (fetal_heart_rate_bpm >= 80 AND fetal_heart_rate_bpm <= 220),
    iron_folic_supplement BOOLEAN DEFAULT TRUE,
    facility_name TEXT,
    notes TEXT,
    next_appointment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 10. TABLA DE SESIONES DE MOVIMIENTO FETAL (Pataditas)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.kick_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    count INTEGER NOT NULL CHECK (count >= 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 1),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 11. TABLA DE CRONÓMETRO DE CONTRACCIONES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contraction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 1),
    interval_seconds INTEGER NOT NULL CHECK (interval_seconds >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 12. TABLA DE MALETA HOSPITALARIA MINSA
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.hospital_bag_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('mom', 'baby', 'partner')),
    title TEXT NOT NULL,
    checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 13. TABLA DE REGISTRO DETALLADO DE SOFOCOS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.hot_flash_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    intensity TEXT NOT NULL CHECK (intensity IN ('mild', 'moderate', 'severe')),
    duration_minutes INTEGER DEFAULT 5,
    triggers JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA DE TIMESTAMP (updated_at)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_perfiles_updated
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_ciclos_updated
    BEFORE UPDATE ON public.ciclos
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_daily_logs_updated
    BEFORE UPDATE ON public.daily_logs
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_birth_plans_updated
    BEFORE UPDATE ON public.birth_plans
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ====================================================================
-- TRIGGER AUTOMÁTICO AL REGISTRAR USUARIO EN SUPABASE AUTH
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles (id, email, stage, opt_in_sync, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        'cycle',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================================
-- ÍNDICES DE ALTO RENDIMIENTO (B-Tree & Composite Indices)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_ciclos_user_date ON public.ciclos (user_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_biometric_user_time ON public.biometric_logs (user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_mrs_evaluations_user ON public.mrs_evaluations (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_triage_user_date ON public.triage_records (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_birth_plans_user ON public.birth_plans (user_id);
CREATE INDEX IF NOT EXISTS idx_prenatal_user_date ON public.prenatal_appointments (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_kicks_user_date ON public.kick_sessions (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_contractions_user_time ON public.contraction_logs (user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_maternal_houses_dept_muni ON public.maternal_houses (department, municipality);
CREATE INDEX IF NOT EXISTS idx_maternal_houses_type ON public.maternal_houses (type);
CREATE INDEX IF NOT EXISTS idx_maternal_houses_coords ON public.maternal_houses (latitude, longitude);

-- ====================================================================
-- POLÍTICAS ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciclos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mrs_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.triage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prenatal_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kick_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contraction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_bag_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hot_flash_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maternal_houses ENABLE ROW LEVEL SECURITY;

-- Policies for perfiles
CREATE POLICY "perfiles_select_own" ON public.perfiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "perfiles_update_own" ON public.perfiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "perfiles_insert_own" ON public.perfiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for user tables
CREATE POLICY "ciclos_user_all" ON public.ciclos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "daily_logs_user_all" ON public.daily_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "mrs_user_all" ON public.mrs_evaluations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "biometrics_user_all" ON public.biometric_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "triage_user_all" ON public.triage_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "birth_plans_user_all" ON public.birth_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "prenatal_user_all" ON public.prenatal_appointments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "kicks_user_all" ON public.kick_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "contractions_user_all" ON public.contraction_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "bag_user_all" ON public.hospital_bag_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "hotflash_user_all" ON public.hot_flash_logs FOR ALL USING (auth.uid() = user_id);

-- Policy for maternal houses (Lectura pública nacional)
CREATE POLICY "maternal_houses_public_read" ON public.maternal_houses FOR SELECT USING (TRUE);

-- ====================================================================
-- DIRECTORIO NACIONAL GEORREFERENCIADO (MINSA NICARAGUA)
-- ====================================================================
INSERT INTO public.maternal_houses (name, department, municipality, silais, type, phone, address, latitude, longitude, has_emergency_24h, has_obstetric_surgery, has_ambulance) VALUES
-- MANAGUA
('Casa Materna Arlen Siu', 'Managua', 'Managua', 'SILAIS Managua', 'casa_materna', '+505 2222 4589', 'Barrio Martha Quezada, del Cine Dorado 1 cuadra abajo.', 12.146500, -86.278500, TRUE, FALSE, TRUE),
('Hospital Materno Infantil Bertha Calderón Roque', 'Managua', 'Managua', 'SILAIS Managua', 'hospital', '+505 2265 0191', 'De la rotonda El Zumen 500 metros al sur.', 12.128700, -86.294100, TRUE, TRUE, TRUE),

-- MATAGALPA
('Casa Materna Gladys Marín', 'Matagalpa', 'Matagalpa', 'SILAIS Matagalpa', 'casa_materna', '+505 2772 2012', 'De la Catedral 2 cuadras al norte, 1 cuadra al este.', 12.928100, -85.918900, TRUE, FALSE, TRUE),
('Hospital Regional César Amador Molina', 'Matagalpa', 'Matagalpa', 'SILAIS Matagalpa', 'hospital', '+505 2772 3215', 'Salida a Managua, frente al Complejo Judicial.', 12.915200, -85.929800, TRUE, TRUE, TRUE),

-- ESTELÍ
('Casa Materna Mildred Abaunza', 'Estelí', 'Estelí', 'SILAIS Estelí', 'casa_materna', '+505 2713 4110', 'Costado oeste de la Clínica Médica Previsional.', 13.089400, -86.356200, TRUE, FALSE, TRUE),
('Hospital Regional San Juan de Dios', 'Estelí', 'Estelí', 'SILAIS Estelí', 'hospital', '+505 2713 6300', 'Costado noreste de la ciudad de Estelí.', 13.098700, -86.348900, TRUE, TRUE, TRUE),

-- CHINANDEGA
('Casa Materna María Auxiliadora', 'Chinandega', 'El Viejo', 'SILAIS Chinandega', 'casa_materna', '+505 2342 1102', 'Frente a la Parroquia El Calvario.', 12.663100, -87.168200, TRUE, FALSE, TRUE),
('Hospital Departamental Dr. Mauricio Abdalah', 'Chinandega', 'Chinandega', 'SILAIS Chinandega', 'hospital', '+505 2341 2210', 'Carretera Chinandega - El Viejo Km 136.', 12.645000, -87.142000, TRUE, TRUE, TRUE),

-- LEÓN
('Casa Materna Concepción Palacios', 'León', 'León', 'SILAIS León', 'casa_materna', '+505 2311 5014', 'Del Teatro González 2 cuadras al sur, 1/2 cuadra abajo.', 12.435000, -86.879000, TRUE, FALSE, TRUE),
('Hospital Escuela Oscar Danilo Rosales Argüello (HEODRA)', 'León', 'León', 'SILAIS León', 'hospital', '+505 2311 6020', 'Frente al Parque San Juan.', 12.441200, -86.872500, TRUE, TRUE, TRUE),

-- MASAYA
('Casa Materna Aurora Ortiz', 'Masaya', 'Masaya', 'SILAIS Masaya', 'casa_materna', '+505 2522 1980', 'De las Cuatro Esquinas 1 cuadra al oeste.', 11.972100, -86.096500, TRUE, FALSE, TRUE),
('Hospital Departamental Humberto Alvarado Vásquez', 'Masaya', 'Masaya', 'SILAIS Masaya', 'hospital', '+505 2522 2810', 'Costado este de la ciudad de Masaya.', 11.968000, -86.085000, TRUE, TRUE, TRUE),

-- RIVAS
('Casa Materna Sor María Romero', 'Rivas', 'Rivas', 'SILAIS Rivas', 'casa_materna', '+505 2563 3310', 'De la rotonda de Rivas 150 metros al sur.', 11.436000, -85.827000, TRUE, FALSE, TRUE),
('Hospital Departamental Gaspar García Laviana', 'Rivas', 'Rivas', 'SILAIS Rivas', 'hospital', '+505 2563 3700', 'Carretera Panamericana Sur Km 112.', 11.442000, -85.831000, TRUE, TRUE, TRUE),

-- CHONTALES
('Casa Materna Josefa Toledo', 'Chontales', 'Juigalpa', 'SILAIS Chontales', 'casa_materna', '+505 2512 0450', 'Frente al Hospital Regional Camilo Ortega.', 12.081500, -85.367000, TRUE, FALSE, TRUE),
('Hospital Escuela Asunción de Juigalpa', 'Chontales', 'Juigalpa', 'SILAIS Chontales', 'hospital', '+505 2512 2480', 'Costado suroeste de la ciudad de Juigalpa.', 12.086000, -85.362000, TRUE, TRUE, TRUE),

-- JINOTEGA
('Casa Materna Blanca Arauz', 'Jinotega', 'Jinotega', 'SILAIS Jinotega', 'casa_materna', '+505 2782 2240', 'Barrio Panorama, del cementerio 1 cuadra al este.', 13.095000, -86.008000, TRUE, FALSE, TRUE),
('Hospital Departamental Victoria Motta', 'Jinotega', 'Jinotega', 'SILAIS Jinotega', 'hospital', '+505 2782 2315', 'Salida a San Rafael del Norte.', 13.104000, -86.001000, TRUE, TRUE, TRUE),

-- COSTA CARIBE NORTE (RACCN)
('Casa Materna Bilwi - Puerto Cabezas', 'Costa Caribe Norte (RACCN)', 'Puerto Cabezas (Bilwi)', 'SILAIS Puerto Cabezas', 'casa_materna', '+505 2792 2234', 'Barrio San Luis, frente a Escuela Normal Gran Ducado.', 14.038000, -83.391000, TRUE, FALSE, TRUE),
('Hospital Regional Nuevo Amanecer de Bilwi', 'Costa Caribe Norte (RACCN)', 'Puerto Cabezas (Bilwi)', 'SILAIS Puerto Cabezas', 'hospital', '+505 2792 2310', 'Barrio Peter Ferrera, Bilwi.', 14.032000, -83.385000, TRUE, TRUE, TRUE),
('Casa Materna Waspam Río Coco', 'Costa Caribe Norte (RACCN)', 'Waspam', 'SILAIS Puerto Cabezas', 'casa_materna', '+505 2794 0012', 'Del muelle municipal 2 cuadras al este.', 14.741000, -83.972000, TRUE, FALSE, TRUE),

-- COSTA CARIBE SUR (RACCS)
('Casa Materna Bluefields', 'Costa Caribe Sur (RACCS)', 'Bluefields', 'SILAIS Bluefields', 'casa_materna', '+505 2572 2310', 'Barrio Beholden, contiguo al Hospital Regional.', 12.015000, -83.765000, TRUE, FALSE, TRUE),
('Hospital Regional Dr. Ernesto Sequeira Blanco', 'Costa Caribe Sur (RACCS)', 'Bluefields', 'SILAIS Bluefields', 'hospital', '+505 2572 2390', 'Barrio Beholden, frente al Parque Central.', 12.011000, -83.762000, TRUE, TRUE, TRUE),

-- RÍO SAN JUAN
('Casa Materna San Carlos Río San Juan', 'Río San Juan', 'San Carlos', 'SILAIS Río San Juan', 'casa_materna', '+505 2583 0210', 'Del Malecón de San Carlos 1 cuadra al norte.', 11.129000, -84.780000, TRUE, FALSE, TRUE),
('Hospital Departamental Dr. Luis Felipe Moncada', 'Río San Juan', 'San Carlos', 'SILAIS Río San Juan', 'hospital', '+505 2583 0340', 'Salida a Managua Km 285.', 11.135000, -84.772000, TRUE, TRUE, TRUE)
ON CONFLICT DO NOTHING;

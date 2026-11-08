-- Reference PostgreSQL schema for a future CarePoint nutrition backend.
-- Apply nurse-dashboard-schema.sql first; it defines the shared carepoint_users table.
-- Store private credential and plan documents in object storage; persist only their keys.

CREATE TABLE dietitian_profiles (
    user_id UUID PRIMARY KEY REFERENCES carepoint_users(id) ON DELETE CASCADE,
    gender TEXT,
    specialization TEXT NOT NULL,
    qualification TEXT,
    registration_number TEXT NOT NULL,
    credential_document_key TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    category TEXT NOT NULL DEFAULT 'dietitian' CHECK (category = 'dietitian'),
    experience_years SMALLINT NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
    consultation_fee_pkr INTEGER NOT NULL CHECK (consultation_fee_pkr BETWEEN 400 AND 1200),
    online_video_available BOOLEAN NOT NULL DEFAULT FALSE,
    home_assessment_available BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dietitian_workplaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_user_id UUID NOT NULL REFERENCES dietitian_profiles(user_id) ON DELETE CASCADE,
    workplace_type TEXT NOT NULL CHECK (workplace_type IN ('clinic', 'hospital', 'home_service_zone')),
    name TEXT NOT NULL,
    city TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dietitian_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_user_id UUID NOT NULL REFERENCES dietitian_profiles(user_id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    starts_at TIME NOT NULL,
    ends_at TIME NOT NULL,
    session_minutes SMALLINT NOT NULL DEFAULT 30 CHECK (session_minutes BETWEEN 15 AND 120),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (dietitian_user_id, weekday, starts_at, ends_at)
);

CREATE TABLE dietitian_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_user_id UUID NOT NULL REFERENCES dietitian_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    appointment_type TEXT NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    session_minutes SMALLINT NOT NULL DEFAULT 30 CHECK (session_minutes BETWEEN 15 AND 120),
    consultation_mode TEXT NOT NULL CHECK (consultation_mode IN ('online', 'clinic', 'home_visit')),
    location TEXT,
    fee_pkr INTEGER NOT NULL CHECK (fee_pkr >= 0),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX dietitian_appointments_queue_idx
    ON dietitian_appointments (dietitian_user_id, status, scheduled_start);

CREATE TABLE dietitian_meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES dietitian_appointments(id) ON DELETE CASCADE,
    dietitian_user_id UUID NOT NULL REFERENCES dietitian_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    daily_calories INTEGER CHECK (daily_calories IS NULL OR daily_calories > 0),
    carbohydrates_percent NUMERIC(5, 2) CHECK (carbohydrates_percent BETWEEN 0 AND 100),
    protein_percent NUMERIC(5, 2) CHECK (protein_percent BETWEEN 0 AND 100),
    fat_percent NUMERIC(5, 2) CHECK (fat_percent BETWEEN 0 AND 100),
    water_goal TEXT,
    foods_to_include TEXT,
    foods_to_avoid TEXT,
    follow_up_notes TEXT,
    plan_document_key TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dietitian_meal_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID NOT NULL REFERENCES dietitian_meal_plans(id) ON DELETE CASCADE,
    meal_name TEXT NOT NULL CHECK (meal_name IN ('breakfast', 'mid_morning', 'lunch', 'evening_snack', 'dinner')),
    food_guidance TEXT NOT NULL
);

CREATE TABLE dietitian_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_user_id UUID NOT NULL REFERENCES dietitian_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    appointment_id UUID REFERENCES dietitian_appointments(id) ON DELETE SET NULL,
    weight_kg NUMERIC(6, 2) CHECK (weight_kg IS NULL OR weight_kg > 0),
    bmi NUMERIC(5, 2) CHECK (bmi IS NULL OR bmi > 0),
    blood_sugar_mg_dl NUMERIC(7, 2),
    cholesterol_notes TEXT,
    follow_up_notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX dietitian_progress_history_idx
    ON dietitian_progress_logs (dietitian_user_id, patient_user_id, recorded_at DESC);

CREATE TABLE dietitian_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_user_id UUID NOT NULL REFERENCES dietitian_profiles(user_id),
    appointment_id UUID NOT NULL UNIQUE REFERENCES dietitian_appointments(id),
    gross_pkr INTEGER NOT NULL CHECK (gross_pkr >= 0),
    commission_pkr INTEGER NOT NULL CHECK (commission_pkr >= 0),
    net_pkr INTEGER NOT NULL CHECK (net_pkr = gross_pkr - commission_pkr),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dietitian_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES dietitian_appointments(id),
    dietitian_user_id UUID NOT NULL REFERENCES dietitian_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX dietitian_reviews_profile_idx
    ON dietitian_reviews (dietitian_user_id, created_at DESC);

-- Reference PostgreSQL schema for a future CarePoint physiotherapy backend.
-- Apply nurse-dashboard-schema.sql first; it defines the shared carepoint_users table.
-- Private credential documents should live in object storage; store only their key.

CREATE TABLE physiotherapist_profiles (
    user_id UUID PRIMARY KEY REFERENCES carepoint_users(id) ON DELETE CASCADE,
    gender TEXT,
    specialization TEXT NOT NULL,
    qualification TEXT,
    license_number TEXT NOT NULL,
    credential_document_key TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    category TEXT NOT NULL CHECK (category IN ('general_physio', 'sports_physio')),
    experience_years SMALLINT NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
    session_fee_pkr INTEGER NOT NULL CHECK (
        (category = 'general_physio' AND session_fee_pkr BETWEEN 600 AND 1500)
        OR (category = 'sports_physio' AND session_fee_pkr BETWEEN 1200 AND 2500)
    ),
    home_visit_available BOOLEAN NOT NULL DEFAULT FALSE,
    rehab_sessions_available BOOLEAN NOT NULL DEFAULT FALSE,
    urgent_calls_available BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE physiotherapist_workplaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physiotherapist_user_id UUID NOT NULL REFERENCES physiotherapist_profiles(user_id) ON DELETE CASCADE,
    workplace_type TEXT NOT NULL CHECK (workplace_type IN ('hospital', 'clinic', 'home_visit_zone')),
    name TEXT NOT NULL,
    city TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE physiotherapist_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physiotherapist_user_id UUID NOT NULL REFERENCES physiotherapist_profiles(user_id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    starts_at TIME NOT NULL,
    ends_at TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (physiotherapist_user_id, weekday, starts_at, ends_at)
);

CREATE TABLE physiotherapy_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physiotherapist_user_id UUID NOT NULL REFERENCES physiotherapist_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    service_type TEXT NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ,
    location TEXT,
    session_fee_pkr INTEGER NOT NULL CHECK (session_fee_pkr >= 0),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX physiotherapy_appointments_queue_idx
    ON physiotherapy_appointments (physiotherapist_user_id, status, scheduled_start);

CREATE TABLE physiotherapy_rehab_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES physiotherapy_appointments(id) ON DELETE CASCADE,
    physiotherapist_user_id UUID NOT NULL REFERENCES physiotherapist_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    exercise_name TEXT NOT NULL,
    sets SMALLINT CHECK (sets IS NULL OR sets > 0),
    repetitions_or_duration TEXT,
    frequency TEXT,
    posture_guidelines TEXT,
    session_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE physiotherapist_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physiotherapist_user_id UUID NOT NULL REFERENCES physiotherapist_profiles(user_id),
    appointment_id UUID NOT NULL UNIQUE REFERENCES physiotherapy_appointments(id),
    gross_pkr INTEGER NOT NULL CHECK (gross_pkr >= 0),
    commission_pkr INTEGER NOT NULL CHECK (commission_pkr >= 0),
    net_pkr INTEGER NOT NULL CHECK (net_pkr = gross_pkr - commission_pkr),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE physiotherapist_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES physiotherapy_appointments(id),
    physiotherapist_user_id UUID NOT NULL REFERENCES physiotherapist_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX physiotherapist_reviews_profile_idx
    ON physiotherapist_reviews (physiotherapist_user_id, created_at DESC);

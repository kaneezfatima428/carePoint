-- Reference PostgreSQL schema for a future CarePoint nursing backend.
-- Credential documents should be stored in private object storage; persist only the key here.

CREATE TABLE carepoint_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'nurse', 'physiotherapist', 'dietitian', 'ultrasound_specialist', 'lab_technician', 'pharmacy_manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nurse_profiles (
    user_id UUID PRIMARY KEY REFERENCES carepoint_users(id) ON DELETE CASCADE,
    gender TEXT,
    specialization TEXT NOT NULL,
    qualification TEXT,
    license_number TEXT NOT NULL,
    license_document_key TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    category TEXT NOT NULL CHECK (category IN ('routine_nurse', 'emergency_nurse')),
    experience_years SMALLINT NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
    fee_pkr INTEGER NOT NULL CHECK (
        (category = 'routine_nurse' AND fee_pkr BETWEEN 500 AND 1500)
        OR (category = 'emergency_nurse' AND fee_pkr BETWEEN 1000 AND 2500)
    ),
    home_visit_available BOOLEAN NOT NULL DEFAULT FALSE,
    bedside_care_available BOOLEAN NOT NULL DEFAULT FALSE,
    emergency_call_available BOOLEAN NOT NULL DEFAULT FALSE,
    night_shift_available BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nurse_workplaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nurse_user_id UUID NOT NULL REFERENCES nurse_profiles(user_id) ON DELETE CASCADE,
    workplace_type TEXT NOT NULL CHECK (workplace_type IN ('hospital', 'clinic', 'service_zone')),
    name TEXT NOT NULL,
    city TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nurse_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nurse_user_id UUID NOT NULL REFERENCES nurse_profiles(user_id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'evening', 'night', '12_hour', '24_hour')),
    starts_at TIME,
    ends_at TIME,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (nurse_user_id, weekday, shift_type)
);

CREATE TABLE nurse_service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nurse_user_id UUID NOT NULL REFERENCES nurse_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    service_type TEXT NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ,
    location TEXT NOT NULL,
    fee_pkr INTEGER NOT NULL CHECK (fee_pkr >= 0),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX nurse_requests_queue_idx
    ON nurse_service_requests (nurse_user_id, status, scheduled_start);

CREATE TABLE nurse_care_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES nurse_service_requests(id) ON DELETE CASCADE,
    nurse_user_id UUID NOT NULL REFERENCES nurse_profiles(user_id),
    blood_pressure TEXT,
    blood_sugar_mg_dl NUMERIC(6, 2),
    temperature_c NUMERIC(4, 1),
    pulse_bpm SMALLINT,
    medication_notes TEXT,
    care_instructions TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nurse_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nurse_user_id UUID NOT NULL REFERENCES nurse_profiles(user_id),
    request_id UUID NOT NULL UNIQUE REFERENCES nurse_service_requests(id),
    gross_pkr INTEGER NOT NULL CHECK (gross_pkr >= 0),
    commission_pkr INTEGER NOT NULL CHECK (commission_pkr >= 0),
    net_pkr INTEGER NOT NULL CHECK (net_pkr = gross_pkr - commission_pkr),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nurse_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE REFERENCES nurse_service_requests(id),
    nurse_user_id UUID NOT NULL REFERENCES nurse_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX nurse_reviews_profile_idx ON nurse_reviews (nurse_user_id, created_at DESC);

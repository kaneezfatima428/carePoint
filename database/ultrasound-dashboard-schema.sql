-- Reference PostgreSQL schema for a future CarePoint diagnostic ultrasound backend.
-- Apply nurse-dashboard-schema.sql first; it defines the shared carepoint_users table.
-- Store credential files, DICOM images, and report PDFs in private object storage.
-- Persist only storage keys and expose files through authenticated, short-lived URLs.

CREATE TABLE ultrasound_specialist_profiles (
    user_id UUID PRIMARY KEY REFERENCES carepoint_users(id) ON DELETE CASCADE,
    gender TEXT,
    specialization TEXT NOT NULL,
    qualification TEXT,
    license_number TEXT,
    credential_document_key TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    category TEXT NOT NULL DEFAULT 'ultrasound_specialist'
        CHECK (category = 'ultrasound_specialist'),
    experience_years SMALLINT NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
    scan_fee_pkr INTEGER NOT NULL CHECK (scan_fee_pkr BETWEEN 800 AND 2000),
    clinic_scans_available BOOLEAN NOT NULL DEFAULT FALSE,
    home_scans_available BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ultrasound_specialist_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialist_user_id UUID NOT NULL REFERENCES ultrasound_specialist_profiles(user_id) ON DELETE CASCADE,
    facility_type TEXT NOT NULL CHECK (facility_type IN ('imaging_center', 'hospital', 'clinic', 'home_service_zone')),
    name TEXT NOT NULL,
    city TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ultrasound_specialist_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialist_user_id UUID NOT NULL REFERENCES ultrasound_specialist_profiles(user_id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    starts_at TIME NOT NULL,
    ends_at TIME NOT NULL,
    scan_duration_minutes SMALLINT NOT NULL DEFAULT 30 CHECK (scan_duration_minutes IN (20, 30)),
    facility_id UUID REFERENCES ultrasound_specialist_facilities(id) ON DELETE SET NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (ends_at > starts_at),
    UNIQUE (specialist_user_id, weekday, starts_at, ends_at, facility_id)
);

CREATE TABLE ultrasound_scan_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialist_user_id UUID NOT NULL REFERENCES ultrasound_specialist_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    scan_type TEXT NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scan_duration_minutes SMALLINT NOT NULL DEFAULT 30 CHECK (scan_duration_minutes IN (20, 30)),
    facility_id UUID REFERENCES ultrasound_specialist_facilities(id) ON DELETE SET NULL,
    service_location TEXT,
    fee_pkr INTEGER NOT NULL CHECK (fee_pkr BETWEEN 0 AND 2000),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'in_progress', 'report_pending', 'completed', 'cancelled')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ultrasound_scan_queue_idx
    ON ultrasound_scan_appointments (specialist_user_id, status, scheduled_start);

CREATE TABLE ultrasound_diagnostic_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES ultrasound_scan_appointments(id) ON DELETE CASCADE,
    specialist_user_id UUID NOT NULL REFERENCES ultrasound_specialist_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    scan_type TEXT NOT NULL,
    key_findings TEXT NOT NULL,
    impression TEXT NOT NULL,
    clinical_recommendation TEXT,
    report_document_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ultrasound_report_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES ultrasound_diagnostic_reports(id) ON DELETE CASCADE,
    object_key TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('dicom', 'image', 'pdf')),
    original_filename TEXT,
    file_size_bytes BIGINT CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ultrasound_specialist_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialist_user_id UUID NOT NULL REFERENCES ultrasound_specialist_profiles(user_id),
    appointment_id UUID NOT NULL UNIQUE REFERENCES ultrasound_scan_appointments(id),
    gross_pkr INTEGER NOT NULL CHECK (gross_pkr >= 0),
    commission_pkr INTEGER NOT NULL CHECK (commission_pkr >= 0),
    net_pkr INTEGER NOT NULL CHECK (net_pkr = gross_pkr - commission_pkr),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ultrasound_specialist_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES ultrasound_scan_appointments(id),
    specialist_user_id UUID NOT NULL REFERENCES ultrasound_specialist_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ultrasound_specialist_reviews_profile_idx
    ON ultrasound_specialist_reviews (specialist_user_id, created_at DESC);

-- Reference PostgreSQL schema for a future CarePoint lab technician backend.
-- Apply nurse-dashboard-schema.sql first; it defines the shared carepoint_users table.
-- Store credential files and processed PDF reports in private object storage.
-- Persist only object keys and serve files through authenticated, short-lived URLs.

CREATE TABLE lab_technician_profiles (
    user_id UUID PRIMARY KEY REFERENCES carepoint_users(id) ON DELETE CASCADE,
    gender TEXT,
    certification TEXT,
    qualification TEXT,
    license_number TEXT,
    credential_document_key TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    category TEXT NOT NULL DEFAULT 'lab_technician' CHECK (category = 'lab_technician'),
    experience_years SMALLINT NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
    collection_fee_pkr INTEGER NOT NULL CHECK (collection_fee_pkr BETWEEN 150 AND 500),
    home_collection_available BOOLEAN NOT NULL DEFAULT FALSE,
    urgent_dispatch_available BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lab_technician_affiliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_user_id UUID NOT NULL REFERENCES lab_technician_profiles(user_id) ON DELETE CASCADE,
    affiliation_type TEXT NOT NULL
        CHECK (affiliation_type IN ('diagnostic_lab', 'diagnostic_center', 'home_service_zone')),
    name TEXT NOT NULL,
    city TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lab_technician_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_user_id UUID NOT NULL REFERENCES lab_technician_profiles(user_id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    collection_window TEXT NOT NULL CHECK (collection_window IN ('morning', 'evening')),
    starts_at TIME NOT NULL,
    ends_at TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (ends_at > starts_at),
    UNIQUE (technician_user_id, weekday, collection_window)
);

CREATE TABLE lab_collection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_user_id UUID NOT NULL REFERENCES lab_technician_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    request_type TEXT NOT NULL CHECK (request_type IN ('home_collection', 'lab_dispatch', 'urgent_lab_dispatch')),
    scheduled_start TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    collection_fee_pkr INTEGER NOT NULL CHECK (collection_fee_pkr BETWEEN 0 AND 500),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'en_route', 'sample_collected', 'delivered_to_lab', 'completed', 'cancelled')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX lab_collection_requests_queue_idx
    ON lab_collection_requests (technician_user_id, status, scheduled_start);

CREATE TABLE lab_collection_request_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES lab_collection_requests(id) ON DELETE CASCADE,
    catalog_test_id UUID,
    test_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lab_processed_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE REFERENCES lab_collection_requests(id) ON DELETE CASCADE,
    technician_user_id UUID NOT NULL REFERENCES lab_technician_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    report_document_key TEXT NOT NULL,
    original_filename TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lab_technician_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_user_id UUID NOT NULL REFERENCES lab_technician_profiles(user_id),
    request_id UUID NOT NULL UNIQUE REFERENCES lab_collection_requests(id),
    gross_collection_fee_pkr INTEGER NOT NULL CHECK (gross_collection_fee_pkr >= 0),
    commission_pkr INTEGER NOT NULL CHECK (commission_pkr >= 0),
    net_pkr INTEGER NOT NULL CHECK (net_pkr = gross_collection_fee_pkr - commission_pkr),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lab_technician_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE REFERENCES lab_collection_requests(id),
    technician_user_id UUID NOT NULL REFERENCES lab_technician_profiles(user_id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    punctuality_rating SMALLINT CHECK (punctuality_rating BETWEEN 1 AND 5),
    collection_professionalism_rating SMALLINT CHECK (collection_professionalism_rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX lab_technician_reviews_profile_idx
    ON lab_technician_reviews (technician_user_id, created_at DESC);

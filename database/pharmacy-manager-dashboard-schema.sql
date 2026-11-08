-- Reference PostgreSQL schema for a future CarePoint pharmacy backend.
-- Apply nurse-dashboard-schema.sql first; it defines the shared carepoint_users table.
-- Store licenses, prescriptions, and order documents in private object storage.
-- Persist object keys only and expose files via authenticated, short-lived URLs.

CREATE TABLE pharmacy_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_user_id UUID NOT NULL REFERENCES carepoint_users(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    pharmacist_name TEXT NOT NULL,
    gender TEXT,
    license_number TEXT,
    license_document_key TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    category TEXT NOT NULL DEFAULT 'pharmacy_delivery' CHECK (category = 'pharmacy_delivery'),
    operating_address TEXT NOT NULL,
    city TEXT,
    delivery_fee_pkr INTEGER NOT NULL CHECK (delivery_fee_pkr BETWEEN 50 AND 200),
    express_delivery_available BOOLEAN NOT NULL DEFAULT FALSE,
    emergency_dispatch_available BOOLEAN NOT NULL DEFAULT FALSE,
    standard_delivery_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (manager_user_id)
);

CREATE TABLE pharmacy_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacy_stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    product_type TEXT NOT NULL CHECK (
        product_type IN ('otc_medicine', 'prescription_medicine', 'wellness_product', 'diagnostic_kit')
    ),
    unit_price_pkr INTEGER NOT NULL CHECK (unit_price_pkr > 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX pharmacy_products_catalog_idx
    ON pharmacy_products (pharmacy_id, product_type, is_active, name);

CREATE TABLE pharmacy_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacy_stores(id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    order_type TEXT NOT NULL CHECK (order_type IN ('direct_otc', 'prescription')),
    status TEXT NOT NULL DEFAULT 'received'
        CHECK (status IN ('received', 'verified', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'returned')),
    prescription_status TEXT NOT NULL DEFAULT 'not_required'
        CHECK (prescription_status IN ('not_required', 'pending', 'verified', 'rejected')),
    medicine_subtotal_pkr INTEGER NOT NULL CHECK (medicine_subtotal_pkr >= 0),
    delivery_fee_pkr INTEGER NOT NULL CHECK (delivery_fee_pkr BETWEEN 0 AND 200),
    delivery_address TEXT NOT NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        (order_type = 'direct_otc' AND prescription_status = 'not_required')
        OR (order_type = 'prescription' AND prescription_status <> 'not_required')
    )
);

CREATE INDEX pharmacy_orders_queue_idx
    ON pharmacy_orders (pharmacy_id, status, created_at DESC);

CREATE TABLE pharmacy_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES pharmacy_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES pharmacy_products(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_pkr INTEGER NOT NULL CHECK (unit_price_pkr > 0),
    line_total_pkr INTEGER GENERATED ALWAYS AS (quantity * unit_price_pkr) STORED
);

CREATE TABLE pharmacy_prescription_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES pharmacy_orders(id) ON DELETE CASCADE,
    uploaded_by_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    prescription_object_key TEXT NOT NULL,
    reviewer_user_id UUID REFERENCES carepoint_users(id),
    decision TEXT NOT NULL DEFAULT 'pending'
        CHECK (decision IN ('pending', 'verified', 'rejected')),
    review_notes TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX pharmacy_prescription_review_queue_idx
    ON pharmacy_prescription_reviews (order_id, decision, uploaded_at DESC);

CREATE TABLE pharmacy_rider_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES pharmacy_orders(id) ON DELETE CASCADE,
    rider_name TEXT NOT NULL,
    logistics_partner TEXT,
    dispatch_status TEXT NOT NULL DEFAULT 'assigned'
        CHECK (dispatch_status IN ('assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed')),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    delivered_at TIMESTAMPTZ,
    delivery_confirmation_key TEXT
);

CREATE TABLE pharmacy_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacy_stores(id),
    order_id UUID NOT NULL UNIQUE REFERENCES pharmacy_orders(id),
    medicine_sales_pkr INTEGER NOT NULL CHECK (medicine_sales_pkr >= 0),
    delivery_fee_pkr INTEGER NOT NULL CHECK (delivery_fee_pkr >= 0),
    commission_pkr INTEGER NOT NULL CHECK (commission_pkr >= 0),
    net_pkr INTEGER NOT NULL CHECK (net_pkr = medicine_sales_pkr + delivery_fee_pkr - commission_pkr),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pharmacy_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES pharmacy_orders(id),
    pharmacy_id UUID NOT NULL REFERENCES pharmacy_stores(id),
    patient_user_id UUID NOT NULL REFERENCES carepoint_users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    delivery_speed_rating SMALLINT CHECK (delivery_speed_rating BETWEEN 1 AND 5),
    packaging_rating SMALLINT CHECK (packaging_rating BETWEEN 1 AND 5),
    service_quality_rating SMALLINT CHECK (service_quality_rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX pharmacy_reviews_store_idx
    ON pharmacy_reviews (pharmacy_id, created_at DESC);

-- ==============================================================================
-- GRAMASEVA: Rural Local Services & 30-Day Service Guarantee Platform
-- Complete PostgreSQL 15 + PostGIS Database Schema
-- Government of Andhra Pradesh (ఆంధ్రప్రదేశ్ ప్రభుత్వం)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Enumerated Custom Types
CREATE TYPE user_role AS ENUM ('CITIZEN', 'PROVIDER', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
CREATE TYPE booking_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'ON_THE_WAY',
    'ARRIVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'GUARANTEE_CLAIMED',
    'GUARANTEE_RESOLVED'
);
CREATE TYPE claim_status AS ENUM (
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'WORKER_B_ASSIGNED',
    'RESOLVED',
    'REJECTED'
);

-- 3. Core Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    village VARCHAR(150) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en', -- 'te' or 'en'
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Service Provider Profiles
CREATE TABLE IF NOT EXISTS provider_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    experience_years INT DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    completed_jobs INT DEFAULT 0,
    status verification_status DEFAULT 'VERIFIED',
    services_list TEXT[] DEFAULT '{}',
    location GEOMETRY(Point, 4326), -- PostGIS WGS 84 Point (longitude, latitude)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create GiST Spatial Index on Provider Coordinates for Fast Radius Search
CREATE INDEX IF NOT EXISTS idx_provider_profiles_location ON provider_profiles USING GIST (location);

-- 5. Service Categories Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    name_te VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    base_visit_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00, -- Fixed ₹50 Visit Fee
    estimated_work_min NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    estimated_work_max NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    icon_name VARCHAR(50) NOT NULL,
    description_en TEXT,
    description_te TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
    provider_name VARCHAR(150) NOT NULL,
    provider_phone VARCHAR(20) NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    service_name VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    village VARCHAR(150) NOT NULL,
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    scheduled_time VARCHAR(50) NOT NULL DEFAULT '10:00 AM - 12:00 PM',
    status booking_status NOT NULL DEFAULT 'CONFIRMED',
    start_otp VARCHAR(6) NOT NULL,
    complete_otp VARCHAR(6) NOT NULL,
    base_visit_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    work_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    work_details TEXT,
    guarantee_active BOOLEAN DEFAULT FALSE,
    guarantee_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. Guarantee Claims Table (Worker A vs Worker B Engine)
CREATE TABLE IF NOT EXISTS guarantee_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    booking_code VARCHAR(50) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    worker_a_id UUID NOT NULL REFERENCES users(id),
    worker_a_name VARCHAR(150) NOT NULL,
    worker_b_id UUID REFERENCES users(id),
    worker_b_name VARCHAR(150),
    issue_description TEXT NOT NULL,
    status claim_status DEFAULT 'UNDER_REVIEW',
    filed_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    -- Core Integrity Constraint: Worker B cannot be Worker A!
    CONSTRAINT chk_worker_b_distinct CHECK (worker_a_id != worker_b_id)
);

-- 8. PostGIS Spatial Discovery Stored Procedure
CREATE OR REPLACE FUNCTION get_nearby_providers(
    p_district VARCHAR,
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_radius_km DOUBLE PRECISION DEFAULT 25.0
)
RETURNS TABLE (
    provider_id UUID,
    full_name VARCHAR,
    phone VARCHAR,
    district VARCHAR,
    mandal VARCHAR,
    experience_years INT,
    rating NUMERIC,
    services_list TEXT[],
    distance_km DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        u.phone,
        u.district,
        u.mandal,
        p.experience_years,
        p.rating,
        p.services_list,
        ROUND((ST_Distance(p.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography) / 1000.0)::numeric, 2)::DOUBLE PRECISION AS distance_km
    FROM users u
    JOIN provider_profiles p ON u.id = p.user_id
    WHERE u.role = 'PROVIDER'
      AND p.status = 'VERIFIED'
      AND (u.district = p_district OR ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography, p_radius_km * 1000))
    ORDER BY distance_km ASC;
END;
$$;

-- 9. Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guarantee_claims ENABLE ROW LEVEL SECURITY;

-- Citizens can only view their own bookings
CREATE POLICY "Citizens can view own bookings" 
ON bookings FOR SELECT 
USING (customer_phone = current_setting('request.jwt.claim.phone', true) OR current_setting('request.jwt.claim.role', true) = 'ADMIN');

-- Providers can view bookings assigned to them
CREATE POLICY "Providers can view assigned bookings" 
ON bookings FOR SELECT 
USING (provider_phone = current_setting('request.jwt.claim.phone', true) OR current_setting('request.jwt.claim.role', true) = 'ADMIN');

-- WebHostService RLS Policies
-- Phase 7 Plan 02: Row Level Security Configuration
--
-- This file configures RLS for all tables to match the existing Express API authorization:
-- - All authenticated users (admins) can access all data
-- - Anonymous users are blocked from sensitive data
-- - Public endpoints: inquiry submission, package viewing
--
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- ============================================================================
-- USERS TABLE
-- Admin users only - no public access
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything with users
CREATE POLICY "Authenticated users have full access to users"
ON users
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- CLIENTS TABLE
-- Business clients - admin only
-- ============================================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything with clients
CREATE POLICY "Authenticated users have full access to clients"
ON clients
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- PAYMENTS TABLE
-- Payment records - admin only
-- ============================================================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything with payments
CREATE POLICY "Authenticated users have full access to payments"
ON payments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- INQUIRIES TABLE
-- Contact form submissions - public can INSERT, admins can do everything
-- ============================================================================

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything with inquiries
CREATE POLICY "Authenticated users have full access to inquiries"
ON inquiries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Anonymous users can submit inquiries (contact form)
CREATE POLICY "Anyone can submit inquiries"
ON inquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================================
-- PACKAGES TABLE
-- Service packages - public can read, admins can do everything
-- ============================================================================

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything with packages
CREATE POLICY "Authenticated users have full access to packages"
ON packages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Anonymous users can view packages (public pricing page)
CREATE POLICY "Anyone can view packages"
ON packages
FOR SELECT
TO anon
USING (true);

-- ============================================================================
-- VERIFICATION
-- After running, check that all tables show "RLS Enabled" in Table Editor
-- ============================================================================

-- Migration: Add auth_id column to link public.users to Supabase Auth
-- Phase 8 Plan 01: Auth Migration Setup
--
-- This column links each user in public.users to their corresponding
-- Supabase Auth user in auth.users. This allows us to:
-- 1. Use Supabase Auth for authentication (login/logout/sessions)
-- 2. Keep our custom user data (firstName, lastName, role) in public.users
-- 3. Look up user role after authentication

-- Add auth_id column to link public.users to auth.users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id);

-- Create index for faster lookups when querying by auth_id
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

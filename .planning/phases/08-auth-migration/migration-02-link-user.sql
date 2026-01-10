-- Link Supabase Auth user to public.users by email
-- Run this after creating a user in Supabase Auth dashboard
--
-- Instructions:
-- 1. Create a user in Supabase Auth (Authentication → Users → Add user)
-- 2. Note the user's UUID from the users list
-- 3. Replace {AUTH_USER_ID} below with that UUID
-- 4. Run this SQL in the SQL Editor

-- First, find the auth user ID for a given email (optional verification):
-- SELECT id FROM auth.users WHERE email = 'admin@example.com';

-- Update public.users to link with auth.users:
UPDATE users
SET auth_id = '{AUTH_USER_ID}'
WHERE email = 'admin@example.com';

-- Verify the link worked:
SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.auth_id
FROM users u
WHERE u.auth_id IS NOT NULL;

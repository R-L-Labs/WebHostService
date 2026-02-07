-- Migration: Allow anonymous users to submit inquiries
-- Purpose: Enable public contact form submission without authentication
-- Run this in Supabase SQL Editor
-- Date: 2026-01-10

-- Allow anonymous users to INSERT inquiries (contact form)
-- This only allows INSERT - anonymous users cannot SELECT, UPDATE, or DELETE
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verify the policy was created:
-- SELECT * FROM pg_policies WHERE tablename = 'inquiries';

-- Add additional_services column to inquiries and clients tables
-- Stores comma-separated list of additional services selected
-- e.g., "Instagram Gallery, Jobber Form, Facebook Reviews, Other: custom text"

ALTER TABLE inquiries
ADD COLUMN IF NOT EXISTS additional_services TEXT;

ALTER TABLE clients
ADD COLUMN IF NOT EXISTS additional_services TEXT;

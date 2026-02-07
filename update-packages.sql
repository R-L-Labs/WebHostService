-- Update SiteKeeper Service Packages
-- Run this in your Supabase SQL Editor to update the packages

-- Delete existing packages to avoid conflicts
DELETE FROM packages;

-- Insert Hosting & Maintenance Package
INSERT INTO packages (id, name, description, price, features, is_active, display_order, created_at, updated_at)
VALUES (
  'hosting-maintenance',
  'Hosting & Maintenance',
  'Keep your website running smoothly with unlimited updates and priority support.',
  49.00,
  '["Unlimited content updates", "Menu specials & photo updates", "Domain & DNS setup", "Priority email support", "High performance (90+ PageSpeed score)", "Google Business setup available*"]'::jsonb,
  true,
  1,
  NOW(),
  NOW()
);

-- Insert Basic Static Website Package
INSERT INTO packages (id, name, description, price, features, is_active, display_order, created_at, updated_at)
VALUES (
  'basic-static',
  'Basic Static Website',
  'Perfect starter package for small businesses ready to establish their online presence.',
  497.00,
  '["5 pages included", "Mobile responsive design", "Contact form with EmailJS (optional)", "Social media & business links", "3 rounds of revisions", "Basic Google Maps integration", "Google Business setup available*"]'::jsonb,
  true,
  2,
  NOW(),
  NOW()
);

-- Insert Custom Website Package
INSERT INTO packages (id, name, description, price, features, is_active, display_order, created_at, updated_at)
VALUES (
  'custom-website',
  'Custom Website',
  'Fully customized solution tailored to your unique business needs. Perfect for blogs, recipe sites, and more.',
  0.00,
  '["Contact for custom quote", "Unlimited pages", "Not limited to static sites", "30-day support included", "Training call if needed", "Blog sites, recipe sites & more"]'::jsonb,
  true,
  3,
  NOW(),
  NOW()
);

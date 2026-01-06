import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  businessName: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Login form validation schema
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Client form validation schema
export const clientFormSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || /^https?:\/\/.+/.test(val),
      'Website must be a valid URL (http:// or https://)'
    ),
  status: z.enum(['PROSPECT', 'ACTIVE', 'INACTIVE', 'CANCELLED']),
  packageId: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

// Inquiry status update schema
export const inquiryStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DISMISSED']),
});

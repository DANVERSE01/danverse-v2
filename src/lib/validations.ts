import { z } from 'zod';

// Lead form validation schema
export const leadFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget_range: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  // Honeypot field for spam protection
  honeypot: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Order form validation schema
export const orderFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone is too long'),
  service: z.string().min(1, 'Service is required'),
  package_type: z.string().min(1, 'Package type is required'),
  total_amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('EGP'),
  payment_method: z.string().default('manual'),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

// Budget range options
export const budgetRanges = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-50k', label: '$15,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: 'over-100k', label: 'Over $100,000' },
  { value: 'discuss', label: 'Let\'s discuss' },
] as const;

// Service options
export const serviceOptions = [
  { value: 'global-creative-designs', label: 'Global Creative Designs' },
  { value: 'brand-transformation', label: 'Brand Transformation' },
  { value: 'end-to-end-campaigns', label: 'End-to-End Campaigns' },
  { value: 'high-end-web-development', label: 'High-End Web Development' },
  { value: 'full-stack-development', label: 'Full-Stack Development' },
  { value: 'danverse-academy', label: 'DANVERSE Academy' },
] as const;

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
};

// Email validation for admin endpoints
export const adminAuthSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});


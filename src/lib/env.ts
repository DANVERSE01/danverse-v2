import { z } from 'zod';

export const env = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  RATE_LIMIT_SECRET: z.string(),
  ADMIN_USER: z.string(),
  ADMIN_PASS: z.string(),
  INSTA_ALIAS: z.string(),
  VODAFONE_CASH_NUMBER: z.string(),
  BANK_NAME: z.string(),
  BANK_ACCOUNT_NAME: z.string(),
  BANK_ACCOUNT_NUMBER: z.string(),
  CURRENCY: z.string(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SMTP_URL: z.string(),
}).parse(process.env);


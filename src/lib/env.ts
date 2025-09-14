import { z } from 'zod';

// Environment schema with optional production secrets
const envSchema = z.object({
  // Required for all modes
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://danverse.ai'),
  RATE_LIMIT_SECRET: z.string().min(32),
  ADMIN_USER: z.string().default('admin'),
  ADMIN_PASS: z.string().min(8),
  
  // Payment info (always required)
  INSTA_ALIAS: z.string().default('muhamedadel69@instapay'),
  VODAFONE_CASH_NUMBER: z.string().default('+201069415658'),
  BANK_NAME: z.string().default('CIB'),
  BANK_ACCOUNT_NAME: z.string().default('MOHAMED ADEL'),
  BANK_ACCOUNT_NUMBER: z.string().default('100065756317'),
  BANK_IBAN: z.string().optional(),
  CURRENCY: z.string().default('EGP'),
  
  // Optional production secrets (for automatic mode switching)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE: z.string().optional(),
  SMTP_URL: z.string().optional(),
  
  // Optional analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  
  // Optional admin IP allowlist
  ADMIN_IP_ALLOWLIST: z.string().optional(),
});

// Parse environment with defaults
export const env = envSchema.parse(process.env);

// Check if we have production secrets
export const hasProductionSecrets = !!(
  env.SUPABASE_URL && 
  env.SUPABASE_ANON_KEY && 
  env.SMTP_URL
);

// Export preview mode status
export const isPreviewMode = !hasProductionSecrets;

// Log current mode
if (process.env.NODE_ENV !== 'test') {
  console.log(`🚀 DANVERSE v2 running in ${isPreviewMode ? 'PREVIEW' : 'PRODUCTION'} mode`);
  if (isPreviewMode) {
    console.log('📝 Data will be stored in memory with cookie persistence');
    console.log('📧 Emails will use Ethereal (preview links in console)');
    console.log('💾 Admin can export/import data via JWE backups');
  }
}


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database types
export interface Lead {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  budget_range?: string;
  service?: string;
  message?: string;
  source?: string;
  status: 'new' | 'qualified' | 'won' | 'lost';
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor?: string;
  action?: string;
  target?: string;
  meta?: Record<string, any>;
  at: string;
}


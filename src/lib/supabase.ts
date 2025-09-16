import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE || '';

export const isPreviewMode = !supabaseUrl || !supabaseServiceRoleKey;

type QueryResult<T> = { data: T | null; error: { message: string } | null; count?: number | null };

// Minimal mock client to avoid crashes during Preview Mode
function createPreviewClient(): SupabaseClient {
  const mock = {
    from() {
      const chain = {
        select: () => Promise.resolve({ data: null, error: { message: 'Preview mode: no database' } } as QueryResult<unknown>),
        insert: () => Promise.resolve({ data: null, error: { message: 'Preview mode: no database' } } as QueryResult<unknown>),
        update: () => Promise.resolve({ data: null, error: { message: 'Preview mode: no database' } } as QueryResult<unknown>),
        single: function() { return this; },
        range: function() { return this; },
        order: function() { return this; },
        eq: function() { return this; },
        or: function() { return this; },
      };
      return chain as unknown as ReturnType<SupabaseClient['from']>;
    },
  } as unknown as SupabaseClient;
  return mock;
}

// Create a single supabase client for interacting with your database
export const supabase: SupabaseClient = isPreviewMode
  ? createPreviewClient()
  : createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
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
  meta?: Record<string, unknown>;
  at: string;
}


import { createClient } from '@supabase/supabase-js';
import { usePreviewAdapter, leadsAdapter, ordersAdapter } from './adapter';

let supabaseClient: any;

if (usePreviewAdapter) {
  console.log('Using Secretless Preview Mode Adapter');
  supabaseClient = {
    from: (table: string) => {
      if (table === 'leads') return leadsAdapter;
      if (table === 'orders') return ordersAdapter;
      return { 
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }),
        insert: async () => ({ data: null, error: new Error('Table not found in preview mode') })
      };
    }
  };
} else {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;
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


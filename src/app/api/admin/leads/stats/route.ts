import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/auth';
import { rateLimitRequest } from '@/lib/utils';

export async function GET(request: NextRequest) {
  // Admin authentication
  const authResult = requireAdminAuth(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  // Rate limiting
  const rateLimitResult = await rateLimitRequest(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    // Get total leads count
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    // Get recent leads for activity feed
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('name, email, service, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentActivity = recentLeads?.map(lead => ({
      type: 'lead',
      description: `New lead from ${lead.name} for ${lead.service}`,
      timestamp: new Date(lead.created_at).toLocaleString(),
      email: lead.email,
    })) || [];

    return NextResponse.json({
      success: true,
      total: totalLeads || 0,
      recent: recentActivity,
    });

  } catch (error) {
    console.error('Leads stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export const runtime = 'nodejs';


import { NextRequest, NextResponse } from 'next/server';
import { dataAdapter } from '@/server/adapter';
import { requireAdminAuth } from '@/lib/auth';
import { rateLimitRequest } from '@/lib/utils';

export const runtime = 'nodejs';

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
    const { data: totalLeads } = await dataAdapter.getLeadsCount();

    // Get recent leads for activity feed
    const { data: recentLeads } = await dataAdapter.getRecentLeads(5);

    const recentActivity = recentLeads?.map(lead => ({
      type: 'lead',
      description: `New lead from ${lead.name}`,
      timestamp: new Date(lead.created_at!).toLocaleString(),
      email: lead.email,
    })) || [];

    return NextResponse.json({
      success: true,
      total: totalLeads || 0,
      recent: recentActivity,
      isPreviewMode: dataAdapter.isPreviewMode(),
    });

  } catch (error) {
    console.error('Leads stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


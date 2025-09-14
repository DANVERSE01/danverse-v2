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
    // Only available in preview mode
    if (!dataAdapter.isPreviewMode()) {
      return NextResponse.json(
        { error: 'Export is only available in preview mode' },
        { status: 400 }
      );
    }

    // Export data as JWE
    const jweData = await (dataAdapter as any).exportData();
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `danverse-backup-${timestamp}.jwe`;

    return new Response(jweData, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

